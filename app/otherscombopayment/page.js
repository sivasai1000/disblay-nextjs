// src/components/ComboPayment.js
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/OthersTopNav";
import LeftNav from "@/components/OthersLeftNav";
import {
  useBusinessSubscription,
  useComboList,
} from "@/components/OthersBusinessApi";
import "@/css/ComboPayment.css";

const OthersComboPayment = () => {

  const whatsapp1 = "/assets/img/whatsapp1.svg";
  const linkedin1 = "/assets/img/linkedin1.svg";
  const x1 = "/assets/img/x1.svg";
  const youtube1 = "/assets/img/youtube1.svg";
  const instagram1 = "/assets/img/instagram1.svg";
  const facebook1 = "/assets/img/facebook1.svg";
  const mail = "/assets/img/mail.svg";
  const telegram1 = "/assets/img/telegram1.svg";
  const close = "/assets/img/close.svg";
  const insta = "/assets/img/insta.svg";
  const redshare = "/assets/img/redshare.svg";

  const router = useRouter();

  // ---------------- SAFE STATES ----------------
  const [packageId, setPackageId] = React.useState(null);
  const [businessId, setBusinessId] = React.useState(null);
  const [businessName, setBusinessName] = React.useState(""); // FIXED localStorage
  const [shareLink, setShareLink] = React.useState("");
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Load router state + localStorage safely
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const state = window.history.state?.state || {};

      setPackageId(state.packageId || null);
      setBusinessId(state.businessId || null);

      // FIX: Safe business slug load
      setBusinessName(localStorage.getItem("business_slug1") || "");
    }
  }, []);
  // ------------------------------------------------

  // API calls
  const { data: subscriptionData, isLoading: subLoading } =
    useBusinessSubscription(
      { business_id: businessId, package_id: packageId },
      { enabled: !!businessId && !!packageId }
    );

  const { data: comboListData, isLoading: comboLoading } =
    useComboList(
      { business_id: businessId },
      { enabled: !!businessId }
    );

  if (subLoading || comboLoading) {
    return (
      <>
        <TopNav />
        <div className="d-flex">
          <LeftNav />
          <div className="flex-grow-1 p-4">Loading subscription details...</div>
        </div>
      </>
    );
  }

  // Helpers
  const slugify = (text) =>
    text?.toString().toLowerCase().trim()
      .replace(/&/g, "-and-")
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const subscription = subscriptionData?.res || {};
  const comboInfo =
    comboListData?.response?.find(
      (pkg) => String(pkg.id) === String(packageId)
    ) || {};

  // 🟢 FIXED — businessName now loaded safely
  const pkgName = comboInfo?.package_name || "package";
  const BASE_URL = "https://app.disblay.com";

  const link = `${BASE_URL}/s/${encodeURIComponent(businessName)}/${encodeURIComponent(slugify(pkgName))}`;

  const handleShareModal = () => {
    const builtLink =
      `${BASE_URL}/s/${encodeURIComponent(businessName)}/${encodeURIComponent(slugify(pkgName))}`;

    setShareLink(builtLink);
    setShowShareModal(true);
  };

  // Values
  const categories = comboInfo.totalCategories ?? 0;
  const items = comboInfo.totalItems ?? 0;
  const cost = comboInfo.totalPrice ?? 0;
  const packageName = comboInfo.package_name;

  return (
    <>
      <div className="d-flex min-vh-100" style={{ background: "#F4F5FB" }}>
        <LeftNav />
        <div className="flex-grow-1 d-flex flex-column">
          <TopNav />

          <div className="flex-grow-1 p-4">
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>

              {/* MAIN CARD */}
              <div
                className="p-3"
                style={{
                  borderRadius: "12px",
                  background: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  marginBottom: "20px",
                }}
              >
                <div className="combopayment-head mb-3">
                  Combo ID : {subscription.id}
                </div>

                {/* Top gradient */}
                <div
                  style={{
                    padding: "20px",
                    borderRadius: "10px",
                    background:
                      "linear-gradient(90deg, rgba(246, 45, 45, 0.1) 0%, rgba(192, 45, 246, 0.1) 100%)",
                  }}
                >
                  <div className="d-flex align-items-center gap-3 mb-3">
                    {comboInfo.package_poster ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${comboInfo.package_poster}`}
                        alt="poster"
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "6px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "6px",
                          background: "#eee",
                        }}
                      />
                    )}
                    <div className="payment-comboname">
                      {comboInfo.package_name}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between text-center">
                    <div>
                      <div className="payment-categories">No of Categories</div>
                      <div className="payment-categoriesvalues">
                        {categories}
                      </div>
                    </div>
                    <div>
                      <div className="payment-categories">No of Items</div>
                      <div className="payment-categoriesvalues">{items}</div>
                    </div>
                    <div>
                      <div className="payment-categories">Cost</div>
                      <div className="payment-categoriesvalues">₹{cost}/-</div>
                    </div>
                  </div>
                </div>

                {/* White bottom */}
                <div style={{ padding: "20px", background: "#fff" }}>
                  <div className="row align-items-stretch">
                    {/* Left column */}
                    <div className="col-4 d-flex flex-column">
                      <div
                        style={{
                          background: "#fff",
                          border: "1px solid #eee",
                          borderRadius: "8px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                          width: "144px",
                          height: "88px",
                        }}
                      >
                        <div
                          style={{
                            background:
                              "linear-gradient(284.69deg, #F62D2D 7.92%, #FF6161 100%)",
                            color: "#fff",
                            textAlign: "center",
                            padding: "6px 0",
                            fontWeight: "700",
                            fontSize: "20px",
                          }}
                        >
                          Day Left
                        </div>
                        <div
                          style={{
                            color: "red",
                            fontWeight: "700",
                            fontSize: "22px",
                            margin: "8px 0",
                          }}
                        >
                          {subscription.remaining_days} Days
                        </div>
                      </div>

                      <button
                        style={{
                          marginTop: "12px",
                          background: "#27A64B",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 20px",
                          color: "#fff",
                          fontWeight: "700",
                          width: "144px",
                          height: "48px",
                        }}
                      >
                        Renewal
                      </button>
                    </div>

                    {/* Center col */}
                    <div className="col-4 text-center">
                      <div className="mt-4 py-3">
                        <div className="created-on mb-2">Created on</div>
                        <div className="created-value">
                          {subscription.start_date}
                        </div>
                      </div>
                      <div className="created-on mt-2">Last Updated Date</div>
                      <p className="created-value mt-1">
                        {subscription.updated || "Up to Date"}
                      </p>
                    </div>

                    {/* Right col */}
                    <div className="col-4 d-flex flex-column align-items-end">
                      <div className="mt-4 py-3">
                        <div className="created-on mb-2">Combo Expiry Date</div>
                        <div className="created-value">
                          {subscription.end_date}
                        </div>
                      </div>

                      <button
                        style={{
                          background: "#000",
                          color: "#fff",
                          borderRadius: "6px",
                          padding: "8px 20px",
                          width: "127px",
                          height: "48px",
                          fontWeight: "600",
                        }}
                        onClick={() => {
                          sessionStorage.setItem("businessId", businessId);
                          sessionStorage.setItem("packageId", packageId);
                          sessionStorage.setItem("packageName", packageName);
                          router.push("/othersbillhistory");
                        }}
                      >
                        Bill History
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECOND CARD */}
              <div
                style={{
                  borderRadius: "12px",
                  padding: "20px",
                  background: "#fff",
                  border: "1px solid #eee",
                }}
              >
                <div className="mb-3">
                  <label className="combopayment-num mb-2">GST No</label>
                  <input
                    type="text"
                    className="form-control combopayment-input"
                    value={subscription.gst_number || ""}
                    readOnly
                  />
                </div>

                <div>
                  <label className="combopayment-num mb-2">
                    Your Generated Combo Menu Link
                  </label>

                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control combopayment-input1 combopayment-textinput"
                      value={link}
                      readOnly
                    />
                    <button
                      style={{
                        border: "1px solid red",
                        borderRadius: "6px",
                        background: "transparent",
                        color: "red",
                        width: "101px",
                        height: "50px",
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                      onClick={handleShareModal}
                    >
                      Share <img src={redshare} alt="share" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showShareModal && (
            <div
              className="transparent-overlay d-flex justify-content-center align-items-center px-4"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.4)",
                zIndex: 9999,
              }}
            >
              <div
                className="share-card-wrapper px-3"
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  width: "450px",
                  maxWidth: "95%",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                  padding: "20px",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div style={{ fontSize: "24px", fontWeight: "800" }}>
                    Share
                  </div>
                  <button
                    onClick={() => setShowShareModal(false)}
                    style={{ border: "none", background: "transparent" }}
                  >
                    <img src={close} width={32} height={32} alt="close" />
                  </button>
                </div>

                <div className="share-linkvia mb-3">Share link via</div>

                <div className="d-flex gap-3 flex-wrap mb-4">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      shareLink
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={whatsapp1} width={52} height={52} />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareLink
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={facebook1} width={52} height={52} />
                  </a>
                  <a
                    href={`https://www.instagram.com/?url=${encodeURIComponent(
                      shareLink
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={insta} width={52} height={52} />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                      shareLink
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={linkedin1} width={52} height={52} />
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(
                      shareLink
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={telegram1} width={52} height={52} />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      shareLink
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={x1} width={52} height={52} />
                  </a>
                </div>

                <div className="share-linkvia mb-2">or copy link</div>

                <div
                  className="d-flex align-items-center rounded px-2"
                  style={{
                    height: "54px",
                    background: "#F62D2D1A",
                  }}
                >
                  <input
                    type="text"
                    readOnly
                    value={shareLink}
                    className="form-control border-0 p-0 me-2"
                    style={{
                      color: "#F62D2D",
                      background: "transparent",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="btn"
                    style={{
                      background:
                        "linear-gradient(284.69deg, #F62D2D 7.92%, #FF6161 100%)",
                      color: "#fff",
                    }}
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OthersComboPayment;
