"use client";

import React, { useEffect, useState } from "react";
import "@/css/topnav.css";
import { useRouter } from "next/navigation";
import { useBusinessDetails, useNotificationCount } from "@/components/BusinessApi/page";

// Public folder images
const notify = "/assets/img/notify.svg";
const searchIcon = "/assets/img/search.svg";
const defaultProfile = "/assets/img/defaultprofile.svg";

export default function NewTopNav() {
  const router = useRouter();

  // -----------------------------
  // LOCAL STORAGE (SSR SAFE)
  // -----------------------------
  const [businessId, setBusinessId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBusinessId(JSON.parse(localStorage.getItem("businessId")));
    }
  }, []);

  // -----------------------------
  // Fetch business details
  // -----------------------------
  const { data } = useBusinessDetails({
    business_id: businessId || "",
  });

  const business = data?.status === "success" ? data.response : null;

  const userName = business?.business_user_name || "";
  const userPhoto = business?.business_user_photo || null;

  // -----------------------------
  // Fetch notification count
  // -----------------------------
  const { data: notifData } = useNotificationCount({
    business_id: businessId || "",
  });

  const totalUnread = notifData?.res?.counts?.totalUnread || 0;

  // -----------------------------
  // JSX RETURN
  // -----------------------------
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
      {/* Page Title */}
      <div className="page-title">Store</div>

      {/* Right Section */}
      <div className="d-flex align-items-center gap-4">

        {/* Search Box */}
        <div className="search-box d-flex align-items-center">
          <img src={searchIcon} alt="search" className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            className="form-control"
          />
        </div>

        {/* Notification */}
        <div className="position-relative" style={{ cursor: "pointer" }}>
          <img
            src={notify}
            alt="notify"
            className="notify-icon"
            onClick={() => router.push("/notification")}
          />

          {totalUnread > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                background: "red",
                color: "#fff",
                borderRadius: "50%",
                fontSize: "10px",
                padding: "2px 6px",
                fontWeight: "bold",
              }}
            >
              {totalUnread}
            </span>
          )}
        </div>

        {/* User Profile */}
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
