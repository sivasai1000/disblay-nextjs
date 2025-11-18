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
import LoginContent from "./LoginContent";
import ForgotContent from "./ForgotContent";

export default function LoginContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const signupMobile =
    typeof window !== "undefined"
      ? sessionStorage.getItem("signupMobile")
      : "";

  const initialUsername = signupMobile || searchParams.get("username") || "";
  const creditionalsimg = "/assets/img/creditionals.png";

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
    const saved = sessionStorage.getItem("signupMobile");
    if (saved) setUsername(saved);
  }, []);

  useEffect(() => {
    if (isSuccess && details) {
      if (details?.response?.business_slug) router.push("/Admin");
      else router.push("/welcome");
    }
    if (isError) setError("Failed to fetch business details");
  }, [isSuccess, isError, details, router]);

  const handleDigitChange = (value, index, setter, arr, prefix) => {
    if (/^\d*$/.test(value)) {
      const newArr = [...arr];
      newArr[index] = value.slice(-1);
      setter(newArr);

      if (value && index < arr.length - 1)
        document.getElementById(`${prefix}-${index + 1}`)?.focus();
      else if (!value && index > 0)
        document.getElementById(`${prefix}-${index - 1}`)?.focus();
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

  return (
    <div className="auth-container">

      {/* ❌ REMOVE Bootstrap row */}
      <div className="auth-card">

        {/* LEFT SIDE */}
        <div className="left-image" style={{ position: "relative" }}>
          <img
            src={creditionalsimg}
            alt="credentials"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="right-panel">
          <div className="form-wrapper text-center">

            {!forgotMode ? (
              <LoginContent
                username={username}
                setUsername={setUsername}
                validateMobile={validateMobile}
                error={error}
                mpin={mpin}
                setMpin={setMpin}
                handleLogin={handleLogin}
                setForgotMode={setForgotMode}
                handleDigitChange={handleDigitChange}
              />
            ) : (
              <ForgotContent
                username={username}
                setUsername={setUsername}
                stage={stage}
                setStage={setStage}
                otp={otp}
                setOtp={setOtp}
                newMpin={newMpin}
                setNewMpin={setNewMpin}
                confirmMpin={confirmMpin}
                setConfirmMpin={setConfirmMpin}
                error={error}
                handleSendOtp={handleSendOtp}
                handleVerifyOtp={handleVerifyOtp}
                handleResendOtp={handleResendOtp}
                handleSetNewMpin={handleSetNewMpin}
                setForgotMode={setForgotMode}
                handleDigitChange={handleDigitChange}
              />
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
