"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import { useSendSubscriptionRequest } from "@/components/BusinessApi/page";

export default function Footer() {
  const dlogo = "/assets/img/disblaylogo.svg";
  const [email, setEmail] = useState("");

  const { mutate: subscribe, isPending } = useSendSubscriptionRequest();

  const handleSubscribe = () => {
    if (!email) {
      return Swal.fire({ icon: "warning", title: "Email Required" });
    }

    subscribe(
      { newsletter_email: email },
      {
        onSuccess: (data) => {
          Swal.fire({
            icon: data?.status === "success" ? "success" : "error",
            title: data?.msg || "Subscribed!",
          });
          setEmail("");
        },
      }
    );
  };

  return (
    <footer className="footer-section py-5">
      <div className="container">
        {/* Logo + Social */}
        <div className="row align-items-center mb-4">
          <div className="col-md-6">
            <Link href="/">
              <img src={dlogo} className="footer-logo" style={{ cursor: "pointer" }} />
            </Link>
          </div>

          <div className="col-md-6 text-md-end footer-social">
            {[
              { link: "https://youtube.com/@getdisblay", img: "/assets/img/dyoutube.svg" },
              { link: "https://www.linkedin.com/company/getdisblay", img: "/assets/img/dlinkedin.svg" },
              { link: "https://x.com/getdisblay", img: "/assets/img/dtwitter.svg" },
              { link: "https://facebook.com/getdisblay", img: "/assets/img/dfacebook.svg" },
            ].map((s, i) => (
              <Link key={i} href={s.link} target="_blank">
                <img src={s.img} />
              </Link>
            ))}
          </div>
        </div>

        {/* Contact + Links + Newsletter */}
        <div className="row align-items-start mb-4" style={{ marginTop: "50px" }}>
          {/* Contact */}
          <div className="col-md-4">
            <div className="footer-heading mb-4">Contact</div>
            <p className="footer-text">+91 90988 00000</p>
            <p className="footer-text">disblay@gmail.com</p>
            <p className="footer-text">Hyderabad, India</p>
          </div>

          {/* Links */}
          <div className="col-md-4">
            <Link
              href="/terms-and-condition"
              className="footer-heading mb-3 d-block"
              style={{ cursor: "pointer",textDecoration: "none" }}
            >
              Terms & Conditions
            </Link>

            <Link
              href="/privacy-policy"
              className="footer-heading mb-3 d-block"
              style={{ cursor: "pointer",textDecoration: "none"  }}
            >
              Privacy Policy
            </Link>

            <Link
              href="/refund-policy"
              className="footer-heading mb-3 d-block"
              style={{ cursor: "pointer",textDecoration: "none" }}
            >
              Refund Policy
            </Link>

            <Link
              href="/CookiesPolicy"
              className="footer-heading mb-3 d-block"
              style={{ cursor: "pointer",textDecoration: "none" }}
            >
              Cookies Policy
            </Link>
          </div>

          {/* Newsletter */}
          <div className="col-md-4">
            <div className="footer-heading mb-4">Stay in the Loop</div>
            <p className="footer-text">
              Get the latest features, updates, and tips straight to your inbox.
            </p>

            <div className="footer-subscribe w-75">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="subscribe-input"
                disabled={isPending}
              />

              <button
                className="subscribe-btn p-2"
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

        {/* Bottom Text */}
        <p className="text-center">
          Copyright © 2025 Disblay. All rights reserved.
          <br />
          <span style={{ color: "#999", fontSize: "12px" }}>
            A product of Topiko Business Solutions Pvt Ltd
          </span>
        </p>
      </div>
    </footer>
  );
}
