"use client";
import Image from "next/image";
import Link from "next/link";
import "@/css/LandingPage.css";

const key = "/assets/img/key2.svg";
const phoneImage = "/assets/img/disblayhome.png";

export default function Hero() {
  return (
    <section className="landing-hero text-center text-lg-start">
      <div className="container">
        <div className="row align-items-center">

          {/* Left Content */}
          <div className="col-lg-8 landing-hero-text">
            <div className="landing-trust-badge">
              Trusted by <span className="highlight">10,000+</span> Businesses Across India
            </div>

            <h1 className="landingpage-headings">
              Show What You Sell, <br />
              <span className="instant no-wrap">
                <span className="landingpage-headings">Share it</span>{" "}
                <Image src={key} alt="key" width={68} height={68} /> Instantly
              </span>
            </h1>

            <p className="subtitle">
              Your Entire Business in one simple link – Products, Services, Combo Offers,
              and Orders, managed in minutes
            </p>

            <p className="tagline">Be Visible, Be Digital, Be Disblay</p>

            {/* Buttons */}
            <div className="mt-4 d-flex justify-content-center">
              <Link href="/SignUp" className="btn btn-lg px-4 landing-btn-primary me-3">
                Get Started
              </Link>

              <Link href="/Login" className="btn btn-lg px-4 landing-btn-outline">
                I Already Have an Account
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="col-lg-4 text-center mt-5 mt-lg-0">
            <Image
              src={phoneImage}
              alt="phone"
              width={450}
              height={450}
              className="landing-phone-img img-fluid"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
