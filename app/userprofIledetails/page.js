"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserAddress, useUpdateUserAddress } from "@/components/userapi";
import { Spinner } from "react-bootstrap";
import UserTop from "@/components/UserTop";
import Swal from "sweetalert2";

export default function UserProfileDetails() {
  const router = useRouter();

  // -----------------------------------------------
  // SAFE client-only states
  // -----------------------------------------------
  const [userId, setUserId] = useState(null);
  const [cartData, setCartData] = useState({ items: [] });
  const [business, setBusiness] = useState({});
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  // -----------------------------------------------
  // Load sessionStorage (client-only)
  // -----------------------------------------------
  useEffect(() => {
    const uid = sessionStorage.getItem("profileUserId");
    setUserId(uid);

    const savedCart = JSON.parse(sessionStorage.getItem("cart") || "{}");
    setCartData(savedCart?.items ? savedCart : { items: [] });

    const savedBusiness = JSON.parse(sessionStorage.getItem("business") || "{}");
    setBusiness(savedBusiness);

    setIsClientLoaded(true);
  }, []);

  if (!isClientLoaded || !userId) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <UserProfileDetailsContent
      userId={userId}
      cartData={cartData}
      business={business}
    />
  );
}


// =================================================================
// CHILD COMPONENT — SAFE HOOK ORDER
// =================================================================
function UserProfileDetailsContent({ userId, cartData, business }) {
  const router = useRouter();

  // React Query (safe — always runs with a stable key)
  const { data, isLoading } = useUserAddress({
    user_id: userId || "",
  });

  const updateMutation = useUpdateUserAddress();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  // Load user data into form
  useEffect(() => {
    if (data?.status === "success") {
      setFormData({
        name: data.res.name || "",
        email: data.res.email || "",
        mobile: data.res.mobile || "",
      });
    }
  }, [data]);

  if (isLoading) {
    return (
      <>
        <UserTop
          business={business}
          cartCount={cartData.items.reduce((sum, i) => sum + (i.qty || 1), 0)}
          onCartClick={() => router.push("/cart")}
        />
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      </>
    );
  }

  if (data?.status !== "success") {
    return (
      <>
        <UserTop
          business={business}
          cartCount={cartData.items.reduce((sum, i) => sum + (i.qty || 1), 0)}
          onCartClick={() => router.push("/cart")}
        />

        
        <p className="text-danger text-center mt-4">
          Failed to load user details.
        </p>
      </>
    );
  }

  const user = data.res;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        user_id: user.id,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        latitude: user.latitude || "",
        longitude: user.longitude || "",
        pincode: user.pincode || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        requester_name: user.address?.requester_name || "",
        requester_mobile: user.address?.requester_mobile || "",
        requester_email: user.address?.requester_email || "",
        requester_country: user.address?.requester_country || "",
        requester_state: user.address?.requester_state || "",
        requester_city: user.address?.requester_city || "",
        requester_address: user.address?.requester_address || "",
        requester_direction: user.address?.requester_direction || "",
        requester_latlong: user.address?.requester_latlong || "",
      };

      const res = await updateMutation.mutateAsync(payload);

      if (res.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          text: "Your profile has been updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });

        setIsEditing(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: res.message || "Something went wrong!",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong!",
      });
    }
  };

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh" }}>
      {/* Top Navigation */}
      <UserTop
        business={business}
        cartCount={cartData.items.reduce((sum, i) => sum + (i.qty || 1), 0)}
        onCartClick={() => router.push("/cart")}
      />

      <div className="d-flex justify-content-center py-5" style={{ fontFamily: "Manrope" }}>
        <div
          className="card shadow-sm p-4"
          style={{ width: "788px", borderRadius: "12px" }}
        >
          <h5 className="fw-bold">My Profile</h5>

          {/* Avatar */}
          <div className="text-center mt-4 mb-4">
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "14px",
                backgroundColor: "#34495E1A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: "700",
                color: "#34495E",
                margin: "0 auto",
              }}
            >
              {formData.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>

          {/* Name */}
          <div className="mb-3">
            <label className="form-label userprofiledetails-name">Name</label>
            <input
              className="form-control userprofiledetails-input"
              name="name"
              value={formData.name}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>

          {/* Mobile */}
          <div className="mb-3">
            <label className="form-label userprofiledetails-name">Mobile Number</label>
            <input
              className="form-control userprofiledetails-input"
              value={formData.mobile}
              readOnly
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label userprofiledetails-name">Email ID</label>
            <input
              className="form-control userprofiledetails-input"
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>

          {isEditing ? (
            <button
              className="userprofiledetails-edit1 w-100"
              onClick={handleSave}
              disabled={updateMutation.isLoading}
            >
              <span className="userprofiledetails-edittext">
                {updateMutation.isLoading ? "Saving..." : "Save"}
              </span>
            </button>
          ) : (
            <button
              className="userprofiledetails-edit w-100"
              onClick={() => setIsEditing(true)}
            >
              <span className="userprofiledetails-edittext">Edit</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
