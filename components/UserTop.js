"use client";

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";
import { useRouter } from "next/navigation";
import "@/css/usertop.css";
import { checkUserMobile, registerUser, loginUser } from "@/components/userapi";

import LoginModal from "./LoginModal";
import Swal from "sweetalert2";

const UserTop = ({ business, cartCount }) => {
  const disblay = "/assets/img/userdisblaylogo.svg";
  const search = "/assets/img/search.svg";
  const usermenu = "/assets/img/usermenu.svg";
  const cart = "/assets/img/cart.svg";
  const userowner = "/assets/img/userowner.svg";
  const userhelp = "/assets/img/userhelp.svg";
  const userpay = "/assets/img/userpay.svg";
  const userterms = "/assets/img/userterms.svg";
  const userdelivery = "/assets/img/userdelivery.svg";
  const modalclose = "/assets/img/modalclose.svg";
  const defaultProfile = "/assets/img/defaultprofile.svg";

  const router = useRouter();

  const [showMenu, setShowMenu] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [loginStep, setLoginStep] = useState("mobile");

  const [mobileNumber, setMobileNumber] = useState("");
  const [name, setName] = useState("");
  const [mpin, setMpin] = useState("");

  // ⭐ Local state to store user
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  // ⭐ Load user during client-side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      const id = localStorage.getItem("user_id");

      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      }

      setUserId(id || null);
    }
  }, []);

  const profileImage = business?.business_user_photo
    ? `${process.env.NEXT_PUBLIC_API_URL}/${business.business_user_photo}`
    : defaultProfile;

  const isSuccess = (res) => {
    if (!res) return false;
    if (res.success === true) return true;
    if (typeof res.status === "string" && res.status.toLowerCase() === "success")
      return true;
    if (Number(res.statusCode) === 200) return true;
    return false;
  };

  // ----------------------------------------------------------
  // MOBILE CHECK
  // ----------------------------------------------------------
  const handleCheckMobile = async () => {
    try {
      const res = await checkUserMobile({ username: mobileNumber });
      const responseValue = res?.response ?? res?.resp ?? res;
      if (Number(responseValue) === 1) {
        setLoginStep("register");
      } else {
        setLoginStep("login");
      }
    } catch (err) {
      console.error("Mobile check failed:", err);
      setLoginStep("login");
    }
  };

  // ----------------------------------------------------------
  // REGISTER
  // ----------------------------------------------------------
  const handleRegister = async () => {
    try {
      const res = await registerUser({
        fullname: name,
        username: mobileNumber,
      });

      if (isSuccess(res)) {
        setLoginStep("otp");

        await Swal.fire({
          icon: "success",
          title: "OTP Sent",
          text: "Please enter the OTP to continue.",
          timer: 1400,
          showConfirmButton: false,
        });
      } else {
        const msg = res?.message || res?.msg || "Registration failed";
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: msg,
        });
      }
    } catch (err) {
      console.error("Register failed:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Registration failed. Please try again.",
      });
    }
  };

  // ----------------------------------------------------------
  // LOGIN
  // ----------------------------------------------------------
  const handleLogin = async () => {
    try {
      const res = await loginUser({ username: mobileNumber, password: mpin });

      if (isSuccess(res)) {
        const userData = res?.response ?? res?.data ?? res;

        try {
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("businessId", userData.id);
          localStorage.setItem("user_id", userData.user_id);

          setUser(userData);

          setUserId(userData.user_id);

          window.dispatchEvent(new Event("userUpdated"));
        } catch (e) {
          console.warn("Could not save user to localStorage", e);
        }

        await Swal.fire({
          icon: "success",
          title: "Login Successful",
          timer: 1500,
          showConfirmButton: false,
        });

        setMobileNumber("");
        setMpin("");
        setName("");
        setActiveModal(null);
        setLoginStep("mobile");
      } else {
        const errMsg = res?.message || res?.msg || "Invalid credentials";

        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: errMsg,
        });
      }
    } catch (err) {
      console.error("Login failed:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Login failed. Please try again.",
      });
    }
  };

  // ----------------------------------------------------------
  // OPEN LOGIN FROM ANYWHERE
  // ----------------------------------------------------------
  useEffect(() => {
    const openLoginModal = () => {
      setActiveModal("login");
      setLoginStep("mobile");
    };

    window.addEventListener("openLoginModal", openLoginModal);
    return () => window.removeEventListener("openLoginModal", openLoginModal);
  }, []);

  const handleOpenModal = (name) => {
    setActiveModal(name);
    setShowMenu(false);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setLoginStep("mobile");
  };

  // ----------------------------------------------------------
  // UI COMPONENT
  // ----------------------------------------------------------
  return (
    <header
      className="header border-bottom py-2 px-2"
      style={{
        height: "74px",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 1050,
      }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* Logo */}
        <div className="header-logo">
          <img src={disblay} alt="disblay logo" height="28" />
        </div>

        {/* Right Section */}
        <div className="header-right d-flex align-items-center">
          {/* Search */}
          <div className="header-search">
            <div className="input-group search-box">
              <span className="input-group-text border-0 bg-transparent">
                <img src={search} alt="search" height="16" />
              </span>
              <input
                type="text"
                className="form-control border-0 search-input"
                placeholder="Search in Lemonade store"
              />
            </div>
          </div>

          {/* Cart */}
          <button
            className="cart-btn btn d-flex align-items-center justify-content-center"
            onClick={() => router.push("/cart")}
            style={{
              background:
                (cartCount || 0) === 0
                  ? "#D0D4DC"
                  : "linear-gradient(180deg, #41BD90 0%, #27A376 100%)",
            }}
          >
            <img src={cart} alt="cart" width={38} height={38} className="me-2" />
            <span className="cart-count">({cartCount || 0})</span>
          </button>

          {/* Logged in user */}
          {userId ? (
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "80px",
                backgroundColor: "#34495E1A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: "800",
                color: "#34495E",
                marginRight: "12px",
                cursor: "pointer",
              }}
              onClick={() => router.push("/userprofile")}
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          ) : (
            <span
              className="login-text"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setActiveModal("login");
                setLoginStep("mobile");
              }}
            >
              Login
            </span>
          )}

          {/* Menu Button */}
          <div className="position-relative">
            <button
              className="menu-btn border-0 p-0"
              style={{ background: "#fff" }}
              onClick={() => setShowMenu(!showMenu)}
            >
              <img src={usermenu} alt="menu" height={32} width={32} />
            </button>

            {/* DROPDOWN MENU */}
            {showMenu && (
              <>
                <div
                  className="menu-overlay"
                  onClick={() => setShowMenu(false)}
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "#020D1730",
                    zIndex: 999,
                  }}
                ></div>

                <div
                  className="usermenu-card position-absolute end-0 mt-2 p-4"
                  style={{
                    background: "#fff",
                    zIndex: 1000,
                  }}
                >
                  <div
                    className="usermenu-item d-flex align-items-center mb-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleOpenModal("owner")}
                  >
                    <img src={userowner} width={28} height={28} className="me-3" />
                    <span className="usertop-owner">Owner Info</span>
                  </div>

                  <div
                    className="usermenu-item d-flex align-items-center mb-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleOpenModal("payment")}
                  >
                    <img src={userpay} width={28} height={28} className="me-3" />
                    <span className="usertop-owner">Payment Options</span>
                  </div>

                  <div
                    className="usermenu-item d-flex align-items-center mb-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleOpenModal("delivery")}
                  >
                    <img src={userdelivery} width={28} height={28} className="me-3" />
                    <span className="usertop-owner">Delivery Handlings</span>
                  </div>

                  <div
                    className="usermenu-item d-flex align-items-center mb-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleOpenModal("terms")}
                  >
                    <img src={userterms} width={28} height={28} className="me-3" />
                    <span className="usertop-owner">Terms & Conditions</span>
                  </div>

                  <div
                    className="usermenu-item d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleOpenModal("help")}
                  >
                    <img src={userhelp} width={28} height={28} className="me-3" />
                    <span className="usertop-owner">Help</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* ALL MODALS (OWNER / PAYMENTS / DELIVERY / TERMS / HELP / LOGIN) */}
      {/* ------------------------------------------------------------------- */}

      <Modal show={activeModal === "owner"} onHide={handleCloseModal} centered>
        <Modal.Header className="border-0">
          <Modal.Title>Owner Information</Modal.Title>
          <img
            src={modalclose}
            width={32}
            height={32}
            style={{ cursor: "pointer" }}
            onClick={handleCloseModal}
          />
        </Modal.Header>

        <Modal.Body>
          <div className="text-center mb-4">
            <img
              src={profileImage}
              alt="Owner"
              style={{ width: 100, height: 100, borderRadius: "80px", objectFit: "cover" }}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Name</label>
              <input type="text" className="form-control" value={business?.business_user_name || ""} disabled />
            </div>

            <div className="col-md-6 mb-3">
              <label>Phone</label>
              <input type="text" className="form-control" value={business?.business_mobile || ""} disabled />
            </div>
          </div>

          <div className="mb-2">
            <label>Email</label>
            <input type="email" className="form-control" value={business?.business_email || ""} disabled />
          </div>
        </Modal.Body>
      </Modal>

      {/* Payment Modal */}
      <Modal show={activeModal === "payment"} onHide={handleCloseModal} centered>
        <Modal.Header className="border-0">
          <Modal.Title>Payment Options</Modal.Title>
          <img
            src={modalclose}
            width={32}
            height={32}
            style={{ cursor: "pointer" }}
            onClick={handleCloseModal}
          />
        </Modal.Header>

        <Modal.Body>
          <label>UPI ID</label>
          <input
            type="text"
            className="form-control mb-4"
            value={business?.payment_upi_id || "Not Available"}
            disabled
          />

          {business?.payment_type?.toLowerCase()?.includes("cod") && (
            <p>✓ Cash on Delivery</p>
          )}

          {business?.payment_type?.toLowerCase()?.includes("online") && (
            <p>✓ Online Payments</p>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={activeModal === "delivery"} onHide={handleCloseModal} centered>
        <Modal.Header className="border-0">
          <Modal.Title>Delivery Options</Modal.Title>
          <img
            src={modalclose}
            width={32}
            height={32}
            style={{ cursor: "pointer" }}
            onClick={handleCloseModal}
          />
        </Modal.Header>

        <Modal.Body>
          {business?.delivery_type ? (
            <p>{business.delivery_type}</p>
          ) : (
            <p>No delivery options available</p>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={activeModal === "terms"} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Terms & Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>By using our service, you agree to the standard terms.</p>
        </Modal.Body>
      </Modal>

      <Modal show={activeModal === "help"} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Help</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>If you need assistance, contact support.</p>
        </Modal.Body>
      </Modal>

      <LoginModal
        activeModal={activeModal}
        handleCloseModal={handleCloseModal}
        loginStep={loginStep}
        setLoginStep={setLoginStep}
        mobileNumber={mobileNumber}
        setMobileNumber={setMobileNumber}
        name={name}
        setName={setName}
        mpin={mpin}
        setMpin={setMpin}
        handleCheckMobile={handleCheckMobile}
        handleRegister={handleRegister}
        handleLogin={handleLogin}
      />
    </header>
  );
};

export default UserTop;
