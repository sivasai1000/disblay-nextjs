"use client"
import React, { useState, useRef } from "react"; // ✅ add useRef

import Swal from "sweetalert2";

import { Modal } from "react-bootstrap";
import { verifyOtp, resendOtp, createMpin,forgotPasswordSendOtp, resetMpin } from "@/components/userapi";

const LoginModal = ({
  activeModal,
  handleCloseModal,
  loginStep,
  setLoginStep,
  mobileNumber,
  setMobileNumber,
  name,
  setName,
  mpin,
  setMpin,
  handleCheckMobile,
  handleRegister,
  handleLogin,
}) => {
    const modalclose = "/assets/img/modalclose.svg"
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [newMpin, setNewMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  // inside your LoginModal component
const inputRefs = useRef([]); // ✅ store refs for MPIN boxes
const [newMpinArr, setNewMpinArr] = useState(["", "", "", ""]);   // for Create MPIN
const [confirmMpinArr, setConfirmMpinArr] = useState(["", "", "", ""]); // for Confirm MPIN

const newMpinRefs = useRef([]);     
const confirmMpinRefs = useRef([]);
const otpRefs = useRef([]);

  // OTP input change
 const handleOtpChange = (value, index) => {
  if (/^\d?$/.test(value)) {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // 👉 Auto-focus next
    if (value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  }
};
const handleOtpKeyDown = (e, index) => {
  if (e.key === "Backspace" && !otp[index] && index > 0) {
    otpRefs.current[index - 1].focus();
  }
};

  // Verify OTP
const handleVerifyOtp = async () => {
  try {
    const res = await verifyOtp({
      username: mobileNumber,
      otp: otp.join(""),
    });

    if (
      res?.success === true ||
      (typeof res?.status === "string" && res.status.toLowerCase() === "success") ||
      Number(res?.statusCode) === 200
    ) {
      setOtpError("");
      setLoginStep("createMpin");
    } else {
      setOtpError(res?.msg || "Incorrect OTP");
    }
  } catch (err) {
    setOtpError("Something went wrong");
  }
};




const handleResendOtp = async () => {
  try {
    const res = await resendOtp({ username: mobileNumber });

    const isSuccess =
      res?.success === true ||
      (typeof res?.status === "string" && res.status.toLowerCase() === "success") ||
      Number(res?.statusCode) === 200;

    if (isSuccess) {
      setOtp(["", "", "", ""]);
      setOtpError("");

      await Swal.fire({
        icon: "success",
        title: "OTP Sent",
        text: res?.msg || "OTP resent successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      setOtpError(res?.msg || "Failed to resend OTP");

      await Swal.fire({
        icon: "error",
        title: "Failed",
        text: res?.msg || "Failed to resend OTP",
      });
    }
  } catch (err) {
    console.error("Resend OTP failed:", err);
    setOtpError("Something went wrong. Please try again.");

    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong. Please try again.",
    });
  }
};




const handleCreateMpin = async () => {
  if (newMpin !== confirmMpin) {
    await Swal.fire({
      icon: "error",
      title: "Mismatch",
      text: "MPINs do not match!",
    });
    return;
  }

  try {
    const res = await createMpin({
      username: mobileNumber,
      new_mpin: newMpin,
    });

    const isSuccess =
      res?.success === true ||
      (typeof res?.status === "string" && res.status.toLowerCase() === "success") ||
      Number(res?.statusCode) === 200;

    if (isSuccess) {
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: res?.msg || "MPIN created successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      // ✅ clear all fields
      setOtp(["", "", "", ""]);
      setOtpError("");
      setNewMpin("");
      setConfirmMpin("");
      setName("");
      setMpin("");

      setLoginStep("login");
    } else {
      await Swal.fire({
        icon: "error",
        title: "Failed",
        text: res?.msg || res?.message || "Failed to create MPIN",
      });
    }
  } catch (err) {
    console.error("Create MPIN failed:", err);

    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while creating MPIN",
    });
  }
};



  return (
    <Modal
      className="p-3"
      show={activeModal === "login"}
      onHide={handleCloseModal}
      centered
      dialogClassName="login-modal p-4"
    >
      <Modal.Header className="d-flex justify-content-between align-items-center border-0">
        <Modal.Title className="login-head mt-2">
          {loginStep === "mobile" && "Enter Mobile Number"}
          {loginStep === "register" && "Register"}
          {loginStep === "otp" && "OTP Verification"}
          {loginStep === "createMpin" && "Create MPIN"}
          {loginStep === "login" && "Login"}
          {loginStep === "forgotMobile" && "Forgot Password"}
{loginStep === "forgotOtp" && "OTP Verification"}
{loginStep === "resetMpin" && "Reset MPIN"}

        </Modal.Title>
        <img
          src={modalclose}
          alt="close"
          width={32}
          height={32}
          style={{ cursor: "pointer" }}
          onClick={handleCloseModal}
        />
      </Modal.Header>

      <Modal.Body>
      
        {loginStep === "mobile" && (
          <>
            <div className="mb-3">
              <label className="login-mobile mb-2">Mobile Number</label>
              <div className="d-flex align-items-center px-2 user-inputdetails">
                <div
                  className="d-flex align-items-center justify-content-center me-2"
                  style={{
                    width: "77px",
                    background: "#f4f4f4",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    height: "33px",
                  }}
                >
                  <img
                    src="https://flagcdn.com/w20/in.png"
                    alt="India flag"
                    style={{
                      width: "20px",
                      height: "14px",
                      marginRight: "4px",
                    }}
                  />
                  +91
                </div>
                <input
                  type="tel"
                  className="form-control border-0"
                  value={mobileNumber}
                maxLength={10}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  style={{
                    background: "transparent",
                    boxShadow: "none",
                  }}
                />
              </div>
            </div>
            <button
              className="login-continuebtn w-100 mt-4 mb-2"
              onClick={handleCheckMobile}
            >
              <div className="login-continuetext">Continue</div>
            </button>
          </>
        )}

        {loginStep === "register" && (
          <>
            <label className="login-mobile mb-2">Name</label>
            <input
              type="text"
              className="form-control mb-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="mb-3">
              <label className="login-mobile mb-2">Mobile Number</label>
              <div className="d-flex align-items-center px-2 user-inputdetails">
                <div
                  className="d-flex align-items-center justify-content-center me-2"
                  style={{
                    width: "77px",
                    background: "#f4f4f4",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    height: "33px",
                  }}
                >
                  <img
                    src="https://flagcdn.com/w20/in.png"
                    alt="India flag"
                    style={{
                      width: "20px",
                      height: "14px",
                      marginRight: "4px",
                    }}
                  />
                  +91
                </div>
                <input
                  type="text"
                  className="form-control border-0"
                  value={mobileNumber}
                 maxLength={10}
                  disabled
                  style={{
                    background: "transparent",
                    boxShadow: "none",
                  }}
                />
              </div>
            </div>
            <button
              className="login-continuebtn w-100 mt-4 mb-2"
              onClick={handleRegister}
            >
              <div className="login-continuetext">Register</div>
            </button>
          </>
        )}

  
        {loginStep === "otp" && (
          <>
            <p className="text-center mb-3">
              Please enter verification code we’ve sent on <br />
              <b>+91 {mobileNumber}</b>
            </p>
            <div className="d-flex justify-content-center mb-3">
             {otp.map((digit, index) => (
  <input
    key={index}
    type="text"
    maxLength="1"
    ref={(el) => (otpRefs.current[index] = el)}
    value={digit}
    onChange={(e) => handleOtpChange(e.target.value, index)}
    onKeyDown={(e) => handleOtpKeyDown(e, index)}
    className="form-control text-center mx-1"
    style={{
      width: "50px",
      height: "50px",
      fontSize: "20px",
      border: otpError ? "2px solid red" : "1px solid #ccc",
    }}
  />
))}

            </div>
            {otpError && <p className="text-danger text-center">{otpError}</p>}
            <p
              className="text-success text-center"
              style={{ cursor: "pointer" }}
              onClick={handleResendOtp}
            >
              Resend OTP
            </p>
            <button
              className="login-continuebtn w-100 mt-4 mb-2"
              onClick={handleVerifyOtp}
            >
              <div className="login-continuetext">Continue</div>
            </button>
          </>
        )}

  
       {loginStep === "createMpin" && (
  <>
    {/* Create MPIN */}
    <label className="login-mobile mb-2">Create MPIN</label>
    <div className="d-flex mb-3">
      {newMpinArr.map((digit, index) => (
        <input
          key={index}
          type="password"
          maxLength="1"
          ref={(el) => (newMpinRefs.current[index] = el)}
          value={digit}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d?$/.test(val)) {
              const updated = [...newMpinArr];
              updated[index] = val;
              setNewMpinArr(updated);
              setNewMpin(updated.join("")); // keep original string for API

              if (val && index < newMpinRefs.current.length - 1) {
                newMpinRefs.current[index + 1].focus();
              }
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !newMpinArr[index] && index > 0) {
              newMpinRefs.current[index - 1].focus();
            }
          }}
          className="form-control text-center mx-1"
          style={{ width: "50px", height: "50px", fontSize: "20px" }}
        />
      ))}
    </div>

    {/* Confirm MPIN */}
    <label className="login-mobile mb-2">Confirm MPIN</label>
    <div className="d-flex mb-3">
      {confirmMpinArr.map((digit, index) => (
        <input
          key={index}
          type="password"
          maxLength="1"
          ref={(el) => (confirmMpinRefs.current[index] = el)}
          value={digit}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d?$/.test(val)) {
              const updated = [...confirmMpinArr];
              updated[index] = val;
              setConfirmMpinArr(updated);
              setConfirmMpin(updated.join("")); // keep original string for API

              if (val && index < confirmMpinRefs.current.length - 1) {
                confirmMpinRefs.current[index + 1].focus();
              }
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !confirmMpinArr[index] && index > 0) {
              confirmMpinRefs.current[index - 1].focus();
            }
          }}
          className="form-control text-center mx-1"
          style={{ width: "50px", height: "50px", fontSize: "20px" }}
        />
      ))}
    </div>

    <button
      className="login-continuebtn w-100 mt-4 mb-2"
      onClick={handleCreateMpin}
    >
      <div className="login-continuetext">Save MPIN</div>
    </button>
  </>
)}

{loginStep === "login" && (
  <>
    <div className="mb-3">
      <label className="login-mobile mb-2">Mobile Number</label>
      <div className="d-flex align-items-center px-2 user-inputdetails">
        <div
          className="d-flex align-items-center justify-content-center me-2"
          style={{
            width: "77px",
            background: "#f4f4f4",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            height: "33px",
          }}
        >
          <img
            src="https://flagcdn.com/w20/in.png"
            alt="India flag"
            style={{
              width: "20px",
              height: "14px",
              marginRight: "4px",
            }}
          />
          +91
        </div>
        <input
          type="tel"
          className="form-control border-0"
          value={mobileNumber}
          maxLength={10}
          disabled
          style={{
            background: "transparent",
            boxShadow: "none",
          }}
        />
      </div>
    </div>

    <label className="login-mobile mb-2">Enter MPIN</label>
    <div className="d-flex mb-3">
      {Array(4) // 👈 change 4 → 6 if your MPIN is 6 digits
        .fill("")
        .map((_, index) => (
          <input
            key={index}
            type="password"
            maxLength="1"
            ref={(el) => (inputRefs.current[index] = el)}
            value={mpin[index] || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d?$/.test(val)) {
                const newMpin = mpin.split("");
                newMpin[index] = val;
                setMpin(newMpin.join(""));

                if (val && index < inputRefs.current.length - 1) {
                  inputRefs.current[index + 1].focus();
                }
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !mpin[index] && index > 0) {
                inputRefs.current[index - 1].focus();
              }
            }}
            className="form-control text-center mx-1"
            style={{
              width: "50px",
              height: "50px",
              fontSize: "20px",
            }}
          />
        ))}
    </div>

    {/* ✅ Make Forgot Password clickable */}
    <div
      className="mt-4"
      style={{ cursor: "pointer", color: "#007bff" }}
      onClick={() => setLoginStep("forgotMobile")}
    >
      Forgot Password
    </div>

    <button
      className="login-continuebtn w-100 mt-4 mb-2"
      onClick={handleLogin}
    >
      <div className="login-continuetext">Login</div>
    </button>
  </>
)}

{loginStep === "forgotMobile" && (
  <>
    <div className="mb-3">
      <label className="login-mobile mb-2">Mobile Number</label>
      <div className="d-flex align-items-center px-2 user-inputdetails">
        <div
          className="d-flex align-items-center justify-content-center me-2"
          style={{
            width: "77px",
            background: "#f4f4f4",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            height: "33px",
          }}
        >
          <img
            src="https://flagcdn.com/w20/in.png"
            alt="India flag"
            style={{
              width: "20px",
              height: "14px",
              marginRight: "4px",
            }}
          />
          +91
        </div>
        <input
          type="tel"
          className="form-control border-0"
          value={mobileNumber}
          maxLength={10}
          onChange={(e) => setMobileNumber(e.target.value)}
          style={{
            background: "transparent",
            boxShadow: "none",
          }}
        />
      </div>
    </div>
   

<button
  className="login-continuebtn w-100 mt-4 mb-2"
  onClick={async () => {
    try {
      const res = await forgotPasswordSendOtp({ username: mobileNumber });

      if (res?.status?.toLowerCase() === "success") {
        await Swal.fire({
          icon: "success",
          title: "OTP Sent!",
          text: res?.msg || "OTP has been sent to your mobile number.",
          timer: 1500,
          showConfirmButton: false,
        });

        setLoginStep("forgotOtp");
      } else {
        await Swal.fire({
          icon: "error",
          title: "Failed",
          text: res?.msg || "Failed to send OTP",
        });
      }
    } catch (err) {
      console.error("Forgot OTP error:", err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Network error. Please try again.",
      });
    }
  }}
>
  <div className="login-continuetext">Continue</div>
</button>

  </>
)}
{loginStep === "forgotOtp" && (
  <>
    <p className="text-center mb-3">
      Please enter OTP sent to <br />
      <b>+91 {mobileNumber}</b>
    </p>

    <div className="d-flex justify-content-center mb-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          ref={(el) => (otpRefs.current[index] = el)}
          value={digit}
          onChange={(e) => handleOtpChange(e.target.value, index)}
          onKeyDown={(e) => handleOtpKeyDown(e, index)}
          className="form-control text-center mx-1"
          style={{
            width: "50px",
            height: "50px",
            fontSize: "20px",
            border: otpError ? "2px solid red" : "1px solid #ccc",
          }}
        />
      ))}
    </div>

    {otpError && <p className="text-danger text-center">{otpError}</p>}

    <p
      className="text-success text-center"
      style={{ cursor: "pointer" }}
      onClick={handleResendOtp}
    >
      Resend OTP
    </p>

    <button
      className="login-continuebtn w-100 mt-4 mb-2"
      onClick={handleVerifyOtp}
    >
      <div className="login-continuetext">Continue</div>
    </button>
  </>
)}

{loginStep === "resetMpin" && (
  <>
    {/* Enter New MPIN */}
    <label className="login-mobile mb-2">Enter New MPIN</label>
    <div className="d-flex mb-3">
      {newMpinArr.map((digit, index) => (
        <input
          key={index}
          type="password"
          maxLength="1"
          ref={(el) => (newMpinRefs.current[index] = el)}
          value={digit}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d?$/.test(val)) {
              const updated = [...newMpinArr];
              updated[index] = val;
              setNewMpinArr(updated);
              setNewMpin(updated.join(""));
              if (val && index < newMpinRefs.current.length - 1) {
                newMpinRefs.current[index + 1].focus();
              }
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !newMpinArr[index] && index > 0) {
              newMpinRefs.current[index - 1].focus();
            }
          }}
          className="form-control text-center mx-1"
          style={{ width: "50px", height: "50px", fontSize: "20px" }}
        />
      ))}
    </div>

    {/* Confirm MPIN */}
    <label className="login-mobile mb-2">Confirm MPIN</label>
    <div className="d-flex mb-3">
      {confirmMpinArr.map((digit, index) => (
        <input
          key={index}
          type="password"
          maxLength="1"
          ref={(el) => (confirmMpinRefs.current[index] = el)}
          value={digit}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d?$/.test(val)) {
              const updated = [...confirmMpinArr];
              updated[index] = val;
              setConfirmMpinArr(updated);
              setConfirmMpin(updated.join(""));
              if (val && index < confirmMpinRefs.current.length - 1) {
                confirmMpinRefs.current[index + 1].focus();
              }
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !confirmMpinArr[index] && index > 0) {
              confirmMpinRefs.current[index - 1].focus();
            }
          }}
          className="form-control text-center mx-1"
          style={{ width: "50px", height: "50px", fontSize: "20px" }}
        />
      ))}
    </div>


<button
  className="login-continuebtn w-100 mt-4 mb-2"
  onClick={async () => {
    if (newMpin !== confirmMpin) {
      await Swal.fire({
        icon: "error",
        title: "MPIN Mismatch",
        text: "MPINs do not match!",
      });
      return;
    }

    try {
      const res = await resetMpin({
        username: mobileNumber,
        otp: otp.join(""),
        new_mpin: newMpin,
      });

      if (res?.status?.toLowerCase() === "success") {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "MPIN reset successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        // ✅ Clear fields
        setNewMpinArr(["", "", "", ""]);
        setConfirmMpinArr(["", "", "", ""]);
        setNewMpin("");
        setConfirmMpin("");
        setLoginStep("login");
      } else {
        await Swal.fire({
          icon: "error",
          title: "Failed",
          text: res?.msg || "Failed to reset MPIN",
        });
      }
    } catch (err) {
      console.error("Reset MPIN error:", err);
      await Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Something went wrong. Please try again.",
      });
    }
  }}
>
  <div className="login-continuetext">Save MPIN</div>
</button>

  </>
)}


      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
