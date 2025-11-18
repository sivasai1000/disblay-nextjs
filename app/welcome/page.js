"use client";

import React, { useState } from "react";
import "@/css/welcome.css";
import axios from "axios";


const globe = "/assets/img/globe.svg";
const disblay = "/assets/img/disblay.svg";
const celebration = "/assets/img/celebration.gif";
const creditionalsimg = "/assets/img/creditionals.png";

import Swal from "sweetalert2";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Welcome() {
  const [step, setStep] = useState("welcome");
  const [businessName, setBusinessName] = useState("");
  const [tagline, setTagline] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [businessURL, setBusinessURL] = useState("");

  // 🔹 Suggest name generator
  const generateSuggestions = (name) => {
    const base = name.trim().toLowerCase().replace(/[^a-z]/g, "");
    const suffixes = ["foods", "cafe", "hub", "store", "menu", "place"];

    const set1 = new Set();
    while (set1.size < 3) {
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      set1.add(`${base}${suffix}`);
    }
    return [...set1];
  };

  // 🔹 Check Availability
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

      const serverSug =
        res.data?.res?.suggestions ??
        res.data?.suggestions ??
        [];

      if (available === true || available === 1 || available === "1") {
        setIsAvailable(true);
        setSuggestions([]);
      } else if (available === false || available === 0 || available === "0") {
        setIsAvailable(false);
        setSuggestions(
          serverSug.length > 0 ? serverSug : generateSuggestions(name)
        );
      } else {
        setIsAvailable(null);
        setSuggestions([]);
      }
    } catch (error) {
      console.error(error);
      setIsAvailable(null);
      setSuggestions([]);
    }
  };

  // 🔹 Proceed
  const handleProceed = async () => {
    const userId = JSON.parse(localStorage.getItem("businessId"));

    if (!userId || !isAvailable || businessName === "") {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Details",
        text: "Please fill all fields properly.",
      });
      return;
    }

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
        const details = await axios.post(
          `${BASE_URL}/getBusinessDetails.php`,
          { business_id: userId }
        );

        const slug = details.data?.response?.slug;
        const businessSlug =
          slug || businessName.trim().toLowerCase().replace(/\s+/g, "-");

        const finalURL = `https://disblay.com/${businessSlug}`;
        setBusinessURL(finalURL);

        setStep("success");
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: result.msg || "Failed to update business details.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
  <div className="auth-container">
    <div className="auth-card">

      {/* LEFT SIDE */}
      <div className="left-image" style={{ position: "relative" }}>
        <img
          src={creditionalsimg}
          alt="credentials"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="right-panel">
        <div className="form-wrapper text-center">

          {/* ---------------- WELCOME STEP ---------------- */}
          {step === "welcome" && (
            <>
              <img src={disblay} alt="disblay" width={120} height={35} className="mb-4" />

              <div className="creditionals-header mb-3">Welcome to Disblay!</div>

              <ul className="text-start small mb-4">
                <li>We’re glad you’re here.</li>
                <li>First check if your business name is available.</li>
                <li>Then fill your details to create a stunning menu.</li>
                <li>Let’s build something amazing!</li>
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

          {/* ---------------- SETUP STEP ---------------- */}
          {step === "setup" && (
            <div className="text-start">
              <div className="creditionals-header mb-4">Set up your Business</div>

              <label className="form-label creditionals-text mb-3 mt-4">
                Business Webpage Address
              </label>

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
              />

              {isAvailable === true && businessName && (
                <p className="mt-2" style={{ color: "green" }}>
                  ✅ Business name available
                </p>
              )}

              {isAvailable === false && (
                <p className="mt-2" style={{ color: "darkred" }}>
                  ⚠️ Business name not available
                </p>
              )}

              {isAvailable === false && suggestions.length > 0 && (
                <>
                  <div className="mt-3 mb-2 creditionals-text fw-semibold">
                    Suggestions
                  </div>

                  {suggestions.map((sug, idx) => (
                    <div className="form-check mb-2" key={idx}>
                      <input
                        type="radio"
                        className="form-check-input"
                        name="sug"
                        id={`sug-${idx}`}
                        onClick={() => {
                          setBusinessName(sug);
                          setIsAvailable(true);
                          setSuggestions([]);
                        }}
                      />
                      <label className="form-check-label ms-2" htmlFor={`sug-${idx}`}>
                        {sug}
                      </label>
                    </div>
                  ))}
                </>
              )}

              <label className="form-label creditionals-text mb-2 mt-4">
                Tagline (Optional)
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Enter your tagline"
                className="creditionals-input w-100 mt-2 mb-4"
              />

              <button
                className="creditional-accountcreate w-100 mb-4 mt-4"
                onClick={handleProceed}
                disabled={!isAvailable}
              >
                <span className="creditionals-btntext">Proceed</span>
              </button>
            </div>
          )}

          {/* ---------------- SUCCESS STEP ---------------- */}
          {step === "success" && (
            <div className="text-center">
              <div className="creditionals-header mb-5">Congratulations!</div>

              <img
                src={celebration}
                alt="celebration"
                style={{ width: 150, height: 150 }}
              />

              <p className="creditonals-already1 mt-4">
                Your business is now live and ready to shine.
              </p>

              <div className="d-flex align-items-center justify-content-start gap-2 mt-3 p-2 globe-input">
                <img src={globe} width={24} height={24} alt="globe" />

                <Link
                  href={businessURL}
                  className="business_url"
                  target="_blank"
                  rel="noreferrer"
                >
                  {businessURL}
                </Link>
              </div>

              <button
                className="creditional-accountcreate w-100 mt-4"
                onClick={() => (window.location.href = "/Admin")}
              >
                <span className="creditionals-btntext">Continue</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  </div>
);

}
