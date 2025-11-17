"use client";

import Link from "next/link";
import React from "react";

const whatsapp1 = "/assets/img/whatsapp1.svg";
const youtube1 = "/assets/img/youtube1.svg";
const facebook1 = "/assets/img/facebook1.svg";
const instagram1 = "/assets/img/instagram1.svg";
const linkedin1 = "/assets/img/linkedin1.svg";
const x1 = "/assets/img/x1.svg";
const mail = "/assets/img/mail.svg";
const telegram1 = "/assets/img/telegram1.svg";
const others1 = "/assets/img/others1.svg";
const google1 = "/assets/img/google.svg";
const link3 = "/assets/img/link3.svg";

const ConnectTab = ({ business }) => {
  if (!business) return null;

  const formatSocialLink = (label, value) => {
    if (!value) return "#";

    const isFullLink = value.startsWith("http://") || value.startsWith("https://");
    const clean = value.trim().replace(/\s+/g, "");

    switch (label.toLowerCase()) {
      case "whatsapp": {
        let phone = clean.replace(/[^0-9]/g, "");
        if (!phone.startsWith("91")) phone = "91" + phone;
        return `https://wa.me/${phone}`;
      }
      case "facebook":
        return isFullLink ? clean : `https://facebook.com/${clean.replace(/^facebook\.com\//, "")}`;
      case "instagram":
        return isFullLink
          ? clean
          : `https://instagram.com/${clean.replace(/^@/, "").replace(/^instagram\.com\//, "")}`;
      case "linkedin":
        return isFullLink ? clean : `https://linkedin.com/in/${clean.replace(/^linkedin\.com\/in\//, "")}`;
      case "x":
      case "twitter":
      case "x/twitter":
        return isFullLink
          ? clean
          : `https://x.com/${clean
              .replace(/^@/, "")
              .replace(/^twitter\.com\//, "")
              .replace(/^x\.com\//, "")}`;
      case "youtube":
        return isFullLink ? clean : `https://youtube.com/${clean.replace(/^youtube\.com\//, "")}`;
      case "mail":
      case "email":
      case "business_email":
        return `mailto:${clean}`;
      case "telegram":
        if (isFullLink) return clean;
        if (/^\d+$/.test(clean)) return `https://t.me/+91${clean}`;
        return `https://t.me/${clean.replace(/^@/, "")}`;
      case "website":
      case "website 1":
      case "website 2":
      case "other":
        return isFullLink ? clean : `https://${clean}`;
      default:
        return clean;
    }
  };

  const socialLinks = [
    { label: "WhatsApp", key: "whatsapp", icon: whatsapp1, color: "#25D366", bg: "#25D36626" },
    { label: "YouTube", key: "youtube", icon: youtube1, color: "#FF0000", bg: "rgba(255,0,0,0.1)" },
    { label: "Facebook", key: "facebook", icon: facebook1, color: "#4267B2", bg: "#4267B21A" },
    { label: "Instagram", key: "instagram", icon: instagram1, color: "#D73F8F", bg: "rgba(215,63,143,0.1)" },
    { label: "LinkedIn", key: "linkedin", icon: linkedin1, color: "#0077B5", bg: "#0077B51A" },
    { label: "X/Twitter", key: "twitter", icon: x1, color: "#000", bg: "rgba(0,0,0,0.05)" },
    { label: "Mail", key: "business_email", icon: mail, color: "#EA4335", bg: "rgba(234,67,53,0.1)" },
    { label: "Telegram", key: "telegram", icon: telegram1, color: "#0077B5", bg: "rgba(0,119,181,0.1)" },
    { label: "Website", key: "other_link1", icon: others1, color: "#4285F4", bg: "rgba(66,133,244,0.1)" },
    { label: "Business", key: "other_link2", icon: google1, color: "#4285F4", bg: "rgba(66,133,244,0.1)" },
    { label: "Link1", key: "other_link3", icon: link3, color: "#4285F4", bg: "rgba(66,133,244,0.1)" },
    { label: "Link2", key: "other_link4", icon: link3, color: "#4285F4", bg: "rgba(66,133,244,0.1)" },
  ];

  return (
    <div className="px-3 mt-4 mb-4">
      <div
        style={{
          fontFamily: "Manrope",
          fontWeight: 600,
          fontSize: "15px",
          color: "#000",
          marginBottom: "16px",
        }}
      >
        Social Links
      </div>

      <div className="row g-3">
        {socialLinks
          .filter(({ key }) => !!business[key]) 
          .map(({ label, key, icon, color, bg }) => (
            <div className="col-6" key={key}>
              <Link
                href={formatSocialLink(label, business[key])}
                target={label.toLowerCase().includes("mail") ? undefined : "_blank"}
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div
                  className="d-flex align-items-center gap-2 px-3"
                  style={{
                    background: bg,
                    borderRadius: "12px",
                    height: "62px",
                  }}
                >
                  <img src={icon} loading="lazy" alt={label} width="46" height="46" />
                  <span
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: "700",
                      fontSize: "16px",
                      color,
                    }}
                  >
                    {label}
                  </span>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ConnectTab;
