
"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UserTop from "@/components/UserTop";
import { usePackageByLink, useUserBusinessDetails } from "@/components/userapi";
import "@/css/userdashboard.css";
import AboutTab from "@/components/AboutTab";
import ConnectTab from "@/components/ConnectTab";
import ProductDetails from "@/components/ProductDetails";
import ServiceDetails from "@/components/ServiceDetails";
import CartPage from "@/components/CartPage";

const whatsapp = "/assets/img/whatsapp.svg";
const share = "/assets/img/share.svg";
const displayLoader = "/assets/img/Disblay_Loader.gif";
const noimage = "/assets/img/noimage.svg";
const whatsapp1 = "/assets/img/whatsapp1.svg";
const linkedin1 = "/assets/img/linkedin1.svg";
const x1 = "/assets/img/x1.svg";
const close = "/assets/img/close.svg";
const instagram1 = "/assets/img/instagram1.svg";
const facebook1 = "/assets/img/facebook1.svg";
const telegram1 = "/assets/img/telegram1.svg";
const closeImg = "/assets/img/close.svg";
const insta = "/assets/img/insta.svg";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
const UserDashboard = ({ 
  cart, 
  setCart, 
  setBusiness,
  ssrPackage,
  ssrBusiness,
  businessname
}) => {

  // -----------------------------------------------
  // 1. ALL HOOKS MUST BE AT THE TOP (NO RETURNS ABOVE)
  // -----------------------------------------------

  // Mobile redirect
  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
    const currentUrl = window.location.href;
    const hostname = window.location.hostname;

    if (isMobile && !hostname.startsWith("m.")) {
      const newUrl = currentUrl.replace("://", "://m.");
      window.location.replace(newUrl);
    } else if (!isMobile && hostname.startsWith("m.")) {
      const newUrl = currentUrl.replace("://m.", "://");
      window.location.replace(newUrl);
    }
  }, []);

  const router = useRouter();
  const params = useParams();

  // ACTIVE TAB HANDLER USING sessionStorage
  const [activeTab, setActiveTab] = useState("home");

  // Load sessionStorage value on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTab = sessionStorage.getItem("activeTab");
      if (savedTab) setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    sessionStorage.setItem("activeTab", tab);
  };

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // -----------------------------------------------
  // 2. FETCH DATA (Still part of hook area)
  // -----------------------------------------------
  const packageData = ssrPackage;
const businessData = ssrBusiness;
const business = businessData?.response;


useEffect(() => {
  if (!business?.business_slug) return;

  localStorage.setItem("business_slug", business.business_slug);
  localStorage.setItem("delivery_type",business.delivery_type);
  localStorage.setItem("businesses_id",business.id)

  if (typeof setBusiness === "function") {
    setBusiness(business);
  }
}, [business]);


  // -----------------------------------------------
  // 4. CONDITIONAL RETURNS COME AFTER ALL HOOKS
  // -----------------------------------------------
  if (!packageData || !businessData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <img src={displayLoader} alt="Loading..." style={{ width: "120px" }} />
      </div>
    );
  }

  // -----------------------------------------------
  // 5. SAFE TO USE business HERE
  // -----------------------------------------------
  const pkg = packageData.response[0];

  const formatProduct = (product, qty = 1) => ({
    id: product.id,
    name: product.product_name,
    desc: `${product.quantity_count} ${product.uom_type}`,
    price: parseFloat(product.mrp),
    image: product.product_logo,
    qty,
  });

  const formatService = (service, qty = 1) => ({
    id: service.id,
    name: service.service_name,
    desc: service.service_industrial_type,
    price: parseFloat(service.mrp),
    image: service.service_image,
    qty,
  });

  const formatComboItem = (pkg) => {
    const isProductCombo = pkg.categories?.some((c) =>
      c.items?.some((i) => i.package_type === "product")
    );

    return {
      id: pkg.id,
      name: pkg.package_name,
      image: pkg.package_poster || pkg.package_logo || "",
      price: Number(pkg.totalPrice) || parseFloat(pkg.totalPrice) || 0,
      qty: 1,
      totalItems: pkg.totalItems || 0,
      totalCategories: pkg.categories?.length || 0,
      comboId: pkg.id,
      comboCategory: isProductCombo ? "product" : "service",
      __rawPackage: pkg,
    };
  };

  const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/&/g, "-and-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");

  const handleShareModal = (item) => {
    const BASE_URL = "https://app.disblay.com";
    const businessName =
      business?.business_slug || item?.business_slug || "unknown";

    let sharelink = "";

    if (item?.package_name && item?.totalItems) {
      sharelink = `${BASE_URL}/s/${encodeURIComponent(
        businessName
      )}/${encodeURIComponent(slugify(item.package_name))}`;
    } else if (
      item?.business_slug &&
      !item?.package_name &&
      !item?.product_name &&
      !item?.service_name
    ) {
      sharelink = `${BASE_URL}/s/${encodeURIComponent(item.business_slug)}`;
    } else if (item?.package_name) {
      sharelink = `${BASE_URL}/s/${encodeURIComponent(
        businessName
      )}/${encodeURIComponent(slugify(item.package_name))}`;
    } else if (item?.package_type === "product") {
      sharelink = `${BASE_URL}/share-handler.php?title=${encodeURIComponent(
        item.product_name
      )}&description=${encodeURIComponent(
        item.product_description || ""
      )}&image=${BASE_URL}/${item.product_logo}&type=product&price=${
        item.mrp
      }&url=${BASE_URL}/${businessName}/${slugify(item.product_name)}`;
    } else if (item?.package_type === "service") {
      sharelink = `${BASE_URL}/share-handler.php?title=${encodeURIComponent(
        item.service_name
      )}&description=${encodeURIComponent(
        item.service_description || ""
      )}&image=${BASE_URL}/${item.service_image}&type=service&price=${
        item.mrp
      }&url=${BASE_URL}/${businessName}/${slugify(item.service_name)}`;
    } else {
      sharelink = `${BASE_URL}/shared-item`;
    }

    setShareLink(sharelink);
    setShowShareModal(true);
  };

  // -----------------------------------------------
  // 6. CONDITIONAL RETURNS (SAFE NOW)
  // -----------------------------------------------
  if (selectedProduct) {
    return (
      <div className="user-home">
        <UserTop />
        <div className="container py-3">
          <ProductDetails
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
          />
        </div>
      </div>
    );
  }

  if (selectedService) {
    return (
      <div className="user-home">
        <UserTop />
        <div className="container py-3">
          <ServiceDetails
            service={selectedService}
            onBack={() => setSelectedService(null)}
          />
        </div>
      </div>
    );
  }

  if (showCart) {
    return (
      <CartPage
        cart={cart}
        business={business}
        onUpdateCart={(action, id) => {
          setCart((prev) => {
            if (action === "increase") {
              return {
                ...prev,
                items: prev.items.map((i) =>
                  i.id === id ? { ...i, qty: i.qty + 1 } : i
                ),
              };
            }

            if (action === "decrease") {
              const updated = prev.items
                .map((i) =>
                  i.id === id ? { ...i, qty: i.qty - 1 } : i
                )
                .filter((i) => i.qty > 0);

              return {
                ...prev,
                items: updated,
                type: updated.length ? prev.type : null,
              };
            }

            if (action === "remove") {
              const updated = prev.items.filter((i) => i.id !== id);
              return {
                ...prev,
                items: updated,
                type: updated.length ? prev.type : null,
              };
            }

            return prev;
          });
        }}
        onBack={() => setShowCart(false)}
      />
    );
  }



  // ✅ Default dashboard view
  return (
    <div className="user-home" >
      {/* Header */}
<UserTop
  business={business}
  cartCount={(cart?.items ?? []).reduce((sum, i) => sum + (i.qty || 0), 0)}
  onCartClick={() => router.push("/cart")}
/>


      <div className="user-dashboard mt-3">
        {/* Banner */}
        <div className="user-banner">
  {business.business_logo ? (
    <img
      src={`${process.env.NEXT_PUBLIC_API_URL}/${business.business_logo}`}
      alt="banner"
      style={{
        width: "100%",
        height: "220px",
        objectFit: "cover",
        borderRadius: "12px",
      }}
    />
  ) : (
    <div
      style={{
        width: "100%",
        height: "220px",
        borderRadius: "12px",
        background: "#F5F5F5",
        border: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <img
        src={noimage} // 👈 your imported fallback image
        alt="No Banner"
        style={{ width: "40px", height: "40px", marginBottom: "6px" }}
      />
      <span style={{ fontSize: "14px", color: "#777" }}>No Image</span>
    </div>
  )}
</div>


        {/* Business Info Card */}
        <div className="user-business-card shadow-sm d-flex justify-content-between align-items-center">
          <div>
            <div className="user-businessname">{business.business_name}</div>
            <div className="user-businesstagline px-1">
              {business.business_tagline}
            </div>
          </div>

          

<div className="d-flex gap-2">

  {/* ✅ WhatsApp Button */}
  <button
    className="btn user-business-btn"
    onClick={async () => {
      if (!business?.business_mobile) {
        await Swal.fire({
          icon: "error",
          title: "Phone Number Missing",
          text: "Business phone number not available",
        });
        return;
      }

      // Keep only digits
      let phone = business.business_mobile.replace(/\D/g, "");

      // ✅ Add 91 only if missing
      if (!phone.startsWith("91")) {
        phone = `91${phone}`;
      }

      const url = `https://wa.me/${phone}?text=${encodeURIComponent(
        "Hi, I’m interested in your combo. Could you please share more details?"
      )}`;

      window.open(url, "_blank");
    }}
  >
    <img src={whatsapp} alt="whatsapp" />
  </button>

  {/* ✅ Share Button (modal unchanged) */}
  <button
    className="btn user-business-btn"
    onClick={() => handleShareModal(business)}
  >
    <img src={share} alt="share" />
  </button>

</div>

        </div>

        <div className="bg-white px-4 py-2">
          {/* Tabs */}
          <div className="mb-4">
            <ul className="nav nav-tabs user-tabs">
              {["Home", "Combos", "About us", "Connect"].map((tab) => {
                const tabKey = tab.toLowerCase();
                return (
                  <li className="nav-item" key={tab}>
                    <button
                      className={`nav-link ${activeTab === tabKey ? "active" : ""
                        }`}
                      onClick={() => setActiveTab(tabKey)}
                    >
                      {tab}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* ---------------- TAB CONTENT ---------------- */}
          {activeTab === "home" && (
            <>
              {/* ✅ Products Section */}
              {packageData.response.items?.some((i) => i.package_type === "product") && (
                <>
                  <div className="user-section-title mt-2 mb-4">Products</div>
                  <div className="row g-3 mb-3">
                    {packageData.response.items
                      .filter((i) => i.package_type === "product")
                      .map((product) => (
                        <div
                          className="col-12 col-md-6"
                          key={product.id}
                          onClick={() => setSelectedProduct(product)}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="user-product-card d-flex align-items-center">
                           {product.product_logo ? (
  <img
    src={`${process.env.NEXT_PUBLIC_API_URL}/${product.product_logo}`}
    alt={product.product_name}
    className="product-img"
    style={{
      width: "150px",
      height: "150px",
      borderRadius: "12px",
      objectFit: "cover",
    }}
  />
) : (
  <div
    style={{
      width: "150px",
      height: "150px",
      borderRadius: "12px",
      background: "#F5F5F5",
      border: "1px solid #ddd",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    }}
  >
    <img
      src={noimage} // 👈 imported fallback image
      alt="No Product"
      style={{ width: "40px", height: "40px", marginBottom: "6px" }}
    />
    <span style={{ fontSize: "14px", color: "#777" }}>No Image</span>
  </div>
)}

                            <div className="product-info ms-2">
                              <div className="product-name mt-2">{product.product_name}</div>
                              <div className="product-desc mt-3">
                                {product.quantity_count} {product.uom_type}
                              </div>
                              <div className="product-price mt-3 mb-3">
                                ₹{parseFloat(product.mrp).toFixed(0)}
                              </div>
{cart?.items?.find(i => i.id === product.id) ? (
  <div
    className="qty-box d-flex align-items-center justify-content-between"
    style={{
      backgroundColor: "#FF4D4F",
      borderRadius: "8px",
      padding: "4px 10px",
      color: "#fff",
      minWidth: "80px"
    }}
  >
    {/* Minus */}
    <button
      className="qty-btn"
      style={{
        background: "transparent",
        border: "none",
        color: "#fff",
        fontSize: "24px",
        fontWeight: "bold"
      }}
      onClick={(e) => {
        e.stopPropagation();
        setCart(prev => {
          const updated = prev.items
            .map(i => i.id === product.id ? { ...i, qty: i.qty - 1 } : i)
            .filter(i => i.qty > 0);
          return { type: updated.length ? "product" : null, items: updated };
        });
      }}
    >
      −
    </button>

    {/* Qty */}
    <span style={{ fontSize: "16px", fontWeight: "600" }}>
      {cart?.items?.find(i => i.id === product.id)?.qty}
    </span>

    {/* Plus */}
    <button
      className="qty-btn"
      style={{
        background: "transparent",
        border: "none",
        color: "#fff",
        fontSize: "24px",
        fontWeight: "bold"
      }}
      onClick={(e) => {
        e.stopPropagation();
        setCart(prev => {
          if (prev.type === "service") {
            return { type: "product", items: [formatProduct(product, 1)] };
          }
          return {
            type: "product",
            items: prev.items.some(i => i.id === product.id)
              ? prev.items.map(i =>
                  i.id === product.id ? { ...i, qty: i.qty + 1 } : i
                )
              : [...prev.items, formatProduct(product, 1)]
          };
        });
      }}
    >
      +
    </button>
  </div>
) : (
  <button
    className="btn add-btn"
    onClick={(e) => {
      e.stopPropagation();
      setCart(prev => {
        if (!prev?.items) return { type: "product", items: [formatProduct(product, 1)] };

        if (prev.type === "combo" || prev.type === "service") {
          return { type: "product", items: [formatProduct(product, 1)] };
        }
        return { type: "product", items: [...prev.items, formatProduct(product, 1)] };
      });
    }}
  >
    <div className="add-text">ADD</div>
  </button>
)}








                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}

              {/* ✅ Services Section */}
              {packageData.response.items?.some((i) => i.package_type === "service") && (
                <>
                  <div className="user-section-title mt-4 mb-4">Services</div>
                  <div className="row g-3">
                    {packageData.response.items
                      .filter((i) => i.package_type === "service")
                      .map((service) => (
                        <div
                          className="col-12 col-md-6"
                          key={service.id}
                          onClick={() => setSelectedService(service)}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="user-service-card d-flex align-items-center">
                            {service.service_image ? (
  <img
    src={`${process.env.NEXT_PUBLIC_API_URL}/${service.service_image}`}
    alt={service.service_name}
    className="service-img"
    style={{
      width: "150px",
      height: "150px",
      borderRadius: "12px",
      objectFit: "cover",
    }}
  />
) : (
  <div
    style={{
      width: "150px",
      height: "150px",
      borderRadius: "12px",
      background: "#F5F5F5",
      border: "1px solid #ddd",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    }}
  >
    <img
      src={noimage} // 👈 your imported fallback image
      alt="No Service"
      style={{ width: "40px", height: "40px", marginBottom: "6px" }}
    />
    <span style={{ fontSize: "14px", color: "#777" }}>No Image</span>
  </div>
)}

                            <div className="service-info ms-2">
                              <div className="product-name mt-2">{service.service_name}</div>
                              <div className="product-desc mt-3">
                                {service.service_industrial_type}
                              </div>
                              <div className="product-price mt-3 mb-3">
                                ₹{parseFloat(service.mrp).toFixed(0)}
                              </div>
{cart?.items?.find(i => i.id === service.id) ? (
  <button
    className="btn"
    style={{
      backgroundColor: "#FF4D4F",
      borderRadius: "8px",
      padding: "6px 12px",
      color: "#fff",
      minWidth: "120px",
      cursor: "pointer",
      fontWeight: "800",
      fontStyle: "ExtraBold",
      fontSize: "18px",
    }}
    onClick={(e) => {
      e.stopPropagation();
      setCart((prev) => {
        if (!prev?.items) return { type: null, items: [] };

        const updated = prev.items.filter((i) => i.id !== service.id);

        return {
          type: updated.length ? "service" : null,
          items: updated,
        };
      });
    }}
  >
    Remove
  </button>
) : (
  <button
    className="btn add-btn"
    onClick={(e) => {
      e.stopPropagation();
      setCart((prev) => {
        if (!prev?.items) {
          return {
            type: "service",
            items: [formatService(service, 1)],
          };
        }

        if (prev.type === "combo") {
          return {
            type: "service",
            items: [formatService(service, 1)],
          };
        }

        if (prev.type === "product") {
          return {
            type: "service",
            items: [formatService(service, 1)],
          };
        }

        return {
          type: "service",
          items: [...prev.items, formatService(service, 1)],
        };
      });
    }}
  >
    <div className="add-text">Schedule Call</div>
  </button>
)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </>
          )}

       {activeTab === "combos" && (
  <>
    {/* 🔹 Helper Slugify Function */}
    {(() => {
      const slugify = (text) =>
        text
          .toString()
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/&/g, "-and-")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "-");

      // 🔹 Product Packages
      return (
        <>
          {Object.values(packageData.response).some((pkg) =>
            pkg.categories?.some((c) =>
              c.items?.some((i) => i.package_type === "product")
            )
          ) && (
            <>
              <div className="user-section-title mt-2 mb-4">
                Product Packages
              </div>
              <div className="row g-3 mb-3">
                {Object.values(packageData.response)
                  .filter((pkg) =>
                    pkg.categories?.some((c) =>
                      c.items?.some((i) => i.package_type === "product")
                    )
                  )
                  .map((pkg) => (
                    <div className="col-12 col-md-6" key={pkg.id}>
                      <div
                        className="user-product-card d-flex align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          const slug =
                            pkg.package_slug || slugify(pkg.package_name);
                          router.push(`/${business.business_slug}/${slug}`);
                        }}
                      >
                        {pkg.package_poster ? (
  <img
    src={`${process.env.NEXT_PUBLIC_API_URL}/${pkg.package_poster}`}
    alt={pkg.package_name}
    className="product-img"
    style={{
      width: "150px",
      height: "150px",
      borderRadius: "12px",
      objectFit: "cover",
    }}
  />
) : (
  <div
    style={{
      width: "150px",
      height: "150px",
      borderRadius: "12px",
      background: "#F5F5F5",
      border: "1px solid #ddd",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    }}
  >
    <img
      src={noimage} // 👈 your imported fallback image
      alt="No Poster"
      style={{ width: "40px", height: "40px", marginBottom: "6px" }}
    />
    <span style={{ fontSize: "14px", color: "#777" }}>No Image</span>
  </div>
)}

                        <div className="product-info ms-2">
                          <div className="product-name mt-2">
                            {pkg.package_name}
                          </div>
                          <div className="product-price mt-3">
                            {pkg.totalItems} Items - ₹
                            {parseFloat(pkg.totalPrice).toFixed(0)}
                          </div>
                          <div className="product-desc mt-3 mb-3">
                            Valid Upto : {pkg.end_date}
                          </div>
                         <button
  className="btn add-btn"
  onClick={(e) => {
    e.stopPropagation(); 
    const comboItem = formatComboItem(pkg);
    const newCart = { type: "combo", items: [comboItem] };
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    router.push("/cart", { state: { fromTab: "combos" } });
  }}
>
  <div className="add-text">Enquiry</div>
</button>

                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          {/* 🔹 Service Packages */}
          {Object.values(packageData.response).some((pkg) =>
            pkg.categories?.some((c) =>
              c.items?.some((i) => i.package_type === "service")
            )
          ) && (
            <>
              <div className="user-section-title mt-4 mb-4">
                Service Packages
              </div>
              <div className="row g-3">
                {Object.values(packageData.response)
                  .filter((pkg) =>
                    pkg.categories?.some((c) =>
                      c.items?.some((i) => i.package_type === "service")
                    )
                  )
                  .map((pkg) => (
                    <div className="col-12 col-md-6" key={pkg.id}>
                      <div
                        className="user-service-card d-flex align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          const slug =
                            pkg.package_slug || slugify(pkg.package_name);
                          router.push(`/${business.business_slug}/${slug}`);
                        }}
                      >
                       {pkg.package_poster ? (
  <img
    src={`${process.env.NEXT_PUBLIC_API_URL}/${pkg.package_poster}`}
    alt={pkg.package_name}
    className="service-img"
    style={{
      width: "150px",
      height: "150px",
      borderRadius: "12px",
      objectFit: "cover",
    }}
  />
) : (
  <div
    style={{
      width: "150px",
      height: "150px",
      borderRadius: "12px",
      background: "#F5F5F5",
      border: "1px solid #ddd",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    }}
  >
    <img
      src={noimage} // 👈 already imported fallback icon
      alt="No Poster"
      style={{ width: "40px", height: "40px", marginBottom: "6px" }}
    />
    <span style={{ fontSize: "14px", color: "#777" }}>No Image</span>
  </div>
)}

                        <div className="service-info ms-2">
                          <div className="product-name mt-2">
                            {pkg.package_name}
                          </div>
                          <div className="product-price mt-3">
                            {pkg.totalItems} Services
                          </div>
                          <div className="product-desc mt-3 mb-3">
                            Valid upto : {pkg.end_date}
                          </div>
                          <button
                            className="btn add-btn"
                            onClick={(e) => {
                              e.stopPropagation(); // ✅ stop navigation
                              const comboItem = formatComboItem(pkg);
                             const newCart = { type: "combo", items: [comboItem] };
setCart(newCart);
localStorage.setItem("cart", JSON.stringify(newCart));
router.push("/cart", { state: { fromTab: "combos" } });

                            }}
                          >
                            <div className="add-text">Schedule Call</div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </>
      );
    })()}
  </>
)}


          {activeTab === "about us" && <AboutTab business={business} />}
          {showShareModal && (
  <div
    className="transparent-overlay d-flex justify-content-center align-items-center px-4"
    style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      zIndex: 9999,
    }}
  >
    <div
      className="share-card-wrapper px-3"
      style={{
        background: "#fff",
        borderRadius: "16px",
        width: "450px",
        maxWidth: "95%",
        boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.15)",
        position: "relative",
        padding: "20px"
      }}
    >
      {/* header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div style={{ fontSize: "24px", fontWeight: "800" }}>Share</div>
        <button
          onClick={() => setShowShareModal(false)}
          style={{ border: "none", background: "transparent", cursor: "pointer" }}
        >
          <img src={close} style={{ width: "32px", height: "32px" }} alt="close"/>
        </button>
      </div>

      {/* social buttons */}
      <div className="share-linkvia mb-3">Share link via</div>
      <div className="d-flex gap-3 flex-wrap mb-4">
        <Link href={`https://wa.me/?text=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer">
          <img src={whatsapp1} width={52} height={52} alt="WhatsApp"/>
        </Link>
        <Link href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer">
          <img src={facebook1} width={52} height={52} alt="Facebook"/>
        </Link>
        <Link href={`https://www.instagram.com/?url=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer">
          <img src={insta} width={52} height={52} alt="Instagram"/>
        </Link>
        <Link href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer">
          <img src={linkedin1} width={52} height={52} alt="LinkedIn"/>
        </Link>
        <Link href={`https://t.me/share/url?url=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer">
          <img src={telegram1} width={52} height={52} alt="Telegram"/>
        </Link>
        <Link href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer">
          <img src={x1} width={52} height={52} alt="X"/>
        </Link>
      </div>

      {/* copy link */}
      <div className="share-linkvia mb-2">or copy link</div>
      <div className="d-flex align-items-center rounded px-2" style={{height:"54px",background:"#F62D2D1A"}}>
        <input
          type="text"
          readOnly
          value={shareLink}
          className="form-control border-0 p-0 me-2"
          style={{ color: "#F62D2D", fontFamily:"Manrope", background:"transparent" ,fontWeight: "500", fontSize: "14px"}}
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(shareLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="btn"
          style={{background: "linear-gradient(284.69deg, #F62D2D 7.92%, #FF6161 100%)", color:"#ffffff"}}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  </div>
)}
          {activeTab === "connect" && <ConnectTab business={business} />}
        </div>
      </div>
    </div>
  );
};
export default UserDashboard;
