"use client"
import React, { useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import { useRouter } from "next/navigation";
import axios from "axios";
import DisblayNav from "@/components/DisblayNav";
import Swal from "sweetalert2";
const celebration = "/assets/img/celebration.gif"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const GetEnroll = () => {
  const router = useRouter();
  const [enrollId, setEnrollId] = useState("");
  const [step, setStep] = useState("form");
  const [agreed, setAgreed] = useState(false);
  const [enrollName, setEnrollName] = useState("");
  const [enrollCnt, setEnrollCnt] = useState(0);

 const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Validation
  if (!enrollId.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Enroll ID Required",
      text: "Please enter your Enroll ID.",
    });
    return;
  }

  try {
    const response = await axios.post(`${BASE_URL}/get_enrollCount.php`, {
      enroll_id: enrollId,
    });

    const data = response.data;
    console.log("API Response:", data);

    // ✅ Success Case
    if (response.status === 200 && data.status === "success") {
      setEnrollName(data.res.business_user_name);
      setEnrollCnt(data.res.cnt);
      setEnrollId(data.res.enroll_id);

      localStorage.setItem("enrollIds", data.res.enroll_id);
      setStep("success");
    } 
    
    // ❌ API Error Case
    else {
      Swal.fire({
        icon: "error",
        title: "Invalid Enroll ID",
        text: data.message || "Something went wrong.",
      });
    }
  } 
  
  catch (error) {
    console.error("Error:", error);

    Swal.fire({
      icon: "error",
      title: "Network Error",
      text:
        error.response?.data?.message ||
        "Failed to connect to the server. Please try again later.",
    });
  }
};


  const handleGetStarted = () => {
    setStep("plan");
  };

 const handleContinue = () => {
  sessionStorage.setItem("enrollId", enrollId);
  router.push("/otherslogin");
};


  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* 🔹 Top Nav */}
      <DisblayNav />

      {/* 🔹 Main Content */}
      <div
        className="flex-grow-1 d-flex flex-column align-items-center justify-content-center"
        style={{ padding: "20px" }}
      >
        {/* Card */}
        <Card
          className="shadow-md"
          style={{
            width: "100%",
            maxWidth: "480px",
            borderRadius: "16px",
            padding: "30px",
            background: "#fff",
          }}
        >
          <div className="d-flex flex-column align-items-center ">
            {/* Step 1: Form */}
            {step === "form" && (
              <>
                <div
                  className="fw-bold text-center mb-4"
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "#34495E",
                  }}
                >
                  Create Business for Others
                </div>

                <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
                  <Form.Group controlId="enrollID" className="mb-3">
                    <Form.Label
                      className="fw-medium"
                      style={{
                        fontFamily: "Manrope",
                        fontSize: "15px",
                        fontWeight: "500",
                        color: "#808080",
                      }}
                    >
                      Enroll ID
                    </Form.Label>
                    <Form.Control
                      className="mb-3"
                      type="text"
                      placeholder="Enter your enroll ID"
                      value={enrollId}
                      onChange={(e) => setEnrollId(e.target.value)}
                      style={{
                        height: "48px",
                        background: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "12px",
                      }}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 fw-semibold"
                    style={{
                      height: "48px",
                      backgroundColor: "#34495E",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  >
                    Submit
                  </Button>
                </Form>

                <div className="text-start w-100 mt-3">
                  <span
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#424242",
                    }}
                  >
                    Didn’t have Enroll ID ?{" "}
                  </span>
                  <span
                    onClick={() => router.push("/getenrollid")}
                    style={{
                      color: "red",
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Get enroll ID
                  </span>
                </div>
              </>
            )}

            {/* Step 2: Success */}
            {step === "success" && (
              <div className="w-100 text-center">
                <img
                  src={celebration}
                  alt="Celebration"
                  style={{ width: "auto", height: "120px" }}
                />
                <div
                  className="mt-3"
                  style={{
                    fontSize: "22px",
                    fontWeight: "800",
                    color: "#27A376",
                  }}
                >
                  Congratulations!
                </div>
                <div
                  className="mt-3"
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "#262626",
                  }}
                >
                  {enrollName}
                </div>
                <div
                  className="mt-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#34495E",
                  }}
                >
                  Enroll ID - {enrollId}
                </div>

                <div
                  className="mt-4"
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "#02060C",
                  }}
                >
                  Total no of Business Webpages Created
                </div>
                <div
                  className="mt-2"
                  style={{
                    color: "#F62D2D",
                    fontSize: "36px",
                    fontWeight: "700",
                  }}
                >
                  {enrollCnt}
                </div>

                <Button
                  onClick={handleGetStarted}
                  className="mt-4 w-100"
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    height: "48px",
                    backgroundColor: "#34495E",
                    border: "none",
                    borderRadius: "8px",
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* Step 3: Plan */}
            {step === "plan" && (
              <div style={{ width: "100%", maxWidth: "500px" }}>
                <div
                  className="w-100 text-start mt-4 mb-4 px-3"
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "24px",
                    fontWeight: "800",
                    color: "#262626",
                    lineHeight: "28px",
                  }}
                >
                  Plan Details
                </div>

                <div className="px-2">
                  <div
                    className="px-4"
                    style={{
                      border: "1px solid #F62D2D",
                      borderRadius: "16px",
                      padding: "15px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "20px",
                        lineHeight: "28px",
                        fontWeight: "700",
                        color: "#F62D2D",
                      }}
                    >
                      Yearly Subscription
                    </div>

                    <div
                      className="mt-3"
                      style={{
                        fontSize: "24px",
                        lineHeight: "19px",
                        fontWeight: "800",
                        color: "#27A376",
                      }}
                    >
                      ₹1499{" "}
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#0000008F",
                          lineHeight: "19px",
                          textAlign: "justify",
                        }}
                      >
                        per year
                      </span>
                    </div>

                    <ul
                      className="mt-4 mb-4"
                      style={{
                        fontSize: "14px",
                        color: "#2B3D4F",
                        fontWeight: "600",
                        lineHeight: "19px",
                      }}
                    >
                      <li className="mt-2">
                        Create up to 20 Products & Services
                      </li>
                      <li className="mt-2">+1 Combo Product/Service Option</li>
                      <li className="mt-2">
                        3 Categories per combo, Total 15 Product/Service
                        Combinations for a combo
                      </li>
                    </ul>

                    <div
                      style={{
                        fontSize: "14px",
                        color: "#0000008F",
                        lineHeight: "19px",
                        fontWeight: "600",
                      }}
                    >
                      Note: Add-ons are applicable for each combo under ₹199 and
                      ₹299 plans.
                    </div>
                  </div>

                  <div className="form-check mt-3 d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input me-3"
                      id="agree"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="agree"
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        cursor: "pointer",
                      }}
                    >
                      I agree to Disblay’s{" "}
                      <a  style={{ textDecoration: "underline" }}>
                        Terms & Conditions and policies
                      </a>
                    </label>
                  </div>

                  <Button
                    onClick={handleContinue}
                    disabled={!agreed}
                    className="w-100 mt-4"
                    style={{
                      height: "50px",
                      backgroundColor: !agreed ? "#ccc" : "#34495E",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "18px",
                      fontWeight: "600",
                      cursor: agreed ? "pointer" : "not-allowed",
                    }}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

{/* 🔹 Terms OUTSIDE card for plan only */}
{step === "plan" && (
  <div className="w-100 d-flex justify-content-start mt-5 px-4">
    <div style={{ maxWidth: "600px" }}>
      <div
        className="text-start mt-4 mb-4"
        style={{
          fontWeight: "800",
          color: "#2563EB",
          fontSize: "18px",
          lineHeight: "25px",
        }}
      >
        Disblay Enroller Benefit Terms
      </div>

      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontWeight: "800", color: "#262626", fontSize: "14px" }}>
          Commission Reward
        </div>
        <ul
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#626262",
          }}
        >
          <li>Earn 53% commission on each successful business onboarding.</li>
        </ul>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontWeight: "800", color: "#262626", fontSize: "14px" }}>
          Business Enrollment Must Include
        </div>
        <ul
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#626262",
          }}
        >
          <li>Basic owner details</li>
          <li>Business information</li>
          <li>Minimum 1 products and/or services</li>
        </ul>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontWeight: "800", color: "#262626", fontSize: "14px" }}>
          Combo Creation Guidelines
        </div>
        <ul
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#626262",
          }}
        >
          <li>
            Maximum 15 products/services per combo, but enroll Minimum 1 combo
            has to list.
          </li>
          <li>
            Our team will support combo creation after verifying the business ID
            and link with the owner.
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontWeight: "800", color: "#262626", fontSize: "14px" }}>
          Instant Commission Release
        </div>
        <ul
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#626262",
          }}
        >
          <li>Once verified, your commission is processed immediately.</li>
        </ul>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontWeight: "800", color: "#262626", fontSize: "14px" }}>
          Need Help or Facing Delay?
        </div>
        <ul
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#626262",
          }}
        >
          <li>
            Reach out to us directly via call for fast assistance.{" "}
            <a
             
              style={{ color: "#2563EB", textDecoration: "underline" }}
            >
              T&C Applicable
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
};

export default GetEnroll;
