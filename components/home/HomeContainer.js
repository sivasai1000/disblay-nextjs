"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import "@/css/LandingPage.css";

import { useSendSubscriptionRequest } from "@/components/BusinessApi/page";
import Navbar from "@/components/home/Navbar";
import VideoModal from "@/components/home/VideoModal";
import Hero from "@/components/home/Hero";
import GettingStarted from "@/components/home/GettingStarted";
import PerfectSellers from "@/components/home/PerfectSellers";
import FAQ from "@/components/home/FAQ";
import Footer from "@/components/home/Footer";

export default function HomeContainer() {
  const [showVideo, setShowVideo] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [email, setEmail] = useState("");

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

  const { mutate: subscribe, isPending } = useSendSubscriptionRequest();

  const toggleFAQ = (i) => setOpenIndex(openIndex === i ? null : i);

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
    <div className="landing-page">
      <Navbar setShowVideo={setShowVideo} />

      <VideoModal showVideo={showVideo} setShowVideo={setShowVideo} />

      <Hero />

      <GettingStarted />

      <PerfectSellers />
      <FAQ
        faqs={faqs}
        openIndex={openIndex}
        toggleFAQ={toggleFAQ}
      />

      <Footer
        email={email}
        setEmail={setEmail}
        handleSubscribe={handleSubscribe}
        isPending={isPending}
      />
    </div>
  );
}
