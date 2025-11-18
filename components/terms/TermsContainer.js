"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import TermsContent from "./TermsContent";
import { useSendSubscriptionRequest } from "@/components/BusinessApi/page";
export default function TermsContainer() {
  const router = useRouter();
  const [showVideo, setShowVideo] = useState(false);
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
    <div className="landing-page">
   

      <TermsContent />

    
    </div>
  );
}
