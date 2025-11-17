"use client";

import React, { useEffect, useState } from "react";
import "@/css/topnav.css";

// NEXT.JS ROUTER
import { useRouter, usePathname } from "next/navigation";

// API Hooks
import {
  useBusinessDetails,
  useNotificationCount,
} from "@/components/BusinessApi/page";

export default function TopNav() {
  const router = useRouter();
  const pathname = usePathname();

  // Static images from /public/assets/img
  const defaultProfile = "/assets/img/defaultprofile.svg";
  const notify = "/assets/img/notify.svg";
  const search = "/assets/img/search.svg";

  // -----------------------------------------
  // PAGE TITLES
  // -----------------------------------------
  const pageTitles = {
    "/Admin": "Store",
    "/Admin": "Store",
    "/profile": "Profile",
    "/BusinessOrders": "Orders",
    "/mysubscription": "My Subscription",
    "/setting": "Settings",
    "/help": "Help",
    "/support": "Support",
    "/notification": "Notifications",
  };

  const currentTitle = pageTitles[pathname] || "Store";

  // -----------------------------------------
  // BUSINESS ID FROM LOCAL STORAGE
  // -----------------------------------------
  const [businessId, setBusinessId] = useState(null);

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("businessId"));
    setBusinessId(id);
  }, []);

  // -----------------------------------------
  // FETCH BUSINESS DETAILS
  // -----------------------------------------
  const { data } = useBusinessDetails(
    { business_id: businessId },
    { enabled: !!businessId }
  );

  const business = data?.status === "success" ? data.response : null;

  const userName = business?.business_user_name || "";
  const userPhoto = business?.business_user_photo || null;

  // -----------------------------------------
  // NOTIFICATION COUNT
  // -----------------------------------------
  const { data: notifData } = useNotificationCount(
    { business_id: businessId },
    { enabled: !!businessId }
  );

  const totalUnread = notifData?.res?.counts?.totalUnread || 0;

  // -----------------------------------------
  // HANDLERS
  // -----------------------------------------
  const goToNotifications = () => router.push("/notification");

  return (
    <header
      className="d-flex justify-content-between align-items-center px-4 topbar"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "#fff",
      }}
    >
      {/* PAGE TITLE */}
      <div className="page-title">{currentTitle}</div>

      {/* RIGHT SIDE */}
      <div className="d-flex align-items-center gap-4">
        {/* SEARCH BOX */}
        <div className="search-box d-flex align-items-center">
          <img src={search} alt="search" className="search-icon" />
          <input type="search" placeholder="Search" className="form-control" />
        </div>

        {/* NOTIFICATION ICON */}
        <div className="position-relative">
          <img
            src={notify}
            alt="notify"
            onClick={goToNotifications}
            className="notify-icon"
            style={{ cursor: "pointer" }}
          />

          {totalUnread > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-2px",
                right: "-2px",
                background: "red",
                color: "#fff",
                borderRadius: "50%",
                fontSize: "10px",
                fontWeight: "bold",
                padding: "2px 4px",
                lineHeight: "1",
              }}
            >
              {totalUnread}
            </span>
          )}
        </div>

        {/* USER PROFILE */}
        <div className="d-flex align-items-center">
          <img
            src={
              userPhoto
                ? `${process.env.NEXT_PUBLIC_API_URL}/${userPhoto}`
                : defaultProfile
            }
            alt="User"
            className="rounded-circle me-2"
            width="32"
            height="32"
          />
          <span className="fw-medium">{userName}</span>
        </div>
      </div>
    </header>
  );
}
