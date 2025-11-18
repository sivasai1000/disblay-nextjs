// src/components/SuccessPage.js
"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { FaLink, FaShareAlt } from "react-icons/fa";
import LeftNav from "@/components/OthersLeftNav";
import TopNav from "@/components/OthersTopNav"; // assuming you already have TopNav
import "@/css/success.css";



const OthersSuccess = () => {
  
  const tick = "/assets/img/tick.svg";

const redshare = "/assets/img/redshare.svg";

const whatsapp1 = "/assets/img/whatsapp1.svg";
const linkedin1 = "/assets/img/linkedin1.svg";
const x1 = "/assets/img/x1.svg";
const youtube1 = "/assets/img/youtube1.svg";
const instagram1 = "/assets/img/instagram1.svg";
const facebook1 = "/assets/img/facebook1.svg";
const mail = "/assets/img/mail.svg";
const telegram1 = "/assets/img/telegram1.svg";
const close = "/assets/img/close.svg";
const insta = "/assets/img/insta.svg";

 const [shareLink, setShareLink] = React.useState("");
const [durationDays, setDurationDays] = React.useState("");

React.useEffect(() => {
  if (typeof window !== "undefined") {
    setShareLink(sessionStorage.getItem("shareLink") || "");
    setDurationDays(sessionStorage.getItem("durationDays") || "");
  }
}, []);


 const router = useRouter();
  const [showShareModal, setShowShareModal] = React.useState(false);
const [copied, setCopied] = React.useState(false);

const handleShareModal = () => {
  if (!shareLink) return;
  setShowShareModal(true);
};


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
          {/* ✅ Gradient Header */}
          <div
            style={{
              background: "linear-gradient(180deg, #FFF8F2 0%, #FFFFFF 100%)",
              padding: "50px 20px",
              textAlign: "center",
            }}
          >
            <div className="mb-4">
              <img src={tick} alt="tick"/>
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

          {/* ✅ Business Link */}
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
                    fontSize:"16px",
                  }}
                >
                  {shareLink}
                </span>
                <button
                  className="btn btn-sm ms-2"
                  style={{
                    
                    background: "linear-gradient(284.69deg, #F62D2D 7.92%, #FF6161 100%)",
                    height:"100%"

                  }}
                  onClick={() => window.open(shareLink, "_blank")}
                >
                 <span className="visit-link">Visit Link</span> 
                </button>
              </div>
            </div>

          

<button
  className="mt-4"
  style={{
    border: "1px solid red",
    borderRadius: "8px",
    padding: "0 12px",
    background: "transparent",
    color: "red",
    width:"101px",
    height:"50px",
    fontSize:"16px",
    fontWeight:"600"
  }}
  onClick={handleShareModal} // ✅ open modal
>
  Share <img src={redshare} alt="share"/>
</button>

<div className="mt-4">
            <button
  className="creditional-accountcreate mt-4"
  style={{ width: "200px" }}
  onClick={() => {
    window.location.href = "/othersadmin"; 
  }}
>
  <span className="creditionals-btntext">Home</span>
</button>

            </div>
          </div>

          

          {/* ✅ Notes Section */}
          <div className="container mt-5">
            <div
              className="card border-0 shadow-sm"
              style={{ borderRadius: "10px" }}
            >
              <div className="card-body">
                <h6 className="fw-bold mb-3">Important Note :</h6>
                <ul className="text-muted small">
                  <li>
                    Once a bill is paid for a combo, it will remain active for
                    one full year from the date of payment.
                  </li>
                  <li>
                    If you choose to delete a combo in the middle of the
                    subscription period, please note that the entire combo ID
                    will be permanently removed from your account. To use it
                    again, you will need to recreate the combo and repay the
                    applicable charges.
                  </li>
                  <li>Kindly exercise caution before deleting any combo.</li>
                  <li>
                    The subscription fee covers the maintenance and usage of
                    your account for one year.
                  </li>
                  <li>
                    After the subscription period expires, your business account
                    and combos will not be deleted, but they will no longer be
                    visible/shareable until you renew the subscription.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {showShareModal && (
  <div
    className="transparent-overlay d-flex justify-content-center align-items-center px-4"
    style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
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
        boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.15)",
        position: "relative",
        padding: "20px"
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div style={{ fontSize: "24px", fontWeight: "800" }}>Share</div>
        <button
          onClick={() => setShowShareModal(false)}
          style={{ border: "none", background: "transparent", cursor: "pointer" }}
        >
          <img src={close} style={{ width: "32px", height: "32px" }} alt="close"/>
        </button>
      </div>

      {/* Share links */}
      <div className="share-linkvia mb-3">Share link via</div>
      <div className="d-flex gap-3 flex-wrap mb-4">
        <a href={`https://wa.me/?text=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer">
          <img src={whatsapp1} width={52} height={52} alt="WhatsApp"/>
        </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer">
          <img src={facebook1} width={52} height={52} alt="Facebook"/>
        </a>
        <a href={`https://www.instagram.com/?url=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer">
          <img src={insta} width={52} height={52} alt="Instagram"/>
        </a>
        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer">
          <img src={linkedin1} width={52} height={52} alt="LinkedIn"/>
        </a>
        <a href={`https://t.me/share/url?url=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer">
          <img src={telegram1} width={52} height={52} alt="Telegram"/>
        </a>
        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer">
          <img src={x1} width={52} height={52} alt="X"/>
        </a>
      </div>

      {/* Copy link */}
      <div className="share-linkvia mb-2">or copy link</div>
      <div className="d-flex align-items-center rounded px-2" style={{height:"54px",background:"#F62D2D1A"}}>
        <input
          type="text"
          readOnly
          value={shareLink}
          className="form-control border-0 p-0 me-2"
          style={{ color: "#F62D2D", fontFamily:"Manrope", background:"transparent" ,fontWeight: "500", fontSize: "14px"}}
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(shareLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="btn"
          style={{background: "linear-gradient(284.69deg, #F62D2D 7.92%, #FF6161 100%)", color:"#ffffff"}}
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
};

export default OthersSuccess;
