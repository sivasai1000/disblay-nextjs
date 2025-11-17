"use client";
import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import "@/css/leftnav.css";

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

export default function LeftNav() {
  const router = useRouter();
  const pathname = usePathname(); // 👈 Required for active state

  const menuItems = [
    { name: "Store", path: "/othersadmin", icon: shop, activeIcon: wshop },
    { name: "Profile", path: "/othersprofile", icon: profile, activeIcon: wprofile },
    { name: "Settings", path: "/otherssetting", icon: setting, activeIcon: wsetting },
    { name: "Help", path: "/othershelp", icon: help, activeIcon: whelp },
    { name: "Support", path: "/otherssupport", icon: support, activeIcon: wsupport },
    { name: "Logout", icon: redlogout, activeIcon: whitelogout },
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
        overflowY: "auto",
      }}
    >
      <img className="px-4 mt-3" src={disblay} alt="Disblay Logo" />

      <div className="sidebar">
        <nav className="nav flex-column mt-4">
          {menuItems.map((item) =>
            item.name === "Logout" ? (
              <div
                key={item.name}
                className="nav-link d-flex align-items-center"
                style={{ cursor: "pointer", color: "red" }}
                onClick={handleLogout}
              >
                <img
                  className="me-2"
                  src={item.icon}
                  width={24}
                  height={24}
                  alt={item.name}
                />
                {item.name}
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.path}
                className={`nav-link d-flex align-items-center ${
                  pathname === item.path ? "active" : ""
                }`}
              >
                <img
                  className="me-2"
                  src={pathname === item.path ? item.activeIcon : item.icon}
                  width={24}
                  height={24}
                  alt={item.name}
                />
                {item.name}
              </Link>
            )
          )}
        </nav>
      </div>
    </aside>
  );
}
