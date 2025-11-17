"use client";

import React, { useState } from "react";
import "@/css/businesscreditionals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Swal from "sweetalert2";
import Image from "next/image";


import {
  useSignup,
  useVerifyOtp,
  useCreateMpin,
} from "@/components/BusinessApi/page";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BusinessCredentials() {
  const router = useRouter();
const creditionalsimg = "/assets/img/creditionals.png";
  const [step, setStep] = useState("signup"); // signup | otp | mpin
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [mpin, setMpin] = useState(["", "", "", ""]);
  const [confirmMpin, setConfirmMpin] = useState(["", "", "", ""]);

  const signup = useSignup();
  const otpVerify = useVerifyOtp();
  const mpinCreate = useCreateMpin();

  const validateMobile = () => {
    if (username.length !== 10) {
      setError("Mobile number must be exactly 10 digits.");
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const handleCreateAccount = () => {
    if (fullname.trim() === "") {
      setError("Full name is required.");
      return;
    }
    if (!validateMobile()) return;

    signup.mutate(
      { fullname, username },
      {
        onSuccess: (res) => {
          if (res.status === "success") {
            setStep("otp");
          } else {
            setError(res.msg || "Signup failed");
          }
        },
        onError: () => setError("Network error during signup"),
      }
    );
  };

  // -------------------------------------
  // OTP INPUT HANDLING
  // -------------------------------------
  const handleOtpChange = (value, index) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      } else if (!value && index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete OTP",
        text: "Please enter all 4 digits.",
      });
      return;
    }

    otpVerify.mutate(
      { username, otp: enteredOtp },
      {
        onSuccess: (res) => {
          if (res.status === "success") {
            Swal.fire({
              icon: "success",
              title: "OTP Verified!",
              text: "Your OTP has been verified successfully.",
              timer: 1000,
              showConfirmButton: false,
            }).then(() => {
              setStep("mpin");
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Invalid OTP",
              text: res.msg || "Please try again.",
            });
          }
        },
        onError: () => {
          Swal.fire({
            icon: "error",
            title: "Network Error",
            text: "Unable to verify your OTP. Please try again.",
          });
        },
      }
    );
  };

  // -------------------------------------
  // MPIN HANDLING
  // -------------------------------------
  const handleMpinChange = (value, index, type) => {
    if (/^\d*$/.test(value)) {
      if (type === "mpin") {
        const newMpin = [...mpin];
        newMpin[index] = value.slice(-1);
        setMpin(newMpin);

        if (value && index < mpin.length - 1) {
          document.getElementById(`mpin-${index + 1}`)?.focus();
        } else if (!value && index > 0) {
          document.getElementById(`mpin-${index - 1}`)?.focus();
        }
      } else {
        const newConfirmMpin = [...confirmMpin];
        newConfirmMpin[index] = value.slice(-1);
        setConfirmMpin(newConfirmMpin);

        if (value && index < confirmMpin.length - 1) {
          document.getElementById(`confirm-${index + 1}`)?.focus();
        } else if (!value && index > 0) {
          document.getElementById(`confirm-${index - 1}`)?.focus();
        }
      }
    }
  };

  const handleSubmitMpin = () => {
    const entered = mpin.join("");
    const confirmed = confirmMpin.join("");

    if (entered.length !== 4 || confirmed.length !== 4) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete M-PIN",
        text: "Please fill all 4 digits in both fields.",
      });
      return;
    }

    if (entered !== confirmed) {
      Swal.fire({
        icon: "error",
        title: "M-PIN Mismatch",
        text: "M-PINs do not match. Please try again.",
      });
      return;
    }

    mpinCreate.mutate(
      { username, new_mpin: entered },
      {
        onSuccess: (res) => {
          if (res.status === "success") {
            Swal.fire({
              icon: "success",
              title: "M-PIN Created!",
              text: "Your M-PIN has been set successfully.",
              confirmButtonText: "Continue",
            }).then(() => {
              router.push(`/Login?username=${username}`);
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Failed",
              text: res.msg || "Failed to create M-PIN. Please try again.",
            });
          }
        },
        onError: () => {
          Swal.fire({
            icon: "error",
            title: "Network Error",
            text: "Unable to create M-PIN. Please check your connection.",
          });
        },
      }
    );
  };

  return (
    <div className="auth-container">
      <div className="auth-card row">

        {/* LEFT IMAGE */}
        <div className="col-6 left-image text-center p-2" style={{ position: "relative", height: "95dvh" }}>
  <Image
    src={creditionalsimg}
    alt="credentials"
    fill
    style={{ objectFit: "contain" }}
  />
</div>


        {/* RIGHT PANEL */}
        <div className="col-6 right-panel">
          <div className="form-wrapper text-center">

            {/* STEP 1 — SIGNUP */}
            {step === "signup" && (
              <>
                <div className="creditionals-header mb-4">Sign up</div>

                {/* FULLNAME */}
                <div className="mb-3 text-start">
                  <label className="form-label creditionals-text mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control creditionals-input mb-3"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Enter your full name"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        document.getElementById("signup-mobile")?.focus();
                      }
                    }}
                  />
                </div>

                {/* MOBILE INPUT */}
                <label className="form-label creditionals-text mb-2 text-start w-100">
                  Mobile Number
                </label>

                <div
                  className="mb-2"
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
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "0 10px",
                      height: "34px",
                      background: "#F4F4F4",
                      borderRadius: "6px",
                      minWidth: "70px",
                    }}
                  >
                    <img
                      src="https://flagcdn.com/w20/in.png"
                      alt="India flag"
                      style={{
                        width: "20px",
                        height: "14px",
                        objectFit: "cover",
                        borderRadius: "2px",
                      }}
                    />
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>
                      +91
                    </span>
                  </div>

                  <input
                    id="signup-mobile"
                    type="tel"
                    value={username}
                    className="creditionals-input"
                    onChange={(e) => {
                      const numericValue = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      setUsername(numericValue);
                    }}
                    onBlur={validateMobile}
                    placeholder="Enter mobile number"
                    maxLength={10}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateAccount();
                    }}
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      fontSize: "14px",
                      padding: "0px 10px",
                      background: "transparent",
                    }}
                  />
                </div>

                {error && <p className="text-danger small mb-2">{error}</p>}

                <div className="form-check mb-4 mt-3 text-start">
                  <input type="checkbox" className="form-check-input" id="terms" />
                  <label className="form-check-label creditionals-agree" htmlFor="terms">
                    I agree to Display’s{" "}
                    <Link href="/" className="creditionals-terms">
                      Terms & Conditions and policies
                    </Link>
                  </label>
                </div>

                <button
                  className="creditional-accountcreate w-100 mb-4"
                  onClick={handleCreateAccount}
                  disabled={signup.isLoading}
                >
                  <span className="creditionals-btntext">
                    {signup.isLoading ? "Creating..." : "Create account"}
                  </span>
                </button>

                <div className="d-flex align-items-center my-3">
                  <hr className="flex-grow-1" />
                  <span className="mx-2">Or</span>
                  <hr className="flex-grow-1" />
                </div>

                <div className="text-center creditonals-already mb-3">
                  Already have an account?{" "}
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => router.push("/Login")}
                  >
                    Login
                  </span>
                </div>
              </>
            )}

            {/* STEP 2 — OTP */}
            {step === "otp" && (
              <>
                <div className="creditionals-header mb-3">OTP Verification</div>

                <div className="creditionals-otptext mb-4">
                  Please enter verification code sent to{" "}
                  <span className="creditionals-otptext1">+91 {username}</span>
                </div>

                <div className="d-flex justify-content-center gap-3 mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleVerifyOtp();
                      }}
                      className="form-control text-center"
                      style={{
                        width: "72px",
                        height: "72px",
                        fontSize: "20px",
                        borderRadius: "8px",
                        border: "1.5px solid #E2E4E9",
                      }}
                    />
                  ))}
                </div>

                <button
                  className="creditional-accountcreate w-100 mb-4"
                  style={{ height: "54px" }}
                  onClick={handleVerifyOtp}
                  disabled={otpVerify.isLoading}
                >
                  <span className="creditionals-btntext">
                    {otpVerify.isLoading ? "Verifying..." : "Verify number"}
                  </span>
                </button>
              </>
            )}

            {/* STEP 3 — MPIN */}
            {step === "mpin" && (
              <>
                <h2 className="creditionals-mpin mb-4">Create your M-Pin</h2>

                <div className="d-flex justify-content-center gap-3 mb-4">
                  {mpin.map((digit, index) => (
                    <input
                      key={index}
                      id={`mpin-${index}`}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleMpinChange(e.target.value, index, "mpin")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (index === mpin.length - 1) {
                            document.getElementById("confirm-0")?.focus();
                          } else {
                            document.getElementById(`mpin-${index + 1}`)?.focus();
                          }
                        }
                      }}
                      className="form-control text-center"
                      style={{
                        width: "72px",
                        height: "72px",
                        fontSize: "20px",
                        borderRadius: "8px",
                        border: "1.5px solid #E2E4E9",
                      }}
                    />
                  ))}
                </div>

                <div className="creditionals-mpin mb-3">Confirm your M-Pin</div>

                <div className="d-flex justify-content-center gap-3 mb-4">
                  {confirmMpin.map((digit, index) => (
                    <input
                      key={index}
                      id={`confirm-${index}`}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleMpinChange(e.target.value, index, "confirm")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (index === confirmMpin.length - 1) {
                            handleSubmitMpin();
                          } else {
                            document.getElementById(`confirm-${index + 1}`)?.focus();
                          }
                        }
                      }}
                      className="form-control text-center"
                      style={{
                        width: "72px",
                        height: "72px",
                        fontSize: "20px",
                        borderRadius: "8px",
                        border: "1.5px solid #E2E4E9",
                      }}
                    />
                  ))}
                </div>

                <button
                  className="creditional-accountcreate w-100"
                  onClick={handleSubmitMpin}
                  disabled={mpinCreate.isLoading}
                >
                  <span className="creditionals-btntext">
                    {mpinCreate.isLoading ? "Saving..." : "Submit"}
                  </span>
                </button>
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
