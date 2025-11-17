"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import "@/css/leftnav.css";
import { useBusinessDetails } from "@/components/BusinessApi/page";

export default function LeftNav() {
  const router = useRouter();
  const pathname = usePathname();

  // Static image paths from /public/assets/img/
  const profile = "/assets/img/profile.svg";
  const help = "/assets/img/help.svg";
  const support = "/assets/img/support.svg";
  const shop = "/assets/img/shop.svg";
  const setting = "/assets/img/setting.svg";
  const disblay = "/assets/img/disblay.svg";

  const wprofile = "/assets/img/wprofile.svg";
  const whelp = "/assets/img/whelp.svg";
  const wsupport = "/assets/img/wsupport.svg";
  const wshop = "/assets/img/wshop.svg";
  const wsetting = "/assets/img/wsetting.svg";

  const whitelogout = "/assets/img/whitelogout.svg";
  const redlogout = "/assets/img/redlogout.svg";

  const whiteorder = "/assets/img/whiteorder.svg";
  const blackorder = "/assets/img/blackorder.svg";

  const blackcrown = "/assets/img/blackcrown.svg";
  const whitecrown = "/assets/img/whitecrown.svg";

  const [businessId, setBusinessId] = useState(null);

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("businessId"));
    setBusinessId(id);
  }, []);

  // Fetch business data AFTER businessId loads
  const { data } = useBusinessDetails(
    { business_id: businessId },
    { enabled: !!businessId }
  );
  const business = data?.status === "success" ? data.response : null;

  const hasAddress = !!business?.business_address;
  const isPaid = business?.isPaid === "1";

  // MENU
  const menuItems = [
    { name: "Store", path: "/Admin", icon: shop, activeIcon: wshop, disabled: false },

    { name: "Profile", path: "/profile", icon: profile, activeIcon: wprofile, disabled: !hasAddress },

    { name: "Orders", path: "/BusinessOrders", icon: blackorder, activeIcon: whiteorder, disabled: !hasAddress },

    {
      name: "My Subscription",
      path: "/mysubscription",
      icon: blackcrown,
      activeIcon: whitecrown,
      disabled: !hasAddress || !isPaid,
    },

    { name: "Settings", path: "/setting", icon: setting, activeIcon: wsetting, disabled: !hasAddress },

    { name: "Help", path: "/help", icon: help, activeIcon: whelp, disabled: false },

    { name: "Support", path: "/support", icon: support, activeIcon: wsupport, disabled: false },

    { name: "Logout", icon: redlogout, activeIcon: whitelogout, disabled: false },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/");
  };

  return (
    <aside
      className="bg-white border-end"
      style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* LOGO */}
      <div
        className="leftnav-header"
        style={{
          padding: "12px 16px",
          backgroundColor: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <img src={disblay} alt="Logo" style={{ maxWidth: "100%", height: "auto" }} />
      </div>

      {/* MENU */}
      <div className="sidebar" style={{ flex: 1, overflowY: "auto", paddingTop: "16px" }}>
        <nav className="nav flex-column">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;

            // Logout button
            if (item.name === "Logout") {
              return (
                <div
                  key={item.name}
                  className="nav-link d-flex align-items-center"
                  style={{ cursor: "pointer", color: "red" }}
                  onClick={handleLogout}
                >
                  <img src={item.icon} width={24} height={24} className="me-2" alt="Logout" />
                  Logout
                </div>
              );
            }

            // Disabled pages
            if (item.disabled) {
              return (
                <div
                  key={item.name}
                  className="nav-link d-flex align-items-center text-muted"
                  style={{ cursor: "not-allowed", opacity: 0.5 }}
                >
                  <img src={item.icon} width={24} height={24} className="me-2" alt={item.name} />
                  {item.name}
                </div>
              );
            }

            // Active / Inactive Navigation
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`nav-link d-flex align-items-center ${isActive ? "active" : ""}`}
              >
                <img
                  src={isActive ? item.activeIcon : item.icon}
                  width={24}
                  height={24}
                  className="me-2"
                  alt={item.name}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
