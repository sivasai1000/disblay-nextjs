"use client";

import React, { useEffect, useState } from "react";
import NewTopNav from "@/components/NewTopNav";
import NewLeftNav from "@/components/NewLeftNav";
import "@/css/NewBusiness.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function NewBusiness() {
  const router = useRouter();

  // ------------------------------
  // Safe client-side userId
  // ------------------------------
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const id =
      sessionStorage.getItem("userId") || localStorage.getItem("userId");
    if (id) setUserId(id);
  }, []);

  // ------------------------------
  // Images as public assets
  // ------------------------------
  const mainImage = "/assets/img/store2.svg";
  const connect = "/assets/img/connect.svg";
  const enroll = "/assets/img/id.svg";
  const reward = "/assets/img/money.svg";
  const orderbox = "/assets/img/orderbox.svg";

  // ------------------------------
  // Create Business
  // ------------------------------
  const handleCreateBusiness = async () => {
    try {
      if (!userId) {
        Swal.fire({
          icon: "warning",
          title: "User Not Found",
          text: "Please log in again.",
        });
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/createBusinessByUserId.php`,
        { user_id: userId }
      );

      if (response.data.status === "success") {
        const businessId = response.data.response?.business_id;

        if (businessId) {
          sessionStorage.setItem("businessId", businessId);
          localStorage.setItem("businessId", businessId);
        }

        await Swal.fire({
          icon: "success",
          title: "Business Created!",
          text: "Your business has been successfully created.",
          confirmButtonText: "Continue",
        });

        router.push("/welcome");
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: response.data.msg || "Failed to create business.",
        });
      }
    } catch (error) {
      console.error("Create Business Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error while creating business. Please try again.",
      });
    }
  };

  // ------------------------------
  // Render Page
  // ------------------------------
  return (
    <div className="newbusiness-container d-flex">
      <NewLeftNav />

      <div className="flex-grow-1">
        <NewTopNav />

        <div className="newbusiness-content p-4">
          <div className="cardss shadow-sm p-4 text-center rounded-4">
            {/* Main Image */}
            <div className="main-img-wrapper">
              <img
                src={mainImage}
                alt="Business Illustration"
                className="main-img mb-4"
              />
            </div>

            {/* Title & Subtitle */}
            <div className="new-business mb-2">Become a Business Owner</div>
            <div className="new-businesstext">
              Showcase your products, grow your network, and earn rewards with
              Disblay
            </div>

            {/* Features List */}
            <div className="text-start d-inline-block mt-4">
              <div className="d-flex align-items-center mb-3 new-connect">
                <img src={connect} alt="Connect" className="me-2 feature-icon" />
                Connect instantly with customers and vendors
              </div>
              <div className="d-flex align-items-center mb-3 new-connect">
                <img src={enroll} alt="Enroll" className="me-2 feature-icon" />
                Get a unique Enroll ID for every new business you onboard
              </div>
              <div className="d-flex align-items-center new-connect">
                <img src={reward} alt="Reward" className="me-2 feature-icon" />
                Earn 20% cash rewards for each successful onboarding
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button className="new-createbtn" onClick={handleCreateBusiness}>
                <span className="new-createbtntext">+ Create Business</span>
              </button>

              <button
                className="new-vieworder text-center"
                onClick={() => router.push("/businessneworders")}
              >
                <span className="new-viewordertext d-flex align-items-center">
                  <img src={orderbox} className="me-2" alt="order" />
                  View Orders
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
