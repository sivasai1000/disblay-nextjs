// src/components/QRPage.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import {
  FaWhatsapp,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaTelegram,
  FaXTwitter,
} from "react-icons/fa6";
import Swal from "sweetalert2";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const QRPage = () => {
  const params = useParams(); // next/navigation useParams
  const offerIdParam = params?.id || ""; // may be undefined
  const router = useRouter();

  // refs
  const qrRef = useRef(null);
  const razorpayScriptLoadedRef = useRef(false);

  // state
  const [sharelink, setShareLink] = useState("");
  const [packageCode, setPackageCode] = useState("");
  const [packageName, setPackageName] = useState("");
  const [packageId, setPackageId] = useState("");
  const [isPaid, setIsPaid] = useState(null); // "0" or "1"
  const [isPaidLoaded, setIsPaidLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userData, setUserData] = useState({});
  const [amount, setAmount] = useState(500);

  // session values
  const [passedAmount, setPassedAmount] = useState("");
  const [planId, setPlanId] = useState("");
  const [plan_for, setPlanFor] = useState("");
  const [type, setType] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [gstNo, setGstNo] = useState("");

  // --- Load all session/local values once (in browser) and mark loaded ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    const amountS = sessionStorage.getItem("amount") || "";
    const planIdS = sessionStorage.getItem("planId") || "";
    const planForS = sessionStorage.getItem("plan_for") || "";
    const typeS = sessionStorage.getItem("type") || "";
    const durationS = sessionStorage.getItem("durationDays") || "";
    const gstS = sessionStorage.getItem("gstNo") || "";

    setPassedAmount(amountS);
    setPlanId(planIdS);
    setPlanFor(planForS);
    setType(typeS);
    setDurationDays(durationS);
    setGstNo(gstS);

    // business slug default sharelink
    const business_slug1 = localStorage.getItem("business_slug1") || "";
    const defaultShare = business_slug1
      ? `https://app.disblay.com/s/${business_slug1}`
      : `https://app.disblay.com/`;
    setShareLink(defaultShare);

    // mark that we're done reading session/localStorage
    // small microtask delay to avoid race conditions
    setTimeout(() => setIsPaidLoaded(true), 0);
  }, []);

  // --- Load business details (if businessId present) ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    const bizRaw = localStorage.getItem("businessId");
    let bizId = null;
    try {
      bizId = bizRaw ? JSON.parse(bizRaw) : null;
    } catch (e) {
      // fallback if stored as plain string id
      bizId = bizRaw || null;
    }
    if (bizId) {
      getBusinessUserDetails(bizId);
    }
    // if passed amount present set amount
    if (passedAmount) {
      const num = Number(passedAmount);
      if (!Number.isNaN(num) && num > 0) setAmount(num);
    }
    // set package code from route param
    if (offerIdParam) {
      setPackageCode(offerIdParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passedAmount, offerIdParam]);

  // --- When plan_for and packageCode are known, fetch package info ---
  useEffect(() => {
    if (!isPaidLoaded) return; // wait until session/local load completed
    if (!plan_for) return;
    if (plan_for === "package" && packageCode) {
      getPackageIdFromCode(packageCode);
    }
    if (plan_for === "business") {
      // default unpaid for business flow
      setIsPaid("0");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaidLoaded, plan_for, packageCode]);

  // --- Trigger payment only once everything is ready ---
  useEffect(() => {
    // Ensure session/local values loaded, userData fetched, and isPaid known
    if (!isPaidLoaded) return;
    if (!userData?.id) return;
    if (!plan_for) return;
    if (isPaid === null) return;

    // If unpaid — open payment
    if (isPaid === "0") {
      // Prevent double calls by ensuring Razorpay script isn't already open/loaded
      handlePayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaidLoaded, userData, isPaid, plan_for, type]);

  // --------------------- API: getPackageList (resolve code -> id) ---------------------
  const getPackageIdFromCode = async (code) => {
    try {
      const bizRaw = localStorage.getItem("businessId");
      let bizId = null;
      try {
        bizId = bizRaw ? JSON.parse(bizRaw) : bizRaw;
      } catch (e) {
        bizId = bizRaw || null;
      }

      const response = await axios.post(`${BASE_URL}/getPackageList.php`, {
        business_id: bizId,
      });

      if (response.data.status === "success") {
        const matched = response.data.response.find(
          (pkg) => String(pkg.package_code) === String(code)
        );

        if (matched) {
          setPackageId(matched.id);
          setIsPaid(String(matched.isPaid)); // ensure string
          setPackageName(matched.package_name || "");

          // slugify both names
          const packageSlug = slugify(matched.package_name || "");
          const businessSlug =
            typeof window !== "undefined"
              ? localStorage.getItem("business_slug1") || ""
              : "";
          const slugLink = businessSlug
            ? `https://app.disblay.com/${businessSlug}/${packageSlug}`
            : `https://app.disblay.com/${packageSlug}`;

          setShareLink(slugLink);
        } else {
          // no match: mark loaded to avoid infinite loading
          setIsPaidLoaded(true);
        }
      } else {
        setIsPaidLoaded(true);
      }
    } catch (err) {
      console.error("Error in getPackageIdFromCode:", err);
      setIsPaidLoaded(true);
    }
  };

  // --------------------- API: getBusinessDetails ---------------------
  const getBusinessUserDetails = async (bizId) => {
    try {
      const response = await axios.post(`${BASE_URL}/getBusinessDetails.php`, {
        business_id: bizId,
      });
      if (response.data && response.data.response) {
        setUserData(response.data.response);
      }
    } catch (error) {
      console.error("Error fetching business details:", error);
    }
  };

  // --------------------- helpers ---------------------
  const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/&/g, "-and-")
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // --------------------- download QR ---------------------
  const handleDownload = () => {
    try {
      const node = qrRef.current;
      // qrcode.react forwards ref to <canvas>, but in case it doesn't, try to query
      const canvas =
        node && typeof node.toDataURL === "function"
          ? node
          : node?.querySelector?.("canvas");
      if (!canvas) {
        Swal.fire({
          icon: "error",
          title: "Download failed",
          text: "QR canvas not found.",
        });
        return;
      }
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "combo_qr.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (e) {
      console.error("Download QR failed:", e);
    }
  };

  // --------------------- Razorpay loader (idempotent) ---------------------
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      // If already present or window.Razorpay exists, resolve true
      if (razorpayScriptLoadedRef.current || window.Razorpay) {
        razorpayScriptLoadedRef.current = true;
        return resolve(true);
      }

      // prevent duplicate script nodes
      if (document.getElementById("razorpay-sdk")) {
        // wait a tick for it to load
        const existing = document.getElementById("razorpay-sdk");
        existing.addEventListener("load", () => {
          razorpayScriptLoadedRef.current = true;
          resolve(true);
        });
        existing.addEventListener("error", () => resolve(false));
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        razorpayScriptLoadedRef.current = true;
        resolve(true);
      };
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // --------------------- Handle Payment ---------------------
  const handlePayment = async () => {
    try {
      // safety: ensure single invocation (if Razorpay already opening, return)
      if (typeof window === "undefined") return;
      if (window.__razorpay_opening) return; // simple guard
      window.__razorpay_opening = true;

      // Free combo path (package + user hasn't used free)
      if (
        plan_for === "package" &&
        userData?.isPaid === "1" &&
        userData?.has_used_free_combo === "0"
      ) {
        const payload = {
          userId: userData.user_id || userData.id,
          businessId: userData.id,
          package_id: packageId,
          package_code: packageCode,
        };

        const res = await axios.post(`${BASE_URL}/freeSubcription.php`, payload);

        if (res.data?.status === "success") {
          await Swal.fire({
            icon: "success",
            title: "Free Subscription Activated!",
            text: "Redirecting...",
            timer: 1500,
            showConfirmButton: false,
          });

          sessionStorage.setItem("businessId", userData.id);
          sessionStorage.setItem("packageId", packageId);
          sessionStorage.setItem("packageCode", packageCode);

          router.push("/othersshare/" + packageCode);
          window.__razorpay_opening = false;
          return;
        } else {
          await Swal.fire({
            icon: "error",
            title: "Free Subscription Failed",
            text: res.data?.msg || "Please try again.",
          });
          window.__razorpay_opening = false;
          return;
        }
      }

      // load SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        await Swal.fire({
          icon: "error",
          title: "Razorpay Error",
          text: "Failed to load Razorpay SDK. Please check network or try later.",
        });
        window.__razorpay_opening = false;
        return;
      }

      // create order on server
      const payload = {
        userId: userData.id || userData.user_id,
        userName: userData.business_user_name || userData.name || "",
        businessId: userData.id,
        amount: Math.round(Number(amount) * 100), // paise
        currency: "INR",
        description: "Subscription Payment",
        email: userData.business_email || "",
        mobile: userData.business_mobile || "",
      };

      const razorpayOrderIdResp = await fetch(
        `${BASE_URL}/generate_razorpayOrderId.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const razorpayOrderIdData = await razorpayOrderIdResp.json();

      if (!razorpayOrderIdData?.res?.transactionId) {
        throw new Error("Invalid order id response");
      }

      const options = {
        key: razorpayOrderIdData.res.apiKeyId,
        amount: Math.round(Number(amount) * 100),
        currency: "INR",
        name: "Disblay",
        description: "Subscription Payment",
        order_id: razorpayOrderIdData.res.transactionId,
        handler: function (response) {
          // finalize
          finalizePayment(
            response.razorpay_payment_id,
            razorpayOrderIdData.res.transactionId,
            response.razorpay_signature
          );
        },
        prefill: {
          name: userData.business_user_name || "",
          email: userData.business_email || "",
          contact: userData.business_mobile || "",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on && rzp.on("payment.failed", async function (response) {
        await Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: response?.error?.description || "Transaction failed.",
        });
        window.__razorpay_opening = false;
      });

      rzp.open();
      // after rzp.open returns, Razorpay UI takes over. clear guard when popup finishes (handler/fail will clear)
      // provide a fallback clear after 2 minutes
      setTimeout(() => {
        window.__razorpay_opening = false;
      }, 2 * 60 * 1000);
    } catch (err) {
      console.error("Payment error:", err);
      await Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: "Something went wrong. Please try again.",
      });
      window.__razorpay_opening = false;
    }
  };

  // --------------------- finalizePayment ---------------------
  const finalizePayment = async (payment_id, order_id, signature) => {
    try {
      const payload = {
        plan_id: planId,
        gst_no: gstNo || "",
        orderId: order_id,
        payment_id: payment_id,
        signature: signature,
        paymentStatus: "paid",
        userId: userData.id,
        businessId: userData.id,
        amount: (Number(amount) * 100).toString(),
        paymentMode: "online",
        package_id: plan_for === "package" ? packageId : "",
        package_code: plan_for === "package" ? packageCode : "",
        subscription_type: type,
        payment_for: plan_for,
      };

      const endpoint =
        plan_for === "business"
          ? `${BASE_URL}/businessSubscriptionPayment.php`
          : `${BASE_URL}/subscription_payment.php`;

      await axios.post(endpoint, payload);

      setIsPaid("1");

      sessionStorage.setItem("planAmount", amount);
      sessionStorage.setItem("shareLink", sharelink);
      sessionStorage.setItem("planId", planId);
      sessionStorage.setItem("plan_for", plan_for);
      sessionStorage.setItem("durationDays", durationDays);

      router.push("/otherssuccess");
    } catch (error) {
      console.error("Finalize Payment Failed:", error);
      await Swal.fire({
        icon: "error",
        title: "Finalize Error",
        text: "Payment succeeded but finalization failed. Contact support.",
      });
    } finally {
      window.__razorpay_opening = false;
    }
  };

  // --------------------- UI ---------------------
  // If session/local values haven't been loaded, show loading
  if (!isPaidLoaded) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <p style={{ fontFamily: "Manrope", fontSize: "18px" }}>Loading...</p>
      </div>
    );
  }

  // If unpaid and ready, show redirecting message while payment UI opens (auto)
  if ((plan_for === "business" || plan_for === "package") && isPaid === "0") {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <p style={{ fontFamily: "Manrope", fontSize: "18px" }}>
          Redirecting to payment...
        </p>
      </div>
    );
  }

  // Otherwise show QR page (packages only)
  return (
    <div className="container-fluid py-5" style={{ fontFamily: "Manrope" }}>
      {plan_for === "package" ? (
        <div className="row justify-content-center">
          {/* Left: QR Section */}
          <div className="col-md-5">
            <div className="bg-white p-4 rounded shadow-sm text-center">
              <h5 className="fw-bold mb-3 text-dark">Combo ID: {packageCode}</h5>
              <QRCodeCanvas value={sharelink} size={200} ref={qrRef} />
              <p className="mt-3">
                <strong>{packageName}</strong>
              </p>
              <div className="mt-4 d-flex gap-3 justify-content-center">
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleDownload}
                >
                  Download QR
                </button>
                <button
                  className="btn btn-dark"
                  onClick={() => router.push("/othersadmin")}
                >
                  Home
                </button>
              </div>
            </div>
          </div>

          {/* Right: Share & Link */}
          <div className="col-md-5">
            <div className="bg-white p-4 rounded shadow-sm">
              <h6 className="fw-bold mb-3">Your Generated Business Link</h6>
              <div className="d-flex mb-3">
                <input
                  type="text"
                  value={sharelink}
                  readOnly
                  className="form-control"
                />
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    navigator.clipboard.writeText(sharelink);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="d-flex flex-wrap gap-3 fs-4">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(sharelink)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaWhatsapp />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    sharelink
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaFacebook />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                    sharelink
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedin />
                </a>
                <a
                  href={`https://www.instagram.com/?url=${encodeURIComponent(
                    sharelink
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaInstagram />
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(
                    sharelink
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaTelegram />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    sharelink
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaXTwitter />
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">No package selected.</p>
      )}
    </div>
  );
};

export default QRPage;
