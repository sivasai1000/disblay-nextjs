"use client";
import React from "react";
import UserTop from "@/components/UserTop";
import { addNotification, useUserBusinessDetails, useUserAddress, useUpdateUserAddress } from "@/components/userapi";
import { useRouter } from "next/navigation";
import { Modal } from "react-bootstrap";
import "@/css/cartpage.css";
import Swal from "sweetalert2";

const CartPage = () => {

  // Fallback images
  const noimage = "/assets/img/noimage.svg";
  const cartmap = "/assets/img/cartmap.svg";

  const router = useRouter();

  // ---------------------------
  // ✅ Load cart from localStorage
  // ---------------------------
  const [cartData, setCartData] = React.useState({ items: [], type: "" });

  React.useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "{}");
    if (savedCart?.items) {
      setCartData(savedCart);
    }
  }, []);

  // ---------------------------
  // LOCAL BUSINESS ID
  // ---------------------------



   const [businessId, setBusinessId] = React.useState(null);
  
  React.useEffect(() => {
    const id = localStorage.getItem("businessId");
    setBusinessId(id);
  }, []);
  // ---------------------------
  // MODALS & FORMS
  // ---------------------------
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [scheduleDate, setScheduleDate] = React.useState("");
  const [scheduleTime, setScheduleTime] = React.useState("");

  const [showAddressModal, setShowAddressModal] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [form, setForm] = React.useState({});

  // ---------------------------
  // BUSINESS DETAILS
  // ---------------------------
const { data: businessDetails, isLoading, isError } = useUserBusinessDetails(
  { business_id: businessId },
  {
    enabled: !!businessId,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  }
);

  

  const currentBusiness = businessDetails?.response || {};
  console.log("current business is",currentBusiness)

  // ---------------------------
  // SUBTOTAL CALCULATION — FIXED
  // ---------------------------
  const subtotal = cartData.items.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  // ---------------------------
  // USER DATA
  // ---------------------------
  const [userId, setUserId] = React.useState(null);
  const [storedUser, setStoredUser] = React.useState({});

  React.useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    setStoredUser(stored);
    setUserId(stored?.user_id || null);
  }, []);
  // keep local copy of user in sync when other parts of app update it
  React.useEffect(() => {
    const syncUser = () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setStoredUser(user);
      setUserId(user?.user_id || null);
    };
    window.addEventListener("userUpdated", syncUser);
    return () => window.removeEventListener("userUpdated", syncUser);
  }, []);

  const requesterName = storedUser?.name || "Guest";
  const username = storedUser?.mobile || storedUser?.email || "";

  // ---------------------------
  // Address hooks
  // ---------------------------
  const {
    data: userAddressData,
    isLoading: isAddressLoading,
    refetch: refetchAddress,
  } = useUserAddress({ user_id: userId }, { enabled: !!userId });

  const userAddress =
    userAddressData?.res?.address && Array.isArray(userAddressData.res.address)
      ? userAddressData.res.address[0]
      : userAddressData?.res?.address;

  const hasAddress = userAddress && Object.keys(userAddress).length > 0;

  const { mutate: saveAddress, isLoading: isSaving } = useUpdateUserAddress({
    onSuccess: () => {
      refetchAddress();
      setShowAddressModal(false);
    },
  });

  React.useEffect(() => {
    if (hasAddress) {
      setForm({
        requester_name: userAddress?.requester_name || "",
        requester_mobile:
          userAddress?.requester_mobile || storedUser?.mobile || "",
        requester_email: userAddress?.requester_email || storedUser?.email || "",
        requester_country: userAddress?.requester_country || "",
        requester_state: userAddress?.requester_state || "",
        requester_city: userAddress?.requester_city || "",
        requester_address: userAddress?.requester_address || "",
        requester_direction: userAddress?.requester_direction || "",
        requester_latlong: userAddress?.requester_latlong || "",
      });
    }
    // we intentionally include hasAddress and storedUser to update when they change
  }, [userAddress, hasAddress, storedUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------------------
  // ✅ updateCart - replaces onUpdateCart prop
  // ---------------------------
  const updateCart = (action, itemId) => {
    const updated = { ...cartData };
    // ensure items array exists
    updated.items = Array.isArray(updated.items) ? [...updated.items] : [];

    if (action === "increase") {
      updated.items = updated.items.map((i) =>
        i.id === itemId ? { ...i, qty: (i.qty || 1) + 1 } : i
      );
    }

    if (action === "decrease") {
      updated.items = updated.items
        .map((i) =>
          i.id === itemId ? { ...i, qty: Math.max(1, (i.qty || 1) - 1) } : i
        )
        .filter((i) => i.qty > 0);
    }

    if (action === "remove") {
      updated.items = updated.items.filter((i) => i.id !== itemId);
    }

    if (action === "clear") {
      updated.items = [];
    }

    // persist & set state
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartData(updated);

    // emit event so other components (if any) can sync
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: updated }));
  };

  // ---------------------------
  // ✅ Handle Place Order (uses cartData & updateCart)
  // ---------------------------
  const handlePlaceOrder = async () => {
    try {
      const isCombo = cartData.type === "combo";
      const firstItem = cartData.items[0];

      const payload = {
        package_id: isCombo
          ? firstItem?.id
          : currentBusiness?.id || currentBusiness?.business_id || localStorage.getItem("businesses_id") ,

        package_name: isCombo ? firstItem?.name : "",
        package_type: isCombo
          ? firstItem?.comboCategory === "product"
            ? "product"
            : "service"
          : cartData.type === "product"
          ? "productItems"
          : "serviceItems",

        requester_name: requesterName,
        username: username,
        sheduled_date: scheduleDate || "",
        sheduled_time: scheduleTime || "",
        user_id: userId,
        notification_type: isCombo
          ? "Combos"
          : cartData.type === "product"
          ? "Products"
          : "Services",
        delivery_type: currentBusiness?.delivery_type || localStorage.getItem("delivery_type") || "",

        items: isCombo
          ? firstItem?.__rawPackage?.categories?.flatMap(
              (c) =>
                c.items?.map((i) => ({
                  product_id: i.id,
                  product_name: i.product_name || i.service_name,
                  product_img: i.product_logo || i.service_image,
                  product_qty: 1,
                  product_price: i.mrp,
                  product_subtotal: i.mrp,
                })) || []
            ) || []
          : cartData.items.map((item) => ({
              product_id: item.id,
              product_name: item.name,
              product_img: item.image,
              product_qty: item.qty || 1,
              product_price: item.price,
              product_subtotal: (item.price || 0) * (item.qty || 1),
            })),
      };

      const res = await addNotification(payload);

      if (res.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Order Placed!",
          text: "Your order has been submitted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });

        // clear cart
        updateCart("clear");
        localStorage.removeItem("cart");

        // App Router does not support passing state; use push only
        router.push("/ordersuccess");
      } else {
        await Swal.fire({
          icon: "error",
          title: "Failed to Place Order",
          text: res.msg || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  // ---------------------------
  // Early returns for loading / error states
  // ---------------------------
  if (isLoading) {
    return (
      <div className="user-home">
        <p className="text-center mt-5">Loading business details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="user-home">
        <p className="text-center mt-5 text-danger">
          Failed to load business details
        </p>
      </div>
    );
  }
  return (
    <div className="user-home">

      {/* TOP HEADER */}
      <UserTop
        business={currentBusiness}
        cartCount={cartData.items.reduce((sum, i) => sum + (i.qty || 1), 0)}
        onCartClick={() => router.back()}
      />

      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-1" />

          {/* -----------------------------
               LEFT SIDE — CART LIST
             ----------------------------- */}
          <div className="col-6">
            <div className="bg-white p-3 rounded mb-3">

              <div className="mb-3 cart-headtext">Cart</div>

              {cartData.items.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                cartData.items.map((item) =>
                  cartData.type === "combo" &&
                  item.comboCategory === "product" ? (

                    /* ----------------------------------
                       COMBO PRODUCT SUMMARY CARD
                       ---------------------------------- */
                    <div
                      key={item.id}
                      className="combo-summary p-3 mb-3"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #E6E9EE",
                        background: "#fff",
                      }}
                    >
                      <div className="d-flex">
                        {item.image ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/${item.image}`}
                            alt={item.name}
                            style={{
                              width: "84px",
                              height: "84px",
                              borderRadius: "6px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "84px",
                              height: "84px",
                              borderRadius: "6px",
                              background: "#F5F5F5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "column",
                              border: "1px solid #E0E0E0",
                            }}
                          >
                            <img
                              src={noimage}
                              alt="No Image"
                              style={{
                                width: "24px",
                                height: "24px",
                                marginBottom: "2px",
                              }}
                            />
                            <span style={{ fontSize: "9px", color: "#777" }}>
                              No Image
                            </span>
                          </div>
                        )}

                        <div className="ms-3">
                          <div className="cart-itemname">{item.name}</div>
                          <div className="cart-itemdesc">
                            {currentBusiness?.business_name}
                          </div>
                        </div>
                      </div>

                      <hr style={{ margin: "12px 0" }} />

                      {/* Combo details */}
                      <div className="d-flex w-100 mb-2">
                        <div className="flex-fill">
                          <div className="cart-subtitle">Combo ID</div>
                          <div className="cart-subval">{item.comboId}</div>
                        </div>
                        <div className="flex-fill text-end">
                          <div className="cart-subtitle">No of Items</div>
                          <div className="cart-subval">{item.totalItems}</div>
                        </div>
                      </div>

                      <div className="d-flex w-100">
                        <div className="flex-fill">
                          <div className="cart-subtitle">No of Categories</div>
                          <div className="cart-subval">
                            {item.totalCategories}
                          </div>
                        </div>
                        <div className="flex-fill text-end">
                          <div className="cart-subtitle">Cost</div>
                          <div className="cart-subval fw-bold">
                            ₹{item.price}
                          </div>
                        </div>
                      </div>
                    </div>

                  ) : (

                    /* ----------------------------------
                       NORMAL PRODUCT/SERVICE CARD
                       ---------------------------------- */
                    <div
                      key={item.id}
                      className="d-flex align-items-center justify-content-between cart-itemscard px-3 py-3"
                    >
                      <div className="d-flex align-items-center">

                        {item.image ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/${item.image}`}
                            alt={item.name}
                            style={{
                              width: "84px",
                              height: "84px",
                              borderRadius: "6px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "84px",
                              height: "84px",
                              borderRadius: "6px",
                              background: "#F5F5F5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "column",
                              border: "1px solid #E0E0E0",
                            }}
                          >
                            <img
                              src={noimage}
                              alt="No Image"
                              style={{
                                width: "22px",
                                height: "22px",
                                marginBottom: "2px",
                              }}
                            />
                            <span style={{ fontSize: "9px", color: "#777" }}>
                              No Image
                            </span>
                          </div>
                        )}

                        <div className="ms-3">
                          <div className="cart-itemname">{item.name}</div>
                          <div className="cart-itemdesc mt-3">{item.desc}</div>
                        </div>
                      </div>

                      {/* Qty or Remove */}
                      <div className="d-flex align-items-center">
                        <div className="cart-item-right">
                          {cartData.type === "product" ? (
                            <div
                              className="qty-box d-flex align-items-center justify-content-between"
                              style={{
                                width: "140px",
                                height: "50px",
                                background:
                                  "linear-gradient(284.69deg, rgba(246, 45, 45, 0.05) 7.92%, rgba(255, 97, 97, 0.05) 100%)",
                                borderRadius: "8px",
                                border: "1px solid #FF6161",
                                padding: "4px 10px",
                              }}
                            >
                              <button
                                className="qty-btn"
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "#F62D2D",
                                  fontSize: "24px",
                                }}
                                onClick={() =>
                                  updateCart("decrease", item.id)
                                }
                              >
                                −
                              </button>

                              <span className="cart-qnty">
                                {item.qty || 1}
                              </span>

                              <button
                                className="qty-btn"
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "#F62D2D",
                                  fontSize: "24px",
                                }}
                                onClick={() =>
                                  updateCart("increase", item.id)
                                }
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn"
                              style={{
                                width: "140px",
                                height: "46px",
                                background:
                                  "linear-gradient(284.69deg, rgba(246, 45, 45, 0.05) 7.92%, rgba(255, 97, 97, 0.05) 100%)",
                                borderRadius: "8px",
                                border: "1px solid #FF6161",
                              }}
                              onClick={() =>
                                updateCart("remove", item.id)
                              }
                            >
                              <span className="cart-btnremove">Remove</span>
                            </button>
                          )}

                          <div className="cart-pricetext">
                            ₹{(item.price * (item.qty || 1)).toFixed(0)}
                          </div>
                        </div>
                      </div>
                    </div>

                  )
                )
              )}
            </div>
            {/* -----------------------------
                 Delivery Address Section
               ----------------------------- */}
            {userId && (
              <div
                className="bg-white p-3 mt-4 mb-4 rounded shadow-sm d-flex align-items-center justify-content-between"
                style={{ height: "99px" }}
              >
                <div className="d-flex align-items-center">
                  <img
                    src={cartmap}
                    alt="Location"
                    style={{ width: "48px", height: "48px", marginRight: "12px" }}
                  />
                  <div>
                    <div className="cart-address">Delivery Address</div>
                    <div className="cart-addresstext mt-2">
                      {isAddressLoading
                        ? "Loading address..."
                        : hasAddress
                        ? `${userAddress?.requester_address || ""}, ${userAddress?.requester_city || ""}`
                        : "Add your address so we know where to deliver"}
                    </div>
                  </div>
                </div>

                <button
                  className="cart-btnaddress"
                  style={{
                    border: "1px solid #FF6161",
                    color: "#FF6161",
                    fontWeight: "500",
                    borderRadius: "8px",
                    padding: "6px 16px",
                    background: "transparent",
                  }}
                  onClick={() => setShowAddressModal(true)}
                >
                  <span className="cart-btnaddresstext">
                    {hasAddress ? "View Address" : "Add Address"}
                  </span>
                </button>
              </div>
            )}

            {/* -----------------------------
                 PLACE ORDER / SCHEDULE
               ----------------------------- */}
            <div className="bg-white p-3 rounded shadow-sm">
              {userId ? (
                <div className="d-flex justify-content-end">
                  {cartData.type === "service" ||
                  (cartData.type === "combo" &&
                    cartData.items[0]?.comboCategory === "service") ? (
                    <button
                      className="order-btn"
                      onClick={() => setShowScheduleModal(true)}
                      disabled={cartData.items.length === 0}
                    >
                      <span className="order-btntext">Schedule Call</span>
                    </button>
                  ) : (
                    <button
                      className="order-btn"
                      onClick={handlePlaceOrder}
                      disabled={cartData.items.length === 0 || !hasAddress}
                    >
                      <span className="order-btntext">Place Order</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-continueregister">Register to continue</span>
                  <button
                    className="order-btn"
                    onClick={() =>
                      window.dispatchEvent(new Event("openLoginModal"))
                    }
                  >
                    <span className="order-btntext">Register</span>
                  </button>
                </div>
              )}
            </div>

            {/* -----------------------------
                 Note Section
               ----------------------------- */}
            <div className="mt-3">
              <div className="cart-notetext">Note :</div>
              <div className="cart-notedesc mt-3">
                <ul>
                  <li>
                    Express your interest in purchasing the combo by entering your
                    WhatsApp number and confirming the OTP. The concerned business
                    person will contact you.
                  </li>
                </ul>
              </div>
            </div>

          </div>

          {/* -----------------------------
               RIGHT SIDE — BILLING
             ----------------------------- */}
          <div className="col-4">
            <div className="bg-white p-3 rounded shadow-sm">
              <h5 className="cart-billing">Billing Information</h5>

              <div className="d-flex justify-content-between mb-3 mt-4">
                <span className="cart-subtotal">Subtotal</span>
                <span className="cart-subtotalprice">
                  ₹{subtotal.toFixed(0)}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-2 mt-2">
                <span className="cart-subtotal">Delivery Fee</span>
                <span className="cart-deliveryvalue">
                  {currentBusiness?.delivery_type || "On demand"}
                </span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mt-4">
                <span className="cart-total">Total</span>
                <span className="cart-totalprice">₹{subtotal.toFixed(0)}</span>
              </div>
            </div>
          </div>

          <div className="col-1" />
        </div>
      </div>

      {/* -----------------------------
           MODAL — SCHEDULE CALL
         ----------------------------- */}
      <Modal
        show={showScheduleModal}
        onHide={() => setShowScheduleModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="address-detailsname">Schedule Call</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Time</label>
            <input
              type="time"
              className="form-control"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            className="btn order-btn"
            style={{
              color: "#fff",
              fontSize: "20px",
              fontWeight: "700",
            }}
            onClick={() => {
              handlePlaceOrder();
              setShowScheduleModal(false);
            }}
            disabled={!scheduleDate || !scheduleTime}
          >
            Continue
          </button>
        </Modal.Footer>
      </Modal>
      {/* -----------------------------
           MODAL — ADDRESS (VIEW / EDIT / ADD)
         ----------------------------- */}
      <Modal
        show={showAddressModal}
        onHide={() => setShowAddressModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="address-detailsname">
              {hasAddress ? " Address Details" : "Add Address"}
            </span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {hasAddress ? (
            <>
              {isEditing ? (
                /* -----------------------------------------
                     EDIT ADDRESS FORM
                   ----------------------------------------- */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    const payload = {
                      ...storedUser,
                      id: storedUser?.user_id,
                      user_id: storedUser?.user_id,
                      userName: form.requester_name || storedUser?.name,
                      requester_name: form.requester_name,
                      requester_mobile: form.requester_mobile,
                      requester_email: form.requester_email,
                      requester_country: form.requester_country,
                      requester_state: form.requester_state,
                      requester_city: form.requester_city,
                      requester_address: form.requester_address,
                      requester_direction: form.requester_direction,
                      requester_latlong: form.requester_latlong,
                    };

                    saveAddress(payload);
                    setIsEditing(false);
                  }}
                >
                  {[
                    { name: "requester_name", label: "Name" },
                    { name: "requester_mobile", label: "Mobile" },
                    { name: "requester_email", label: "Email" },
                    { name: "requester_country", label: "Country" },
                    { name: "requester_state", label: "State" },
                    { name: "requester_city", label: "City" },
                  ].map((f) => (
                    <div className="mb-3" key={f.name}>
                      <label className="label-names">{f.label}</label>
                      <input
                        type="text"
                        name={f.name}
                        value={form[f.name] || ""}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  ))}

                  <div className="mb-3">
                    <label style={{ fontWeight: "600" }}>Address</label>
                    <textarea
                      rows={2}
                      name="requester_address"
                      value={form.requester_address || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label style={{ fontWeight: "600" }}>Copy Your Latitude,Longitude</label>
                    <input
                      type="text"
                      name="requester_latlong"
                      value={form.requester_latlong || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn w-100"
                    style={{
                      backgroundColor: "#34495e",
                      color: "#fff",
                      fontWeight: "600",
                      borderRadius: "8px",
                      height: "48px",
                    }}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </form>
              ) : (
                /* -----------------------------------------
                     VIEW ADDRESS MODE
                   ----------------------------------------- */
                <div>
                  <div className="mb-3">
                    <label className="label-names mb-2">Name</label>
                    <input
                      type="text"
                      name="requester_name"
                      value={form.requester_name || ""}
                      onChange={handleChange}
                      className="form-control"
                      readOnly
                    />
                  </div>

                  <div className="mb-3">
                    <label className="label-names mb-2">Mobile</label>
                    <input
                      type="text"
                      name="requester_mobile"
                      value={form.requester_mobile || ""}
                      onChange={handleChange}
                      className="form-control"
                      readOnly
                    />
                  </div>

                  <div className="mb-3">
                    <label className="label-names mb-2">Email</label>
                    <input
                      type="email"
                      name="requester_email"
                      value={form.requester_email || ""}
                      onChange={handleChange}
                      className="form-control"
                      readOnly
                    />
                  </div>

                  <div className="mb-3">
                    <label className="label-names mb-2">Address</label>
                    <textarea
                      rows={2}
                      name="full_address"
                      value={`${form.requester_address || ""}, ${form.requester_city || ""}, ${form.requester_state || ""}, ${form.requester_country || ""}`}
                      className="form-control"
                      readOnly
                    />
                  </div>

                  <button
                    type="button"
                    className="btn w-100 mt-3"
                    style={{
                      backgroundColor: "#27A376",
                      color: "#fff",
                      fontWeight: "600",
                      borderRadius: "8px",
                      fontSize: "24px",
                      height: "58px",
                    }}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </>
          ) : (
            /* -----------------------------------------
                 ADD NEW ADDRESS FORM
               ----------------------------------------- */
            <form
              onSubmit={(e) => {
                e.preventDefault();

                const payload = {
                  ...storedUser,
                  id: storedUser?.user_id,
                  user_id: storedUser?.user_id,
                  userName: form.requester_name || storedUser?.name,

                  requester_name: form.requester_name,
                  requester_mobile: form.requester_mobile,
                  requester_email: form.requester_email,
                  requester_country: form.requester_country,
                  requester_state: form.requester_state,
                  requester_city: form.requester_city,
                  requester_address: form.requester_address,
                  requester_direction: form.requester_direction,
                  requester_latlong: form.requester_latlong,
                };

                saveAddress(payload);
                setIsEditing(false);
              }}
            >
              <div className="mb-3">
                <label style={{ fontWeight: "600" }}>Full Name</label>
                <input
                  type="text"
                  name="requester_name"
                  placeholder="Enter full name"
                  className="form-control"
                  value={form.requester_name || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label style={{ fontWeight: "600" }}>Address</label>
                <input
                  type="text"
                  name="requester_address"
                  placeholder="Street / Area / House No."
                  className="form-control"
                  value={form.requester_address || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label style={{ fontWeight: "600" }}>City</label>
                <input
                  type="text"
                  name="requester_city"
                  placeholder="Enter city"
                  className="form-control"
                  value={form.requester_city || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label style={{ fontWeight: "600" }}>State</label>
                <input
                  type="text"
                  name="requester_state"
                  placeholder="Enter state"
                  className="form-control"
                  value={form.requester_state || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label style={{ fontWeight: "600" }}>Country</label>
                <input
                  type="text"
                  name="requester_country"
                  placeholder="Enter country"
                  className="form-control"
                  value={form.requester_country || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label style={{ fontWeight: "600" }}>Latitude, Longitude</label>
                <input
                  type="text"
                  name="requester_latlong"
                  placeholder="Copy your latitude, longitude"
                  className="form-control"
                  value={form.requester_latlong || ""}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="btn w-100"
                style={{
                  backgroundColor: "#34495e",
                  color: "#fff",
                  fontWeight: "600",
                  borderRadius: "8px",
                  fontSize: "20px",
                  height: "58px",
                }}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Address"}
              </button>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CartPage;
