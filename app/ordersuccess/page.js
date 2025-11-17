"use client";

import React, { useEffect } from "react";
import UserTop from "@/components/UserTop";

const successfullysent = "/assets/img/successfullysent.svg";
const whatsappIcon = "/assets/img/whats.svg";
const bookmark = "/assets/img/Bookmark.svg";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function OrderSuccess({ business, setCart }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type");
  const comboCategory = searchParams.get("comboCategory");

  let successMessage = "";
  let whatsappMessage = "";

  if (type === "product") {
    successMessage =
      "Your product request has been sent to the seller successfully.";
    whatsappMessage =
      "Hi, I've sent the order request. Kindly update me on the status at www.disblay.com";
  } else if (type === "service") {
    successMessage =
      "Your service request has been sent to the seller successfully.";
    whatsappMessage =
      "Hi, I've scheduled a call request for your service. Kindly update me on the status at www.disblay.com";
  } else if (type === "combo") {
    if (comboCategory === "service") {
      successMessage =
        "Your combo (service) request has been sent to the seller successfully.";
      whatsappMessage =
        "Hi, I've scheduled a call request for your service. Kindly update me on the status at www.disblay.com";
    } else {
      successMessage =
        "Your combo request has been sent to the seller successfully.";
      whatsappMessage =
        "Hi, I've sent the order request. Kindly update me on the status at www.disblay.com";
    }
  } else {
    successMessage = "Your request has been sent to the seller successfully.";
    whatsappMessage =
      "Hi, kindly update me on the status at www.disblay.com";
  }

  useEffect(() => {
    localStorage.removeItem("cart");
    if (setCart) setCart({ type: null, items: [] });
  }, [setCart]);

  return (
    <div className="user-home">
      <UserTop
        business={business}
        cartCount={0}
        onCartClick={() => router.push("/UserDashboard")}
      />

      <div
        className="d-flex flex-column align-items-center justify-content-center text-center"
        style={{ minHeight: "80vh", background: "#F1FEF5" }}
      >
        <div className="mt-4 py-4">
          <img
            src={successfullysent}
            alt="Success"
            style={{ maxWidth: "400px", height: "326px", marginBottom: "20px" }}
          />

          <div className="success-update mt-4 mb-4">{successMessage}</div>

          <div className="success-update1 mt-4 mb-4">
            For quicker updates, please call or WhatsApp them directly.
          </div>

          <Link
            href={`https://wa.me/91${business?.business_mobile || ""}?text=${encodeURIComponent(
              whatsappMessage
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn success-whatsapp d-flex align-items-center justify-content-center mx-auto"
            style={{ maxWidth: "320px" }}
          >
            <img
              src={whatsappIcon}
              alt="WhatsApp"
              style={{
                width: "26px",
                height: "26px",
                marginRight: "8px",
              }}
            />
            <span className="success-whatsapptext">WhatsApp</span>
          </Link>

          {/* TWO BUTTONS */}
          <div
            className="d-flex justify-content-between mt-4 mx-auto"
            style={{ gap: "100px" }}
          >
            <button
              className="btn success-whatsapp flex-fill"
              style={{
                backgroundColor: "#27A376",
                color: "#fff",
                fontWeight: "600",
                height: "48px",
                borderRadius: "8px",
              }}
              onClick={() =>
                router.push(`/${localStorage.getItem("business_slug")}`)
              }
            >
              Done
            </button>

            <button
              className="btn success-whatsapp flex-fill"
              style={{
                backgroundColor: "#34495e",
                color: "#fff",
                fontWeight: "600",
                height: "48px",
                borderRadius: "8px",
              }}
              onClick={() => router.push("/orders")}
            >
              View Orders
            </button>
          </div>

          <div className="mt-4">
            <span
              style={{
                fontSize: "15px",
                fontWeight: 500,
                textAlign: "justify",
              }}
            >
              Bookmark the business webpage for easy access and future
              communication.
            </span>
            <div className="mt-2">
              <img
                src={bookmark}
                loading="lazy"
                style={{ width: "100%" }}
                alt="bookmark"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
