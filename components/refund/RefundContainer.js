"use client";

import { useState } from "react";
import Swal from "sweetalert2";

import Navbar from "@/components/home/Navbar";
import VideoModal from "@/components/home/VideoModal";
import Footer from "@/components/home/Footer";
import RefundContent from "./RefundContent";

import { useSendSubscriptionRequest } from "@/components/BusinessApi/page";

export default function RefundContainer() {
  const [showVideo, setShowVideo] = useState(false);
  const [email, setEmail] = useState("");

  const { mutate: subscribe, isPending } = useSendSubscriptionRequest();

  const handleSubscribe = () => {
    if (!email) {
      return Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email before subscribing.",
      });
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

      <RefundContent />

     
    </div>
  );
}
