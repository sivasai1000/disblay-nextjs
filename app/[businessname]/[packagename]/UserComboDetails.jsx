"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePackageByLink, useUserBusinessDetails } from "@/components/userapi";
import "@/css/usercombodetails.css";
import UserTop from "@/components/UserTop";
import Swal from "sweetalert2";
import { FaPlay, FaPause } from "react-icons/fa";
import ComboProductDetails from "@/components/ComboProductDetails";
import ComboServiceDetails from "@/components/ComboServiceDetails";
import ImageVideoCarousel from "@/components/ImageVideoCarousel";


import { useParams, useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const UserComboDetails = ({ cart, setCart }) => {
    const whatsapp = "/assets/img/whatsapp.svg";
const pdf = "/assets/img/pdf.svg";
const location = "/assets/img/map.svg";
const leftarrow = "/assets/img/leftarrow.svg";
const share = "/assets/img/share.svg";
const uparrow = "/assets/img/uparrow.svg";
const downarrow = "/assets/img/downarrow.svg";


const displayLoader = "/assets/img/Disblay_Loader.gif";
const noimage = "/assets/img/noimage.svg";

const whatsapp1 = "/assets/img/whatsapp1.svg";
const linkedin1 = "/assets/img/linkedin1.svg";
const x1 = "/assets/img/x1.svg";
const facebook1 = "/assets/img/facebook1.svg";
const telegram1 = "/assets/img/telegram1.svg";
const close = "/assets/img/close.svg";
const insta = "/assets/img/insta.svg";

  const router = useRouter();

  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const hostname = typeof window !== "undefined" ? window.location.hostname : "";

    if (isMobile && !hostname.startsWith("m.")) {
      const newUrl = currentUrl.replace("://", "://m.");
      window.location.replace(newUrl);
    } else if (!isMobile && hostname.startsWith("m.")) {
      const newUrl = currentUrl.replace("://m.", "://");
      window.location.replace(newUrl);
    }
  }, []);

  // Next.js route params
  const params = useParams();
  // params will contain { businessname, packagename } from the folder route
  const businessname = params?.businessname;
  const packagename = params?.packagename;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);

  const [showCart, setShowCart] = useState(false);

  // 🔹 Call API with slug
  const { data: packageData, isLoading } = usePackageByLink({
    share_link: `https://disblay.com/${businessname}/${packagename}`,
  });
  const businessId = packageData?.business_id;
  const { data: businessData } = useUserBusinessDetails({
    business_id: businessId,
  });

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
    const APP_BASE = "https://app.disblay.com";
    const businessName = business?.business_slug || item?.business_slug || "unknown";
    let sharelink = "";

    if (item?.package_name && item?.totalItems) {
      sharelink = `${APP_BASE}/s/${encodeURIComponent(
        businessName
      )}/${encodeURIComponent(slugify(item.package_name))}`;
    } else if (item?.package_name) {
      sharelink = `${APP_BASE}/s/${encodeURIComponent(
        businessName
      )}/${encodeURIComponent(slugify(item.package_name))}`;
    } else {
      sharelink = `${APP_BASE}/s/${encodeURIComponent(businessName)}`;
    }

    setShareLink(sharelink);
    setShowShareModal(true);
  };

  const business = businessData.response;
  if (isLoading) return <p>Loading...</p>;
  if (!packageData?.response?.[0]) return <p>No package found</p>;

  const pkg = packageData.response[0];
  const categories = pkg.categories || [];

  const formatComboItem = (pkg) => {
    const isServiceCombo = pkg.categories?.some((c) =>
      c.items?.some((i) => i.package_type === "service")
    );

    return {
      id: pkg.id,
      name: pkg.package_name,
      image: pkg.package_poster,
      price: parseFloat(pkg.totalPrice) || 0,
      qty: 1,
      totalItems: pkg.totalItems || 0,
      totalCategories: pkg.categories?.length || 0,
      comboId: pkg.id,
      comboCategory: isServiceCombo ? "service" : "product",
      __rawPackage: pkg, // keep full package for CartPage
    };
  };

  const isServiceCombo = pkg.categories?.some((c) =>
    c.items?.some((i) => i.package_type === "service")
  );
  const buttonText = isServiceCombo ? "Schedule Call" : "Enquiry";

  const CustomAudioPlayer = ({ audioUrl }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
      if (!audioRef.current) return;

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.error("Audio play error:", err));
      }
    };

    return (
      <>
        <button
          onClick={togglePlay}
          className="d-flex align-items-center gap-2"
          style={{
            width: "110px",
            height: "48px",
            padding: "0px 16px",
            border: "none",
            borderRadius: "10px",
            background: "#EFEFEF",
            color: "#000",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer",
            justifyContent: "center",
          }}
        >
          {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
          <span className="play-pause">{isPlaying ? "Pause" : "Play"}</span>
        </button>

        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} style={{ display: "none" }}>
          <source src={audioUrl} type="audio/mpeg" />
        </audio>
      </>
    );
  };

  if (selectedProduct) {
    return (
      <div className="user-home">
        <UserTop business={business} />
        <div className="container py-3">
          <ComboProductDetails product={selectedProduct} onBack={() => setSelectedProduct(null)} />
        </div>
      </div>
    );
  }

  if (selectedService) {
    return (
      <div className="user-home">
        <UserTop business={business} />
        <div className="container py-3">
          <ComboServiceDetails service={selectedService} onBack={() => setSelectedService(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="user-home">
      <UserTop
        business={business}
        cartCount={(cart?.items ?? []).reduce((sum, i) => sum + (i.qty || 1), 0)}
        onCartClick={() => {
          // preserve previous behavior: store state in localStorage before pushing
          // Next.js router doesn't support history state param the same way; use localStorage
          router.push("/cart");
        }}
      />

      <div className="user-combo mt-4">
        <div className="d-flex align-items-center justify-content-between mb-2 mt-2" style={{ padding: "16px" }}>
          <div className="d-flex align-items-center">
            <button className="btn border-0 p-0" onClick={() => router.back()}>
              <img src={leftarrow} alt="back" />
            </button>
            <div className="usercombo-name ms-2">{pkg.package_name}</div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <a
              href={
                business?.business_mobile
                  ? `https://wa.me/${
                      business.business_mobile.replace(/\D/g, "").startsWith("91")
                        ? business.business_mobile.replace(/\D/g, "")
                        : `91${business.business_mobile.replace(/\D/g, "")}`
                    }?text=${encodeURIComponent(
                      "Hi, I’m interested in your combo. Could you please share more details?"
                    )}`
                  : "#"
              }
              target="_blank"
              rel="noreferrer"
              className="whatsapp-btn"
              onClick={async (e) => {
                if (!business?.business_mobile) {
                  e.preventDefault();
                  await Swal.fire({
                    icon: "error",
                    title: "Phone Number Missing",
                    text: "Business phone number not available",
                  });
                }
              }}
            >
              <img src={whatsapp} alt="whatsapp" width={44} height={44} className="me-2" />
            </a>

            <img src={share} alt="share" width={44} height={44} style={{ cursor: "pointer" }} onClick={() => handleShareModal(pkg)} />
          </div>
        </div>

        <div className="combo-banner position-relative text-center">
          <ImageVideoCarousel poster={`${process.env.NEXT_PUBLIC_API_URL}/${pkg.package_poster}`} videoUrl={pkg.package_url} name={pkg.package_name} />
        </div>

        <div className="card-section d-flex justify-content-around align-items-center mt-3">
          <div className="text-center card-left">
            <div className="days-left-label">Days Left</div>
            <div className="days-remaining">{pkg.remaining_days}</div>
          </div>

          {pkg.package_url ? <CustomAudioPlayer audioUrl={`${BASE_URL}/${pkg.package_audio}`} /> : <button className="btn play-btn d-flex align-items-center justify-content-center" disabled>
            <FaPlay size={20} className="me-2" />
            <div className="play-text ">Play</div>
          </button>}

          {pkg.package_pdf ? (
            <a href={`${process.env.NEXT_PUBLIC_API_URL}/${pkg.package_pdf}`} target="_blank" rel="noreferrer" className="btn pdf-btn">
              <img src={pdf} width={26} height={26} alt="pdf" />
              <div className="pdf-text">PDF</div>
            </a>
          ) : (
            <button className="btn pdf-btn" disabled>
              <img src={pdf} width={26} height={26} alt="pdf" />
              <div className="pdf-text">PDF</div>
            </button>
          )}

          <button
            className="btn enquiry-btn"
            onClick={() => {
              const comboItem = formatComboItem(pkg);

              // Always clear old cart if type is different
              const newCart = { type: "combo", items: [comboItem] };

              // 🔹 Update React state (very important)
              setCart(newCart);

              // 🔹 Save to localStorage for persistence
              localStorage.setItem("cart", JSON.stringify(newCart));
              localStorage.setItem("cart_from", "combo");

              // 🔹 Navigate to CartPage
              router.push("/cart");
            }}
          >
            <div className="enquriy-btntext">{buttonText}</div>
          </button>
        </div>

        <div className="card-section1 d-flex justify-content-between align-items-center px-3 py-2 mt-3">
          <div className="cat-combo">
            No of categories
            <br /> <div className="mt-2 cat-combovalue">{categories.length}</div>
          </div>
          <div className="cat-combo">
            Total Items
            <br /> <div className="mt-2 cat-combovalue">{pkg.totalItems}</div>
          </div>
          <div className="cat-combo">
            Cost <br /> <div className="mt-2 cat-combovalue1 ">₹{pkg.totalPrice}</div>
          </div>
        </div>

        <div className="px-4">
          <div className="card-section mt-3">
            {categories.map((cat) => {
              return (
                <div key={cat.id} className="mb-3">
                  {/* Category Header with Arrow */}
                  <div className="cat-header" onClick={() => setIsOpen(!isOpen)}>
                    <div>
                      <div className="cat-head">{cat.category_name}</div>
                      {isOpen && (
                        <>
                          {cat.category_subtitle && <div className="cat-head1 mt-3">{cat.category_subtitle}</div>}
                          {cat.category_tagline && <div className="cat-head1 mt-2">{cat.category_tagline}</div>}
                        </>
                      )}
                    </div>
                    <img src={isOpen ? uparrow : downarrow} alt="toggle" style={{ width: "20px", height: "20px" }} />
                  </div>

                  {/* Items List */}
                  <div className="bg-white rounded-3 shadow-sm px-3 py-1">
                    {cat.items.map((item) => {
                      const isService = item.package_type === "service";
                      const rawImage = isService ? item.service_image : item.product_logo;
                      const image = rawImage ? `${process.env.NEXT_PUBLIC_API_URL}/${rawImage}` : null;

                      const name = isService ? item.service_name : item.product_name;
                      const brand = isService ? item.service_industrial_type : item.product_brand_name;
                      const qtyOrMrp = isService ? `${item.booking_type}` : `${item.quantity_count} ${item.uom_type}`;

                      return (
                        <div
                          key={item.id}
                          onClick={() => (isService ? setSelectedService(item) : setSelectedProduct(item))}
                          style={{ cursor: "pointer" }}
                          className="d-flex align-items-center combodetails-card mt-3 mb-4"
                        >
                          {image ? (
                            <img
                              src={image.startsWith("http") ? image : `${process.env.NEXT_PUBLIC_API_URL}/${image}`}
                              alt={name}
                              style={{
                                width: "84px",
                                height: "84px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "84px",
                                height: "84px",
                                borderRadius: "8px",
                                background: "#F5F5F5",
                                border: "1px solid #ddd",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                              }}
                            >
                              <img src={noimage} alt="No Image" style={{ width: "28px", height: "28px", marginBottom: "4px" }} />
                              <span style={{ fontSize: "12px", color: "#777" }}>No Image</span>
                            </div>
                          )}

                          <div className="ms-3 flex-grow-1">
                            <div className="combo-productname">{name}</div>
                            {brand && <div className="combo-productquant mt-3">{brand}</div>}
                            <div className="combo-productquant mt-2">{qtyOrMrp}</div>
                          </div>
                          <div className="combo-productprice">₹{parseFloat(item.mrp).toFixed(0)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ---------- Store Location ---------- */}
          {business?.business_address && (
            <div
              className="p-3 mb-4 mt-4"
              style={{
                borderRadius: "16px",
                backgroundColor: "#fff",
                boxShadow: "0 0 12px rgba(0,0,0,0.08)",
                position: "relative",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="m-0 fw-bold" style={{ fontSize: "16px" }}>
                  Store Location
                </h5>

                <img
                  src={share}
                  alt="Share"
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                  onClick={async () => {
                    let shareUrl = "";

                    if (business.latitude && business.longitude) {
                      shareUrl = `https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`;
                    } else {
                      const address = encodeURIComponent(
                        `${business.business_address}, ${business.city}, ${business.state}, ${business.country}, ${business.pincode}`
                      );
                      shareUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
                    }

                    if (navigator.share) {
                      navigator.share({
                        title: "My Store Location",
                        url: shareUrl,
                      });
                    } else {
                      await navigator.clipboard.writeText(shareUrl);
                      Swal.fire({
                        icon: "success",
                        title: "Copied!",
                        text: "Location link copied to clipboard.",
                        timer: 1800,
                        showConfirmButton: false,
                      });
                    }
                  }}
                />
              </div>

              {/* Google Maps with overlay */}
              <a
                href={
                  business.latitude && business.longitude
                    ? `https://maps.google.com/?q=${business.latitude},${business.longitude}`
                    : `https://maps.google.com/?q=${encodeURIComponent(
                        `${business.business_address}, ${business.city}, ${business.state}, ${business.country}, ${business.pincode}`
                      )}`
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  borderRadius: "12px",
                  overflow: "hidden",
                  marginBottom: "12px",
                }}
              >
                <div style={{ width: "100%", height: "200px", position: "relative" }}>
                  <iframe
                    title="store-map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0, pointerEvents: "none" }}
                    src={
                      business.latitude && business.longitude
                        ? `https://maps.google.com/maps?q=${business.latitude},${business.longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed`
                        : `https://maps.google.com/maps?q=${encodeURIComponent(
                            `${business.business_address}, ${business.city}, ${business.state}, ${business.country}, ${business.pincode}`
                          )}&t=&z=13&ie=UTF8&iwloc=&output=embed`
                    }
                    allowFullScreen
                  ></iframe>

                  {/* Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(255,255,255,0.8)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#444",
                      pointerEvents: "none",
                    }}
                  >
                    <img src={location} alt="Store Icon" style={{ width: "40px", height: "40px", marginBottom: "8px" }} />
                    <span style={{ fontFamily: "Manrope", fontSize: "14px", fontWeight: "800", color: "#7A7A7A" }}>
                      Click to open in Google Maps
                    </span>
                  </div>
                </div>
              </a>

              {/* Address */}
              <div className="d-flex align-items-start gap-2" style={{ fontSize: "14px", fontWeight: 500 }}>
                <img src={location} alt="Location" style={{ width: "16px", height: "16px", marginTop: "3px" }} />
                <span style={{ fontFamily: "Manrope", color: "#061F35" }}>
                  {business.business_address}, {business.city}, {business.state}, {business.country}, {business.pincode}
                </span>
              </div>
            </div>
          )}

          {showShareModal && (
            <div
              className="transparent-overlay d-flex justify-content-center align-items-center px-4"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
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
                  padding: "20px",
                }}
              >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div style={{ fontSize: "24px", fontWeight: "800" }}>Share</div>
                  <button onClick={() => setShowShareModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
                    <img src={close} style={{ width: "32px", height: "32px" }} alt="close" />
                  </button>
                </div>

                {/* Share links */}
                <div className="share-linkvia mb-3">Share link via</div>
                <div className="d-flex gap-3 flex-wrap mb-4">
                  <a href={`https://wa.me/?text=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer">
                    <img src={whatsapp1} width={52} height={52} alt="WhatsApp" />
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer">
                    <img src={facebook1} width={52} height={52} alt="Facebook" />
                  </a>
                  <a href={`https://www.instagram.com/?url=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer">
                    <img src={insta} width={52} height={52} alt="Instagram" />
                  </a>
                  <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer">
                    <img src={linkedin1} width={52} height={52} alt="LinkedIn" />
                  </a>
                  <a href={`https://t.me/share/url?url=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer">
                    <img src={telegram1} width={52} height={52} alt="Telegram" />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer">
                    <img src={x1} width={52} height={52} alt="X" />
                  </a>
                </div>

                {/* Copy link */}
                <div className="share-linkvia mb-2">or copy link</div>
                <div className="d-flex align-items-center rounded px-2" style={{ height: "54px", background: "#F62D2D1A" }}>
                  <input
                    type="text"
                    readOnly
                    value={shareLink}
                    className="form-control border-0 p-0 me-2"
                    style={{ color: "#F62D2D", fontFamily: "poppins", background: "transparent", fontWeight: "500", fontSize: "14px" }}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="btn"
                    style={{ background: "linear-gradient(284.69deg, #F62D2D 7.92%, #FF6161 100%)", color: "#ffffff" }}
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserComboDetails;
