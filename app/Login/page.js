"use client";
import React, { useState, useEffect } from "react";
import "@/css/businesscreditionals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  useLogin,
  useBusinessDetails,
  useResendOtp,
  useVerifyForgotOtp,
  useResetMpin,
} from "@/components/BusinessApi/page";
import { useRouter, useSearchParams } from "next/navigation";
export default function Login() {
  const router = useRouter();
  const creditionalsimg = "/assets/img/creditionals.png";
  const searchParams = useSearchParams();
  const initialUsername = searchParams.get("username") || "";
  const [username, setUsername] = useState(initialUsername);
  const [error, setError] = useState("");
  const [mpin, setMpin] = useState(["", "", "", ""]);
  const [forgotMode, setForgotMode] = useState(false);
  const [stage, setStage] = useState("mobile");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newMpin, setNewMpin] = useState(["", "", "", ""]);
  const [confirmMpin, setConfirmMpin] = useState(["", "", "", ""]);
  const [businessId, setBusinessId] = useState(null);
  const login = useLogin();
  const resendOtp = useResendOtp();
  const verifyForgotOtp = useVerifyForgotOtp();
  const resetMpin = useResetMpin();
  const { data: details, isSuccess, isError } = useBusinessDetails(
    { business_id: businessId },
    { enabled: !!businessId }
  );

  useEffect(() => {
    if (isSuccess && details) {
      if (details?.response?.business_slug) router.push("/Admin");
      else router.push("/welcome");
    }
    if (isError) setError("Failed to fetch business details");
  }, [isSuccess, isError, details, router]);

  // MPIN / OTP logic
  const handleDigitChange = (value, index, setter, arr, prefix) => {
    if (/^\d*$/.test(value)) {
      const newArr = [...arr];
      newArr[index] = value.slice(-1);
      setter(newArr);

      if (value && index < arr.length - 1) {
        document.getElementById(`${prefix}-${index + 1}`)?.focus();
      } else if (!value && index > 0) {
        document.getElementById(`${prefix}-${index - 1}`)?.focus();
      }
    }
  };

  const validateMobile = () => {
    if (username.length !== 10) {
      setError("Mobile number must be exactly 10 digits.");
      return false;
    }
    setError("");
    return true;
  };

  // LOGIN SUBMIT
  const handleLogin = () => {
    if (!validateMobile()) return;

    const pin = mpin.join("");
    if (pin.length !== 4) {
      setError("Please enter all 4 digits of M-Pin");
      return;
    }

    login.mutate(
      { username, password: pin },
      {
        onSuccess: (res) => {
          if (res.status === "success") {
            const bid = res.response?.id;
            const uid = res.response?.user_id;
            const bname = res.response?.business_name;

            if (uid) localStorage.setItem("userId", uid);
            if (bid) {
              localStorage.setItem("businessId", bid);
              setBusinessId(bid);
            }

            if (!bname && !bid) router.replace("/newbusiness");
            else if (!bname && bid) router.replace("/welcome");
            else router.replace("/Admin");
          } else setError(res.msg || "Login failed");
        },
        onError: () => setError("Network error during login"),
      }
    );
  };

  // Forgot Flow
  const handleSendOtp = () => {
    if (!validateMobile()) return;

    resendOtp.mutate(
      { username },
      {
        onSuccess: (res) => {
          if (res.status === "success") {
            setStage("otp");
            setError("");
          } else setError(res.msg || "Failed to send OTP");
        },
      }
    );
  };

  const handleVerifyOtp = () => {
    const code = otp.join("");
    if (code.length !== 4) {
      setError("Please enter the 4-digit OTP");
      return;
    }

    verifyForgotOtp.mutate(
      { username, otp: code },
      {
        onSuccess: (res) => {
          if (res.status === "success") setStage("setmpin");
          else setError(res.msg || "Invalid OTP");
        },
      }
    );
  };

  const handleResendOtp = () => {
    if (!validateMobile()) return;

    resendOtp.mutate(
      { username },
      {
        onSuccess: (res) => {
          if (res.status === "success") setError("");
          else setError(res.msg || "Failed to resend OTP");
        },
        onError: () => setError("Network error while resending OTP"),
      }
    );
  };

  const handleSetNewMpin = () => {
    const n1 = newMpin.join("");
    const n2 = confirmMpin.join("");

    if (n1.length !== 4 || n2.length !== 4) {
      setError("Enter all 4 digits in both fields");
      return;
    }
    if (n1 !== n2) {
      setError("M-PIN and Confirm M-PIN do not match");
      return;
    }

    resetMpin.mutate(
      { username, otp: otp.join(""), new_mpin: n1 },
      {
        onSuccess: (res) => {
          if (res.status === "success") {
            setForgotMode(false);
            setStage("mobile");
            setMpin(["", "", "", ""]);
            setOtp(["", "", "", ""]);
            setNewMpin(["", "", "", ""]);
            setConfirmMpin(["", "", "", ""]);
            setError("");
          } else setError(res.msg || "Failed to set new M-PIN");
        },
      }
    );
  };

  // DigitBoxes
  const DigitBoxes = (label, arr, setter, prefix, mt = 50) => (
    <>
      <p className="creditionals-text text-start" style={{ marginTop: mt, marginBottom: 30 }}>
        {label}
      </p>

      <div className="d-flex justify-content-start gap-3 mb-4">
        {arr.map((digit, index) => (
          <input
            key={index}
            id={`${prefix}-${index}`}
            type="password"
            maxLength={1}
            value={digit}
            onChange={(e) =>
              handleDigitChange(e.target.value, index, setter, arr, prefix)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (prefix === "mpin") handleLogin();
                if (prefix === "otp") handleVerifyOtp();
                if (prefix === "newmpin" || prefix === "confirmmpin")
                  handleSetNewMpin();
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
    </>
  );

  return (
    <div className="auth-container">
      <div className="auth-card row p-2">

        {/* LEFT IMAGE */}
        <div className="col-6 left-image text-center p-1">
          <img src={creditionalsimg} alt="credentials" style={{ height: "100dvh" }} />
        </div>

        {/* RIGHT PANEL */}
        <div className="col-6 right-panel">
          <div className="form-wrapper text-center">

            <div className="creditionals-header mb-4">
              {forgotMode ? "Forgot M-PIN" : "Login"}
            </div>

            {/* LOGIN VIEW */}
            {!forgotMode && (
              <>
                <label className="form-label creditionals-text mb-3 mt-4 text-start w-100">
                  Mobile Number
                </label>

                <div className="mt-1 mb-2" style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  height: "50px",
                  border: "1px solid #ced4da",
                  borderRadius: "10px",
                  padding: "0 8px",
                  background: "#fff",
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "0 10px",
                    height: "34px",
                    background: "#F4F4F4",
                    borderRadius: "6px",
                    minWidth: "70px",
                  }}>
                    <img src="https://flagcdn.com/w20/in.png" alt="India flag"
                      style={{
                        width: "20px",
                        height: "14px",
                        objectFit: "cover",
                        borderRadius: "2px",
                      }} />
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>+91</span>
                  </div>

                  <input
                    type="tel"
                    value={username}
                    className="creditionals-input"
                    onChange={(e) =>
                      setUsername(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    onBlur={validateMobile}
                    placeholder="Enter mobile number"
                    maxLength={10}
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

                {DigitBoxes("Enter your M-Pin", mpin, setMpin, "mpin")}

                <button
                  className="creditional-accountcreate w-100 mb-4 mt-4"
                  onClick={handleLogin}
                >
                  <span className="creditionals-btntext">
                    {login.isLoading ? "Logging in..." : "Login"}
                  </span>
                </button>

                <div className="text-end mt-2 mb-4">
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer", fontSize: 14 }}
                    onClick={() => setForgotMode(true)}
                  >
                    Forgot Password / M-PIN?
                  </span>
                </div>

                <div className="d-flex align-items-center my-3">
                  <hr className="flex-grow-1" />
                  <span className="mx-2">Or</span>
                  <hr className="flex-grow-1" />
                </div>

                <div className="text-center creditonals-already mb-3">
                  Don’t have an account?{" "}
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => router.push("/SignUp")}
                  >
                    Create account
                  </span>
                </div>
              </>
            )}

            {/* FORGOT FLOW */}
            {forgotMode && (
              <>
                {/* STEP 1 — MOBILE */}
                {stage === "mobile" && (
                  <>
                    <label className="form-label creditionals-text mb-3 mt-4 text-start w-100">
                      Mobile Number
                    </label>

                    <div className="mt-1 mb-2" style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      height: "50px",
                      border: "1px solid #ced4da",
                      borderRadius: "10px",
                      padding: "0 8px",
                      background: "#fff",
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "0 10px",
                        height: "34px",
                        background: "#F4F4F4",
                        borderRadius: "6px",
                        minWidth: "70px",
                      }}>
                        <img src="https://flagcdn.com/w20/in.png" alt="India flag"
                          style={{
                            width: "20px",
                            height: "14px",
                            objectFit: "cover",
                            borderRadius: "2px",
                          }} />
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>+91</span>
                      </div>

                      <input
                        type="tel"
                        value={username}
                        className="creditionals-input"
                        onChange={(e) =>
                          setUsername(e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                        placeholder="Enter mobile number"
                        maxLength={10}
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

                    <button
                      className="creditional-accountcreate w-100 mb-3 mt-2"
                      onClick={handleSendOtp}
                    >
                      <span className="creditionals-btntext">
                        {resendOtp.isLoading ? "Sending OTP..." : "Send OTP"}
                      </span>
                    </button>

                    <div className="text-start mt-2">
                      <span
                        className="text-secondary"
                        style={{ cursor: "pointer", fontSize: 14 }}
                        onClick={() => setForgotMode(false)}
                      >
                        ← Back to Login
                      </span>
                    </div>
                  </>
                )}

                {/* STEP 2 — OTP */}
                {stage === "otp" && (
                  <>
                    <label className="form-label creditionals-text mb-3 mt-4 text-start w-100">
                      Mobile Number
                    </label>

                    <div className="mt-1 mb-2" style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      height: "50px",
                      border: "1px solid #ced4da",
                      borderRadius: "10px",
                      padding: "0 8px",
                      background: "#fff",
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "0 10px",
                        height: "34px",
                        background: "#F4F4F4",
                        borderRadius: "6px",
                        minWidth: "70px",
                      }}>
                        <img src="https://flagcdn.com/w20/in.png" alt="India flag"
                          style={{
                            width: "20px",
                            height: "14px",
                            objectFit: "cover",
                            borderRadius: "2px",
                          }} />
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>+91</span>
                      </div>

                      <input
                        type="tel"
                        value={username}
                        className="creditionals-input"
                        onChange={(e) =>
                          setUsername(e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        maxLength={10}
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

                    {DigitBoxes("Enter OTP", otp, setOtp, "otp")}

                    <button
                      className="creditional-accountcreate w-100 mb-3 mt-2"
                      onClick={handleVerifyOtp}
                    >
                      <span className="creditionals-btntext">
                        {verifyForgotOtp.isLoading ? "Verifying..." : "Verify OTP"}
                      </span>
                    </button>

                    <div className="d-flex justify-content-between">
                      <span
                        className="text-secondary"
                        style={{ cursor: "pointer", fontSize: 14 }}
                        onClick={() => setStage("mobile")}
                      >
                        ← Change Number
                      </span>
                      <span
                        className="text-primary"
                        style={{ cursor: "pointer", fontSize: 14 }}
                        onClick={handleResendOtp}
                      >
                        Resend OTP
                      </span>
                    </div>
                  </>
                )}

                {/* STEP 3 — NEW MPIN */}
                {stage === "setmpin" && (
                  <>
                    <label className="form-label creditionals-text mb-3 mt-4 text-start w-100">
                      Mobile Number
                    </label>

                    <div className="mt-1 mb-2" style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      height: "50px",
                      border: "1px solid #ced4da",
                      borderRadius: "10px",
                      padding: "0 8px",
                      background: "#fff",
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "0 10px",
                        height: "34px",
                        background: "#F4F4F4",
                        borderRadius: "6px",
                        minWidth: "70px",
                      }}>
                        <img src="https://flagcdn.com/w20/in.png" alt="India flag"
                          style={{
                            width: "20px",
                            height: "14px",
                            objectFit: "cover",
                            borderRadius: "2px",
                          }} />
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>+91</span>
                      </div>

                      <input
                        type="tel"
                        value={username}
                        className="creditionals-input"
                        onChange={(e) =>
                          setUsername(e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        maxLength={10}
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

                    {DigitBoxes("Set New M-PIN", newMpin, setNewMpin, "newmpin")}
                    {DigitBoxes("Confirm New M-PIN", confirmMpin, setConfirmMpin, "confirmmpin", 20)}

                    <button
                      className="creditional-accountcreate w-100 mb-3 mt-2"
                      onClick={handleSetNewMpin}
                    >
                      <span className="creditionals-btntext">
                        {resetMpin.isLoading ? "Saving..." : "Save M-PIN"}
                      </span>
                    </button>

                    <div className="text-start mt-2">
                      <span
                        className="text-secondary"
                        style={{ cursor: "pointer", fontSize: 14 }}
                        onClick={() => setForgotMode(false)}
                      >
                        ← Back to Login
                      </span>
                    </div>
                  </>
                )}
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
