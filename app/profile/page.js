"use client";

import React, { useState, useEffect } from "react";
import LeftNav from "@/components/LeftNav";
import TopNav from "@/components/TopNav";
import {
  useBusinessDetails,
  useUpdateBusiness,
} from "@/components/BusinessApi/page";
import Swal from "sweetalert2";

// Public assets
const defaultProfile = "/assets/img/defaultprofile.svg";

export default function Profile() {
  const [businessId, setBusinessId] = useState(null);

 useEffect(() => {
  if (typeof window !== "undefined") {
    const id =
      sessionStorage.getItem("business_id") ||
      localStorage.getItem("business_id") ||
      localStorage.getItem("businessId") ||
      "";

    setBusinessId(id);
  }
}, []);


  const { data, isLoading, refetch } = useBusinessDetails(
    { business_id: businessId },
    { enabled: !!businessId }
  );

  const { mutateAsync: updateBusiness } = useUpdateBusiness();

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    business_user_name: "",
    business_email: "",
    business_mobile: "",
    business_user_photo: "",
  });

  const [profilePreview, setProfilePreview] = useState(null);

  // Load fetched data into form
  useEffect(() => {
    if (data?.status === "success" && data.response) {
      const b = data.response;
      setFormData({
        business_user_name: b.business_user_name || "",
        business_email: b.business_email || "",
        business_mobile: b.business_mobile || "",
        business_user_photo: b.business_user_photo || "",
      });

      setProfilePreview(
        b.business_user_photo
          ? `${process.env.NEXT_PUBLIC_API_URL}/${b.business_user_photo}`
          : null
      );
    }
  }, [data]);

  // ---------------------- Image Change ----------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, business_user_photo: file }));
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  // ---------------------- Save profile ----------------------
  const handleSave = async () => {
    try {
      const payload = new FormData();
      payload.append("business_id", businessId);

      Object.entries(formData).forEach(([key, val]) => {
        if (key === "business_user_photo") {
          if (val instanceof File) {
            payload.append("business_user_photo", val);
          } else if (val === "" || val === null) {
            payload.append("business_user_photo", "");
          }
        } else if (val !== null && val !== undefined && val !== "") {
          payload.append(key, val);
        }
      });

      const res = await updateBusiness(payload);

      if (res.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          text: "Your profile has been updated successfully.",
          confirmButtonText: "OK",
        });

        setEditMode(false);
        refetch();
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: res.msg || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <LeftNav />

      {/* Main Content */}
      <div className="flex-grow-1">
        <TopNav />

        <div
          className="container-fluid"
          style={{
            padding: "20px",
            background: "#F8F9FB",
            minHeight: "100dvh",
          }}
        >
          <div
            className="card p-4"
            style={{
              borderRadius: "16px",
              background: "#fff",
              boxShadow: "0 0 12px rgba(0,0,0,0.08)",
              maxWidth: "800px",
              margin: "20px 20px",
            }}
          >
            <div
              style={{
                fontWeight: "700",
                fontSize: "24px",
                marginBottom: "24px",
              }}
            >
              Personal Information
            </div>

            {/* Profile Image */}
            <div className="text-center mb-3">
              <img
                src={profilePreview || defaultProfile}
                alt="Profile"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              {editMode && (
                <div>
                  <label
                    htmlFor="userPhotoInput"
                    className="btn mt-4 mb-3"
                    style={{
                      width: "136px",
                      height: "40px",
                      borderRadius: "8px",
                      border: "1px solid #E2E4E9",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#34495E",
                      }}
                    >
                      Change Image
                    </span>
                  </label>

                  <input
                    type="file"
                    id="userPhotoInput"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="row mb-3 mt-4">
              <div className="col-md-6">
                <label className="form-label sub-title">Name</label>
                <input
                  type="text"
                  className="form-control sub-input"
                  disabled={!editMode}
                  value={formData.business_user_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      business_user_name: e.target.value,
                    })
                  }
                  style={{
                    border: "1px solid #ced4da",
                    background: "#fff",
                    color:"#000"
                  }}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label sub-title">Phone</label>

                <div
                  className="d-flex align-items-center rounded px-2 sub-input"
                  style={{
                    border: "1px solid #ced4da",
                    backgroundColor: "#fff",
                  }}
                >
                  <div
                    style={{
                      width: "90px",
                      height: "34px",
                      background: "#f4f4f4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "6px",
                      marginRight: "8px",
                    }}
                  >
                    <img
                      src="https://flagcdn.com/w20/in.png"
                      alt="India flag"
                      style={{
                        width: "20px",
                        height: "14px",
                        objectFit: "cover",
                        borderRadius: "2px",
                        marginRight: "4px",
                      }}
                    />
                    +91
                  </div>

                  <input
                    type="tel"
                    value={formData.business_mobile}
                    disabled={!editMode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        business_mobile: e.target.value,
                      })
                    }
                    style={{
                      border: "none",
                      background: "transparent",
                      width: "100%",
                      outline: "none",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="mb-4 col-md-6">
              <label className="form-label sub-title">Email ID</label>
              <input
                type="email"
                className="form-control sub-input"
                disabled={!editMode}
                value={formData.business_email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    business_email: e.target.value,
                  })
                }
                style={{
                  marginBottom: "30px",
                  border: "1px solid #ced4da",
                  background: "#fff",
                }}
              />
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-between mt-3">
              {editMode ? (
                <>
                  <button
                    className="edit-btn2"
                    onClick={() => setEditMode(false)}
                    style={{ background: "transparent" }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#525866",
                      }}
                    >
                      Cancel
                    </span>
                  </button>

                  <button
                    className="save-btn"
                    onClick={handleSave}
                    style={{
                      color: "#fff",
                      border: "none",
                    }}
                  >
                    Save & Continue
                  </button>
                </>
              ) : (
                <div className="ms-auto">
                  <button
                    className="edit-btn2"
                    onClick={() => setEditMode(true)}
                    style={{ background: "transparent" }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#525866",
                      }}
                    >
                      Edit
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
