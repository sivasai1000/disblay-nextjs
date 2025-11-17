"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import "@/css/LandingPage.css"
import { useRouter } from "next/navigation";


// API HOOK
import { useSendSubscriptionRequest } from "@/components/BusinessApi/page";
import Link from "next/link";

export default function Page() {
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
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg landing-navbar">
  <div className="container d-flex text-start justify-content-between">

    <Link className="navbar-brand d-flex align-items-center">
      <img
        src={logo}
        alt="logo"
        className="landing-logo me-2"

      />
    </Link>

    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#landingNav"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    {/* ADD ID HERE */}
    <div className="collapse navbar-collapse" id="landingNav">
      <div className="d-flex ms-auto align-items-center">
        <button
          className="btn landing-btn-outlines px-4 me-3"
          onClick={() => router.push("/getenroll")}
        >
          <div style={{ color: "#505050", fontSize: "16px", fontWeight: "600" }}>
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


      <div className="terms-container">
        {/* Header */}
        <div className="terms-header text-center" style={{ marginTop: "70px" }}>
          <h6 className="terms-title">Dislpay Legal</h6>
          <h2 className="terms-heading">Cookies Policy</h2>
          <p className="terms-updated">Last Updated: SEP 29, 2025</p>
        </div>

        {/* Body */}
        <div
          className="terms-body-section"
          style={{ marginTop: "70px", marginBottom: "100px" }}
        >
          <div className="terms-section">
            <h4 className="terms-subheading">What Are Cookies</h4>
            <p>
              Cookies are small text files stored on your device to improve
              your browsing experience.
            </p>
          </div>

          <div className="terms-section">
            <h4 className="terms-subheading">How We Use Cookies</h4>
            <ul>
              <li>
                <strong>Essential Cookies:</strong> To enable login, security,
                and account features.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> To understand usage and
                improve services.
              </li>
              <li>
                <strong>Functional Cookies:</strong> To remember preferences.
              </li>
              <li>
                <strong>Advertising Cookies:</strong> (if used) to personalize
                ads.
              </li>
            </ul>
          </div>

          <div className="terms-section">
            <h4 className="terms-subheading">Managing Cookies</h4>
            <p>
              You can disable cookies via your browser settings, but this may
              impact functionality of the Platform.
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
          {/* Close Button */}
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
            <video
              width="100%"
              height="100%"
              controls
              autoPlay
              style={{ borderRadius: "12px" }}
            >
              <source src={howItWorksVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer-section py-5">
        <div className="container">
          {/* Logo + Socials */}
          <div className="row align-items-center mb-4">
            <div className="col-md-6">
              <img
                src={dlogo}
                className="footer-logo"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/");
                }}
              />
            </div>

            <div className="col-md-6 text-md-end text-start footer-social">
              <Link
                href="https://youtube.com/@getdisblay"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={youtubeIcon} style={{ cursor: "pointer" }} />
              </Link>

              <Link
                href="https://www.linkedin.com/company/getdisblay"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={linkedinIcon} style={{ cursor: "pointer" }} />
              </Link>

              <Link
                href="https://x.com/getdisblay"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={xIcon} style={{ cursor: "pointer" }} />
              </Link>

              <Link
                href="https://www.facebook.com/getdisblay"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={facebookIcon} style={{ cursor: "pointer" }} />
              </Link>
            </div>
          </div>

          {/* Contact + Links + Newsletter */}
          <div
            className="row align-items-start mb-4"
            style={{ marginTop: "50px" }}
          >
            {/* Contact */}
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="footer-heading mb-4">Contact</div>
              <p className="footer-text">+91 90988 00000</p>
              <p className="footer-text">disblay@gmail.com</p>
              <p className="footer-text">Hyderabad, India</p>
            </div>

            {/* Links */}
            <div className="col-md-4 mb-4 mb-md-0">
              <div
                className="footer-heading mb-3"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  router.push("/terms-and-condition");
                }}
              >
                Terms & Conditions
              </div>

              <div
                className="footer-heading mb-3"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  router.push("/privacy-policy");
                }}
              >
                Privacy Policy
              </div>

              <div
                className="footer-heading mb-3"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  router.push("/refund-policy");
                }}
              >
                Refund Policy
              </div>

              <div
                className="footer-heading mb-3"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  router.push("/CookiesPolicy");
                }}
              >
                Cookies Policy
              </div>
            </div>

            {/* Newsletter */}
            <div className="col-md-4">
              <div className="footer-heading mb-4">Stay in the Loop</div>
              <p className="footer-text">
                Get the latest features, updates, and tips straight to your
                inbox.
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

          {/* Copyright */}
          <p className="text-center mt-3 mb-0">
            Copyright © 2025 Disblay. All rights reserved.
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
