"use client";

import React from "react";
import Swal from "sweetalert2";


import "@/css/abouttab.css";
import Link from "next/link";

const AboutTab = ({ business }) => {
    const shareIcon = "/assets/img/share.svg";
const storeIcon = "/assets/img/storeIcon.svg";
const mapIcon = "/assets/img/map.svg";
const bookmark = "/assets/img/Bookmark.svg";

  if (!business) return null;

  const handleShare = async () => {
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
      navigator.clipboard.writeText(shareUrl);

      await Swal.fire({
        icon: "success",
        title: "Link Copied!",
        text: "Store location copied to clipboard.",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="px-3">
      {/* About Business */}
      <div className="mb-3 mt-4">
        <div className="tab-aboutbusiness">About Business</div>
        <div
          className="tab-aboutbusiness1 mt-3"
          style={{
            fontFamily: "Manrope",
            fontSize: "14px",
            fontWeight: "500",
            textAlign: "justify",
          }}
        >
          {business.about_business ||
            "No business description available at the moment."}
        </div>
      </div>

      {/* Store Location */}
      {business.business_address && (
        <div
          className="p-3 mb-4 mt-4"
          style={{
            borderRadius: "16px",
            backgroundColor: "#fff",
            boxShadow: "0 0 12px rgba(0,0,0,0.08)",
            position: "relative",
          }}
        >
          {/* Title + Share */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-0 fw-bold" style={{ fontSize: "16px" }}>
              Store Location
            </h5>
            <img
              src={shareIcon}
              alt="Share"
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
              onClick={handleShare}
            />
          </div>

          {/* Google Maps */}
          <Link
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
                <img
                  src={storeIcon}
                  alt="Store Icon"
                  style={{ width: "50px", height: "50px", marginBottom: "8px" }}
                />
                <span
                  className="mt-4"
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "800",
                    color: "#7A7A7A",
                  }}
                >
                  Click to open in Google Maps
                </span>
              </div>
            </div>
          </Link>

          {/* Address */}
          <div
            className="d-flex align-items-start gap-2"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            <img
              src={mapIcon}
              alt="Location"
              style={{ width: "16px", height: "16px", marginTop: "3px" }}
            />
            <span style={{ fontFamily: "Manrope", color: "#061F35" }}>
              {business.business_address}, {business.city}, {business.state},{" "}
              {business.country}, {business.pincode}
            </span>
          </div>
        </div>
      )}

      {/* Bookmark */}
      <div className="mt-4">
        <span
          style={{ fontSize: "15px", fontWeight: 500, textAlign: "justify" }}
        >
          Bookmark the business webpage in your browser for easy access and
          future communications.
        </span>

        <div className="mt-2">
          <img
            src={bookmark}
            loading="lazy"
            style={{ width: "100%" }}
            alt="bookmark"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutTab;
