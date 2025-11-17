"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
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
import Link from "next/link";



const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const QRPage = () => {
  const router = useRouter();
  const params = useParams();
  const offerIdParam = params?.id;

  // read from sessionStorage (Option A: individual session keys)
  const sessionAvailable = typeof window !== "undefined";

  const business_slug_session = sessionAvailable
    ? sessionStorage.getItem("business_slug1")
    : null;

  const session_packageCode = sessionAvailable
    ? sessionStorage.getItem("packageCode")
    : null;
  const session_packageId = sessionAvailable
    ? sessionStorage.getItem("packageId")
    : null;
  const session_businessId = sessionAvailable
    ? sessionStorage.getItem("businessId")
    : null;
  const session_type = sessionAvailable ? sessionStorage.getItem("type") : null;
  const session_plan_for = sessionAvailable
    ? sessionStorage.getItem("plan_for")
    : null;
  const session_amount = sessionAvailable ? sessionStorage.getItem("amount") : null;
  const session_planId = sessionAvailable ? sessionStorage.getItem("planId") : null;
  const session_durationDays = sessionAvailable
    ? sessionStorage.getItem("durationDays")
    : null;
  const session_gstNo = sessionAvailable ? sessionStorage.getItem("gstNo") : null;

  const business_slug = business_slug_session || "";

  const [sharelink, setShareLink] = useState(
    `https://app.disblay.com/s/${business_slug}`
  );
  const [packageCode, setPackageCode] = useState(session_packageCode || "");
  const [packageName, setPackageName] = useState("");
  const [packageId, setPackageId] = useState(session_packageId || "");
  const [isPaid, setIsPaid] = useState(null);
  const [isPaidLoaded, setIsPaidLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userData, setUserData] = useState({});
  const [amount, setAmount] = useState(session_amount ? Number(session_amount) : 500);

  const qrRef = useRef();

  // keep variable names expected later in code (matching original)
  const passedAmount = session_amount || null;
  const planId = session_planId || null;
  const plan_for = session_plan_for || null;
  const type = session_type || null;
  const durationDays = session_durationDays || null;
  const gstNo = session_gstNo || null;

  // 🔹 Load package + business details
  useEffect(() => {
    // if biz id stored in localStorage use it
    const bizIdFromLocal = (() => {
      try {
        return JSON.parse(localStorage.getItem("businessId"));
      } catch {
        return null;
      }
    })();

    const bizId = bizIdFromLocal || (session_businessId ? session_businessId : null);

    if (bizId) getBusinessUserDetails(bizId);

    // if passedAmount exists in sessionStorage set it
    if (passedAmount) setAmount(Number(passedAmount));

    // Priority: if offerIdParam present, use it; otherwise fallback to session packageCode
    const effectiveOfferId = offerIdParam || session_packageCode || null;

    if (plan_for === "package" && effectiveOfferId) {
      setPackageCode(effectiveOfferId);
      // if session already has packageId we keep it; else fetch by code
      if (session_packageId) {
        setPackageId(session_packageId);
        setIsPaidLoaded(true); // assume existing session values imply loaded, still we can call getPackageIdFromCode to refresh name/link
        // but call getPackageIdFromCode to ensure name & share link are set (non-blocking)
        getPackageIdFromCode(effectiveOfferId);
      } else {
        getPackageIdFromCode(effectiveOfferId);
      }
    }

    if (plan_for === "business") {
      setIsPaid("0"); // unpaid by default
      setIsPaidLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offerIdParam]);

  // 🔹 Auto-trigger payment if business subscription
  useEffect(() => {
    if (
      userData?.id &&
      ((plan_for === "business" && isPaid === "0") ||
        (plan_for === "package" && isPaid === "0") ||
        (plan_for === "package" && isPaid === "0" && type === "Renewal"))
    ) {
      handlePayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, isPaid, plan_for, type]);

  // 🔹 API: getPackageList
  const getPackageIdFromCode = async (code) => {
    try {
      const bizIdFromLocal = (() => {
        try {
          return JSON.parse(localStorage.getItem("businessId"));
        } catch {
          return null;
        }
      })();
      const bizId = bizIdFromLocal || (session_businessId ? session_businessId : null);

      const businessSlugRaw = localStorage.getItem("business_slug") || "business";

      const response = await axios.post(`${BASE_URL}/getPackageList.php`, {
        business_id: bizId,
      });

      if (response.data.status === "success") {
        const matched = response.data.response.find((pkg) => pkg.package_code === code);

        if (matched) {
          setPackageId(matched.id);
          setIsPaid(matched.isPaid);
          setPackageName(matched.package_name);
          setIsPaidLoaded(true);

          // update sessionStorage so other pages see this
          if (sessionAvailable) {
            sessionStorage.setItem("packageId", matched.id || "");
            sessionStorage.setItem("packageCode", matched.package_code || "");
          }

          // slugify both names
          const packageSlug = slugify(matched.package_name || "");
          const businessSlug = sessionAvailable
            ? sessionStorage.getItem("business_slug1") || business_slug_raw_fallback()
            : business_slug_raw_fallback();

          const slugLink = `https://app.disblay.com/${businessSlug}/${packageSlug}`;
          setShareLink(slugLink);
        } else {
          // If not matched, still mark loaded to avoid infinite loading
          setIsPaidLoaded(true);
          console.warn("Package code not found in package list:", code);
        }
      } else {
        // API didn't return success, mark loaded to avoid infinite loading
        setIsPaidLoaded(true);
        console.warn("getPackageList returned non-success:", response.data);
      }
    } catch (err) {
      console.error("Error in getPackageIdFromCode:", err);
      // make sure we don't stay stuck in loading
      setIsPaidLoaded(true);
    }
  };

  // helper to fallback business slug if local/session missing
  const business_slug_raw_fallback = () => {
    try {
      return localStorage.getItem("business_slug") || localStorage.getItem("business_slug1") || "business";
    } catch {
      return "business";
    }
  };

  // 🔹 API: getBusinessDetails
  const getBusinessUserDetails = async (bizId) => {
    try {
      const response = await axios.post(`${BASE_URL}/getBusinessDetails.php`, {
        business_id: bizId,
      });
      if (response.data && response.data.response) {
        setUserData(response.data.response);

        // update session values from response if useful
        if (sessionAvailable) {
          try {
            if (response.data.response.business_slug) {
              sessionStorage.setItem("business_slug1", response.data.response.business_slug);
              setShareLink(`https://app.disblay.com/s/${response.data.response.business_slug}`);
            }
          } catch {}
        }
      }
    } catch (error) {
      console.error("Error fetching business details:", error);
    }
  };

  // helper
  const slugify = (text) =>
    String(text || "")
      .toLowerCase()
      .trim()
      .replace(/&/g, "-and-")
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // download QR
  const handleDownload = () => {
    const canvas = qrRef.current;
    if (!canvas) return;
    try {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "combo_qr.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error("QR download failed:", err);
    }
  };

  // 🔹 Razorpay script loader
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 🔹 Handle Payment (with free combo check)
  const handlePayment = async () => {
    try {
      // ✅ Free combo (only for package)
      if (
        plan_for === "package" &&
        userData?.isPaid === "1" &&
        userData?.has_used_free_combo === "0"
      ) {
        const payload = {
          userId: userData.user_id,
          businessId: userData.id,
          package_id: packageId,
          package_code: packageCode,
        };

        const res = await axios.post(`${BASE_URL}/freeSubcription.php`, payload);

        if (res.data?.status === "success") {
          await Swal.fire({
            icon: "success",
            title: "🎉 Free Subscription Activated!",
            text: "Your free subscription was applied successfully.",
            confirmButtonText: "Continue",
          });

          // preserve same behavior as React navigate with state by storing to sessionStorage
          if (sessionAvailable) {
            try {
              sessionStorage.setItem("businessId", userData.id || "");
              sessionStorage.setItem("packageId", packageId || "");
              sessionStorage.setItem("packageCode", packageCode || "");
            } catch {}
          }

          router.push(`/share/${packageCode}`);
          return;
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: res.data?.msg || "Unable to apply free subscription.",
          });
          return;
        }
      }

      // ✅ Load Razorpay SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        Swal.fire({
          icon: "error",
          title: "SDK Load Failed",
          text: "Razorpay SDK failed to load.",
        });
        return;
      }

      // ✅ Payment payload
      const payload = {
        userId: userData.id,
        userName: userData.business_user_name,
        businessId: userData.id,
        amount: amount * 100,
        currency: "INR",
        description: "Subscription Payment",
        email: userData.business_email,
        mobile: userData.business_mobile,
      };

      const razorpayOrderIdData = await fetch(`${BASE_URL}/generate_razorpayOrderId.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const razorpayOrderIdData1 = await razorpayOrderIdData.json();

      const options = {
        key: razorpayOrderIdData1.res.apiKeyId,
        amount: amount * 100,
        currency: "INR",
        name: "Disblay",
        description: "Subscription Payment",
        order_id: razorpayOrderIdData1.res.transactionId,

        handler: function (response) {
          finalizePayment(
            response.razorpay_payment_id,
            razorpayOrderIdData1.res.transactionId,
            response.razorpay_signature
          );
        },

        prefill: {
          name: userData.business_user_name,
          email: userData.business_email,
          contact: userData.business_mobile,
        },

        theme: { color: "#3399cc" },
      };

      // ✅ Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);

      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: "Something went wrong during payment. Please try again.",
      });
    }
  };

  // 🔹 Finalize Payment
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
  userName: userData.business_user_name,      // ✅ ADDED
  businessId: userData.id,
  amount: (amount * 100).toString(),
  paymentMode: "online",
  description: "Subscription Payment",        // ✅ ADDED
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

      // mimic original navigate with state by storing result in sessionStorage
      if (sessionAvailable) {
        try {
          sessionStorage.setItem("planAmount", String(amount));
          sessionStorage.setItem("shareLink", sharelink || "");
          sessionStorage.setItem("planId", planId || "");
          sessionStorage.setItem("plan_for", plan_for || "");
          sessionStorage.setItem("durationDays", durationDays || "");
        } catch {}
      }

      router.push("/success");
    } catch (error) {
      console.error("Finalize Payment Failed:", error);
    }
  };

  // 🔹 Redirect screen for unpaid / renewal
  if (
    (plan_for === "business" && isPaid === "0") ||
    (plan_for === "package" && isPaid === "0") ||
    type === "Renewal"
  ) {
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

  // 🔹 Show QR page (packages only)
  return (
    <div className="container-fluid py-5" style={{ fontFamily: "Manrope" }}>
      {isPaidLoaded && plan_for === "package" ? (
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
                <button className="btn btn-outline-secondary" onClick={handleDownload}>
                  Download QR
                </button>
                <button className="btn btn-dark" onClick={() => router.push("/Admin")}>
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
                <input type="text" value={sharelink} readOnly className="form-control" />
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(sharelink);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch (err) {
                      console.error("Clipboard write failed:", err);
                    }
                  }}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="d-flex flex-wrap gap-3 fs-4">
                <Link
                  href={`https://wa.me/?text=${encodeURIComponent(sharelink)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaWhatsapp color="#25D366" />
                </Link>
                <Link
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    sharelink
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaFacebook color="#4267B2" />
                </Link>
                <Link
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                    sharelink
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedin color="#0077B5" />
                </Link>
                <Link
                  href={`https://www.instagram.com/?url=${encodeURIComponent(sharelink)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaInstagram color="#E1306C" />
                </Link>
                <Link
                  href={`https://t.me/share/url?url=${encodeURIComponent(sharelink)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaTelegram color="#0088cc" />
                </Link>
                <Link
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(sharelink)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaXTwitter color="#000" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </div>
  );
};

export default QRPage;
