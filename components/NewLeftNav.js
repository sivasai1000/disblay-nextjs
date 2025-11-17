"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import "@/css/leftnav.css";

export default function NewLeftNav() {
  const router = useRouter();
  const pathname = usePathname();

  // -------------------------
  // Image assets (Next.js public/)
  // -------------------------
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

  // -------------------------
  // Menu List
  // -------------------------
  const menuItems = [
    { name: "Store", path: "/newbusiness", icon: shop, activeIcon: wshop },
    { name: "Orders", path: "/businessneworders", icon: blackorder, activeIcon: whiteorder },
    { name: "Help", path: "/businesshelp", icon: help, activeIcon: whelp },
    { name: "Logout" },
  ];

  // -------------------------
  // Logout Handler
  // -------------------------
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/");
  };

  // -------------------------
  // JSX
  // -------------------------
  return (
    <aside
      className="bg-white border-end"
      style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        zIndex: 1000,
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <img className="px-4 mt-3" src={disblay} alt="Disblay Logo" />

      {/* Sidebar Navigation */}
      <div className="sidebar">
        <nav className="nav flex-column mt-4">

          {menuItems.map((item) =>
            item.name === "Logout" ? (
              <div
                key="logout"
                className="nav-link d-flex align-items-center"
                style={{ cursor: "pointer", color: "red" }}
                onClick={handleLogout}
              >
                <img
                  className="me-2"
                  src={redlogout}
                  width={24}
                  height={24}
                  alt="Logout"
                />
                Logout
              </div>
            ) : (
              <div
                key={item.name}
                onClick={() => router.push(item.path)}
                className={`nav-link d-flex align-items-center ${
                  pathname === item.path ? "active" : ""
                }`}
                style={{ cursor: "pointer" }}
              >
                <img
                  className="me-2"
                  src={pathname === item.path ? item.activeIcon : item.icon}
                  width={24}
                  height={24}
                  alt={item.name}
                />
                {item.name}
              </div>
            )
          )}

        </nav>
      </div>
    </aside>
  );
}
