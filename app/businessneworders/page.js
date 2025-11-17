"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from "next/navigation";
import '@/css/Notifications.css';
import { Modal } from "react-bootstrap";
import moment from 'moment';
import LeftNav from "@/components/NewLeftNav";
import TopNav from "@/components/NewTopNav";
import Swal from "sweetalert2";
import Link from 'next/link';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const BusinessNewOrders = () => {
    const callimg = "/assets/img/call2.png";
const whatsapp1 = "/assets/img/whatsapp1.svg";
const serviceIcon = "/assets/img/nprofile.svg";
const productIcon = "/assets/img/nprofile.svg";

const ncall = "/assets/img/ncall.svg";
const nclock = "/assets/img/nclock.svg";
const nsms = "/assets/img/nsms.svg";
const nlocation = "/assets/img/nlocation.svg";
const ncalendar = "/assets/img/ncalendar.svg";
const nwhatsapp = "/assets/img/nwhatsapp.svg";

const ncalling = "/assets/img/ncalling.svg";
const productnotify = "/assets/img/productnotify.svg";
const arrowright = "/assets/img/arrowright.svg";
const leftarrow3 = "/assets/img/left-arrow1.svg";
const leftarrow2 = "/assets/img/leftarrow.svg";
const nonotification = "/assets/img/nonotifications.svg";
const topiko = "/assets/img/topiko.svg";
const nmap = "/assets/img/nmap.svg";
const noimage = "/assets/img/noimage.svg";
const nlivedirection = "/assets/img/nlivedirection.svg";
const productlogo = "/assets/img/productlogo.svg";
const servicelogo = "/assets/img/servicelogo.png";

const ucircle = "/assets/img/ucircle.svg";
const uprofile = "/assets/img/uprofile1.svg";
const savedaddress = "/assets/img/savedaddress1.svg";
const usms = "/assets/img/usms1.svg";
const udisblay = "/assets/img/udisblay1.svg";
const umap = "/assets/img/umap1.svg";
const ushop = "/assets/img/ushop1.svg";
const ucall = "/assets/img/ucall1.svg";

    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(true);
    const [showUserNotification, setShowUserNotification] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [packageNotifications, setPackageNotifications] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [detailedUser, setDetailedUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [readStatusMap, setReadStatusMap] = useState({});
    const [selectedType, setSelectedType] = useState("all");
    const [loading, setLoading] = useState(true);
    const [productItems, setProductItems] = useState([]);
    const [serviceItems, setServiceItems] = useState([]);
    const [showOrder, setShowOrder] = useState(true);
    const [showCustomer, setShowCustomer] = useState(false);
    const [showServiceOrder, setShowServiceOrder] = useState(false);
    const [comboItems, setComboItems] = useState([]);
    const [showOwnerInfo, setShowOwnerInfo] = useState(false);


const router = useRouter();


    const searchParams = useSearchParams();
const businessId = searchParams.get("business_id");


    const userId = localStorage.getItem("userId");
    
    const business_slug = localStorage.getItem("business_slug1")
    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const res = await axios.post(
                    `${BASE_URL}/get_userNotificationList_v1.php`,
                    { user_id: userId }
                );

                if (res.data.status === "success" && res.data.res) {
                    const { productItems = [], serviceItems = [], combos = [] } = res.data.res;
                    const validCombos = combos.filter(
                        c => parseInt(c.unread_count || 0) > 0 || (Array.isArray(c.messages) && c.messages.length > 0)
                    );

                    // Merge into ONE array with explicit type
                    let merged = [
                        ...productItems.map(p => ({ ...p, type: "product" })),
                        ...serviceItems.map(s => ({ ...s, type: "service" })),
                        ...validCombos.map(c => ({ ...c, type: "combo" }))
                    ];

                    // Sort (latest first)
                    merged.sort(
                        (a, b) =>
                            new Date(b.created_date || b.created) -
                            new Date(a.created_date || a.created)
                    );

                    setNotifications(merged);
                    localStorage.setItem("notifications", JSON.stringify(merged));
                } else {
                    setNotifications([]);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
                setNotifications([]);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchNotifications();
    }, [userId]);


    const unreadCount = notifications.reduce((acc, note) => acc + parseInt(note.unread_count || 0), 0);

    const markAsRead = (id) => {
        const updated = notifications.map(note =>
            note.id === id ? { ...note, unread: 0 } : note
        );
        setNotifications(updated);
        localStorage.setItem("notifications", JSON.stringify(updated));
    };
    const fetchPackageNotifications = async (packageId) => {
        try {
            const res = await axios.post(`${BASE_URL}/get_notificationsByPackage_v1.php`, {
                package_id: packageId,
                user_id: userId
            });

            if (res.data.status === "success" && res.data.res) {
                setPackageNotifications(res.data.res); // ✅ use object directly
            } else {
                setPackageNotifications(null);
            }
        } catch (error) {
            console.error("Error fetching package notifications:", error);
            setPackageNotifications(null);
        }
    };


    // One function for both Product & Service
    const fetchNotificationById = async (notificationId) => {
        console.log("notificationId", notificationId);
        try {
            const res = await axios.post(
                `${BASE_URL}/get_notificationById_v1.php`,
                { id: notificationId }
            );
            console.log("get_notificationById.php is ", res)

            if (res.data.status === "success" && res.data.res) {

                setPackageNotifications(res.data.res);
            } else {
                setPackageNotifications(null);
                console.warn("No notification found or invalid response format");
            }
        } catch (error) {
            console.error("Error fetching notification:", error);
            setPackageNotifications(null);
        }
    };



    const fetchNotificationDetails = async (notificationId) => {
        try {
            const res = await axios.post(
                `${BASE_URL}/get_notificationDetails.php`,
                { notification_id: notificationId }
            );

            if (res.data.status === "success" && res.data.res) {
                setDetailedUser(res.data.res);

                // ✅ Mark as read in localStorage
                const readIds = JSON.parse(localStorage.getItem("readNotificationIds") || "[]");

                if (!readIds.includes(notificationId)) {
                    readIds.push(notificationId);
                    localStorage.setItem("readNotificationIds", JSON.stringify(readIds));
                }
                setReadStatusMap(prev => ({
                    ...prev,
                    [notificationId]: "0"
                }));
                setPackageNotifications(prev =>
                    prev.map(msg =>
                        msg.notification_id === notificationId
                            ? { ...msg, isRead: "0" } 
                            : msg
                    )
                );
                
                setNotifications(prev =>
                    prev.map(pkg =>
                        pkg.package_id === res.data.res.package_id
                            ? {
                                ...pkg,
                                unread_count: Math.max(0, parseInt(pkg.unread_count || 1) - 1)
                            }
                            : pkg
                    )
                );
                setSelectedNotification(prev => ({ ...prev }));

            } else {
                setDetailedUser(null);
                console.warn("No detailed data found or invalid format");
            }
        } catch (error) {
            console.error("Error fetching notification details:", error);
            setDetailedUser(null);
        }
    };
    const getFilteredNotifications = () => {
        let list = selectedType === "all"
            ? notifications
            : notifications.filter(item => item.type === selectedType);
        return list;
    };
    const today = new Date().toISOString().split("T")[0]; 

    const filtered = getFilteredNotifications();

    const todayNotifications = filtered.filter(note => {
        const created = note.created_date || note.created;
        return created && created.startsWith(today);
    });

    const previousNotifications = filtered.filter(note => {
        const created = note.created_date || note.created;
        return created && !created.startsWith(today);
    });
    const getTypeCount = (type) => {
        if (type === "all") return notifications.length;
        return notifications.filter(n => n.type === type).length;
    };
    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="d-flex">
                <LeftNav />
            </div>
            <div className="flex-grow-1">
                <TopNav />
                <div style={{ background: "#f9fafb" }}>
                    {/* ✅ Top Navigation */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",   // center horizontally
                            alignItems: "center",       // center vertically
                            minHeight: "100vh",         // full screen height
                            background: "#f5f6fb",      // optional background
                        }}
                    >
                        <div className='mt-4'
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                minHeight: "100vh",
                                background: "#ffffff",
                                width: "788px",
                                borderRadius: "12px",     // optional, looks neat
                                boxShadow: "0 2px 12px rgba(0,0,0,0.1)", // optional
                            }}
                        >
                            <main style={{ flex: 1 }}>

                                {!showUserNotification && (
                                    <div className="card cardshow" style={{ width: "100%" }}>
                                        <div className="card-header alignings d-flex justify-content-between align-items-center" style={{ background: "transparent" }}>
                                            {/* Back + Title grouped in one row */}
                                            <div className="d-flex align-items-center w-100 gap-3">
                                                <img
                                                    src={leftarrow2}
                                                    width={28}
                                                    alt='left'
                                                    height={28}
                                                    // onClick={() => router.push(`/${business_slug}`)}
                                                    onClick={() => router.push("/newbusiness")}
                                                    style={{ cursor: "pointer" }}
                                                />
                                                <div className=" mb-0" style={{ fontWeight: "700", fontSize: '20px', color: "#262626" }}>My Orders</div>
                                                <div className="ms-auto text-end" >
                                                    <img src={savedaddress} width={30} height={30} alt="Saved Address" onClick={() => router.push('/address')} style={{cursor:"pointer"}}
                                                    />
                                                </div>
                                            </div>


                                        </div>
                                        {/* ---- Tabs Bar ---- */}
                                        <div
                                            className="d-flex overflow-auto px-3 mt-3 mb-2"
                                            style={{ gap: "8px", paddingBottom: "8px", whiteSpace: "nowrap" }}
                                        >
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
                                                            background: isSelected ? "#34495E" : "#ffffff",
                                                            color: isSelected ? "#ffffff" : "#000000",
                                                            border: `1px solid ${isSelected ? "#34495E" : "#CCCCCC"}`,
                                                            cursor: "pointer",
                                                            gap: "6px",
                                                        }}
                                                    >
                                                        {tab.id === "product" && (
                                                            <img
                                                                src={productnotify}
                                                                alt="notify"
                                                                style={{ width: "16px", height: "16px" }}
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





                                        <div className="notification-panel " style={{ background: "#Ffffff" }}>
                                            {!loading && todayNotifications.length === 0 && previousNotifications.length === 0 ? (
                                                <div className="text-center mt-5">
                                                    <img
                                                        src={nonotification}
                                                        alt="No Notifications"
                                                        style={{
                                                            width: "325px",
                                                            height: "325px",
                                                            marginBottom: "20px",
                                                            objectFit: "contain"
                                                        }}
                                                    />
                                                    <p style={{ fontWeight: "600", fontSize: "16px", color: "#34495E" }}>
                                                        {selectedType === 'all'
                                                            ? 'No orders placed'
                                                            : selectedType === 'combo'
                                                                ? 'No orders for the combo.'
                                                                : selectedType === 'product'
                                                                    ? 'No orders for the product.'
                                                                    : selectedType === 'service'
                                                                        ? 'No orders for the service.'
                                                                        : 'No orders available.'}
                                                    </p>
                                                </div>
                                            ) : (
                                                <>
                                                    {todayNotifications.length === 0 && previousNotifications.length === 0 ? (
                                                        <p className="text-center text-muted mt-5" style={{ fontWeight: "600", fontSize: "16px" }}>
                                                            {selectedType === 'combo'
                                                                ? 'No Orders for the combo.'
                                                                : selectedType === 'product'
                                                                    ? 'No Orders for the product.'
                                                                    : selectedType === 'service'
                                                                        ? 'No Orders for the service.'
                                                                        : 'No Orders available.'}
                                                        </p>
                                                    ) : (
                                                        <>
                                                            {todayNotifications.length > 0 && (
                                                                <>

                                                                    {todayNotifications.map((note) => (
                                                                        note.type === "combo" ? (
                                                                            <div
                                                                                key={note.package_id}
                                                                                className="notification-cards"
                                                                                onClick={() => {
                                                                                    setSelectedNotification(note);
                                                                                    fetchPackageNotifications(note.package_id);
                                                                                    setShowUserNotification(true);
                                                                                }}
                                                                            >
                                                                                {/* Top Row: Business Info */}
                                                                                <div className="d-flex align-items-center mb-2">
                                                                                    {note.business_logo ? (
                                                                                        <img
                                                                                            src={`${BASE_URL}/${note.business_logo}`}
                                                                                            alt={note.business_name || "business"}
                                                                                            style={{
                                                                                                width: "40px",
                                                                                                height: "40px",
                                                                                                borderRadius: "8px",
                                                                                                marginRight: "10px"
                                                                                            }}
                                                                                        />
                                                                                    ) : (
                                                                                        <img
                                                                                            src={noimage}
                                                                                            alt="logo"
                                                                                            style={{
                                                                                                width: "40px",
                                                                                                height: "40px",
                                                                                                borderRadius: "8px",
                                                                                                marginRight: "10px"
                                                                                            }}
                                                                                        />
                                                                                    )}

                                                                                    <div>
                                                                                        <div style={{ fontWeight: "700", fontSize: "15px", color: "#262626" }}>
                                                                                            {note.business_name}
                                                                                        </div>
                                                                                        <div style={{ fontSize: "13px", color: "#777" }}>
                                                                                            {moment(note.created || note.created_date).format("DD-MMM-YYYY")}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Bottom Box: Combo Info with Badge inside */}
                                                                                <div
                                                                                    className="d-flex align-items-center justify-content-between"
                                                                                    style={{
                                                                                        background: "#F5F6FB",
                                                                                        borderRadius: "10px",
                                                                                        padding: "12px",
                                                                                        marginTop: "8px"
                                                                                    }}
                                                                                >
                                                                                    {/* Left side: Poster + Combo Info */}
                                                                                    <div className="d-flex align-items-center">
                                                                                        {note.package_poster ? (
                                                                                            <img
                                                                                                src={`${BASE_URL}/${note.package_poster}`}
                                                                                                alt={note.package_name || "package"}
                                                                                                style={{
                                                                                                    width: "50px",
                                                                                                    height: "50px",
                                                                                                    borderRadius: "8px",
                                                                                                    marginRight: "10px"
                                                                                                }}
                                                                                            />
                                                                                        ) : (
                                                                                            <div
                                                                                                style={{
                                                                                                    width: "50px",
                                                                                                    height: "50px",
                                                                                                    borderRadius: "8px",
                                                                                                    backgroundColor: "#f0f0f0",
                                                                                                    display: "flex",
                                                                                                    alignItems: "center",
                                                                                                    justifyContent: "center",
                                                                                                    marginRight: "10px"
                                                                                                }}
                                                                                            >
                                                                                                <img src={noimage} alt="No preview" style={{ width: "20px", height: "20px" }} />
                                                                                            </div>
                                                                                        )}

                                                                                        <div>
                                                                                            <div className="notification-title">{note.package_name} </div>
                                                                                            <div className="notification-sub">Combo ID : {note.package_code}</div>
                                                                                        </div>
                                                                                    </div>


                                                                                </div>
                                                                            </div>

                                                                        ) : (

                                                                            <div
                                                                                key={note.notification_id}
                                                                                className="notification-cards"
                                                                                onClick={() => {
                                                                                    setSelectedNotification(note);
                                                                                    fetchNotificationById(note.notification_id);
                                                                                    setShowUserNotification(true);
                                                                                }}
                                                                            >
                                                                                {/* Top Row: Business Info */}
                                                                                <div className="d-flex align-items-center mb-2">
                                                                                    {/* Business Logo */}
                                                                                    {note.business_logo ? (
                                                                                        <img
                                                                                            src={`${BASE_URL}/${note.business_logo}`}
                                                                                            alt={note.business_name || "name"}
                                                                                            style={{
                                                                                                width: "40px",
                                                                                                height: "40px",
                                                                                                borderRadius: "8px",
                                                                                                marginRight: "10px"
                                                                                            }}
                                                                                        />
                                                                                    ) : (
                                                                                        <img
                                                                                            src={noimage}
                                                                                            alt="logo"
                                                                                            style={{
                                                                                                width: "40px",
                                                                                                height: "40px",
                                                                                                borderRadius: "8px",
                                                                                                marginRight: "10px"
                                                                                            }}
                                                                                        />
                                                                                    )}

                                                                                    <div>
                                                                                        <div style={{ fontWeight: "700", fontSize: "15px", color: "#262626" }}>
                                                                                            {note.business_name || note.package_name}
                                                                                        </div>
                                                                                        <div style={{ fontSize: "13px", color: "#777" }}>
                                                                                            {moment(note.created || note.created_date).format("DD-MMM-YYYY")}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Bottom Box: Order Info */}
                                                                                <div
                                                                                    className="d-flex align-items-center justify-content-between"
                                                                                    style={{
                                                                                        background: "#F5F6FB",
                                                                                        borderRadius: "10px",
                                                                                        padding: "12px",
                                                                                        marginTop: "8px"
                                                                                    }}
                                                                                >
                                                                                    {/* Left side: Icon + Order Info */}
                                                                                    <div className="d-flex align-items-center">
                                                                                        <img
                                                                                            src={note.type === "product" ? productlogo : servicelogo}
                                                                                            alt={note.type === "product" ? "Product" : "Service" || "select type"}
                                                                                            style={{ width: "40px", height: "40px", marginRight: "10px" }}
                                                                                        />
                                                                                        <div>

                                                                                            <div className="notification-sub">Order ID : {note.order_number}</div>

                                                                                        </div>
                                                                                    </div>


                                                                                </div>
                                                                            </div>



                                                                        )
                                                                    ))}

                                                                </>
                                                            )}
                                                            {previousNotifications.length > 0 && (
                                                                <>
                                                                    {previousNotifications.map((note) => (
                                                                        note.type === "combo" ? (
                                                                            <div
                                                                                key={note.package_id}
                                                                                className="notification-cards"
                                                                                onClick={() => {
                                                                                    setSelectedNotification(note);
                                                                                    fetchPackageNotifications(note.package_id);
                                                                                    setShowUserNotification(true);
                                                                                }}
                                                                            >
                                                                                {/* Top Row: Business Info */}
                                                                                <div className="d-flex align-items-center mb-2">
                                                                                    {note.business_logo ? (
                                                                                        <img
                                                                                            src={`${BASE_URL}/${note.business_logo}`}
                                                                                            alt={note.business_name || "business"}
                                                                                            style={{
                                                                                                width: "40px",
                                                                                                height: "40px",
                                                                                                borderRadius: "8px",
                                                                                                marginRight: "10px"
                                                                                            }}
                                                                                        />
                                                                                    ) : (
                                                                                        <img
                                                                                            src={noimage}
                                                                                            alt="logo"
                                                                                            style={{
                                                                                                width: "40px",
                                                                                                height: "40px",
                                                                                                borderRadius: "8px",
                                                                                                marginRight: "10px"
                                                                                            }}
                                                                                        />
                                                                                    )}

                                                                                    <div>
                                                                                        <div style={{ fontWeight: "700", fontSize: "15px", color: "#262626" }}>
                                                                                            {note.business_name}
                                                                                        </div>
                                                                                        <div style={{ fontSize: "13px", color: "#777" }}>
                                                                                            {moment(note.created || note.created_date).format("DD-MMM-YYYY")}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Bottom Box: Combo Info with Badge inside */}
                                                                                <div
                                                                                    className="d-flex align-items-center justify-content-between"
                                                                                    style={{
                                                                                        background: "#F5F6FB",
                                                                                        borderRadius: "10px",
                                                                                        padding: "12px",
                                                                                        marginTop: "8px"
                                                                                    }}
                                                                                >
                                                                                    {/* Left side: Poster + Combo Info */}
                                                                                    <div className="d-flex align-items-center">
                                                                                        {note.package_poster ? (
                                                                                            <img
                                                                                                src={`${BASE_URL}/${note.package_poster}`}
                                                                                                alt={note.package_name || "package"}
                                                                                                style={{
                                                                                                    width: "50px",
                                                                                                    height: "50px",
                                                                                                    borderRadius: "8px",
                                                                                                    marginRight: "10px"
                                                                                                }}
                                                                                            />
                                                                                        ) : (
                                                                                            <div
                                                                                                style={{
                                                                                                    width: "50px",
                                                                                                    height: "50px",
                                                                                                    borderRadius: "8px",
                                                                                                    backgroundColor: "#f0f0f0",
                                                                                                    display: "flex",
                                                                                                    alignItems: "center",
                                                                                                    justifyContent: "center",
                                                                                                    marginRight: "10px"
                                                                                                }}
                                                                                            >
                                                                                                <img src={noimage} alt="No preview" style={{ width: "20px", height: "20px" }} />
                                                                                            </div>
                                                                                        )}

                                                                                        <div>
                                                                                            <div className="notification-title">{note.package_name} </div>
                                                                                            <div className="notification-sub">Combo ID : {note.package_code}</div>
                                                                                        </div>
                                                                                    </div>


                                                                                </div>
                                                                            </div>

                                                                        ) : (
                                                                            <div
                                                                                key={note.notification_id}
                                                                                className="notification-cards"
                                                                                onClick={() => {
                                                                                    setSelectedNotification(note);
                                                                                    fetchNotificationById(note.notification_id);
                                                                                    setShowUserNotification(true);
                                                                                }}
                                                                            >
                                                                                {/* Top Row: Business Info */}
                                                                                <div className="d-flex align-items-center mb-2">
                                                                                    {/* Business Logo */}
                                                                                    {note.business_logo ? (
                                                                                        <img
                                                                                            src={`${BASE_URL}/${note.business_logo}`}
                                                                                            alt={note.business_name || "business"}
                                                                                            style={{
                                                                                                width: "40px",
                                                                                                height: "40px",
                                                                                                borderRadius: "8px",
                                                                                                marginRight: "10px"
                                                                                            }}
                                                                                        />
                                                                                    ) : (
                                                                                        <img
                                                                                            src={noimage}
                                                                                            alt="logo"
                                                                                            style={{
                                                                                                width: "40px",
                                                                                                height: "40px",
                                                                                                borderRadius: "8px",
                                                                                                marginRight: "10px"
                                                                                            }}
                                                                                        />
                                                                                    )}

                                                                                    <div>
                                                                                        <div style={{ fontWeight: "700", fontSize: "15px", color: "#262626" }}>
                                                                                            {note.business_name || note.package_name}
                                                                                        </div>
                                                                                        <div style={{ fontSize: "13px", color: "#777" }}>
                                                                                            {moment(note.created || note.created_date).format("DD-MMM-YYYY")}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Bottom Box: Order Info */}
                                                                                <div
                                                                                    className="d-flex align-items-center justify-content-between"
                                                                                    style={{
                                                                                        background: "#F5F6FB",
                                                                                        borderRadius: "10px",
                                                                                        padding: "12px",
                                                                                        marginTop: "8px"
                                                                                    }}
                                                                                >
                                                                                    {/* Left side: Icon + Order Info */}
                                                                                    <div className="d-flex align-items-center">
                                                                                        <img
                                                                                            src={note.type === "product" ? productlogo : servicelogo}
                                                                                            alt={note.type === "product" ? "Product" : "Service" || "type"}
                                                                                            style={{ width: "40px", height: "40px", marginRight: "10px" }}
                                                                                        />
                                                                                        <div>

                                                                                            <div className="notification-sub">Order ID : {note.order_number}</div>

                                                                                        </div>
                                                                                    </div>


                                                                                </div>
                                                                            </div>

                                                                        )
                                                                    ))}

                                                                </>
                                                            )}
                                                        </>
                                                    )}

                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div style={{ background: "#F5F6FB" }}>
                                    {selectedNotification && showUserNotification && (
                                        <div className="full-screen-panel" style={{ background: "#F5F6FB" }}>
                                            <div
                                                className="top-bar d-flex justify-content-between align-items-center py-3 "
                                                style={{ color: "#34495E" }}
                                            >
                                                <div className="d-flex w-100 align-items-center">
                                                    {/* Left section: back + title */}
                                                    <div className="d-flex align-items-center">
                                                        <button className="btn" onClick={() => setShowUserNotification(false)}>
                                                            <img src={leftarrow2} alt="back" />
                                                        </button>
                                                        <div className="fs-3 fw-bold ms-2">
                                                            {packageNotifications?.business?.business_name || "Business"}
                                                        </div>

                                                    </div>

                                                    {/* Right section: user circle */}
                                                    <div className="ms-auto px-4">
                                                        <img
                                                            src={ucircle}
                                                            width={20}
                                                            height={20}
                                                            alt="user"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => setShowOwnerInfo(true)}
                                                        />
                                                    </div>

                                                </div>


                                            </div>

                                            <div className="p-3">
                                                <>
                                                    {selectedNotification.type === "combo" && (
                                                        <div>
                                                            {/* Combo Panel */}
                                                            <div
                                                                className="combo-card d-flex justify-content-between align-items-center px-3 py-3 mb-3"
                                                                style={{ background: "white" }}
                                                            >
                                                                <div className="d-flex align-items-center gap-3">
                                                                    {selectedNotification.package_poster ? (
                                                                        <img
                                                                            src={`${BASE_URL}/${selectedNotification.package_poster}`}
                                                                            alt="combo"
                                                                            className="combo-img"

                                                                        />
                                                                    ) : (
                                                                        <div
                                                                            style={{
                                                                                width: "58px",
                                                                                height: "58px",
                                                                                borderRadius: "10px",
                                                                                backgroundColor: "#f0f0f0",
                                                                                display: "flex",
                                                                                flexDirection: "column",
                                                                                alignItems: "center",
                                                                                justifyContent: "center",
                                                                                fontSize: "8px",
                                                                                color: "#999",
                                                                                padding: "10px",
                                                                            }}
                                                                        >
                                                                            <img src={noimage} alt="No preview" style={{ width: "20px", height: "20px", marginBottom: "6px" }} />
                                                                            No Image
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <div className="combo-title">{selectedNotification.package_name} </div>
                                                                        <div className="combo-sub">Combo ID : {selectedNotification.package_code}</div>
                                                                        <div className="combo-sub">Created Date :  {selectedNotification.created_date}</div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            {packageNotifications && (
                                                                <>
                                                                    <div
                                                                        className="fw-bold mb-4 mt-4"
                                                                        style={{ fontSize: "15px", color: "#34495E" }}
                                                                    >
                                                                        Items ({packageNotifications.order_details?.length || 0})
                                                                    </div>

                                                                    {packageNotifications.order_details?.map((item, i) => (
                                                                        <div
                                                                            key={i}
                                                                            className="d-flex justify-content-between align-items-center p-2 mb-2"
                                                                            style={{
                                                                                border: "1px solid #E9ECEF",
                                                                                borderRadius: "12px",
                                                                                height: "78px",
                                                                                background: "#FDFDFD"
                                                                            }}
                                                                        >
                                                                            <div className="d-flex align-items-center">
                                                                                <img
                                                                                    src={`${BASE_URL}/${item.product_img}`}
                                                                                    alt={item.product_name || "product"}
                                                                                    style={{
                                                                                        width: "60px",
                                                                                        height: "60px",
                                                                                        borderRadius: "8px",
                                                                                        marginRight: "10px"
                                                                                    }}
                                                                                />
                                                                                <div>
                                                                                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#262626" }}>
                                                                                        {item.product_name}
                                                                                    </div>
                                                                                    <div style={{ fontSize: "14px", fontWeight: "500", color: "#262626" }}>
                                                                                        Qty: {item.product_qty}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div style={{ fontSize: "16px", fontWeight: "700", color: "#262626" }}>
                                                                                ₹{item.subtotal}
                                                                            </div>
                                                                        </div>
                                                                    ))}

                                                                    {/* Price Breakdown */}
                                                                    {(() => {
                                                                        const subtotal =
                                                                            packageNotifications.order_details?.reduce(
                                                                                (sum, item) => sum + parseFloat(item.subtotal || 0),
                                                                                0
                                                                            ) || 0;
                                                                        const deliveryFee = packageNotifications.delivery_fee
                                                                            ? parseFloat(packageNotifications.delivery_fee)
                                                                            : 0;
                                                                        const total = subtotal + deliveryFee;

                                                                        return (
                                                                            <div className="mt-3">
                                                                                <div
                                                                                    className="fw-bold mb-4 mt-4"
                                                                                    style={{ fontSize: "16px", fontWeight: "700", color: "#262626" }}
                                                                                >
                                                                                    Price Breakdown
                                                                                </div>
                                                                                <div className="d-flex justify-content-between">
                                                                                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#3E5069" }}>Subtotal</div>
                                                                                    <div style={{ fontSize: "16px", fontWeight: "600", color: "#07182C" }}>₹{subtotal}</div>
                                                                                </div>
                                                                                <div className="d-flex justify-content-between mt-2">
                                                                                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#3E5069" }}>Delivery Fee</div>
                                                                                    <div style={{ fontSize: "16px", fontWeight: "600", color: "#3E5069" }}>
                                                                                        {packageNotifications.delivery_fee || "on demand"}
                                                                                    </div>
                                                                                </div>
                                                                                <hr />
                                                                                <div className="d-flex justify-content-between fw-bold">
                                                                                    <div style={{ fontSize: "18px", fontWeight: "700", color: "#262626" }}>Total</div>
                                                                                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#00B308" }}>₹{total}</div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                </>
                                                            )}

                                                        </div>
                                                    )}

                                                    {selectedNotification.type === "product" && packageNotifications && (
                                                        <div
                                                            className="bg-white p-3 mb-3"
                                                            style={{
                                                                borderRadius: "16px",
                                                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                                                            }}
                                                        >
                                                            {/* Card Header */}
                                                            <div
                                                                className="d-flex justify-content-between align-items-center"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() => setShowOrder((prev) => !prev)} // toggle state
                                                            >
                                                                <div className="d-flex align-items-center">
                                                                    <img
                                                                        src={productlogo}
                                                                        alt="Product"
                                                                        style={{
                                                                            width: "40px",
                                                                            height: "40px",
                                                                            borderRadius: "8px",
                                                                            marginRight: "12px"
                                                                        }}
                                                                    />
                                                                    <div>
                                                                        <div
                                                                            className="fw-bold"
                                                                            style={{ fontSize: "14px", color: "#34495E" }}
                                                                        >
                                                                            Order ID : {packageNotifications.order_number}
                                                                        </div>
                                                                        <div className="text-muted" style={{ fontSize: "13px" }}>
                                                                            Date {packageNotifications.created}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Dropdown Arrow */}
                                                                <FiChevronDown
                                                                    size={22}
                                                                    style={{
                                                                        transition: "transform 0.3s",
                                                                        transform: showOrder ? "rotate(180deg)" : "rotate(0deg)",
                                                                        color: "#ff4d4d"
                                                                    }}
                                                                />
                                                            </div>

                                                            {/* Collapsible Content */}
                                                            {showOrder && (
                                                                <div className="mt-3">
                                                                    {/* Items */}
                                                                    <div
                                                                        className="fw-bold mb-4 mt-4"
                                                                        style={{ fontSize: "15px", color: "#34495E" }}
                                                                    >
                                                                        Items ({packageNotifications.order_details?.length || 0})
                                                                    </div>
                                                                    {packageNotifications.order_details?.map((item, i) => (
                                                                        <div
                                                                            key={i}
                                                                            className="d-flex justify-content-between align-items-center p-2 mb-2"
                                                                            style={{
                                                                                border: "1px solid #E9ECEF",
                                                                                borderRadius: "12px",
                                                                                height: "78px",
                                                                                background: "#FDFDFD"
                                                                            }}
                                                                        >
                                                                            <div className="d-flex align-items-center">
                                                                                <img
                                                                                    src={`${BASE_URL}/${item.product_img}`}
                                                                                    alt={item.product_name || "name"}
                                                                                    style={{
                                                                                        width: "60px",
                                                                                        height: "60px",
                                                                                        borderRadius: "8px",
                                                                                        marginRight: "10px"
                                                                                    }}
                                                                                />
                                                                                <div>
                                                                                    <div
                                                                                        style={{
                                                                                            fontSize: "16px",
                                                                                            fontWeight: "700",
                                                                                            color: "#262626"
                                                                                        }}
                                                                                    >
                                                                                        {item.product_name}
                                                                                    </div>
                                                                                    <div className="text-muted " style={{
                                                                                        fontSize: "14px",
                                                                                        fontWeight: "500",
                                                                                        color: "#262626"
                                                                                    }}>Qty: {item.product_qty}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="fw-bold" style={{
                                                                                fontSize: "16px",
                                                                                fontWeight: "700",
                                                                                color: "#262626"
                                                                            }}>
                                                                                ₹{item.subtotal}
                                                                            </div>
                                                                        </div>
                                                                    ))}

                                                                    {/* Price Breakdown */}
                                                                    {(() => {
                                                                        const subtotal =
                                                                            packageNotifications.order_details?.reduce(
                                                                                (sum, item) => sum + parseFloat(item.subtotal || 0),
                                                                                0
                                                                            ) || 0;
                                                                        const deliveryFee = packageNotifications.delivery_fee
                                                                            ? parseFloat(packageNotifications.delivery_fee)
                                                                            : 0;
                                                                        const total = subtotal + deliveryFee;

                                                                        return (
                                                                            <div className="mt-3">
                                                                                <div
                                                                                    className="fw-bold mb-4 mt-4"
                                                                                    style={{
                                                                                        fontSize: "16px",
                                                                                        fontWeight: "700",
                                                                                        color: "#262626"
                                                                                    }}
                                                                                >
                                                                                    Price Breakdown
                                                                                </div>
                                                                                <div className="d-flex justify-content-between ">
                                                                                    <div style={{
                                                                                        fontSize: "14px",
                                                                                        fontWeight: "600",
                                                                                        color: "#3E5069"
                                                                                    }}>Subtotal</div>
                                                                                    <div style={{
                                                                                        fontSize: "16px",
                                                                                        fontWeight: "600",
                                                                                        color: "#07182C"
                                                                                    }}>₹{subtotal}</div>
                                                                                </div>
                                                                                <div className="d-flex justify-content-between mt-2">
                                                                                    <div style={{
                                                                                        fontSize: "14px",
                                                                                        fontWeight: "600",
                                                                                        color: "#3E5069"
                                                                                    }}>Delivery Fee</div>
                                                                                    <div style={{
                                                                                        fontSize: "16px",
                                                                                        fontWeight: "600",
                                                                                        color: "#3E5069"
                                                                                    }}>{packageNotifications.delivery_fee || "on demand"}</div>
                                                                                </div>
                                                                                <hr />
                                                                                <div
                                                                                    className="d-flex justify-content-between fw-bold"
                                                                                    style={{ color: "#27AE60" }}
                                                                                >
                                                                                    <div style={{
                                                                                        fontSize: "18px",
                                                                                        fontWeight: "700",
                                                                                        color: "#262626"
                                                                                    }} >Total</div>
                                                                                    <div style={{
                                                                                        fontSize: "16px",
                                                                                        fontWeight: "700",
                                                                                        color: "#00B308"
                                                                                    }}>₹{total}</div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}


                                                    {selectedNotification.type === "service" && packageNotifications && (
                                                        <div
                                                            className="bg-white p-3 mb-3"
                                                            style={{
                                                                borderRadius: "16px",
                                                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                                                            }}
                                                        >
                                                            {/* Card Header */}
                                                            <div
                                                                className="d-flex justify-content-between align-items-center"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() => setShowOrder((prev) => !prev)} // toggle state
                                                            >
                                                                <div className="d-flex align-items-center">
                                                                    <img
                                                                        src={servicelogo}
                                                                        alt="Product"
                                                                        style={{
                                                                            width: "40px",
                                                                            height: "40px",
                                                                            borderRadius: "8px",
                                                                            marginRight: "12px"
                                                                        }}
                                                                    />
                                                                    <div>
                                                                        <div
                                                                            className="fw-bold"
                                                                            style={{ fontSize: "14px", color: "#34495E" }}
                                                                        >
                                                                            Order ID : {packageNotifications.order_number}
                                                                        </div>
                                                                        <div className="text-muted" style={{ fontSize: "13px" }}>
                                                                            Date {packageNotifications.created}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Dropdown Arrow */}
                                                                <FiChevronDown
                                                                    size={22}
                                                                    style={{
                                                                        transition: "transform 0.3s",
                                                                        transform: showOrder ? "rotate(180deg)" : "rotate(0deg)",
                                                                        color: "#ff4d4d"
                                                                    }}
                                                                />
                                                            </div>

                                                            {/* Collapsible Content */}
                                                            {showOrder && (
                                                                <div className="mt-3">
                                                                    {/* Items */}
                                                                    <div
                                                                        className="fw-bold mb-4 mt-4"
                                                                        style={{ fontSize: "15px", color: "#34495E" }}
                                                                    >
                                                                        Items ({packageNotifications.order_details?.length || 0})
                                                                    </div>
                                                                    {packageNotifications.order_details?.map((item, i) => (
                                                                        <div
                                                                            key={i}
                                                                            className="d-flex justify-content-between align-items-center p-2 mb-2"
                                                                            style={{
                                                                                border: "1px solid #E9ECEF",
                                                                                borderRadius: "12px",
                                                                                height: "78px",
                                                                                background: "#FDFDFD"
                                                                            }}
                                                                        >
                                                                            <div className="d-flex align-items-center">
                                                                                <img
                                                                                    src={`${BASE_URL}/${item.product_img}`}
                                                                                    alt={item.product_name || "product"}
                                                                                    style={{
                                                                                        width: "60px",
                                                                                        height: "60px",
                                                                                        borderRadius: "8px",
                                                                                        marginRight: "10px"
                                                                                    }}
                                                                                />
                                                                                <div>
                                                                                    <div
                                                                                        style={{
                                                                                            fontSize: "16px",
                                                                                            fontWeight: "700",
                                                                                            color: "#262626"
                                                                                        }}
                                                                                    >
                                                                                        {item.product_name}
                                                                                    </div>
                                                                                    <div className="text-muted " style={{
                                                                                        fontSize: "14px",
                                                                                        fontWeight: "500",
                                                                                        color: "#262626"
                                                                                    }}>Qty: {item.product_qty}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="fw-bold" style={{
                                                                                fontSize: "16px",
                                                                                fontWeight: "700",
                                                                                color: "#262626"
                                                                            }}>
                                                                                ₹{item.subtotal}
                                                                            </div>
                                                                        </div>
                                                                    ))}

                                                                    {/* Price Breakdown */}
                                                                    {(() => {
                                                                        const subtotal =
                                                                            packageNotifications.order_details?.reduce(
                                                                                (sum, item) => sum + parseFloat(item.subtotal || 0),
                                                                                0
                                                                            ) || 0;
                                                                        const deliveryFee = packageNotifications.delivery_fee
                                                                            ? parseFloat(packageNotifications.delivery_fee)
                                                                            : 0;
                                                                        const total = subtotal + deliveryFee;

                                                                        return (
                                                                            <div className="mt-3">
                                                                                <div
                                                                                    className="fw-bold mb-4 mt-4"
                                                                                    style={{
                                                                                        fontSize: "16px",
                                                                                        fontWeight: "700",
                                                                                        color: "#262626"
                                                                                    }}
                                                                                >
                                                                                    Price Breakdown
                                                                                </div>
                                                                                <div className="d-flex justify-content-between ">
                                                                                    <div style={{
                                                                                        fontSize: "14px",
                                                                                        fontWeight: "600",
                                                                                        color: "#3E5069"
                                                                                    }}>Subtotal</div>
                                                                                    <div style={{
                                                                                        fontSize: "16px",
                                                                                        fontWeight: "600",
                                                                                        color: "#07182C"
                                                                                    }}>₹{subtotal}</div>
                                                                                </div>
                                                                                <div className="d-flex justify-content-between mt-2">
                                                                                    <div style={{
                                                                                        fontSize: "14px",
                                                                                        fontWeight: "600",
                                                                                        color: "#3E5069"
                                                                                    }}>Delivery Fee</div>
                                                                                    <div style={{
                                                                                        fontSize: "16px",
                                                                                        fontWeight: "600",
                                                                                        color: "#3E5069"
                                                                                    }}>{packageNotifications.delivery_fee || "on demand"}</div>
                                                                                </div>
                                                                                <hr />
                                                                                <div
                                                                                    className="d-flex justify-content-between fw-bold"
                                                                                    style={{ color: "#27AE60" }}
                                                                                >
                                                                                    <div style={{
                                                                                        fontSize: "18px",
                                                                                        fontWeight: "700",
                                                                                        color: "#262626"
                                                                                    }} >Total</div>
                                                                                    <div style={{
                                                                                        fontSize: "16px",
                                                                                        fontWeight: "700",
                                                                                        color: "#00B308"
                                                                                    }}>₹{total}</div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}






                                                </>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <Modal
                                    show={showOwnerInfo}
                                    onHide={() => setShowOwnerInfo(false)}
                                    centered
                                    size="lg"
                                >
                                    <Modal.Header closeButton style={{ background: "#fff", color: "#000" }}>
                                        <Modal.Title>Owner Info</Modal.Title>
                                    </Modal.Header>

                                    <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
                                        <div className="p-3">
                                            {/* Owner Name */}
                                            <div className="d-flex align-items-center mb-3">
                                                <img src={uprofile} alt="Owner" style={{ width: 40, height: 40, marginRight: "12px" }} />
                                                <strong>{packageNotifications?.business?.business_user_name || "Business Owner"}</strong>
                                            </div>
                                            <hr />

                                            {/* Company */}
                                            <div className="d-flex align-items-center mb-3">
                                                <img src={ushop} alt="Company" style={{ width: 20, height: 20, marginRight: "12px" }} />
                                                <span>{packageNotifications?.business?.business_name || "No Data"}</span>
                                            </div>
                                            <hr />

                                            {/* Phone */}
                                            <div className="d-flex align-items-center mb-3">
                                                <img src={ucall} alt="Phone" style={{ width: 20, height: 20, marginRight: "12px" }} />
                                                <span>{packageNotifications?.business?.business_mobile || "No Data"}</span>
                                            </div>
                                            <hr />

                                            {/* Email */}
                                            <div className="d-flex align-items-center mb-3">
                                                <img src={usms} alt="Email" style={{ width: 20, height: 20, marginRight: "12px" }} />
                                                <span>{packageNotifications?.business?.business_email || "No Data"}</span>
                                            </div>
                                            <hr />

                                            {/* Website */}
                                            <div className="d-flex align-items-center mb-3">
                                                <img src={udisblay} alt="Website" style={{ width: 20, height: 20, marginRight: "12px" }} />
                                                <Link
                                                    href={`https://disblay.com/${packageNotifications?.business?.business_slug || ""}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    https://disblay.com/{packageNotifications?.business?.business_slug || "No Data"}
                                                </Link>
                                            </div>
                                            <hr />

                                            {/* Address */}
                                            <div className="d-flex align-items-start mb-3">
                                                <img src={umap} alt="Address" style={{ width: 20, height: 20, marginRight: "12px" }} />
                                                <span>{packageNotifications?.business?.full_address || "No Data"}</span>
                                            </div>
                                        </div>
                                    </Modal.Body>

                                    <Modal.Footer>
                                        <Link
                                            className="btn btn-success"
                                            href={`https://wa.me/91${packageNotifications?.business?.business_mobile || ""}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            WhatsApp
                                        </Link>
                                    </Modal.Footer>
                                </Modal>






                                <div style={{ background: "#F5F6FB" }}>
                                    {detailedUser && (
                                        <div className="full-screen-panel">
                                            {/* Top Bar */}
                                            <div className="top-bar d-flex justify-content-between align-items-center py-3 " style={{ color: "#34495E" }}>
                                                <div className="d-flex align-items-center"> {/* Flex container for button and title */}
                                                    <button
                                                        className="btn"
                                                        onClick={() => {
                                                            setDetailedUser(false); // ✅ just close, no changes to state
                                                        }}
                                                    // Adding some space between the button and the title
                                                    >
                                                        <img src={leftarrow2} alt="Back" />
                                                    </button>
                                                    <div style={{ fontWeight: "700", fontSize: '20px', color: "#262626" }} >My Orders</div>
                                                </div>
                                            </div>


                                            {/* User Detail Card */}
                                            <div className="p-4 mt-4">
                                                <div className='mb-4' style={{ fontFamily: "Manrope", fontSize: "20px", fontWeight: "700", lineHeight: "16px", color: "#34495E" }}> Lead Details</div>
                                                <div className="bg-white rounded-4 shadow-sm p-3" style={{ borderRadius: '16px' }}>
                                                    {/* User Info */}
                                                    <div className="d-flex align-items-center mb-3 p-3">
                                                        <img
                                                            src={detailedUser.package_type === "service" ? serviceIcon : productIcon}
                                                            alt="user type"
                                                            style={{ width: 40, height: 40, marginRight: 12 }}
                                                        />
                                                        <div style={{ fontFamily: "Manrope", fontSize: "16px", fontWeight: "600", lineHeight: "15px", color: "#262626" }}>{detailedUser.requester_name}</div>
                                                    </div>

                                                    <hr className="my-2" />

                                                    {/* Phone */}
                                                    <div className="d-flex align-items-center mb-3 p-3">
                                                        <img src={ncall} width={24} height={24} alt='call' />
                                                        <span style={{ fontFamily: "Manrope", fontSize: "16px", fontWeight: "600", lineHeight: "15px", color: "#262626", marginLeft: "10px" }}>{detailedUser.requester_mobile}</span>
                                                    </div>
                                                    <hr className="my-2" />
                                                    {/* Email */}
                                                    <div className="d-flex align-items-center mb-3 p-3">
                                                        <img src={nsms} width={24} height={24} alt='sms' />
                                                        <span style={{ fontFamily: "Manrope", fontSize: "16px", fontWeight: "600", lineHeight: "15px", color: "#262626", marginLeft: "10px" }}>{detailedUser.requester_email || "No Data"}</span>
                                                    </div>
                                                    <hr className="my-2" />
                                                    {/* Conditional Scheduled Call (only if service) */}
                                                    {detailedUser.package_type === "service" && (
                                                        <div className="d-flex align-items-center mb-3 p-3">
                                                            <img src={ncalendar} width={24} height={24} alt="Calendar Icon" />
                                                            <span style={{
                                                                fontFamily: "Manrope",
                                                                fontSize: "16px",
                                                                fontWeight: "600",
                                                                lineHeight: "24px",
                                                                color: "#262626",
                                                                marginLeft: "10px"
                                                            }}>
                                                                Scheduled call on {detailedUser.sheduled_date} at {detailedUser.sheduled_time}




                                                            </span>

                                                        </div>
                                                    )}
                                                    {detailedUser?.package_type === "service" && (
                                                        <hr className="my-2 w-100" />
                                                    )}



                                                    {/* Requested Date */}
                                                    <div className="d-flex align-items-center mb-3 p-3">
                                                        <img src={nclock} width={24} height={24} alt="Clock Icon" />
                                                        <span style={{
                                                            fontFamily: "Manrope",
                                                            fontSize: "16px",
                                                            fontWeight: "600",
                                                            lineHeight: "24px", // adjusted for better vertical alignment
                                                            color: "#262626",
                                                            marginLeft: "10px"
                                                        }}>
                                                            Requested on {(() => {
                                                                if (!detailedUser.created) return "";
                                                                const [date, time] = detailedUser.created.split(" ");
                                                                let [hours, minutes] = time.split(":");
                                                                hours = parseInt(hours, 10);
                                                                const ampm = hours >= 12 ? "PM" : "AM";
                                                                hours = hours % 12 || 12; // convert 0 → 12
                                                                return `${date} at ${hours}:${minutes} ${ampm}`;
                                                            })()}

                                                        </span>
                                                    </div>

                                                    <hr className="my-2" />
                                                    {/* Address */}
                                                    <div className="d-flex align-items-start gap-3 p-3">
                                                        <img src={nlocation} width={24} height={24} alt="Location" />
                                                        <div style={{
                                                            fontFamily: "Manrope",
                                                            fontSize: "16px",
                                                            fontWeight: "600",
                                                            lineHeight: "24px",
                                                            color: "#262626",
                                                            wordBreak: "break-word"
                                                        }}>
                                                            {detailedUser.requester_address || "No Data"}
                                                        </div>
                                                    </div>
                                                    <hr className="my-2" />
                                                    {/*live location*/}
                                                    {/* Live Location */}
                                                    <div className="d-flex align-items-start gap-3 p-3">
                                                        {/* Google Maps Navigation */}
                                                        <img
                                                            src={nlivedirection}
                                                            width={24}
                                                            height={24}
                                                            alt="Direction"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => {
                                                                if (detailedUser.requester_latlong) {
                                                                    window.open(
                                                                        `https://www.google.com/maps/dir/?api=1&destination=${detailedUser.requester_latlong}`,
                                                                        "_blank"
                                                                    );
                                                                }
                                                            }}
                                                        />

                                                        {/* Google Maps View */}
                                                        <img
                                                            src={nmap}
                                                            width={24}
                                                            height={24}
                                                            alt="Map"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => {
                                                                if (detailedUser.requester_latlong || detailedUser.requester_direction) {
                                                                    const destination = detailedUser.requester_latlong
                                                                        ? detailedUser.requester_latlong   // ✅ use lat,long if available
                                                                        : encodeURIComponent(detailedUser.requester_direction); // ✅ else use address

                                                                    window.open(
                                                                        `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
                                                                        "_blank"
                                                                    );
                                                                }

                                                            }}
                                                        />

                                                        <div
                                                            style={{
                                                                fontFamily: "Manrope",
                                                                fontSize: "16px",
                                                                fontWeight: "600",
                                                                lineHeight: "24px",
                                                                color: "#262626",
                                                                wordBreak: "break-word",
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() => {
                                                                const location = detailedUser.requester_latlong || detailedUser.requester_direction;
                                                                if (location) {
                                                                    window.open(
                                                                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
                                                                        "_blank"
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            {detailedUser.requester_latlong || detailedUser.requester_direction}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            {/* Buttons */}
                                            <div className="d-flex gap-3 px-4 mb-4">
                                                <Link
                                                    className="btn flex-fill d-flex align-items-center justify-content-center"
                                                    href={`https://wa.me/91${detailedUser.requester_mobile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        backgroundColor: "#0BCB61",
                                                        width: "170px",
                                                        color: "white",
                                                        borderRadius: "10px",
                                                        height: "54px",
                                                        borderRadius: "10px"
                                                    }}
                                                >
                                                    <img src={nwhatsapp} alt='whatsapp' width={24} height={24} className='me-3' /> <span style={{ fontFamily: "Manrope", fontSize: "16px", fontWeight: "700", lineHeight: "26px", color: "#FFFFFF" }} >WhatsApp</span>
                                                </Link>

                                                <Link
                                                    className="btn flex-fill d-flex align-items-center justify-content-center"
                                                    href={`tel:${detailedUser.requester_mobile}`}
                                                    style={{
                                                        backgroundColor: "#196FE2",
                                                        color: "white",
                                                        width: "170px",
                                                        borderRadius: "10px",
                                                        height: "54px",
                                                        borderRadius: "10px"
                                                    }}
                                                >
                                                    <img src={ncalling} width={24} height={24} className='me-3' /> <span style={{ fontFamily: "Manrope", fontSize: "16px", fontWeight: "700", lineHeight: "26px", color: "#FFFFFF" }} >Call</span>
                                                </Link>
                                            </div>

                                        </div>

                                    )}


                                </div>
                                {showDeleteModal && (
                                    <div style={{
                                        position: 'fixed',
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 9999
                                    }}>
                                        <div style={{
                                            background: '#fff',
                                            borderRadius: '16px',
                                            padding: '24px',
                                            width: '90%',
                                            maxWidth: '400px',
                                            textAlign: 'center',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                                        }}>
                                            <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>Delete All Notifications?</h2>
                                            <p style={{ fontSize: "16px", color: "#555", marginBottom: "24px" }}>
                                                This will permanently delete all notifications for this business.
                                            </p>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                                                {/* Cancel Button */}
                                                <button
                                                    onClick={() => setShowDeleteModal(false)}
                                                    style={{
                                                        flex: 1,
                                                        background: "#f5f5f5",
                                                        color: "#444",
                                                        border: "1px solid #ccc",
                                                        borderRadius: "8px",
                                                        fontSize: "16px",
                                                        padding: "12px 0",
                                                        cursor: "pointer",
                                                        fontWeight: "500"
                                                    }}
                                                >
                                                    Cancel
                                                </button>

                                                {/* Delete All Button */}
                                               <button
  onClick={async () => {
    try {
      const res = await axios.post(`${BASE_URL}/delete_allNotifications.php`, {
        user_id: userId,
      });

      if (res.data.status === "success") {
        setNotifications([]);
        localStorage.setItem(
          `clearedNotifications_${businessId}`,
          JSON.stringify({})
        );
        setShowDeleteModal(false);

        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "All notifications have been deleted.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Failed to delete notifications.",
        });
      }
    } catch (err) {
      console.error("Delete error:", err);

      await Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please try again later.",
      });
    }
  }}
  style={{
    flex: 1,
    background: "#E53935",
    color: "#fff",
    padding: "12px 0",
    borderRadius: "8px",
    border: "none",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
  }}
>
  Delete All
</button>

                                            </div>
                                        </div>
                                    </div>
                                )}
                            </main>
                        </div>




                    </div>
                </div>
            </div>
        </div>
    );


};

export default BusinessNewOrders;
