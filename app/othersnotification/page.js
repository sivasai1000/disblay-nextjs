"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import LeftNav from "@/components/OthersLeftNav";
import TopNav from "@/components/OthersTopNav";
import { Modal, Button } from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";

// assets
const productlogo = "/assets/img/productlogo.svg";
const productnotify = "/assets/img/productnotify1.svg";
const servicelogo = "/assets/img/servicelogo.png";
const noimage = "/assets/img/noimage.svg";
const nwhatsapp = "/assets/img/nwhatsapp.svg";
const nprofile = "/assets/img/nprofile.svg";
const ncalling = "/assets/img/ncalling.svg";
const ncalendar = "/assets/img/ncalendar.svg";
const nlocation = "/assets/img/nlocation.svg";
const orderproduct = "/assets/img/orderproduct.svg";
const orderservice = "/assets/img/orderservice.svg";
const nleft = "/assets/img/nleft.svg";
const nsms = "/assets/img/nsms.svg";
const ncall = "/assets/img/ncall.svg";
const nclock = "/assets/img/nclock.svg";
const ncircle = "/assets/img/ncircle.svg";

import "@/css/notification.css";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const OthersNotification = () => {
   const queryClient = useQueryClient();
 
    const router = useRouter();
  const [businessId, setBusinessId] = useState("");

useEffect(() => {
  if (typeof window !== "undefined") {
    setBusinessId(localStorage.getItem("businessId") || "");
  }
}, []);


  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");

  const [page, setPage] = useState("list"); 
  const [selectedNotification, setSelectedNotification] = useState(null);

  const [orderDetails, setOrderDetails] = useState(null); // product/service order
  const [comboRequests, setComboRequests] = useState([]); // list of requests in combo
  const [comboUser, setComboUser] = useState(null);       // single user detail

  // -------- Fetch Notifications ----------
 const fetchNotifications = async () => {
  setLoading(true);
  try {
    const res = await axios.post(`${BASE_URL}/get_notificationlist_v3.php`, {
      business_id: businessId,
    });

    if (res.data.status === "success" && res.data.res) {
      let { productItems = [], serviceItems = [], combos = [] } = res.data.res;

      // ✅ Only combos with messages
      combos = combos.filter((c) => Array.isArray(c.messages) && c.messages.length > 0);

      // ✅ Add latestTime field for each type
      const productMapped = productItems.map((p) => ({
        ...p,
        type: "product",
        latestTime: new Date(p.created).getTime(),
      }));

      const serviceMapped = serviceItems.map((s) => ({
        ...s,
        type: "service",
        latestTime: new Date(s.created).getTime(),
      }));

      const comboMapped = combos.map((c) => {
        const lastUpdated = Math.max(
          ...(c.messages || []).map((m) => new Date(m.updated).getTime())
        );
        return {
          ...c,
          type: "combo",
          latestTime: lastUpdated,
        };
      });

      // ✅ Merge and sort by latestTime (DESC)
      const merged = [...productMapped, ...serviceMapped, ...comboMapped].sort(
        (a, b) => b.latestTime - a.latestTime
      );

      setNotifications(merged);
    } else {
      setNotifications([]);
    }
  } catch (err) {
    console.error("Error fetching notifications:", err);
    setNotifications([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (businessId) fetchNotifications();
  }, [businessId]);

  // -------- Fetch Product/Service Detail ----------
  const fetchDetail = async (note) => {
    try {
      const res = await axios.post(`${BASE_URL}/get_notificationById_v1.php`, {
        id: note.notification_id,
      });
      if (res.data.status === "success" && res.data.res) {
        setOrderDetails(res.data.res);
        setPage("detail");
         queryClient.invalidateQueries(["notificationCount"]);

        fetchNotifications(); // refresh list view
      }
    } catch (err) {
      console.error("Error fetching detail:", err);
    }
  };

  // -------- Fetch Combo Requests ----------
  const fetchComboRequests = async (note) => {
    try {
      const res = await axios.post(`${BASE_URL}/get_notificationsByPackage.php`, {
        package_id: note.package_id,
      });
      if (res.data.status === "success" && Array.isArray(res.data.res)) {
        setComboRequests(res.data.res);
        setPage("comboRequests");
         queryClient.invalidateQueries(["notificationCount"]);

        fetchNotifications();
      }
    } catch (err) {
      console.error("Error fetching combo requests:", err);
    }
  };

  // -------- Fetch Combo User Detail ----------
  const fetchComboUserDetail = async (notificationId) => {
    try {
      const res = await axios.post(`${BASE_URL}/get_notificationDetails.php`, {
        notification_id: notificationId,
      });
      if (res.data.status === "success" && res.data.res) {
        setComboUser(res.data.res);
        setPage("comboUser");
       queryClient.invalidateQueries(["notificationCount"]);

        fetchNotifications();
      }
    } catch (err) {
      console.error("Error fetching combo user detail:", err);
    }
  };
const clearAllNotifications = async () => {
  try {
    await axios.post(`${BASE_URL}/delete_allNotifications.php`, {
      business_id: businessId,
    });
    setNotifications([]); // clear locally
    queryClient.invalidateQueries(["notificationCount"]); // refresh badge
  } catch (err) {
    console.error("Error clearing notifications:", err);
  }
};

  // -------- Filtering --------
 const filtered =
  selectedType === "all"
    ? notifications
    : selectedType === "combo"
    ? [...notifications.filter((n) => n.type === "combo")].sort((a, b) => {
        const lastA = Math.max(...(a.messages || []).map((m) => new Date(m.updated).getTime()), 0);
        const lastB = Math.max(...(b.messages || []).map((m) => new Date(m.updated).getTime()), 0);
        return lastB - lastA;
      })
    : notifications.filter((n) => n.type === selectedType);


  const getTypeCount = (type) => {
    if (type === "all") return notifications.length;
    return notifications.filter((n) => n.type === type).length;
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#F5F6FB" }}>
      <LeftNav />
      <div className="flex-grow-1 d-flex flex-column">
        <TopNav />
        <div className="container-fluid p-4">
          
          {/* ---------- LIST VIEW ---------- */}
          {page === "list" && (
            <div className="bg-white rounded-4 shadow-sm p-4">
             <div className="d-flex align-items-center mb-4">
  <img
    src={nleft}
    alt="back"
    style={{ cursor: "pointer", width: "28px", height: "28px" }}
    onClick={()=>{
      router.push('/othersadmin')
    }}
   
  />
  <h4 className="fw-bold ms-2 mb-0">Notifications</h4>
</div>

              <div
              className="d-flex overflow-auto mt-4 mb-2 "
              style={{ gap: "8px", paddingBottom: "8px", whiteSpace: "nowrap" }}>
                {[
                { id: "all", label: "All", width: 79, height: 40 },
                { id: "product", label: "Products", width: 148, height: 40 },
                { id: "combo", label: "🧩 Combos", width: 148, height: 40 },
                { id: "service", label: "🛠 Services", width: 148, height: 40 },
              ].map((tab) => {
                const isSelected = selectedType === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedType(tab.id)}
                    style={{
                      width: `${tab.width}px`,
                      height: "40px",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      fontWeight: 500,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: isSelected ? "#262626" : "#ffffff",
                      color: isSelected ? "#ffffff" : "#000000",
                      border: `1px solid ${isSelected ? "#262626" : "#CCCCCC"}`,
                      cursor: "pointer",
                      gap: "6px",
                    }}
                  >
                    {tab.id === "product" && (
                      <img
                        src={productnotify}
                        alt="notify"
                        style={{ width: "20px", height: "20px" }}
                      />
                    )}
                    <span
                      style={{
                        fontFamily: "Manrope, sans-serif",
                        fontWeight: 600,
                        fontSize: "16px",
                        lineHeight: "19.06px",
                        letterSpacing: "0",
                      }}
                    >
                      {tab.label} ({getTypeCount(tab.id)})
                    </span>
                  </button>
                );
              })}
              </div>
             {notifications.length > 0 && (
  <div className="d-flex justify-content-end mb-4">
    <button
      className=""
      style={{
        background:"transparent",
        border:"none",
        
  

      }}
      onClick={() => setShowModal(true)}
    >
      Clear All
    </button>
  </div>
)}
 

              {loading ? (
                <div className="text-center py-5">Loading...</div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  No notifications available
                </div>
              ) : (
                filtered.map((note) => (
                  <div
                    key={note.notification_id || note.package_id}
                    className="notification-card"
                    onClick={() => {
                      setSelectedNotification(note);
                      if (note.type === "combo") {
                        fetchComboRequests(note);
                      } else {
                        fetchDetail(note);
                      }
                    }}
                  >
                    <div className="notification-left">
                      {note.type === "product" && (
                        <img src={productlogo} alt="product" className="notification-logo" />
                      )}
                      {note.type === "service" && (
                        <img src={servicelogo} alt="service" className="notification-logo" />
                      )}
                      {note.type === "combo" && (
  note.package_poster ? (
    <img
      src={`${BASE_URL}/${note.package_poster}`}
      alt="combo"
      className="notification-logo"
    />
  ) : (
    <div
      style={{
        width: "60px",            // same size as .notification-logo
        height: "60px",
        borderRadius: "12px",
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
        alt="No Combo"
        style={{ width: "22px", height: "22px", marginBottom: "2px" }}
      />
      <span style={{ fontSize: "9px", color: "#777" }}>No Image</span>
    </div>
  )
)}

                      <div>
                        <div className="notification-title">
                          {note.type === "combo"
                            ? note.package_name
                            : note.type === "product"
                            ? "Product Order"
                            : "Service Request"}
                        </div>
                        <div className="notification-sub">
                          {note.type === "combo"
                            ? `Combo ID: ${note.package_code}`
                            : `Order ID: ${note.order_number}`}
                        </div>
                      </div>
                    </div>
                    {parseInt(note.unread_count) > 0 && (
                      <span className="badge-circle">{note.unread_count}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* ---------- PRODUCT / SERVICE DETAIL ---------- */}
          {page === "detail" && orderDetails && (
  <div className="row">

    <div className="col-md-6">
      <div className="bg-white rounded-4 shadow-sm p-4">
        <div
  className="d-flex align-items-center mb-3"
  style={{ cursor: "pointer" }}
  onClick={() => {
    setPage("list");
    setOrderDetails(null);
  }}
>
  <img src={nleft} width={32} height={32} alt="back" />
  <h5 className="fw-bold ms-2 mb-0">Order Summary</h5>
</div>

{/* ICON + TEXT in same row */}
<div className="d-flex align-items-center gap-3 mb-3">
 {orderDetails.package_type === "productItems" || orderDetails.package_type === "serviceItems" ? (
  <img
    src={orderDetails.package_type === "productItems" ? orderproduct : servicelogo}
    alt="order type"
    style={{
      width: "60px",
      height: "60px",
      objectFit: "contain",
      borderRadius: "12px",
     
    }}
  />
) : (
  <div
    style={{
      width: "60px",
      height: "60px",
      borderRadius: "12px",
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
      alt="No type"
      style={{ width: "22px", height: "22px", marginBottom: "2px" }}
    />
    <span style={{ fontSize: "9px", color: "#777" }}>No Image</span>
  </div>
)}

  <div>
    <p className="mb-1 fw-bold">
      Order ID : {orderDetails.order_number}
    </p>
    <small className="text-muted">
      Date {new Date(orderDetails.created).toLocaleDateString()} - {" "}
      {new Date(orderDetails.created).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </small>
  </div>
</div>



        <hr />

        <h6 className="fw-bold mt-3 mb-3">Items ({orderDetails.order_details?.length})</h6>
        {orderDetails.order_details?.map((item, i) => (
          <div
            key={i}
            className="d-flex align-items-center justify-content-between  rounded-3 p-2 mb-2"
          >
            <div className="d-flex align-items-center gap-3">
              {item.product_img ? (
  <img
    src={`${BASE_URL}/${item.product_img}`}
    alt={item.product_name}
    style={{
      width: "80px",
      height: "80px",
      objectFit: "cover",
      borderRadius: "8px",
    }}
  />
) : (
  <div
    style={{
      width: "80px",
      height: "80px",
      borderRadius: "8px",
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
      style={{ width: "24px", height: "24px", marginBottom: "2px" }}
    />
    <span style={{ fontSize: "10px", color: "#777" }}>No Image</span>
  </div>
)}

              <div>
                <div className="notifyname">{item.product_name}</div>
                <div className="notifyqty">Qty: {item.product_qty}</div>
              </div>
            </div>
            <div className="notityprice">₹{item.subtotal}</div>
          </div>
        ))}

        <div className="border-top pt-3 mt-3">
          <div className="notifyname mt-2 mb-2"> Price Breakdown</div>
          <div className="d-flex justify-content-between">
            <div className="notifysub">Subtotal</div>
            <b>₹{orderDetails.order_details?.reduce((a, b) => a + parseFloat(b.subtotal), 0)}</b>
          </div>
          <div className="d-flex justify-content-between">
            <div className="notifysub">Delivery Fee</div>
            <b>{orderDetails.delivery_fee || "on demand"}</b>
          </div>
          <hr/>
          <div className="d-flex justify-content-between mt-2 fw-bold">
            <span>Total</span>
            <span className="text-success">
              ₹
              {orderDetails.order_details?.reduce((a, b) => a + parseFloat(b.subtotal), 0)}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* RIGHT: Customer Details */}
    <div className="col-md-5">
  <div className="bg-white rounded-4 shadow-sm p-4">
    <div className="notifyname mb-4">Customer Details</div>

    {/* Profile */}
    <div className="d-flex align-items-center mb-4">
      <img src={nprofile} alt="profile" width={42} height={42} className="me-2" />
      <div className="nnotifyprofile">{orderDetails.requester_name}</div>
    </div>
    <hr/>

    {/* Phone */}
    <div className="d-flex align-items-center mb-3">
      <img src={ncall} alt="call" width={24} height={24}  className="me-2" />
      <div className="nnotifyprofile1">{orderDetails.requester_mobile}</div>
    </div>
<hr/>
    {/* Email */}
    <div className="d-flex align-items-center mb-3">
      <img src={nsms} alt="email" width={24} height={24}  className="me-2" />
      <div className="nnotifyprofile1">{orderDetails.requester_email}</div>
    </div>
<hr/>
    {/* Requested Date */}
    <div className="d-flex align-items-center mb-3">
      <img src={nclock} alt="clock" width={24} height={24}  className="me-2" />
      <div className="nnotifyprofile1">Requested on {orderDetails.created}</div>
    </div>
<hr/>
    {/* Show schedule only if service */}
    {orderDetails.package_type === "serviceItems" && (
      <div className="d-flex align-items-center mb-3">
        <img src={ncalendar} alt="calendar" width={24} height={24}  className="me-2" />
        <div className="nnotifyprofile1">
          Scheduled {orderDetails.sheduled_date || ""} {orderDetails.sheduled_time || ""}
        </div>
        <hr/>
      </div>
      
    )}

    {/* Address */}
    <div className="d-flex align-items-start mb-3">
      <img src={nlocation} alt="location" width={24} height={24} className="me-2 mt-1" />
      <div className="nnotifyprofile2">{orderDetails.business?.full_address}</div>
    </div>

    {/* Buttons */}
  <div className="d-flex gap-3 mt-3 w-100">
  {/* WhatsApp Button */}
  <a
    href={`https://wa.me/91${orderDetails.requester_mobile}`}
    className="btn d-flex align-items-center gap-2 w-100"
    target="_blank"
    rel="noreferrer"
    style={{
      backgroundColor: "#25D366", // WhatsApp green
      color: "white",
      borderRadius: "10px",
      height: "50px",
      justifyContent: "center", // center content
    }}
  >
    <img src={nwhatsapp} alt="wa" width={20} />
    <span style={{ fontWeight: "700", fontSize: "14px", lineHeight: "20px" }}>
      WhatsApp
    </span>
  </a>

  {/* Call Button */}
  <a
    href={`tel:${orderDetails.requester_mobile}`}
    className="btn d-flex align-items-center gap-2 w-100"
    style={{
      backgroundColor: "#196FE2", // Call blue
      color: "white",
      borderRadius: "10px",
      height: "50px",
      justifyContent: "center", // center content
    }}
  >
    <img src={ncalling} alt="call" width={20} />
    <span style={{ fontWeight: "700", fontSize: "14px", lineHeight: "20px" }}>
      Call
    </span>
  </a>
</div>


  </div>
</div>

  </div>
)}


          {/* ---------- COMBO REQUESTS LIST ---------- */}
          {page === "comboRequests" && selectedNotification && (
            <div className="bg-white rounded-4 shadow-sm p-4">
              <div
                className="d-flex align-items-center mb-4"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setPage("list");
                  setComboRequests([]);
                }}
              >
                <img src={nleft} alt="left" width={28} height={28}/> 
              </div>

              <div className="d-flex align-items-center gap-3 mb-3">
                <img
                  src={
                    selectedNotification.package_poster
                      ? `${BASE_URL}/${selectedNotification.package_poster}`
                      : noimage
                  }
                  alt="combo"
                  className="notification-logo"
                />
                <div>
                  <div className="fw-bold">{selectedNotification.package_name}</div>
                  <small className="text-muted">
                    Combo ID: {selectedNotification.package_code}
                  </small>
                </div>
              </div>
              <div className="nrequest mt-4 mb-4">Requests</div>

              {comboRequests.map((req) => (
                <div
                  key={req.notification_id}
                  className="d-flex justify-content-between align-items-center  p-3 mb-3"
                  style={{ cursor: "pointer",background:'#F2F4F7',borderRadius:"14px" }}
                  onClick={() => fetchComboUserDetail(req.notification_id)}
                >
                  <div>
                    <div className="comboname">{req.requester_name}</div>
                    <div className="combodate mt-2">
                      Requested Date : {req.requested_date}
                    </div>
                  </div>
                  <span><img src={ncircle} alt="circle" width={28}  height={28}/></span>
                </div>
              ))}
            </div>
          )}

          {/* ---------- COMBO USER DETAIL ---------- */}
{page === "comboUser" && comboUser && (
  <div className="col-8">
    <div className="bg-white rounded-4 shadow-sm p-4">
      {/* Back Header */}
      <div
        className="d-flex align-items-center mb-4"
        style={{ cursor: "pointer" }}
        onClick={() => {
          setPage("comboRequests");
          setComboUser(null);
        }}
      >
        <img src={nleft} alt="back" />
        <h5 className="fw-bold ms-2 mb-0">Customer Details</h5>
      </div>

      {/* Profile */}
      <div className="d-flex align-items-center mb-4">
        <img src={nprofile} alt="profile" width={42} height={42} className="me-2" />
        <div className="nnotifyprofile">{comboUser.requester_name}</div>
      </div>
      <hr />

      {/* Phone */}
      <div className="d-flex align-items-center mb-3">
        <img src={ncall} alt="call" width={24} height={24} className="me-2" />
        <div className="nnotifyprofile1">{comboUser.requester_mobile}</div>
      </div>
      <hr />

      {/* Email */}
      <div className="d-flex align-items-center mb-3">
        <img src={nsms} alt="email" width={24} height={24} className="me-2" />
        <div className="nnotifyprofile1">{comboUser.requester_email}</div>
      </div>
      <hr />

      {/* Requested Date */}
      <div className="d-flex align-items-center mb-3">
        <img src={nclock} alt="clock" width={24} height={24} className="me-2" />
        <div className="nnotifyprofile1">Requested on {comboUser.created}</div>
      </div>
      <hr />

      {/* Schedule row - only if service */}
      {comboUser.package_type === "serviceItems" && (
        <>
          <div className="d-flex align-items-center mb-3">
            <img src={ncalendar} alt="calendar" width={24} height={24} className="me-2" />
            <div className="nnotifyprofile1">
              Scheduled {comboUser.sheduled_date || ""} {comboUser.sheduled_time || ""}
            </div>
          </div>
          <hr />
        </>
      )}

      {/* Address */}
      <div className="d-flex align-items-start mb-3">
        <img src={nlocation} alt="location" width={24} height={24} className="me-2 mt-1" />
        <div className="nnotifyprofile2">{comboUser.requester_address}</div>
      </div>

      {/* Buttons */}
      <div className="row mt-3">
        {/* WhatsApp */}
        <div className="col-6">
          <a
            href={`https://wa.me/91${comboUser.requester_mobile}`}
            target="_blank"
            rel="noreferrer"
            className="btn d-flex align-items-center gap-2 w-100"
            style={{
              backgroundColor: "#25D366",
              color: "white",
              borderRadius: "10px",
              height: "50px",
              justifyContent: "center",
            }}
          >
            <img src={nwhatsapp} alt="wa" width={20} />
            <span style={{ fontWeight: "700", fontSize: "14px", lineHeight: "20px" }}>
              WhatsApp
            </span>
          </a>
        </div>

        {/* Call */}
        <div className="col-6">
          <a
            href={`tel:${comboUser.requester_mobile}`}
            className="btn d-flex align-items-center gap-2 w-100"
            style={{
              backgroundColor: "#196FE2",
              color: "white",
              borderRadius: "10px",
              height: "50px",
              justifyContent: "center",
            }}
          >
            <img src={ncalling} alt="call" width={20} />
            <span style={{ fontWeight: "700", fontSize: "14px", lineHeight: "20px" }}>
              Call
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
)}



        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Confirm</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Are you sure you want to delete all notifications?
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Cancel
    </Button>
    <Button
      variant="danger"
      onClick={async () => {
        await clearAllNotifications();
        setShowModal(false);
      }}
    >
      Yes, Delete All
    </Button>
  </Modal.Footer>
</Modal>

    </div>
    
  );
};

export default OthersNotification;
