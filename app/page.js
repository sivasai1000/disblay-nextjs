"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "@/css/LandingPage.css"  
import Swal from "sweetalert2";

import { useSendSubscriptionRequest } from "@/components/BusinessApi/page";
import Image from "next/image";
import Link from "next/link";


export default function Home() {
  const router = useRouter();
  const howItWorksVideo = "/assets/video/howitworks.mp4"; // Next.js correct usage
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
const key = "/assets/img/key2.svg";
const cup = "/assets/img/cup.svg";
const plusIcon = "/assets/img/plusIcon.svg";
const minusIcon = "/assets/img/minusIcon.svg";
const youtubeIcon = "/assets/img/dyoutube.svg";
const linkedinIcon = "/assets/img/dlinkedin.svg";
const xIcon = "/assets/img/dtwitter.svg";
const facebookIcon = "/assets/img/dfacebook.svg";
const dlogo = "/assets/img/disblaylogo.svg";


  const faqs = [
    { question: "What is Disblay?", answer: "Disblay is a simple digital storefront for your business. It gives you a dedicated link to showcase products/services, create offers, and share with customers — all without the hassles of websites or apps." },
    { question: "Do I need technical skills to use Disblay?", answer: "Not at all. If you can use WhatsApp, you can use Disblay. It’s designed for small business owners with zero tech background." },
    { question: "How much does Disblay cost?", answer: "Disblay costs ₹999 + GST per year. No hidden charges, no commission cuts." },
    { question: "Will I get my own business link?", answer: "Yes! You can select a business URL of your choice (yourname.disblay.com) — and it stays yours forever." },
    { question: "What can I showcase on Disblay?", answer: "You can list products, services, and even create combo offers. Each item can have a photo, name, price, and details." },
    { question: "Can I add my social media and other business links?", answer: "Yes, Disblay lets you add links to WhatsApp, Instagram, Facebook, or any other business page so customers can connect easily." },
    { question: "How do I share my Disblay page?", answer: "Simply share your URL on WhatsApp, SMS, Instagram, or Facebook. Customers can browse your offerings instantly without downloading any app." },
    { question: "Can I manage orders and payments?", answer: "Yes. Customers can place orders directly from your page. You can manage orders, payments, and shipping through your dashboard." },
    { question: "Is my data and business information safe?", answer: "Absolutely. Your data is secure and only you control what’s displayed or updated on your page." },
    { question: "Why choose Disblay over websites or free tools?", answer: "Websites are costly and complicated. Free tools like WhatsApp/Instagram get messy with no proper tracking. Disblay is built to be simple, professional, and made for Indian small businesses — at an unbeatable price." },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const [email, setEmail] = useState("");
  const [showVideo, setShowVideo] = useState(false);

  const { mutate: subscribe, isPending } = useSendSubscriptionRequest();

  const handleSubscribe = () => {
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email before subscribing."
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
              text: "Thank you for subscribing!"
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Subscription Failed",
              text: data?.msg || "Please try again."
            });
          }
          setEmail("");
        },
        onError: () => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something went wrong. Please try again later."
          });
        },
      }
    );
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="landing-page">

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg landing-navbar">
        <div className="container d-flex text-start justify-content-between">
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <img
              src={logo}
              alt="logo"
              className="landing-logo me-2"
            />
          </Link>

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
      </nav>

      {/* Video Modal */}
      {showVideo && (
        <div
          onClick={() => setShowVideo(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
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

        <section className="landing-hero text-center text-lg-start">
  <div className="container">
    <div className="row align-items-center">
      
      {/* Left Content */}
      <div className="col-lg-8 landing-hero-text">
        <div className="landing-trust-badge">
          Trusted by <span className="highlight">10,000+ </span>Businesses Across India
        </div>
        <h1 className="landingpage-headings">
          Show What You Sell, <br />
          <span className="instant no-wrap">
          <span className="landingpage-headings">Share it</span>  <Image src={key} alt="key" width={68} height={68}/> Instantly
          </span>
          </h1>
        <p className="subtitle">
          Your Entire Business in one simple link – Products, Services, Combo Offers,
          and Orders, managed in minutes
        </p>
        <p className="tagline">Be Visible, Be Digital, Be Disblay</p>
        <div className="mt-4 d-flex justify-content-center justify-content-lg-center">
              <button
      className="btn btn-lg px-4 landing-btn-primary me-3"
      onClick={() => router.push("/SignUp")}
    >
      Get Started
    </button>

          <button className="btn btn-lg px-4 landing-btn-outline"  onClick={() => router.push("/Login")}>
            I Already Have an Account
          </button>
        </div>
      </div>

      {/* Right Content (Phone Mockup) */}
      <div className="col-lg-4 text-center mt-5 mt-lg-0">
        <img src={phoneImage} alt="phone" className="landing-phone-img img-fluid"/>
      </div>

    </div>
  </div>
</section>

<section className="getting-started py-5">
  <div className="container text-center">
    <h2 className="getting-started-title">
      Getting started is <span className="highlight">easier</span> than making chai <Image src={cup} alt="cup" width={44} height={44} style={{ verticalAlign: "middle" }}/>
    </h2>

    <div className="row mt-5 g-4">
      {/* Card 1 */}
      <div className="col-md-3 d-flex">
        <div className="getting-card">
          <img src={frame1} alt="Sign Up" className="getting-card-img" />
          <div className="card-titles mb-2">Sign Up & Setup Business</div>
          <p>Enter your business name and logo</p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="col-md-3 d-flex">
        <div className="getting-card">
          <img src={frame2} alt="Add Items" className="getting-card-img" />
          <div className="card-titles mb-2">Add what you sell</div>
         <p>Upload items, set prices, or combos.</p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="col-md-3 d-flex">
        <div className="getting-card">
          <img src={frame3} alt="Share Store Link" className="getting-card-img" />
           <div className="card-titles mb-2">Share your store link</div>
           <p>Share your store link on WhatsApp, Instagram or anywhere</p>
        </div>
      </div>

      {/* Card 4 */}
      <div className="col-md-3 d-flex">
        <div className="getting-card">
          <img src={frame4} alt="Start Earning" className="getting-card-img" />
          <div className="card-titles mb-2">Start earning</div>
          <p>Watch your phone buzz with new orders.</p>
        </div>
      </div>
    </div>
  </div>
</section>
<section className="perfect-sellers py-5">
  <div className="container text-center">
    <h2 className="getting-started-title mb-5">
      Perfect for Every Seller
    </h2>

    <div className="row g-4 justify-content-center">
      {/* Card 1 */}
      <div className="col-md-3 d-flex">
        <div className="seller-card w-100">
          <img src={frame5} alt="Homepreneurs" className="seller-card-img" />
          <div className="mt-3 perfect-sellerstext">Homepreneurs</div>
          <p className="seller-category mt-1">(Pickles, sweets, snacks)</p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="col-md-3 d-flex">
        <div className="seller-card w-100">
          <img src={frame6} alt="Local Shops" className="seller-card-img" />
          <div className="mt-3 perfect-sellerstext">Local Shops</div>
          <p className="seller-category mt-1">(Groceries, gifts)</p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="col-md-3 d-flex">
        <div className="seller-card w-100">
          <img src={frame7} alt="Creators & Freelancers" className="seller-card-img" />
          <div className="mt-3 perfect-sellerstext">Creators & Freelancers</div>
          <p className="seller-category mt-1">(Digital art, Courses)</p>
        </div>
      </div>

      {/* Card 4 */}
      <div className="col-md-3 d-flex">
        <div className="seller-card w-100">
          <img src={frame8} alt="Service Providers" className="seller-card-img" />
         <div className="mt-3 perfect-sellerstext">Service Providers</div>
          <p className="seller-category mt-1">(Consultations, repairs)</p>
        </div>
      </div>
    </div>
  </div>
</section>
<section className="faq-section py-5">
      <div className="container">
        <h5 className="text-center frequent-ques mb-2"> FREQUENT QUESTIONS</h5>
        <h2 className="text-center mb-5 getting-started-title">
          Got Questions? We’ve Got Answers
        </h2>

   <div className="faq-list">
  {faqs.map((faq, index) => (
    <div
      key={index}
      className={`faq-item ${openIndex === index ? "open" : ""}`}
    >
      <div className="faq-question" onClick={() => toggleFAQ(index)}>
        <span>{index + 1}. {faq.question}</span>
        <span className="faq-icon">
          <img 
            src={openIndex === index ? minusIcon : plusIcon} 
            alt={openIndex === index ? "Collapse" : "Expand"} 
            className="faq-icon-img"
          />
        </span>
      </div>
      {openIndex === index && (
        <div className="faq-answer">
          <p>{faq.answer}</p>
        </div>
      )}
    </div>
  ))}

  {/* Contact Us Row */}
  <div className="faq-contact d-flex justify-content-between align-items-center p-3 mt-3">
    <div className="find-acc">Couldn't Find an Answer You're Looking For ?</div>
    <button className="btn landing-btn-watch px-4">Contact Us</button>
  </div>
</div>




      </div>
    </section>


    <footer className="footer-section py-5">
  <div className="container">
    {/* Top row: logo + social icons */}
    <div className="row align-items-center mb-4">
      <div className="col-md-6">
           <img
  src={dlogo}
  className="footer-logo"

  onClick={(e) => {
    e.stopPropagation();
  router.push("/")
  }
  }
/>
      </div>
     <div className="col-md-6 text-md-end text-start footer-social">
  <Link
    href="https://youtube.com/@getdisblay"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src={youtubeIcon} alt="YouTube" style={{ cursor: "pointer" }} />
  </Link>
  <Link
    href="https://www.linkedin.com/company/getdisblay"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src={linkedinIcon} alt="LinkedIn" style={{ cursor: "pointer" }} />
  </Link>
  <Link
    href="https://x.com/getdisblay"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src={xIcon} alt="X" style={{ cursor: "pointer" }} />
  </Link>
  <Link
    href="https://www.facebook.com/getdisblay"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src={facebookIcon} alt="Facebook" style={{ cursor: "pointer" }} />
  </Link>
</div>

    </div>

    {/* Middle row: Contact, Terms, Newsletter */}
    <div className="row align-items-start mb-4" style={{marginTop:"50px"}}>
      <div className="col-md-4 mb-4 mb-md-0">
        <div className="footer-heading mb-4">Contact</div>
        <p className="footer-text">+91 90988 00000</p>
        <p className="footer-text">disblay@gmail.com</p>
        <p className="footer-text">Hyderabad, India</p>
      </div>

      <div className="col-md-4 mb-4 mb-md-0">
        <div className="footer-heading mb-3" style={{cursor:"pointer"}} onClick={() => router.push("/terms-and-condition")} >Terms & Conditions</div>
         <div className="footer-heading mb-3" style={{cursor:"pointer"}}  onClick={() => router.push("/privacy-policy")}>Privacy Policy</div>
         <div className="footer-heading mb-3" style={{cursor:"pointer"}} onClick={() => router.push("/refund-policy")}>Refund Policy</div>
        <div className="footer-heading mb-3" style={{cursor:"pointer"}} onClick={() => router.push("/CookiesPolicy")}>Cookies Policy </div>
      </div>

      <div className="col-md-4">
        <div className="footer-heading mb-4">Stay in the Loop</div>
        <p className="footer-text">Get the latest features, updates, and tips straight to your inbox.</p>
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
