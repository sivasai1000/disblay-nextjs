"use client"
import React, { useState,useEffect, useRef } from "react";
import { Button, Form, Card } from "react-bootstrap";
import { useRouter } from "next/navigation";
import axios from "axios";
import DisblayNav from "@/components/DisblayNav";
import Swal from "sweetalert2";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const OthersLogin = () => {

 const router = useRouter();
  const [enrollId, setEnrollId] = useState(""); 
  useEffect(() => {
  const id = sessionStorage.getItem("enrollId");
  setEnrollId(id);
}, []);



  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep(step - 1);
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Validation
  if (!name || !mobile || !agreeTerms) {
    await Swal.fire({
      icon: "warning",
      title: "Incomplete Details",
      text: "Please complete all fields and agree to the terms.",
    });
    return;
  }

  try {
    const response = await axios.post(`${BASE_URL}/bregister.php`, {
      fullname: name,
      username: mobile,
      reference: enrollId || "",
    });

    // ✅ Success
    if (response.data.status === "success") {
      const business_id = response.data.response.business_id;

      localStorage.setItem("businessId", business_id || "");

      await Swal.fire({
        icon: "success",
        title: "Registered Successfully!",
        text: "Proceeding to the next step...",
        timer: 1500,
        showConfirmButton: false,
      });

      setStep(2);
    } else {
      // ✅ API failure
      await Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: response.data.message || "User already exists.",
      });
    }
  } catch (error) {
    console.error("Error creating enroll ID:", error);

    await Swal.fire({
      icon: "error",
      title: "Network Error",
      text: "Unable to connect to the server. Please try again.",
    });
  }
};


 const handleVerify = async () => {
  // ✅ Validate OTP fields
  if (otp.some((digit) => digit === "")) {
    await Swal.fire({
      icon: "warning",
      title: "Incomplete OTP",
      text: "Please enter all OTP digits.",
    });
    return;
  }

  const otpCode = otp.join("");

  try {
    const response = await axios.post(`${BASE_URL}/bverifyotp.php`, {
      username: mobile,
      otp: otpCode,
    });

    // ✅ Success
    if (response.data.status === "success") {
      await Swal.fire({
        icon: "success",
        title: "OTP Verified!",
        text: "Verification successful. Redirecting...",
        timer: 1200,
        showConfirmButton: false,
      });

      router.push("/enrollbusiness");
    } 
    else {
      await Swal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: response.data.msg || "OTP verification failed.",
      });
    }
  } catch (error) {
    console.error("OTP verification error:", error);

    await Swal.fire({
      icon: "error",
      title: "Network Error",
      text: "Unable to verify OTP. Please try again.",
    });
  }
};


  return (
 <div className="min-vh-100 d-flex flex-column bg-light">
          {/* 🔹 Top Nav */}
          <DisblayNav />
    <div
        className="flex-grow-1 d-flex flex-column align-items-center justify-content-center"
        style={{ padding: "20px" }}
      >
      <Card
        className="shadow-md"
        style={{
          width: "100%",
          maxWidth: "480px",
          borderRadius: "16px",
          padding: "24px",
          background: "#fff",
        }}
      >
        

        {/* Step 1: Owner Info */}
        {step === 1 && (
          <div className="d-flex flex-column align-items-center">
            <div
              className="mt-2 mb-4"
              style={{
                fontFamily: "Manrope",
                fontSize: "22px",
                fontWeight: "700",
                color: "#34495E",
              }}
            >
              Owner Info
            </div>

            <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Form.Group className="mb-4">
                <Form.Label
                  style={{ fontSize: "15px", color: "#808080", fontWeight: "500" }}
                >
                  Business Owner Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    height: "50px",
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "14px",
                  }}
                />
              </Form.Group>

              <Form.Label
                style={{ fontSize: "15px", color: "#808080", fontWeight: "500" }}
              >
                Mobile Number
              </Form.Label>
              <div
                className="mt-1 mb-4"
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  height: "50px",
                  border: "1px solid #ced4da",
                  borderRadius: "10px",
                  padding: "0 8px",
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    width: "70px",
                    height: "34px",
                    background: "#F4F4F4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "6px",
                  }}
                >
                  <img
                    src="https://flagcdn.com/w20/in.png"
                    alt="India flag"
                    style={{
                      width: "20px",
                      height: "14px",
                      marginRight: "4px",
                      borderRadius: "2px",
                    }}
                  />
                  <span style={{ fontSize: "14px" }}>+91</span>
                </div>

                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setMobile(value);
                  }}
                  maxLength={10}
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    padding: "0 10px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <Form.Group className="d-flex align-items-center mb-3 mt-3">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                  style={{
                    width: "18px",
                    height: "18px",
                    marginRight: "8px",
                    accentColor: "#3D7FFF",
                    cursor: "pointer",
                  }}
                />
                <label
                  htmlFor="agreeTerms"
                  style={{
                    fontSize: "13px",
                    lineHeight: "18px",
                    margin: 0,
                    cursor: "pointer",
                  }}
                >
                  I agree to Disblay’s{" "}
                  <a
                  
                    style={{
                      color: "#3D7FFF",
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                  >
                    Terms & Conditions and policies
                  </a>
                </label>
              </Form.Group>

              <Button
                type="submit"
                disabled={!agreeTerms}
                className="w-100 fw-semibold mt-3"
                style={{
                  height: "50px",
                  backgroundColor: !agreeTerms ? "#ccc" : "#34495E",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "18px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#FFFFFF",
                  }}
                >
                  Submit
                </span>
              </Button>
            </Form>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div
            className="d-flex flex-column align-items-center"
            style={{ width: "100%", marginTop: "20px" }}
          >
            <div
              className="mb-3"
              style={{
                fontFamily: "Manrope",
                fontSize: "22px",
                fontWeight: "700",
                color: "#34495E",
              }}
            >
              OTP Verification
            </div>
            <div
              className="text-center mb-4"
              style={{
                fontFamily: "Manrope",
                fontSize: "14px",
                fontWeight: "500",
                color: "#5E5E5E",
              }}
            >
              Please enter verification code sent on{" "}
              <div
                style={{
                  fontFamily: "Manrope",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#000000",
                }}
              >
                +91 {mobile}
              </div>
            </div>

            {/* OTP Boxes */}
            <div className="d-flex justify-content-between mb-3" style={{ gap: "10px" }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="tel"
                  value={digit}
                  ref={otpRefs[index]}
                  maxLength="1"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!/^\d?$/.test(value)) return;
                    const newOtp = [...otp];
                    newOtp[index] = value;
                    setOtp(newOtp);
                    if (value && index < 3) {
                      otpRefs[index + 1].current.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace") {
                      if (otp[index]) {
                        const newOtp = [...otp];
                        newOtp[index] = "";
                        setOtp(newOtp);
                      } else if (index > 0) {
                        otpRefs[index - 1].current.focus();
                      }
                    }
                  }}
                  style={{
                    width: "50px",
                    height: "50px",
                    textAlign: "center",
                    fontSize: "18px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                />
              ))}
            </div>

            <p
              style={{
                fontSize: "14px",
                color: "#bbb",
                marginBottom: "20px",
                cursor: "pointer",
              }}
            >
              Resend OTP
            </p>

            <Button
              onClick={handleVerify}
              className="w-100 fw-semibold"
              style={{
                height: "50px",
                backgroundColor: "#34495E",
                border: "none",
                borderRadius: "8px",
                fontSize: "18px",
              }}
            >
              <span
                style={{
                  fontFamily: "Manrope",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#FFFFFF",
                  lineHeight: "20px",
                }}
              >
                Verify number
              </span>
            </Button>
          </div>
        )}
      </Card>
    </div>
    </div>
  );
};

export default OthersLogin;
