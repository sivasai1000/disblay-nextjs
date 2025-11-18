// components/signup/SignupStep1.js
"use client";

import Link from "next/link";
import "@/css/businesscreditionals.css";

export default function SignupStep1({
  fullname,
  setFullname,
  username,
  setUsername,
  validateMobile,
  error,
  handleCreateAccount,
  signupLoading,
}) {
  return (
    <>
      <div
        className="form-wrapper text-center"
        style={{
          width: "100%",
          maxWidth: "420px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="creditionals-header mb-4">Sign up</div>

        {/* Full Name */}
        <div className="mb-3 w-100 text-start">
          <label className="form-label creditionals-text mb-2">Full Name</label>

          <input
            type="text"
            className="form-control creditionals-input mb-3"
            style={{
              width: "100%",         // ⚡ full width
              maxWidth: "420px",
            }}
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Enter your full name"
            onKeyDown={(e) => {
              if (e.key === "Enter")
                document.getElementById("signup-mobile")?.focus();
            }}
          />
        </div>

        {/* Mobile Number */}
        <label className="form-label creditionals-text mb-2 text-start w-100">
          Mobile Number
        </label>

        <div
          className="mb-2 w-100"
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: "420px",
            height: "52px",
            border: "1px solid #E2E4E9",
            borderRadius: "10px",
            padding: "0 8px",
            background: "#fff",
          }}
        >
          {/* Country code box */}
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
              style={{ width: "20px", height: "14px", borderRadius: "2px" }}
            />
            <span style={{ fontSize: "14px", fontWeight: "500" }}>+91</span>
          </div>

          {/* Number input */}
          <input
            id="signup-mobile"
            type="tel"
            className="creditionals-input"
            value={username}
            placeholder="Enter mobile number"
            maxLength={10}
            onChange={(e) =>
              setUsername(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            onBlur={validateMobile}
            onKeyDown={(e) => e.key === "Enter" && handleCreateAccount()}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "14px",
              padding: "0 10px",
              background: "transparent",
            }}
          />
        </div>

        {error && <p className="text-danger small mb-2">{error}</p>}

        {/* Terms */}
        <div className="form-check mb-4 mt-3 text-start w-100">
          <input type="checkbox" className="form-check-input" id="termsCheck" />
          <label
            className="form-check-label creditionals-agree"
            htmlFor="termsCheck"
          >
            I agree to Display’s{" "}
            <Link href="/" className="creditionals-terms">
              Terms & Conditions and policies
            </Link>
          </label>
        </div>

        {/* Button */}
        <button
          className="creditional-accountcreate w-100 mb-4"
          style={{
            height: "54px",
            maxWidth: "420px",
            borderRadius: "12px",
          }}
          onClick={handleCreateAccount}
          disabled={signupLoading}
        >
          <span className="creditionals-btntext">
            {signupLoading ? "Creating..." : "Create account"}
          </span>
        </button>
      </div>
    </>
  );
}
