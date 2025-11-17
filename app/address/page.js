import React, { useState, useEffect } from "react";
import { FaCrosshairs } from "react-icons/fa";
import { useUserAddress, useUpdateUserAddress } from "@/components/userapi";
import "@/css/UserSavedAddress.css";
import { useRouter, usePathname } from "next/navigation";
import LeftNav from "@/components/NewLeftNav";
import TopNav from "@/components/NewTopNav";
import Swal from "sweetalert2";


export default function BusinessNewSavedAddress() {
  
  const userId = localStorage.getItem("userId");

  const { data, refetch } = useUserAddress({ user_id: userId });
  const u = data?.res;

  const updateAddress = useUpdateUserAddress();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});

   const router = useRouter();
  // ✅ Prefill only from address object (NOT root user fields)
  useEffect(() => {
    if (data?.res) {
      const u = data.res;
      const a = u.address || {};
      setForm({
        id: a.id || "",
        requester_name: a.requester_name || "",
        requester_mobile: a.requester_mobile || "",
        requester_email: a.requester_email || "",
        requester_country: a.requester_country || u.country || "",
        requester_state: a.requester_state || u.state || "",
        requester_city: a.requester_city || u.city || "",
        requester_address: a.requester_address || "",
        requester_direction: a.requester_direction || "",
        requester_latlong: a.requester_latlong || "",
        user_id: a.user_id || userId,
      });
    }
  }, [data, userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📍 Auto fetch location
  const handleLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const direction = await fetchDirection(lat, lng);

        setForm((prev) => ({
          ...prev,
          requester_direction: direction,
          requester_latlong: `${lat},${lng}`,
        }));
      },
      () => {
        Swal.fire({
          icon: "error",
          title: "Location Error",
          text: "Unable to fetch your location. Please enable GPS.",
        });
      }
    );
  } else {
    Swal.fire({
      icon: "error",
      title: "Not Supported",
      text: "Geolocation is not supported by your device.",
    });
  }
};

  // ↩ Manual paste latlong
 const handleManualLatLong = async () => {
  if (!form.requester_latlong) {
    Swal.fire({
      icon: "warning",
      title: "Lat/Long Required",
      text: "Please paste lat,long first.",
    });
    return;
  }

  const [lat, lng] = form.requester_latlong.split(",").map((v) => v.trim());

  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Format",
      text: "Use lat,long format (e.g. 17.49224, 78.39919).",
    });
    return;
  }

  const direction = await fetchDirection(lat, lng);

  setForm((prev) => ({
    ...prev,
    requester_direction: direction,
  }));

  Swal.fire({
    icon: "success",
    title: "Location Updated",
    text: "Direction updated based on your provided latitude and longitude.",
    timer: 1200,
    showConfirmButton: false,
  });
};


  // 🌍 Reverse geocode helper
  const fetchDirection = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data?.address) {
        const { road, suburb, city, state, postcode, country } = data.address;
        return `${road || ""}, ${suburb || ""}, ${city || ""}, ${state || ""}, ${
          postcode || ""
        }, ${country || ""}`;
      }
      return `Lat: ${lat}, Lng: ${lng}`;
    } catch (err) {
      console.error("Reverse geocode error:", err);
      return `Lat: ${lat}, Lng: ${lng}`;
    }
  };

  const handleSubmit = async () => {
    const u = data?.res || {};
    const a = data?.res?.address || {};

    const payload = {
      user_id: userId,
      id: u.id,
      name: u.name || "",
      mobile: u.mobile || "",
      email: u.email || "",
      longitude: u.longitude || "",
      latitude: u.latitude || "",
      pincode: u.pincode || "",
      area: u.area || "",
      city: u.city || "",
      state: u.state || "",
      country: u.country || "",
      password: u.password || "",
      ip_address: u.ip_address || "",
      business: u.business || {},
      userName: u.userName || u.name || "",

      // 🔑 Flattened address fields
      requester_name: form.requester_name || a.requester_name || "",
      requester_mobile: form.requester_mobile || a.requester_mobile || "",
      requester_email: form.requester_email || a.requester_email || "",
      requester_country: form.requester_country || a.requester_country || "",
      requester_state: form.requester_state || a.requester_state || "",
      requester_city: form.requester_city || a.requester_city || "",
      requester_address: form.requester_address || a.requester_address || "",
      requester_direction: form.requester_direction || a.requester_direction || "",
      requester_latlong: form.requester_latlong || a.requester_latlong || "",
    };

    console.log("📤 Sending payload:", payload);

    await updateAddress.mutateAsync(payload);
    await refetch();
    setIsEditing(false);
  };


  return (
    <div className="d-flex">
                {/* Sidebar */}
                <div className="d-flex">
                    <LeftNav />
                </div>
                <div className="flex-grow-1">
                    <TopNav />
    <div
      style={{
       
        display: "flex",
        flexDirection: "column",
        background: "#f9fafb",
      }}
    >
     

      {/* ✅ Center wrapper */}
      <div
        className="d-flex justify-content-center"
        style={{ flex: 1, overflowY: "auto", padding: "20px" }}
      >
        {/* ✅ Inner card fills available height */}
        <div
          style={{
            width: "100%",
            maxWidth: "832px",
            height:"100%",
            overflow:"auto",
            background: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          {/* Profile Icon */}
          <div
            className="mt-4 mb-4"
            style={{
              width: "58px ",
              height: "58px",
              borderRadius: "10px",
              backgroundColor: "#34495E1A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: "800",
              color: "#34495E",
              margin: "0 auto",
            }}
          >
            {u?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>

          {/* Editable Fields */}
          <div style={{ flex: 1 }}>
            {[
              { name: "requester_name", label: "Name" },
              { name: "requester_mobile", label: "Mobile" },
              { name: "requester_email", label: "Email" },
              { name: "requester_country", label: "Country" },
              { name: "requester_state", label: "State" },
              { name: "requester_city", label: "City" },
            ].map((f) => (
              <div className="mb-3" key={f.name}>
                <label
                  style={{ fontSize: "15px", fontWeight: "600", marginBottom: "6px" }}
                >
                  {f.label}
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Enter ${f.label}`}
                  name={f.name}
                  value={form[f.name] || ""}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #E0E0E0",
                    borderRadius: "8px",
                    height: "48px",
                    fontSize: "14px",
                    padding: "10px 12px",
                  }}
                />
              </div>
            ))}

            {/* Address */}
            <div className="mb-3">
              <label style={{ fontSize: "15px", fontWeight: "600" }}>Address</label>
              <textarea
                rows={2}
                className="form-control"
                name="requester_address"
                placeholder="Enter your address"
                value={form.requester_address || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  padding: "10px 12px",
                }}
              />
            </div>

            {/* Directions */}
            <div className="mb-3">
              <label style={{ fontSize: "15px", fontWeight: "600" }}>Directions</label>
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn square-btn d-flex justify-content-center align-items-center"
                  disabled={!isEditing}
                  onClick={handleLocation}
                >
                  <FaCrosshairs className="fs-5" style={{ color: "black" }} />
                </button>
                <input
                  type="text"
                  className="form-control"
                  name="requester_direction"
                  placeholder="Street, City, State, Country"
                  value={form.requester_direction || ""}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #E0E0E0",
                    borderRadius: "8px",
                    height: "48px",
                    fontSize: "14px",
                    padding: "10px 12px",
                  }}
                />
              </div>
            </div>

            {/* LatLong */}
            <div className="mb-5">
              <label style={{ fontSize: "15px", fontWeight: "600" }}>
                Paste Location (Lat, Lng)
              </label>
              <div className="direction-wrapper d-flex align-items-center gap-2">
                <input
                  name="requester_latlong"
                  value={form.requester_latlong || ""}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className="form-control"
                  placeholder="e.g. 17.49224,78.39919"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #E0E0E0",
                    borderRadius: "8px",
                    height: "48px",
                    fontSize: "14px",
                    padding: "10px 12px",
                  }}
                />
                {isEditing && (
                  <button
                    type="button"
                    className="btn square-btn"
                    onClick={handleManualLatLong}
                  >
                    ↩
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Buttons pinned at bottom inside card */}
          <div>
            {isEditing ? (
              <button
                className="btn w-100"
                style={{
                  backgroundColor: "#34495e",
                  color: "#fff",
                  fontWeight: "600",
                  borderRadius: "8px",
                  height: "48px",
                }}
                onClick={handleSubmit}
              >
                <span style={{ fontSize: "20px", fontWeight: "700" }}>Save</span>
              </button>
            ) : (
              <button
                className="btn w-100"
                style={{
                  backgroundColor: "#27A376",
                  color: "#fff",
                  fontWeight: "600",
                  borderRadius: "8px",
                  height: "48px",
                }}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}
