"use client";

import React, { useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

import "@/css/businesscreditionals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { useSignup, useVerifyOtp, useCreateMpin } from "@/components/BusinessApi/page";

import SignupStep1 from "./SignupStep1";
import SignupStep2 from "./SignupStep2";
import SignupStep3 from "./SignupStep3";

export default function SignupContainer() {
  const router = useRouter();
  const creditionalsimg = "/assets/img/creditionals.png";

  // STATES
  const [step, setStep] = useState("signup");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [mpin, setMpin] = useState(["", "", "", ""]);
  const [confirmMpin, setConfirmMpin] = useState(["", "", "", ""]);

  // API HOOKS
  const signup = useSignup();
  const otpVerify = useVerifyOtp();
  const mpinCreate = useCreateMpin();

  const validateMobile = () => {
    if (username.length !== 10) {
      setError("Mobile number must be exactly 10 digits.");
      return false;
    }
    setError("");
    return true;
  };

  const handleCreateAccount = () => {
    if (!fullname.trim()) {
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

  const handleDigitChange = (value, index, setter, arr, prefix) => {
    if (!/^\d*$/.test(value)) return;

    const newArr = [...arr];
    newArr[index] = value.slice(-1);
    setter(newArr);

    if (value && index < arr.length - 1) {
      document.getElementById(`${prefix}-${index + 1}`)?.focus();
    } else if (!value && index > 0) {
      document.getElementById(`${prefix}-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const entered = otp.join("");

    if (entered.length !== 4) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete OTP",
        text: "Please enter all 4 digits",
      });
      return;
    }

    otpVerify.mutate(
      { username, otp: entered },
      {
        onSuccess: (res) => {
          if (res.status === "success") {
            Swal.fire({
              icon: "success",
              title: "OTP Verified!",
              timer: 800,
              showConfirmButton: false,
            }).then(() => setStep("mpin"));
          } else {
            Swal.fire({
              icon: "error",
              title: "Invalid OTP",
              text: res.msg || "Try again",
            });
          }
        },
        onError: () =>
          Swal.fire({
            icon: "error",
            title: "Network Error",
            text: "Please try again later",
          }),
      }
    );
  };

  const handleSubmitMpin = () => {
    const entered = mpin.join("");
    const confirmed = confirmMpin.join("");

    if (entered.length !== 4 || confirmed.length !== 4) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete M-PIN",
        text: "Please enter all 4 digits",
      });
      return;
    }

    if (entered !== confirmed) {
      Swal.fire({
        icon: "error",
        title: "M-PIN Mismatch",
        text: "Both pins must match",
      });
      return;
    }

    mpinCreate.mutate(
      { username, new_mpin: entered },
      {
        onSuccess: (res) => {
          if (res.status === "success") {
            sessionStorage.setItem("signupMobile", username);
            Swal.fire({
              icon: "success",
              title: "M-PIN Created",
              confirmButtonText: "Continue",
            }).then(() => router.push("/Login"));
          } else {
            Swal.fire({
              icon: "error",
              title: "Failed",
              text: res.msg || "Try again",
            });
          }
        },
        onError: () =>
          Swal.fire({
            icon: "error",
            title: "Network Error",
            text: "Try again later",
          }),
      }
    );
  };

  return (
    <div className="auth-container">
      
      {/* REMOVE row and Bootstrap grid */}
      <div className="auth-card">

        {/* LEFT IMAGE */}
        <div className="left-image" style={{ position: "relative" }}>
          <Image
            src={creditionalsimg}
            alt="credentials"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="form-wrapper text-center">
            
            {step === "signup" && (
              <SignupStep1
                fullname={fullname}
                setFullname={setFullname}
                username={username}
                setUsername={setUsername}
                validateMobile={validateMobile}
                error={error}
                handleCreateAccount={handleCreateAccount}
                signupLoading={signup.isLoading}
              />
            )}

            {step === "otp" && (
              <SignupStep2
                username={username}
                otp={otp}
                setOtp={setOtp}
                handleDigitChange={handleDigitChange}
                handleVerifyOtp={handleVerifyOtp}
                otpLoading={otpVerify.isLoading}
              />
            )}

            {step === "mpin" && (
              <SignupStep3
                mpin={mpin}
                setMpin={setMpin}
                confirmMpin={confirmMpin}
                setConfirmMpin={setConfirmMpin}
                handleDigitChange={handleDigitChange}
                handleSubmitMpin={handleSubmitMpin}
                mpinLoading={mpinCreate.isLoading}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
