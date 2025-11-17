"use client"
import React, { useState } from "react";
import "@/css/businesscreditionals.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import DisblayNav from "@/components/DisblayNav";
import Swal from "sweetalert2";
const globe = "/assets/img/globe.svg";
const celebration = "/assets/img/celebration.gif";


const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Welcome() {
  const [step, setStep] = useState("welcome");
  const [businessName, setBusinessName] = useState("");
  const [tagline, setTagline] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [businessURL, setBusinessURL] = useState("");
  const [loading, setLoading] = useState(false);
   const router = useRouter();

  // ✅ Suggestion generator
  const generateSuggestions = (name) => {
    const base = name.trim().toLowerCase().replace(/[^a-z]/g, "");
    const suffixes = ["foods", "cafe", "hub", "store", "menu", "place"];
    const suggestionSet = new Set();

    while (suggestionSet.size < 3) {
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      suggestionSet.add(`${base}${suffix}`);
    }
    return Array.from(suggestionSet);
  };

  // ✅ Check availability
  const handleBusinessChange = async (e) => {
    const name = e.target.value.replace(/\s+$/, "");
    setBusinessName(name);

    if (/[^a-zA-Z0-9 ]/.test(name)) {
      setIsAvailable(null);
      setSuggestions([]);
      return;
    }

    if (!name.trim()) {
      setIsAvailable(null);
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/checkBusinessName.php`, {
        business_name: name,
      });

      const available =
        res.data?.res?.available ??
        res.data?.available ??
        res.data?.isAvailable ??
        null;

      const serverSuggestions =
        res.data?.res?.suggestions ?? res.data?.suggestions ?? [];

      if (available === true || available === 1 || available === "1") {
        setIsAvailable(true);
        setSuggestions([]);
      } else if (available === false || available === 0 || available === "0") {
        setIsAvailable(false);
        setSuggestions(
          Array.isArray(serverSuggestions) && serverSuggestions.length > 0
            ? serverSuggestions
            : generateSuggestions(name)
        );
      } else {
        setIsAvailable(null);
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Name check failed", err);
      setIsAvailable(null);
      setSuggestions([]);
    }
  };

  // ✅ Proceed
 const handleProceed = async () => {
  const userId = JSON.parse(localStorage.getItem("businessId"));

  // ✅ Validation
  if (!userId || !isAvailable || businessName === "") {
    await Swal.fire({
      icon: "warning",
      title: "Incomplete Details",
      text: "Please fill all fields properly before continuing.",
    });
    return;
  }

  setLoading(true);

  const form = new FormData();
  form.append("business_id", String(userId));
  form.append("business_name", businessName);
  form.append("business_tagline", tagline);

  try {
    const res = await fetch(`${BASE_URL}/updatebusiness.php`, {
      method: "POST",
      body: form,
    });

    const result = await res.json();

    if (result.status === "success") {
      // ✅ Fetch details
      const businessDetails = await axios.post(
        `${BASE_URL}/getBusinessDetails.php`,
        { business_id: userId }
      );

      const slug = businessDetails.data?.response?.slug;
      const businessSlug =
        slug || businessName.trim().toLowerCase().replace(/\s+/g, "-");

      const fullShareLink = `https://disblay.com/${businessSlug}`;
      setBusinessURL(fullShareLink);

      // ✅ Success popup
      await Swal.fire({
        icon: "success",
        title: "Updated Successfully!",
        text: "Your business information has been saved.",
        timer: 1500,
        showConfirmButton: false,
      });

      setStep("success");
    } else {
      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: result.msg || "Unable to update business details.",
      });
    }
  } catch (err) {
    console.error("Error:", err);

    await Swal.fire({
      icon: "error",
      title: "Network Error",
      text: "Something went wrong. Please try again later.",
    });
  } finally {
    setLoading(false);
  }
};


  return (
     <div className="min-vh-100 d-flex flex-column ">
              {/* 🔹 Top Nav */}
              <DisblayNav />
    <div className="auth-container">
        
      <div className="auth-card row d-flex justify-content-center align-items-center">
        {/* Right panel only */}
        <div className="right-panel">
          <div className="form-wrapper text-center">
            {/* STEP 1: Welcome */}
            {step === "welcome" && (
              <>
                <div
                  className="creditionals-header mb-3"
                  style={{ fontSize: "24px", fontWeight: "700" }}
                >
                  Welcome to Disblay!
                </div>
                <ul className="text-start small mb-4">
                  <li>We’re glad you’re here.</li>
                  <li>Check if your business name is available.</li>
                  <li>
                    Fill in your profile details to create a stunning menu and
                    earn customer trust.
                  </li>
                  <li>Let’s build something amazing together!</li>
                </ul>
                <button
                  className="creditional-accountcreate w-100 mb-4 mt-4"
                  onClick={() => setStep("setup")}
                >
                  <span className="creditionals-btntext">
                    Let’s get started 🚀
                  </span>
                </button>
              </>
            )}

            {/* STEP 2: Setup */}
            {step === "setup" && (
              <div className="text-start">
                <div
                  className="creditionals-header mb-4"
                  style={{ fontSize: "22px", fontWeight: "700" }}
                >
                  Set up your Business
                </div>

                {/* Business Name */}
                <label className="form-label creditionals-text mb-3 mt-4 text-start w-100">
                  Business Webpage Address
                </label>
                <div className="position-relative">
                  <input
                    type="text"
                    value={businessName}
                    onChange={handleBusinessChange}
                    placeholder="Enter your business name"
                    className={`creditionals-input w-100 mb-2 ${
                      isAvailable === false
                        ? "is-invalid"
                        : isAvailable === true
                        ? "is-valid"
                        : ""
                    }`}
                    style={{ height: "50px", borderRadius: "8px" }}
                  />
                </div>

                {/* Error & Success */}
                {/[^a-zA-Z0-9 ]/.test(businessName) && (
                  <p className="mt-2" style={{ color: "darkred" }}>
                    ❌ Avoid using special characters in your business name.
                  </p>
                )}
                {!/[^a-zA-Z0-9 ]/.test(businessName) &&
                  isAvailable === true && (
                    <p className="mt-2" style={{ color: "green" }}>
                      ✅ Business name available
                    </p>
                  )}
                {!/[^a-zA-Z0-9 ]/.test(businessName) &&
                  isAvailable === false && (
                    <p className="mt-2" style={{ color: "darkred" }}>
                      ⚠️ Business name not available
                    </p>
                  )}

                {/* Suggestions */}
                {isAvailable === false && suggestions.length > 0 && (
                  <>
                    <div className="mt-3 mb-2 creditionals-text fw-semibold">
                      Suggestions
                    </div>
                    {suggestions.map((sug, index) => (
                      <div className="form-check mb-2" key={index}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="sug"
                          id={`sug-${index}`}
                          onClick={() => {
                            setBusinessName(sug);
                            setIsAvailable(true);
                            setSuggestions([]);
                          }}
                        />
                        <label
                          htmlFor={`sug-${index}`}
                          className="form-check-label ms-2 creditionals-text"
                        >
                          {sug}
                        </label>
                      </div>
                    ))}
                  </>
                )}

                {/* Tagline */}
                <label className="form-label creditionals-text mb-2 mt-4 text-start w-100">
                  Tagline (Optional)
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Enter your tagline"
                  className="creditionals-input w-100 mt-2 mb-4"
                  style={{ height: "50px", borderRadius: "8px" }}
                />

                {/* Proceed */}
                <button
                  className="creditional-accountcreate w-100 mb-4 mt-4"
                  disabled={!isAvailable || loading}
                  onClick={handleProceed}
                  style={{
                    backgroundColor:
                      !isAvailable || loading ? "#ccc" : "#34495E",
                    borderRadius: "8px",
                    height: "50px",
                    fontSize: "18px",
                    cursor: !isAvailable ? "not-allowed" : "pointer",
                  }}
                >
                  <span
                    className="creditionals-btntext"
                    style={{ fontSize: "20px", fontWeight: "600" }}
                  >
                    {loading ? "Saving..." : "Proceed"}
                  </span>
                </button>

                <div className="note-text mt-3">
                  <b>Note:</b> Avoid using special characters like & * ? _ / in
                  your business name. Combine words (e.g., HotelVetrivel) to
                  create a clean link such as{" "}
                  <b>www.disblay.com/hotelvetrivel</b>.
                </div>
              </div>
            )}

            {/* STEP 3: Success */}
            {step === "success" && (
              <div className="text-center">
                
                <img
                  src={celebration}
                  alt="celebration"
                  style={{ width: "150px", height: "150px" }}
                />
                <div
                  className="creditionals-header mt-4"
                  style={{ marginBottom: "50px", fontSize: "24px" }}
                >
                  Congratulations!
                </div>
                <p className="creditonals-already1 mt-4">
                  Your business is now live and ready to shine.
                </p>
                <div className="d-flex align-items-center justify-content-start gap-2 mt-3 p-2 globe-input">
                  <img src={globe} alt="globe" width={24} height={24} />
                  <a
                    href={businessURL}
                    className="business_url"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {businessURL}
                  </a>
                </div>
                <button
                  className="creditional-accountcreate w-100 mt-4"
                  onClick={() => router.push('/othersadmin')}
                  style={{
                    borderRadius: "8px",
                    height: "50px",
                    backgroundColor: "#34495E",
                    fontSize: "18px",
                  }}
                >
                  <span
                    className="creditionals-btntext"
                    style={{ fontSize: "20px", fontWeight: "600" }}
                  >
                    Continue
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
