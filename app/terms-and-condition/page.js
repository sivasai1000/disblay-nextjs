"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import "@/css/LandingPage.css"; // update path if needed
import { useRouter } from "next/navigation";

// PUBLIC IMAGE PATHS
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

const howItWorksVideo = "/assets/video/howitworks.mp4";

// API HOOK
import { useSendSubscriptionRequest } from "@/components/BusinessApi/page";
import Link from "next/link";

export default function TermsandCondition() {
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

          <Link href="/" className="navbar-brand d-flex align-items-center">
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

      {/* TERMS MAIN CONTENT */}
      <div className="terms-container py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="terms-title">Disblay Legal</h2>
            <h1 className="terms-heading">Terms & Conditions</h1>
            <p className="terms-updated">Last Updated: SEP 29, 2025</p>
          </div>

          <div
            className="terms-body-section"
            style={{ marginTop: "70px", marginBottom: "100px" }}
          >
            <section className="terms-section mt-4">
              <h3 className="terms-subheading">Acceptance of Terms</h3>
              <p>
                By accessing or using Disblay (“the Platform”), you agree to
                these Terms & Conditions. If you do not agree, please stop using
                the Platform immediately.
              </p>
            </section>

            <section className="terms-section">
              <h3 className="terms-subheading">Eligibility</h3>
              <p>
                You must be 18 years or older to use the Platform, or have
                parental/guardian consent. By registering, you confirm that the
                information you provide is accurate and complete.
              </p>
            </section>

            <section className="terms-section">
              <h3 className="terms-subheading">User Responsibilities</h3>
              <p>
                You are responsible for maintaining the confidentiality of your
                account and password. You agree to use the Platform only for
                lawful purposes. You must not:
              </p>
              <ul>
                <li>
                  Upload or share illegal, fraudulent, defamatory, or harmful
                  content.
                </li>
                <li>
                  Attempt to reverse-engineer, hack, or disrupt the Platform.
                </li>
                <li>
                  Use the Platform to impersonate others or misrepresent your
                  identity.
                </li>
              </ul>
            </section>

            <section className="terms-section">
              <h3 className="terms-subheading">Intellectual Property</h3>
              <p>
                All software, logos, trademarks, and content on Disblay are the
                property of Topiko Business Solutions Pvt. Ltd. You may not
                copy, modify, distribute, or reuse these assets without prior
                written consent.
              </p>
            </section>

            <section className="terms-section">
              <h3 className="terms-subheading">Service Availability</h3>
              <p>
                We strive to keep the Platform available at all times, but we do
                not guarantee uninterrupted or error-free service. Planned
                maintenance or unforeseen downtime may affect availability.
              </p>
            </section>

            <section className="terms-section">
              <h3 className="terms-subheading">Payment & Subscription</h3>
              <p>
                Pricing and subscription fees are displayed on the Platform. By
                purchasing a plan, you agree to our Refund Policy.
              </p>
            </section>

            <section className="terms-section">
              <h3 className="terms-subheading">Limitation of Liability</h3>
              <p>
                Disblay’s provision of use is “as is”. We are not responsible
                for business losses, missed opportunities, or damages resulting
                from use of the Platform.
              </p>
            </section>

            <section className="terms-section">
              <h3 className="terms-subheading">Governing Law</h3>
              <p>
                These Terms shall be governed by the laws of India, with
                exclusive jurisdiction in the courts of Hyderabad.
              </p>
            </section>
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
              aspectRatio: "16/9",
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
                <img src={youtubeIcon} />
              </Link>
              <Link href="https://www.linkedin.com/company/getdisblay" target="_blank">
                <img src={linkedinIcon} />
              </Link>
              <Link href="https://x.com/getdisblay" target="_blank">
                <img src={xIcon} />
              </Link>
              <Link href="https://www.facebook.com/getdisblay" target="_blank">
                <img src={facebookIcon} />
              </Link>
            </div>
          </div>

          <div
            className="row align-items-start mb-4"
            style={{ marginTop: "50px" }}
          >
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
