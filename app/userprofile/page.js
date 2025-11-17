"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserTop from "@/components/UserTop";
import { useUserAddress } from "@/components/userapi";
import { Spinner } from "react-bootstrap";

const storeicon = "/assets/img/storeicon1.svg";
const vector = "/assets/img/Vector.svg";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState({});
  const [cart, setCart] = useState({ items: [] });
  const [businessSlug, setBusinessSlug] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // -------------------------
  // Load data from localStorage AFTER client loads
  // -------------------------
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);

    const storedCart = JSON.parse(localStorage.getItem("cart") || "{}");
    setCart(storedCart?.items ? storedCart : { items: [] });

    const storedBusiness = JSON.parse(localStorage.getItem("business") || "{}");
    setBusiness(storedBusiness);

    const slug = localStorage.getItem("business_slug");
    setBusinessSlug(slug);

    setIsLoaded(true);
  }, []);

  // Save businessId correctly
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem("businessId", user.id);
    }
  }, [user]);

  if (!isLoaded || !user) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <ProfileContent
      user={user}
      cart={cart}
      business={business}
      setBusiness={setBusiness}
      businessSlug={businessSlug}
    />
  );
}

// ------------------------------
// CHILD COMPONENT (API HOOK SAFE)
// ------------------------------
function ProfileContent({ user, cart, business, setBusiness, businessSlug }) {
  const router = useRouter();

  // Fetch business status using API
  const { data, isLoading } = useUserAddress({ user_id: user?.user_id });

  // Update business from API result automatically
  useEffect(() => {
    if (data?.res?.business) {
      setBusiness(data.res.business);
    }
  }, [data, setBusiness]);

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (data?.status !== "success") {
    return <p className="text-danger text-center mt-4">Failed to load profile</p>;
  }

  const businessStatus = data?.res?.business?.business_status;

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh" }}>
      {/* TOP NAVIGATION */}
      <UserTop
        business={business}
        cartCount={cart.items.reduce((sum, i) => sum + (i.qty || 1), 0)}
        onCartClick={() => router.push("/cart")}
      />

      <div className="container py-4">
        <div
          className="mx-auto bg-white p-4 rounded-4 shadow-sm"
          style={{ maxWidth: "600px" }}
        >
          <h5 className="mb-4 fw-bold">My profile</h5>

          {/* USER DETAILS */}
          <div
            className="d-flex align-items-center justify-content-between mb-4 p-3"
            style={{
              background: "#ffffff",
              border: "1px solid #E2E4E9",
              borderRadius: "14px",
              cursor: "pointer",
            }}
            onClick={() => {
              sessionStorage.setItem("profileUserId", user?.user_id);
              router.push("/userprofIledetails");
            }}
          >
            <div className="d-flex flex-column">
              <span className="userdetails-name">{user?.name}</span>
              <span className="userdetails-nametext mt-2">
                {user?.mobile}
              </span>
            </div>
            <img src={vector} alt="vector" width={17} height={17} />
          </div>

          {/* BUSINESS BOX */}
          <div
            className="text-center p-4 rounded-4 mb-4"
            style={{
              background:
                "linear-gradient(284.69deg, rgba(246, 45, 45, 0.1) 7.92%, rgba(255, 97, 97, 0.1) 100%)",
            }}
          >
            <img src={storeicon} width={60} height={60} alt="storeicon" />

            <div className="view-business mb-2 mt-4">
              {businessStatus === "Old"
                ? "View Your Business"
                : "Join as a Business Owner"}
            </div>

            <div className="view-businesstext mb-3">
              {businessStatus === "Old"
                ? "Manage and view your existing business details."
                : "With Disblay, you can showcase what you sell, connect with customers, and onboard local vendors."}
            </div>

            <button
              className="viewbusiness-btn mt-2"
              onClick={() => {
                router.push(businessStatus === "Old" ? "/admin" : "/welcome");
              }}
            >
              <span className="viewbusiness-textbtn">
                {businessStatus === "Old" ? "View Business" : "+ Create Business"}
              </span>
            </button>
          </div>

          {/* MY ORDERS */}
          <div
            className="d-flex justify-content-between align-items-center p-3 mb-2 rounded-3"
            style={{
              background: "#ffffff",
              border: "1px solid #E2E4E9",
              borderRadius: "14px",
              cursor: "pointer",
            }}
            onClick={() => router.push("/orders")}
          >
            <span className="userdetails-name">My Orders</span>
            <img src={vector} width={17} height={17} alt="vector" />
          </div>

          {/* LOGOUT */}
          <div
            className="text-center mt-4 fw-bold text-danger"
            style={{ cursor: "pointer" }}
           onClick={() => {
  const storedSlug = localStorage.getItem("business_slug");
  const finalSlug = businessSlug || storedSlug;

  if (!finalSlug) {
    console.error("No business slug found");
    return;
  }

  localStorage.clear();
  localStorage.setItem("business_slug", finalSlug); // keep slug even after clear

  router.push(`/${finalSlug}`);
}}

          >
            <span className="userdetails-name1">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
