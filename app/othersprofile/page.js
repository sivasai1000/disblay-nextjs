// src/components/Profile.js
"use client"

import React, { useState, useEffect } from "react";
import LeftNav from "@/components/OthersLeftNav";
import TopNav from "@/components/OthersTopNav";
import { useBusinessDetails, useUpdateBusiness } from "@/components/OthersBusinessApi";

import Swal from "sweetalert2";

export default function OthersProfile() {
    const defaultProfile = "/assets/img/defaultprofile.svg"
  const businessId = JSON.parse(localStorage.getItem("businessId"));

  const { data, isLoading, refetch } = useBusinessDetails({
    business_id: businessId,
  });

  const { mutateAsync: updateBusiness } = useUpdateBusiness();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    business_user_name: "",
    business_email: "",
    business_mobile: "",
    business_user_photo: "",
  });
  const [profilePreview, setProfilePreview] = useState(null);

  // Load data into form
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
          ? `${process.env.NEXT_PUBLIC_API_URL_APP_API_URL}/${b.business_user_photo}`
          : null
      );
    }
  }, [data]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, business_user_photo: file }));
      setProfilePreview(URL.createObjectURL(file));
    }
  };

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
        text: "Your business profile has been updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      setEditMode(false);
      refetch();
    } else {
      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: res.msg || "Unable to update your profile.",
      });
    }
  } catch (err) {
    console.error(err);

    await Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text: "Please try again later.",
    });
  }
};



  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div style={{ width: "240px" }}>
        <LeftNav />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <TopNav />

        <div
          className="container-fluid "
          style={{ padding: "20px", background: "#F8F9FB",height:"100dvh"}}
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
                    className="btn  mt-4 mb-3"
                    style={{width:"136px",height:"40px",borderRadius:"8px",border:"1px solid #E2E4E9"}}
                  >
                    <span style={{fontSize:"14px",fontWeight:"500",color:"#34495E",lineHeight:"20px"}}>Change Image</span>
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
                  style={{
                      border: "1px solid #ced4da",
      backgroundColor: "#fff",
                  }}
                  className="form-control sub-input"
                  disabled={!editMode}
                  value={formData.business_user_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      business_user_name: e.target.value,
                    })
                  }
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
        fontSize: "14px",
        fontWeight: "500",
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
    className="sub-input"
      type="tel"
      value={formData.business_mobile}
      disabled={!editMode}
      onChange={(e) =>
        setFormData({ ...formData, business_mobile: e.target.value })
      }
      style={{
        border: "none",
        boxShadow: "none",
        backgroundColor: "transparent",
        fontSize: "14px",
        width: "100%",
        outline: "none",
      }}
    />
  </div>
</div>

            </div>

            <div className="mb-4 col-md-6">
              <label className="form-label sub-title">Email ID</label>
              <input
              style={{
                marginBottom:"30px",
                  border: "1px solid #ced4da",
      backgroundColor: "#fff",
              }}
                type="email"
                className="form-control sub-input"
                disabled={!editMode}
                value={formData.business_email}
                onChange={(e) =>
                  setFormData({ ...formData, business_email: e.target.value })
                }
              />
            </div>

            {/* Buttons */}
           <div className="d-flex justify-content-between mt-3">
  {editMode ? (
    <>
      <button
        className="btn edit-btn2"
        onClick={() => setEditMode(false)}
      >
         <span style={{fontSize:"18px",fontWeight:"700",color:"#525866"}}>Cancel</span>
      </button>
      <button
        className="btn save-btn"
        style={{
         
          color: "#fff",
        
        }}
        onClick={handleSave}
      >
        Save & Continue
      </button>
    </>
  ) : (
    <div className="ms-auto">
      <button
        className="btn edit-btn2"
        onClick={() => setEditMode(true)}
      >
        <span style={{fontSize:"18px",fontWeight:"700",color:"#525866"}}>Edit</span>
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
