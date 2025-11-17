// OthersTopNav.js
"use client"
import React, { useState,useEffect } from "react";
import "@/css/topnav.css";
const notify = "/assets/img/notify.svg";
const celebration = "/assets/img/celebration.gif";
const search = "/assets/img/search.svg";

import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import {
  useBusinessDetails,
  useNotificationCount,
  useComboList,
} from "@/components/OthersBusinessApi";

import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OthersTopNav() {
  const router = useRouter();
  const defaultProfile = "/assets/img/defaultprofile.svg"; 
 
  
  const [isAgreed, setIsAgreed] = useState(false);
  const [showModal, setShowModal] = useState(false);
const [showCongratsModal, setShowCongratsModal] = useState(false);

const [enrollName, setEnrollName] = useState("");
const [enrollCnt, setEnrollCnt] = useState(0);
const [enrollId, setEnrollId] = useState("");

  // Get businessId from localStorage
 
   const [businessId, setBusinessId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("businessId");
      setBusinessId(id ? JSON.parse(id) : null);
    }
  }, []);

  // Fetch business details
  const { data } = useBusinessDetails({ business_id: businessId });
  const business = data?.status === "success" ? data.response : null;

  const userName = business?.business_user_name || "";
  const userPhoto = business?.business_user_photo || null;

  // Fetch notification count
  const { data: notifData } = useNotificationCount({ business_id: businessId });
  const totalUnread = notifData?.res?.counts?.totalUnread || 0;

  // ✅ Fetch package list
  const { data: comboData } = useComboList({ business_id: businessId });
  const packages = comboData?.response || [];

  // ✅ Check if any package is paid
  const hasPaidPackage = Array.isArray(packages)
    ? packages.some((pkg) => String(pkg.isPaid) === "1")
    : String(packages?.isPaid) === "1";
const handleSubmit = async () => {
  const enrollId = localStorage.getItem("enrollIds");

  try {
    const response = await axios.post(`${BASE_URL}/get_enrollCount.php`, {
      enroll_id: enrollId,
    });

    const data = response.data;

    if (response.status === 200) {
      setEnrollName(data.res.business_user_name);
      setEnrollCnt(data.res.cnt);
      setEnrollId(data.res.enroll_id);

      await Swal.fire({
        icon: "success",
        title: "Fetched Successfully!",
        text: "Enroll details loaded.",
        timer: 1400,
        showConfirmButton: false,
      });
    } else {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message || "Something went wrong.",
      });
    }
  } catch (error) {
    console.error("Error:", error);

    await Swal.fire({
      icon: "error",
      title: "Network Error",
      text:
        error.response?.data?.message ||
        "Failed to connect to the server. Please try again later.",
    });
  }
};


  // ✅ Handle continue
 const handleSubmiting = async () => {
  if (!isAgreed) {
    await Swal.fire({
      icon: "warning",
      title: "Agreement Required",
      text: "Please agree to the terms before continuing.",
    });
    return;
  }

  // ✅ Optional success/confirmation popup
  await Swal.fire({
    icon: "success",
    title: "Success",
    text: "You may continue.",
    timer: 1200,
    showConfirmButton: false,
  });

  setShowModal(false);
  router.push("/othersadmin");
};


  const handleCloseClick = () => {
  if (hasPaidPackage) {
    // if paid → show Congrats modal
    handleSubmit(); // call your API to fetch enroll details
    setShowCongratsModal(true);
  } else {
    // if unpaid → show "Yet to Complete" modal
    setShowModal(true);
  }
};
  return (
    <>
      <header
        className="d-flex justify-content-between align-items-center px-4 topbar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "#fff",
        }}
      >
        <div className="page-title">Store</div>

        {/* Right: Search + Notify + Profile */}
        <div className="d-flex align-items-center gap-4">
          {/* Search */}
          <div className="search-box d-flex align-items-center">
            <img src={search} alt="search" className="search-icon" />
            <input type="text" placeholder="Search" className="form-control" />
          </div>

          {/* Notification */}
          <div className="position-relative">
            <img
              src={notify}
              alt="notify"
              onClick={() => router.push("/othersnotification")}
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

          {/* User */}
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

          {/* Close Button */}
          <div>
           <button
  onClick={handleCloseClick}
  style={{
    width: "73px",
    height: "35px",
    borderRadius: "10px",
    background: hasPaidPackage ? "#000000" : "#00000066",
    border: "none",
  }}
>
  <span
    style={{
      fontFamily: "Manrope",
      fontWeight: "700",
      fontSize: "14px",
      color: hasPaidPackage ? "#fff" : "#fff",
    }}
  >
    Close
  </span>
</button>

          </div>
        </div>
      </header>

      {/* ✅ Centered Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)", // overlay
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              width: "500px",
              maxHeight: "90vh",
              backgroundColor: "#fff",
              borderRadius: 12,
              overflowY: "auto",
              padding: 16,
              fontFamily: "Manrope, sans-serif",
              position: "relative",
            }}
          >
            {/* Red Bordered Box */}
            <div
              style={{
                border: "1px solid #F62D2D",
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <div
                className="d-flex justify-content-center"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "poppins",
                  fontSize: "17px",
                  color: "#FF1717",
                  background: "#FF17171A",
                  height: "56px",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 18 }}>⚠️</span>
                Yet to Complete Note
              </div>
              <div className="px-3">
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: "22px",
                    color: "#34495E",
                    fontFamily: "poppins",
                  }}
                >
                  You're almost done! Please complete the remaining steps to
                  finish your Disblay Business Page and activate your enrollment
                  reward.
                </p>

                <p style={{ fontWeight: 600, margin: "10px 0 4px" }}>
                  To qualify:
                </p>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: "22px",
                    color: "#34495E",
                    fontFamily: "Poppins",
                  }}
                >
                  <p className="mb-1">
                    Fill in Basic Owner Details & Business Information.
                  </p>
                  <p className="mt-2 mb-1">
                    Add at least 2 products and/or services.
                  </p>
                  <p className="mt-2 mb-1">
                    Create at least 1 Combo (max 20 total items) with minimum 2
                    categories.
                  </p>
                  <p className="mt-2">Submit for validation.</p>
                </div>

                <p style={{ fontWeight: 600, margin: "10px 0 4px" }}>Reward:</p>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: "22px",
                    color: "#34495E",
                    fontFamily: "poppins",
                  }}
                >
                  After our team verifies your enrollment, you’ll earn 20% of
                  the yearly subscription amount for each successful business
                  you enroll.
                </p>

                <p
                  style={{
                    fontSize: 14,
                    lineHeight: "22px",
                    color: "#F62D2D",
                    fontFamily: "poppins",
                  }}
                >
                  <strong>Important:</strong> Please do not delete, transfer, or
                  close your Enroll ID until validation is complete and rewards
                  are credited. Doing so may lead to suspension or loss of
                  eligibility.
                </p>

                <p
                  style={{
                    fontSize: 13,
                    marginTop: 10,
                    color: "#34495E",
                    fontFamily: "poppins",
                  }}
                >
                  Thank you for building with Disblay! <br /> — Topiko Business
                  Solutions Pvt. Ltd.
                </p>
              </div>
            </div>

            {/* Footer with Checkbox */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  fontSize: 13,
                  lineHeight: "18px",
                  cursor: "pointer",
                  gap: 6,
                  color: "#34495E",
                }}
              >
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  style={{ marginTop: 2 }}
                />
                <span>
                  I agree to Disblay's{" "}
                  <a
                   
                    style={{
                      color: "#007bff",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Terms & Conditions and policies
                  </a>
                </span>
              </label>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <button
                style={{
                  flex: 1,
                  height: 40,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  background: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => router.push('/')}
              >
                Close any way
              </button>
              <button
                style={{
                  flex: 1,
                  height: 40,
                  border: "none",
                  borderRadius: 8,
                  background: "#34495E",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={handleSubmiting}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      {showCongratsModal && (
  <div 

    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#ffffff",
      display: "flex",
      justifyContent: "center",
      zIndex: 9999,
      height: "100vh",
      overflowY: "auto",
      paddingTop: "80px",
      paddingBottom: "40px"
    }}
  >
    
  
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      <img 
        src={celebration} 
        alt="Celebration" 
        style={{ width: "auto", height: "150px", display: "block", margin: "0 auto" }} 
      />
      <div className="mt-4 text-center"
           style={{fontSize:"24px",fontWeight:"800",color:"#27A376",lineHeight:"30px"}}>
        Congratulations!
      </div>
      <div className="mt-4 text-center" 
           style={{ fontFamily: "Manrope", fontSize: "27px", lineHeight: "38px", fontWeight: "700", color:"#262626" }}>
        {enrollName}
      </div>
      <div className="mt-4 text-center" 
           style={{ fontFamily: "Manrope", fontSize: "14px", lineHeight: "23px", fontWeight: "600", color:"#34495E" }}>
        Enroll ID - {enrollId}
      </div>
      <div className="text-center mt-4 mb-2"
           style={{ fontFamily: "Manrope", fontSize: "16px", lineHeight: "23px", fontWeight: "700", marginTop: "20px", color:'#02060CCC' }}>
        Total no of Business Webpages Created
      </div>
      <div className="mt-4 text-center px-3"
           style={{ color:"#F62D2D", fontSize:"42px", fontWeight:"700", lineHeight:"32px" }}>
        {enrollCnt}
      </div>
      <div className="mt-4 px-3 text-center">
        <button  
          onClick={()=> router.push('/')}
          className="get-started-btn mt-4 " 
          style={{ fontFamily: "Manrope", fontSize: "20px", fontWeight: "700" ,background:"#34495E",border:"none",borderRadius:"12px",width:"120px",height:"50px"}}
        >
        <span
    style={{
      fontFamily: "Manrope",
      fontWeight: "700",
      fontSize: "20px",
      color: hasPaidPackage ? "#fff" : "#fff",
    }}
  > Done</span> 
        </button>
      </div>
      <div className="mt-4 px-2">
        <div className="text-center mt-4 mb-4"
          style={{ fontWeight: "800", color: "#2563EB", fontSize: "18px", lineHeight:"25px" }}>
          Disblay Enroller Benefit Terms
        </div>

        {/* Commission Reward */}
        <div style={{ marginBottom: "5px" }}>
          <div style={{ fontWeight: "800", color: "#262626", lineHeight:"25px", fontSize:"14px" }}>
            Commission Reward
          </div>
          <ul style={{ fontSize: "14px", fontWeight: "600", color: "#626262", lineHeight:"25px" }}>
            <li>Earn 53% commission on each successful business onboarding.</li>
          </ul>
        </div>

        {/* Business Enrollment */}
        <div style={{ marginBottom: "5px" }}>
          <div style={{ fontWeight: "800", color: "#262626", lineHeight:"25px", fontSize:"14px" }}>
            Business Enrollment Must Include
          </div>
          <ul style={{ fontSize: "14px", fontWeight: "600", color: "#626262", lineHeight:"25px" }}>
            <li>Basic owner details</li>
            <li>Business information</li>
            <li>Minimum 1 products and/or services</li>
          </ul>
        </div>

        {/* Combo Creation */}
        <div style={{ marginBottom: "5px" }}>
          <div style={{ fontWeight: "800", color: "#262626", lineHeight:"25px", fontSize:"14px" }}>
            Combo Creation Guidelines
          </div>
          <ul style={{ fontSize: "14px", fontWeight: "600", color: "#626262", lineHeight:"25px" }}>
            <li>Maximum 15 products/services per combo, but enroll Minimum 1 combo has to list.</li>
            <li>Our team will support combo creation after verifying the business ID and link with the owner.</li>
          </ul>
        </div>

        {/* Commission Release */}
        <div style={{ marginBottom: "5px" }}>
          <div style={{ fontWeight: "800", color: "#262626", lineHeight:"25px", fontSize:"14px" }}>
            Instant Commission Release
          </div>
          <ul style={{ fontSize: "14px", fontWeight: "600", color: "#626262", lineHeight:"25px" }}>
            <li>Once verified, your commission is processed immediately.</li>
          </ul>
        </div>

        {/* Need Help */}
        <div style={{ marginBottom: "5px" }}>
          <div style={{ fontWeight: "800", color: "#262626", lineHeight:"25px", fontSize:"14px" }}>
            Need Help or Facing Delay?
          </div>
          <ul style={{ fontSize: "14px", fontWeight: "600", color: "#626262", lineHeight:"25px" }}>
            <li>
              Reach out to us directly via call for fast assistance.{" "}
              <a style={{ color: "#2563EB", textDecoration: "underline" }}>
                T&C Applicable
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
}
