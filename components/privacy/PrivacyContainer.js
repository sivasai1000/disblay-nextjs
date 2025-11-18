"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useSendSubscriptionRequest } from "@/components/BusinessApi/page";

// Shared components
import Navbar from "@/components/home/Navbar";
import VideoModal from "@/components/home/VideoModal";
import Footer from "@/components/home/Footer";

// Content
import PrivacyContent from "./PrivacyContent";

export default function PrivacyContainer() {
  const [showVideo, setShowVideo] = useState(false);
  const [email, setEmail] = useState("");

  const { mutate: subscribe, isPending } = useSendSubscriptionRequest();

  const handleSubscribe = () => {
    if (!email) {
      return Swal.fire({ icon: "warning", title: "Email required" });
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


      <PrivacyContent />

    </div>
  );
}
