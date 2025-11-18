"use client";

import React from "react";
import { useRouter} from "next/navigation";
import LeftNav from "@/components/LeftNav";
import "@/css/businesscreditionals.css"
import TopNav from "@/components/TopNav";
import "@/css/success.css";
import {
  FaLink,
} from "react-icons/fa";
import Link from "next/link";

export default function Success() {
  const router = useRouter();


 
  const getSessionState = () => {
  if (typeof window === "undefined") return {};

  try {
    return {
      shareLink: sessionStorage.getItem("shareLink") || "",
      durationDays: sessionStorage.getItem("durationDays") || "",
      planAmount: sessionStorage.getItem("planAmount") || "",
      planId: sessionStorage.getItem("planId") || "",
      plan_for: sessionStorage.getItem("plan_for") || ""
    };
  } catch {
    return {};
  }
};


  const sessionState = getSessionState();

  const shareLink = shareLinkParam || sessionState.shareLink || "";
  const durationDays = durationParam || sessionState.durationDays || "";

  const [showShareModal, setShowShareModal] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleShareModal = () => {
    if (!shareLink) return;
    setShowShareModal(true);
  };

  // Assets from public folder
  const tick = "/assets/img/tick.svg";
  const redshare = "/assets/img/redshare.svg";
  const whatsapp1 = "/assets/img/whatsapp1.svg";
  const linkedin1 = "/assets/img/linkedin1.svg";
  const x1 = "/assets/img/x1.svg";
  const facebook1 = "/assets/img/facebook1.svg";
  const telegram1 = "/assets/img/telegram1.svg";
  const close = "/assets/img/close.svg";
  const insta = "/assets/img/insta.svg";

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Left Sidebar */}
      <LeftNav />

      {/* Right Section */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Top Nav */}
        <TopNav />

        {/* Main Content */}
        <div className="flex-grow-1">
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(180deg, #FFF8F2 0%, #FFFFFF 100%)",
              padding: "50px 20px",
              textAlign: "center",
            }}
          >
            <div className="mb-4">
              <img src={tick} alt="tick" />
            </div>
            <h3 style={{ fontWeight: "700", color: "#000" }}>
              Subscription Successful
            </h3>
            <div
              style={{
                display: "inline-block",
                background: "#E8F9EF",
                borderRadius: "6px",
                padding: "6px 16px",
                marginTop: "12px",
              }}
            >
              <span style={{ color: "#27A376", fontWeight: "700" }}>
                Plan valid for {durationDays ? `${durationDays} Days` : "1 Year"}
              </span>
            </div>
          </div>

          {/* Business Link */}
          <div className="text-center mt-4">
            <div className="business-pagelink">Your Business page link</div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  background: "#F62D2D1A",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  maxWidth: "450px",
                  width: "100%",
                }}
              >
                <FaLink color="#F62D2D" className="me-2" />
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                    color: "#F62D2D",
                    fontSize: "16px",
                  }}
                >
                  {shareLink}
                </span>

                <button
                  className="btn btn-sm ms-2"
                  style={{
                    background:
                      "linear-gradient(284.69deg, #F62D2D 7.92%, #FF6161 100%)",
                  }}
                  onClick={() => window.open(shareLink, "_blank")}
                >
                  <span className="visit-link">Visit Link</span>
                </button>
              </div>
            </div>

            <button
              className="mt-4 mb-4"
              style={{
                border: "1px solid red",
                borderRadius: "8px",
                padding: "0 12px",
                background: "transparent",
                color: "red",
                width: "101px",
                height: "50px",
                fontSize: "16px",
                fontWeight: "600",
              }}
              onClick={handleShareModal}
            >
              Share <img src={redshare} alt="share" />
            </button>

  <div className="mt-4 d-flex justify-content-center">
  <Link
    href="/Admin"
    className="creditional-accountcreate d-flex justify-content-center align-items-center"
    style={{ width: "200px", textDecoration: "none" }}
  >
    <span className="creditionals-btntext">Home</span>
  </Link>
</div>



          </div>

          {/* Notes Section */}
          <div className="container mt-5">
            <div className="card border-0 shadow-sm" style={{ borderRadius: "10px" }}>
              <div className="card-body">
                <h6 className="fw-bold mb-3">Important Note :</h6>
                <ul className="text-muted small">
                  <li>
                    Once a bill is paid for a combo, it will remain active for one
                    full year from the date of payment.
                  </li>
                  <li>
                    If you choose to delete a combo in the middle of the
                    subscription period, the combo ID will be removed permanently.
                  </li>
                  <li>Exercise caution before deleting combos.</li>
                  <li>
                    The subscription fee covers maintenance and usage for one year.
                  </li>
                  <li>
                    After expiry, combos are hidden until subscription renewal.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* SHARE MODAL */}
        {showShareModal && (
          <div
            className="transparent-overlay d-flex justify-content-center align-items-center px-4"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              zIndex: 9999,
            }}
          >
            <div
              className="share-card-wrapper px-3"
              style={{
                background: "#fff",
                borderRadius: "16px",
                width: "450px",
                maxWidth: "95%",
                boxShadow: "0px 4px 24px rgba(0,0,0,0.15)",
                padding: "20px",
              }}
            >
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div style={{ fontSize: "24px", fontWeight: "800" }}>Share</div>
                <button
                  onClick={() => setShowShareModal(false)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  <img src={close} width={32} height={32} alt="close" />
                </button>
              </div>

              {/* Share Icons */}
              <div className="share-linkvia mb-3">Share link via</div>
              <div className="d-flex gap-3 flex-wrap mb-4">
                <Link
                  href={`https://wa.me/?text=${encodeURIComponent(shareLink)}`}
                  target="_blank"
                >
                  <img src={whatsapp1} width={52} height={52} />
                </Link>
                <Link
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    shareLink
                  )}`}
                  target="_blank"
                >
                  <img src={facebook1} width={52} height={52} />
                </Link>
                <Link
                  href={`https://www.instagram.com/?url=${encodeURIComponent(
                    shareLink
                  )}`}
                  target="_blank"
                >
                  <img src={insta} width={52} height={52} />
                </Link>
                <Link
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                    shareLink
                  )}`}
                  target="_blank"
                >
                  <img src={linkedin1} width={52} height={52} />
                </Link>
                <Link
                  href={`https://t.me/share/url?url=${encodeURIComponent(
                    shareLink
                  )}`}
                  target="_blank"
                >
                  <img src={telegram1} width={52} height={52} />
                </Link>
                <Link
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    shareLink
                  )}`}
                  target="_blank"
                >
                  <img src={x1} width={52} height={52} />
                </Link>
              </div>

              {/* Copy Link */}
              <div className="share-linkvia mb-2">or copy link</div>

              <div
                className="d-flex align-items-center rounded px-2"
                style={{
                  height: "54px",
                  background: "#F62D2D1A",
                }}
              >
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  className="form-control border-0 p-0 me-2"
                  style={{
                    color: "#F62D2D",
                    background: "transparent",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="btn"
                  style={{
                    background:
                      "linear-gradient(284.69deg, #F62D2D 7.92%, #FF6161 100%)",
                    color: "#fff",
                  }}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
