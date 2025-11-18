// components/signup/SignupStep2.js
"use client";

import DigitBoxes from "./DigitBoxes";

export default function SignupStep2({
  username,
  otp,
  setOtp,
  handleDigitChange,
  handleVerifyOtp,
  otpLoading,
}) {
  return (
    <>
      <div className="creditionals-header mb-3">OTP Verification</div>

      <div className="creditionals-otptext mb-4">
        Please enter verification code sent to{" "}
        <span className="creditionals-otptext1">+91 {username}</span>
      </div>

      <DigitBoxes
        label="Enter OTP"
        arr={otp}
        setter={setOtp}
        prefix="otp"
        handleDigitChange={handleDigitChange}
        handleSubmit={handleVerifyOtp}
      />

      <button
        className="creditional-accountcreate w-100 mb-4"
        style={{ height: "54px" }}
        onClick={handleVerifyOtp}
        disabled={otpLoading}
      >
        <span className="creditionals-btntext">
          {otpLoading ? "Verifying..." : "Verify number"}
        </span>
      </button>
    </>
  );
}
