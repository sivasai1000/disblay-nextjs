"use client"
import React, { useState, useEffect } from "react";
import { useBusinessDetails, useUpdateBusiness } from "@/components/OthersBusinessApi";
import { FaCrosshairs} from "react-icons/fa6"; // or from "react-icons/fa"
import "@/css/completeprofile.css";
import Swal from "sweetalert2";

export default function OthersCompleteProfile({ businessId, onFinish }) {
    const imageplus = "/assets/img/imageplus.svg"
  const [page, setPage] = useState(1); // steps 1-4
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [isDirty, setIsDirty] = useState(false); // track if user changed anything

  const { data, isLoading } = useBusinessDetails({ business_id: businessId });
    const [loading, setLoading] = useState(false);
  const { mutateAsync: updateBusiness } = useUpdateBusiness();
  const [latLngInput, setLatLngInput] = useState("");
const handleBack = () => {
  if (page > 1) setPage(page - 1);
};



  useEffect(() => {
  if (data?.status === "success") {
    const cleaned = Object.fromEntries(
      Object.entries(data.response || {}).map(([key, value]) => [
        key,
        value === null || value === "null" ? "" : value
      ])
    );

    setFormData(cleaned);
  }
}, [data]);


  const handleChange = (field, value) => {
    setFormData((prev) => ({
  ...prev,
  [field]: value === null || value === "null" ? "" : value
}));

    setIsDirty(true); // mark form as dirty
  };
  // Keep input updated when formData changes
useEffect(() => {
  if (formData.latitude && formData.longitude) {
    setLatLngInput(`${formData.latitude}, ${formData.longitude}`);
  }
}, [formData.latitude, formData.longitude]);

 const handleNext = async (save = true) => {
  // ✅ Page 2 validation — Business Name
  if (page === 2) {
    if (!formData.business_name || formData.business_name.trim() === "") {
      await Swal.fire({
        icon: "warning",
        title: "Business Name Required",
        text: "Please enter a valid business name.",
      });
      return;
    }
  }

  // ✅ Page 2 validation — Address
  if (page === 2) {
    if (!formData.business_address || formData.business_address.trim() === "") {
      await Swal.fire({
        icon: "warning",
        title: "Address Required",
        text: "Please enter your business address.",
      });
      return;
    }
  }

  // ✅ Save form if needed
  if (save && isDirty) {
    const payload = new FormData();
    payload.append("business_id", businessId);

    Object.entries(formData).forEach(([key, val]) => {
      if (val !== null && val !== "null" && val !== "") {
        if (key === "business_address") {
          payload.append("address", val);
        } else {
          payload.append(key, val);
        }
      }
    });

    if (profileImage) {
      payload.append("business_user_photo", profileImage);
    }

    try {
      await updateBusiness(payload);

      await Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Your details were saved successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      setIsDirty(false);
    } catch (err) {
      console.error(err);

      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong while saving.",
      });
    }
  }

  // ✅ Navigate to next page
  if (page < 4) {
    setPage(page + 1);
  } else {
    onFinish?.();
  }
};


   const getLocation = () => {
    if (!navigator.geolocation) {
      setLoading(false);
      return Promise.resolve({
        latitude: null,
        longitude: null,
        accuracy: null,
        house: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        address: "Geolocation not supported by your browser.",
      });
    }

    setLoading(true);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const addr = data.address || {};

            // More granular fields
            const house = addr.house_number || "";
            const street =
              addr.road ||
              addr.residential ||
              addr.neighbourhood ||
              addr.suburb ||
              addr.pedestrian ||
              "";
            const landmark =
              addr.amenity ||
              addr.shop ||
              addr.attraction ||
              addr.public_building ||
              "";
            const city = addr.city || addr.town || addr.village || "";
            const state = addr.state || "";
            const country = addr.country || "";
            const pincode = addr.postcode || "";

            const fullAddress = [
              house,
              street,
              landmark,
              city,
              state,
              pincode,
              country,
            ]
              .filter(Boolean)
              .join(", ");

            setLoading(false);

            resolve({
              latitude,
              longitude,
              accuracy,
              house,
              street,
              landmark,
              city,
              state,
              country,
              pincode,
              address: fullAddress || "Address not found",
            });
          } catch (error) {
            console.error("Error fetching address:", error);
            setLoading(false);
            resolve({
              latitude,
              longitude,
              accuracy,
              house: "",
              street: "",
              landmark: "",
              city: "",
              state: "",
              country: "",
              pincode: "",
              address: "Error fetching address",
            });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoading(false);

          let message = "Error fetching location.";
          if (error.code === error.PERMISSION_DENIED) {
            message = "Location access denied.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            message = "Location unavailable.";
          } else if (error.code === error.TIMEOUT) {
            message = "Location request timed out.";
          }

          resolve({
            latitude: null,
            longitude: null,
            accuracy: null,
            house: "",
            street: "",
            landmark: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
            address: message,
          });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // ✅ best GPS accuracy
      );
    });
  };


 const handleGetLocation = async () => {
  const result = await getLocation();

  if (result.latitude && result.longitude) {
    setFormData(prev => ({
      ...prev,
      street: result.street,
      state: result.state,
      postal: result.pincode,
      country: result.country,
      direction: result.address,
    }));
  } else {
    Swal.fire({
      icon: "error",
      title: "Location Error",
      text: result.address || "Unable to fetch your location.",
    });
  }
};


  if (isLoading) return <div>Loading...</div>;

  const steps = [1, 2, 3, 4];

  return (
    <div className="complete-profile-container">
      {/* Progress bar */}
      <div className="steps-container">
        {steps.map((step) => (
          <div
            key={step}
            className={`step-bar ${page >= step ? "active" : ""}`}
          ></div>
        ))}
      </div>

      {/* Card */}
      <div className="complete-card">
        {/* Step 1: Personal Info */}
        {page === 1 && (
          <>
            <div className="section-title">Personal Info</div>
            <div className="profile-upload">
              <div className="profile-circle">
                {profileImage ? (
                  <img src={URL.createObjectURL(profileImage)} alt="profile" />
                ) : (
                  <i className="bi bi-person default-icon"></i>
                )}
              </div>
              <label htmlFor="profileUpload" className="upload-btn">
                Upload Image
              </label>
              <input
                id="profileUpload"
                type="file"
                accept="image/*"
                className="d-none"
                onChange={(e) => {
                  setProfileImage(e.target.files[0]);
                  setIsDirty(true);
                }}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label sub-title">Name</label>
                <input
                  className="form-control sub-input"
                  placeholder="Enter name"
                  value={formData.business_user_name || ""}
                  onChange={(e) =>
                    handleChange("business_user_name", e.target.value)
                  }
                />
              </div>
              <div className="col-md-6 mb-3">
  <label className="form-label sub-title">Mobile Number</label>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      width: "100%",
      height: "50px",
      border: "1px solid #ced4da",
      borderRadius: "10px",
      padding: "0 8px",
      background: "#fff",
    }}
  >
    {/* Country Code Box */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "0 10px",
        height: "34px",
        background: "#F4F4F4",
        borderRadius: "6px",
        minWidth: "70px",
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
        }}
      />
      <span style={{ fontSize: "14px", fontWeight: "500" }}>+91</span>
    </div>

    {/* Mobile Input (read-only) */}
    <input
      type="tel"
      className="form-control sub-input"
      placeholder="Enter mobile number"
      value={formData.business_mobile || ""}
      readOnly
      style={{
        flex: 1,
        border: "none",
        outline: "none",
        fontSize: "14px",
        padding: "0px 10px",
        background: "transparent",
        boxShadow: "none",
      }}
    />
  </div>
</div>

              <div className="col-md-12 mb-3">
                <label className="form-label sub-title">Email ID</label>
                <input
                  className="form-control sub-input"
                  placeholder="Enter email"
                  value={formData.business_email || ""}
                  onChange={(e) =>
                    handleChange("business_email", e.target.value)
                  }
                />
              </div>
            </div>
          </>
        )}

        {/* Step 2: Business Information */}
        {page === 2 && (
          <>
            <div className="section-title">Business Information</div>
<div className="mb-3">
  {formData.business_logo ? (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      {/* Square Preview */}
      <img
        src={
          typeof formData.business_logo === "string"
            ? formData.business_logo.startsWith("http")
              ? formData.business_logo
              : `${process.env.NEXT_PUBLIC_API_URL}/${formData.business_logo.replace(/^\/+/, "")}`
            : URL.createObjectURL(formData.business_logo)
        }
        alt="Business Logo"
        style={{
          width: "100px",
          height: "100px",
          objectFit: "cover",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      />

      {/* Right Side: Label + Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div className="sub-title">Business Logo / Image</div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            className="btn"
            style={{
              borderRadius: "8px",
              padding: "6px 16px",
              background: "#34495E",
              color: "#ffffff",
            }}
            onClick={() => document.getElementById("logoInput").click()}
          >
            Change Image
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            style={{
              borderRadius: "8px",
              padding: "6px 16px",
              border: "1px solid #E2E4E9",
            }}
            onClick={() => handleChange("business_logo", null)}
          >
            Remove Image
          </button>
        </div>
      </div>

      {/* Hidden input */}
      <input
        type="file"
        id="logoInput"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleChange("business_logo", e.target.files[0])}
      />
    </div>
  ) : (
    // No image → Upload UI
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      {/* Placeholder Square */}
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "8px",
          border: "1px dashed #ccc",
          background: "#f9f9f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={imageplus} // ✅ use your imported imageplus
          alt="Upload"
          style={{ width: "32px", height: "32px", opacity: 0.6 }}
        />
      </div>

      {/* Right Side: Label + Upload Button */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span style={{ fontSize: "14px", fontWeight: "500" }}>
          Business Logo / Image
        </span>
        <button
          type="button"
          className="btn btn-dark"
          style={{ borderRadius: "8px", padding: "6px 16px" }}
          onClick={() => document.getElementById("logoInput").click()}
        >
          Upload Image
        </button>
      </div>

      {/* Hidden input */}
      <input
        type="file"
        id="logoInput"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleChange("business_logo", e.target.files[0])}
      />
    </div>
  )}
</div>



            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label sub-title">Business Name</label>
                <input
                  className="form-control sub-input"
                  value={
                    formData.business_name !== "null" ? formData.business_name : ""
                  }
                  onChange={(e) =>
                    handleChange("business_name", e.target.value)
                  }
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label sub-title">Business Tagline</label>
                <input
                  className="form-control sub-input"
                  value={
                    formData.business_tagline !== "null"
                      ? formData.business_tagline
                      : ""
                  }
                  onChange={(e) =>
                    handleChange("business_tagline", e.target.value)
                  }
                />
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label sub-title">About Business</label>
             <textarea
  className="form-control"
  rows={3}
  value={
    formData?.about_business &&
    formData.about_business.toString().toLowerCase() !== "null"
      ? formData.about_business
      : ""
  }
  onChange={(e) => handleChange("about_business", e.target.value)}
/>



              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label sub-title">City</label>
                <input
                  className="form-control sub-input"
                  value={formData.city || ""}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label sub-title">State</label>
                <input
                  className="form-control sub-input"
                  value={formData.state || ""}
                  onChange={(e) => handleChange("state", e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label sub-title">Pincode</label>
                <input
                  className="form-control sub-input"
                  value={formData.pincode || ""}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label sub-title">Country</label>
                <input
                  className="form-control sub-input"
                  value={formData.country || ""}
                  onChange={(e) => handleChange("country", e.target.value)}
                />
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label sub-title">Address</label>
    <input
  className="form-control sub-input"
  placeholder="Enter Address"
  value={formData.business_address || ""}
  onChange={(e) => handleChange("business_address", e.target.value)} // ✅ frontend state
/>


              </div>


{/* Directions (Optional) */}
<div className="col-md-12 mb-3">
  <label className="form-label sub-title">Directions (Optional)</label>
  <div className="d-flex align-items-center gap-2">
    <button
      type="button"
      className="btn square-btn d-flex justify-content-center align-items-center"
      onClick={async () => {
                                    const result = await handleGetLocation();
                                    if (result) {
                                      setFormData((prev) => ({
                                        ...prev,
                                        direction: result,
                                      }));
                                    }
                                  }}
    >
      <FaCrosshairs className="fs-1" style={{ color: "black" }} />
    </button>

    <input
      type="text"
      className="form-control"
      placeholder="Street, City, State, Country"
      value={formData.direction || ""}
      style={{ height: "50px" }}
      readOnly
    />
  </div>
</div>



<div className="text-center mt-2 mb-2" style={{ fontSize: "12px", fontWeight: "500" }}>
  OR
</div>

{/* Latitude, Longitude input */}

<div className="col-md-12 mb-3">
  <label className="form-label sub-title">Copy & Paste Location (Optional)</label>
  <input
    className="form-control"
    placeholder="Latitude , Longitude"
    value={latLngInput}
    onChange={(e) => {
      const val = e.target.value;
      setLatLngInput(val); // update local field immediately

      const [lat, lng] = val.split(",").map((v) => v.trim());

      handleChange("latitude", lat || "");
      handleChange("longitude", lng || "");
    }}
  />
</div>

            </div>
          </>
        )}

        {/* Step 3: Payment Setup */}
{page === 3 && (
  <>
    <div className="section-title">Payment Setup</div>

    {/* UPI ID */}
    <div className="mb-3">
      <label className="form-label sub-title">UPI ID</label>
      <input
        className="form-control sub-input"
        placeholder="yourupi@ybl"
        value={formData.payment_upi_id !== "null" ? formData.payment_upi_id : ""}
        onChange={(e) => handleChange("payment_upi_id", e.target.value)}
      />
    </div>

    {/* Online Payments */}
    <div className="d-flex justify-content-between align-items-center mb-2">
      <label
        className="form-label mb-3 mt-3 sub-payment"
        style={{
          color: formData.payment_type === "online" ? "#32353A" : "#676A6D",
          fontWeight: formData.payment_type === "online" ? "600" : "400",
        }}
      >
        Online Payments
      </label>
      <input
        type="checkbox"
        className="form-check-input"
        checked={formData.payment_type === "online"}
        onChange={() =>
          handleChange(
            "payment_type",
            formData.payment_type === "online" ? "" : "online"
          )
        }
      />
    </div>

    {/* Cash on Delivery */}
    <div className="d-flex justify-content-between align-items-center mb-2">
      <label
        className="form-label mb-3 mt-3 sub-payment"
        style={{
          color: formData.payment_type === "cod" ? "#32353A" : "#676A6D",
          fontWeight: formData.payment_type === "cod" ? "600" : "400",
        }}
      >
        Cash on Delivery
      </label>
      <input
        type="checkbox"
        className="form-check-input"
        checked={formData.payment_type === "cod"}
        onChange={() =>
          handleChange(
            "payment_type",
            formData.payment_type === "cod" ? "" : "cod"
          )
        }
      />
    </div>

    {/* Both */}
    <div className="d-flex justify-content-between align-items-center mb-2">
      <label
        className="form-label mb-3 mt-3 sub-payment"
        style={{
          color: formData.payment_type === "both" ? "#32353A" : "#676A6D",
          fontWeight: formData.payment_type === "both" ? "600" : "400",
        }}
      >
        Both
      </label>
      <input
        type="checkbox"
        className="form-check-input"
        checked={formData.payment_type === "both"}
        onChange={() =>
          handleChange(
            "payment_type",
            formData.payment_type === "both" ? "" : "both"
          )
        }
      />
    </div>
  </>
)}



        {/* Step 4: Delivery Setup */}
{page === 4 && (
  <>
    <div className="section-title">Delivery Setup</div>

    {/* On Demand */}
    <div className="d-flex justify-content-between align-items-center mb-2">
      <label
        className="form-label mb-3 mt-3 sub-payment"
        style={{
          color: formData.delivery_type === "On Demand" ? "#32353A" : "#676A6D",
          fontWeight: formData.delivery_type === "On Demand" ? "600" : "400",
        }}
      >
        On Demand
      </label>
      <input
        type="checkbox"
        className="form-check-input"
        checked={formData.delivery_type === "On Demand"}
        onChange={() => {
          if (formData.delivery_type === "On Demand") {
            // unselect → reset
            handleChange("delivery_type", "");
            handleChange("onDemands", "0");
          } else {
            // select On Demand
            handleChange("delivery_type", "On Demand");
            handleChange("onDemands", "1");
          }
        }}
      />
    </div>

    {/* Next Day */}
    <div className="d-flex justify-content-between align-items-center mb-2">
      <label
        className="form-label mb-3 mt-3 sub-payment"
        style={{
          color: formData.delivery_type === "Next Day" ? "#32353A" : "#676A6D",
          fontWeight: formData.delivery_type === "Next Day" ? "600" : "400",
        }}
      >
        Next Day Delivery
      </label>
      <input
        type="checkbox"
        className="form-check-input"
        checked={formData.delivery_type === "Next Day"}
        onChange={() => {
          handleChange("delivery_type", "Next Day");
          handleChange("onDemands", "0");
        }}
      />
    </div>

    {/* Same Day */}
    <div className="d-flex justify-content-between align-items-center mb-2">
      <label
        className="form-label mb-3 mt-3 sub-payment"
        style={{
          color: formData.delivery_type === "Same Day" ? "#32353A" : "#676A6D",
          fontWeight: formData.delivery_type === "Same Day" ? "600" : "400",
        }}
      >
        Same Day Delivery
      </label>
      <input
        type="checkbox"
        className="form-check-input"
        checked={formData.delivery_type === "Same Day"}
        onChange={() => {
          handleChange("delivery_type", "Same Day");
          handleChange("onDemands", "0");
        }}
      />
    </div>

    {/* Scheduled */}
    <div className="d-flex justify-content-between align-items-center mb-2">
      <label
        className="form-label mb-3 mt-3 sub-payment"
        style={{
          color: formData.delivery_type === "Scheduled" ? "#32353A" : "#676A6D",
          fontWeight: formData.delivery_type === "Scheduled" ? "600" : "400",
        }}
      >
        Scheduled Delivery (Inform your preferred Date and Time)
      </label>
      <input
        type="checkbox"
        className="form-check-input"
        checked={formData.delivery_type === "Scheduled"}
        onChange={() => {
          handleChange("delivery_type", "Scheduled");
          handleChange("onDemands", "0");
        }}
      />
    </div>

    {/* All */}
    <div className="d-flex justify-content-between align-items-center mb-2">
      <label
        className="form-label mb-3 mt-3 sub-payment"
        style={{
          color: formData.delivery_type === "All" ? "#32353A" : "#676A6D",
          fontWeight: formData.delivery_type === "All" ? "600" : "400",
        }}
      >
        All of the above
      </label>
      <input
        type="checkbox"
        className="form-check-input"
        checked={formData.delivery_type === "All"}
        onChange={() => {
          handleChange("delivery_type", "All");
          handleChange("onDemands", "0");
        }}
      />
    </div>
  </>
)}




        {/* Footer Buttons */}
        <div className="footer-buttons">
          <button
            className="btn skip-btn px-4"
            onClick={() => handleNext(false)}
          >
            <span className="skip-text">Skip</span>
          </button>
          <button
            className={`btn px-4 save-btn ${
              isDirty ? "btn-success" : "btn-secondary"
            }`}
            onClick={() => handleNext(true)}
            disabled={!isDirty}
          >
           <span className="save-text">{page === 4 ? "Finish" : "Save & Continue"}</span> 
          </button>
        </div>
      </div>
    </div>
  );
}
