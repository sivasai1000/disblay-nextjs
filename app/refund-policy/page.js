"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import "@/css/LandingPage.css"; // adjust path if needed
import { useRouter } from "next/navigation";

// PUBLIC IMAGES
const phoneImage = "/assets/img/disblayhome.png";
const logo = "/assets/img/disblaylogo.svg";
const frame1 = "/assets/img/frame1.svg";
const frame2 = "/assets/img/frame2.svg";
const frame3 = "/assets/img/frame3.svg";
const frame4 = "/assets/img/frame4.svg";
const frame5 = "/assets/img/frame5.svg";
const frame6 = "/assets/img/frame6.svg";
const frame7 = "/assets/img/frame7.svg";
const frame8 = "/assets/img/frame8.svg";
const keyIcon = "/assets/img/key2.svg";
const cup = "/assets/img/cup.svg";
const plusIcon = "/assets/img/plusIcon.svg";
const minusIcon = "/assets/img/minusIcon.svg";
const youtubeIcon = "/assets/img/dyoutube.svg";
const linkedinIcon = "/assets/img/dlinkedin.svg";
const xIcon = "/assets/img/dtwitter.svg";
const facebookIcon = "/assets/img/dfacebook.svg";
const dlogo = "/assets/img/disblaylogo.svg";

// VIDEO
const howItWorksVideo = "/assets/video/howitworks.mp4";

// API HOOK
import { useSendSubscriptionRequest } from "@/components/BusinessApi/page";
import Link from "next/link";

export default function RefundPolicy() {
  const router = useRouter();
  const [showVideo, setShowVideo] = useState(false);
  const [email, setEmail] = useState("");

  const { mutate: subscribe, isPending } = useSendSubscriptionRequest();

  const handleSubscribe = () => {
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email before subscribing.",
      });
      return;
    }

    subscribe(
      { newsletter_email: email },
      {
        onSuccess: (data) => {
          if (data?.status === "success") {
            Swal.fire({
              icon: "success",
              title: "Subscribed!",
              text: "Thank you for subscribing!",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Subscription Failed",
              text: data?.msg || "Please try again.",
            });
          }
          setEmail("");
        },
        onError: () => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something went wrong. Please try again later.",
          });
        },
      }
    );
  };

  return (
    <div className="landing-page">

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg landing-navbar">
        <div className="container d-flex text-start justify-content-between">
          {/* Left: Logo */}
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <img
              src={logo}
              alt="logo"
              className="landing-logo me-2"
              
            />
          </Link>

          {/* Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#landingNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Center + Right */}
          <div className="collapse navbar-collapse" id="landingNav">
            <div className="d-flex ms-auto align-items-center">
              <button
                className="btn landing-btn-outlines px-4 me-3"
                onClick={() => router.push("/getenroll")}
              >
                <div
                  style={{
                    color: "#505050",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  Create Business For Others
                </div>
              </button>

              <button
                className="btn landing-btn-watch px-4"
                onClick={() => setShowVideo(true)}
              >
                Watch How it Works
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <div className="terms-container">
        <div className="terms-header text-center" style={{ marginTop: "70px" }}>
          <h6 className="terms-title">Dislpay Legal</h6>
          <h2 className="terms-heading">Refund Policy</h2>
          <p className="terms-updated">Last Updated: SEP 29, 2025</p>
        </div>

        {/* CONTENT */}
        <div
          className="terms-body-section"
          style={{ marginTop: "70px", marginBottom: "100px" }}
        >
          <div className="terms-section">
            <h4 className="terms-subheading">General Policy</h4>
            <p>
              Subscription fees are non-refundable once services are activated.
              Certain exceptions apply (see below).
            </p>
          </div>

          <div className="terms-section">
            <h4 className="terms-subheading">Eligible Refunds</h4>
            <div className="mt-3 refunds-name">
              Refunds may be approved only in cases of:
            </div>

            <ul className="ms-3 mt-2">
              <li>Duplicate charges due to a payment error.</li>
              <li>Technical issues preventing access to the service, unresolved within 7 days.</li>
              <li>Cancellation during a trial period (if applicable).</li>
            </ul>
          </div>

          <div className="terms-section">
            <h4 className="terms-subheading">Refund Process</h4>
            <p>
              Submit a refund request to <strong>legal@topiko.com</strong> with
              payment details. Refund requests must be made within 7 days of
              payment. Approved refunds will be credited within 7–10 business
              days via the original payment method.
            </p>
          </div>
        </div>
      </div>

      {/* VIDEO POPUP */}
      {showVideo && (
        <div
          onClick={() => setShowVideo(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <button
            onClick={() => setShowVideo(false)}
            style={{
              position: "absolute",
              top: "40px",
              right: "60px",
              background: "transparent",
              color: "#fff",
              border: "none",
              fontSize: "36px",
              cursor: "pointer",
              zIndex: 2100,
            }}
          >
            ×
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "80%",
              maxWidth: "800px",
              aspectRatio: "16 / 9",
              backgroundColor: "#000",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <video width="100%" height="100%" controls autoPlay>
              <source src={howItWorksVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer-section py-5">
        <div className="container">

          {/* Top Row */}
          <div className="row align-items-center mb-4">
            <div className="col-md-6">
              <img
                src={dlogo}
                className="footer-logo"
                onClick={() => router.push("/")}
              />
            </div>

            <div className="col-md-6 text-md-end text-start footer-social">
              <Link href="https://youtube.com/@getdisblay" target="_blank">
                <img src={youtubeIcon} style={{ cursor: "pointer" }} />
              </Link>
              <Link href="https://www.linkedin.com/company/getdisblay" target="_blank">
                <img src={linkedinIcon} style={{ cursor: "pointer" }} />
              </Link>
              <Link href="https://x.com/getdisblay" target="_blank">
                <img src={xIcon} style={{ cursor: "pointer" }} />
              </Link>
              <Link href="https://www.facebook.com/getdisblay" target="_blank">
                <img src={facebookIcon} style={{ cursor: "pointer" }} />
              </Link>
            </div>
          </div>

          {/* Middle Row */}
          <div className="row align-items-start mb-4" style={{ marginTop: "50px" }}>
            <div className="col-md-4">
              <div className="footer-heading mb-4">Contact</div>
              <p className="footer-text">+91 90988 00000</p>
              <p className="footer-text">disblay@gmail.com</p>
              <p className="footer-text">Hyderabad, India</p>
            </div>

            <div className="col-md-4">
              <div
                className="footer-heading mb-3"
                style={{ cursor: "pointer" }}
                onClick={() => router.push("/terms-and-condition")}
              >
                Terms & Conditions
              </div>
              <div
                className="footer-heading mb-3"
                style={{ cursor: "pointer" }}
                onClick={() => router.push("/privacy-policy")}
              >
                Privacy Policy
              </div>
              <div
                className="footer-heading mb-3"
                style={{ cursor: "pointer" }}
                onClick={() => router.push("/refund-policy")}
              >
                Refund Policy
              </div>
              <div
                className="footer-heading mb-3"
                style={{ cursor: "pointer" }}
                onClick={() => router.push("/CookiesPolicy")}
              >
                Cookies Policy
              </div>
            </div>

            <div className="col-md-4">
              <div className="footer-heading mb-4">Stay in the Loop</div>
              <p className="footer-text">
                Get the latest features, updates, and tips straight to your inbox.
              </p>

              <div className="footer-subscribe">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="subscribe-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                />
                <button
                  className="subscribe-btn"
                  onClick={handleSubscribe}
                  disabled={isPending}
                >
                  {isPending ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
            </div>
          </div>

          {/* Watermark */}
          <div className="footer-watermark text-center">
            <h1>disblay</h1>
          </div>

          <p className="text-center mt-3 mb-0">
            Copyright © 2025 Disblay.
            <br />
            <span style={{ color: "#999", fontSize: "12px" }}>
              A product of Topiko Business Solutions Pvt Ltd
            </span>
          </p>
        </div>
      </footer>

    </div>
  );
}
