"use client";

import React, { useEffect, useState } from "react";
import TopNav from "@/components/TopNav";
import LeftNav from "@/components/LeftNav";
import { useRouter } from "next/navigation";
import {
  useBusinessSubscription,
  useComboList,
} from "@/components/BusinessApi/page";

import "@/css/ComboPayment.css";
import Link from "next/link";

const ComboPayment = () => {
  const router = useRouter();

  // Images
  const close = "/assets/img/close.svg";
  const redshare = "/assets/img/redshare.svg";

  // States for storage
  const [packageId, setPackageId] = useState(null);
  const [businessId, setBusinessId] = useState(null);
  const [packageCode, setPackageCode] = useState(null);
  const [businessName, setBusinessName] = useState("");

  // Load session + local storage
  useEffect(() => {
    const stored = sessionStorage.getItem("planData");
    if (stored) {
      const parsed = JSON.parse(stored);
      setPackageId(parsed.packageId);
      setBusinessId(parsed.businessId);
      setPackageCode(parsed.packageCode);
    }

    const slug = localStorage.getItem("business_slug1");
    if (slug) setBusinessName(slug);
  }, []);

  // ALWAYS call hooks (no early return)
  const {
    data: subscriptionData,
    isLoading: subLoading,
  } = useBusinessSubscription(
    { business_id: businessId, package_id: packageId },
    { enabled: !!businessId && !!packageId }
  );

  const { data: comboListData, isLoading: comboLoading } = useComboList(
    { business_id: businessId },
    { enabled: !!businessId }
  );

  // Loading screen combined (shown inside JSX)
  const isLoadingAll =
    !packageId ||
    !businessId ||
    subLoading ||
    comboLoading ||
    !subscriptionData ||
    !comboListData;

  // Utility
  const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/&/g, "-and-")
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const subscription = subscriptionData?.res ?? {};
  const comboInfo =
    comboListData?.response?.find(
      (item) => String(item.id) === String(packageId)
    ) ?? {};

  const pkgName = comboInfo.package_name || "package";
  const BASE_URL = "https://app.disblay.com";

  const defaultShareLink = `${BASE_URL}/s/${encodeURIComponent(
    businessName
  )}/${encodeURIComponent(slugify(pkgName))}`;

  // Share modal
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState(defaultShareLink);
  const [copied, setCopied] = useState(false);

  const handleShareModal = () => {
    setShareLink(defaultShareLink);
    setShowShareModal(true);
  };

  const categories = comboInfo.totalCategories ?? 0;
  const items = comboInfo.totalItems ?? 0;
  const cost = comboInfo.totalPrice ?? 0;
  const packageName = comboInfo.package_name;

  return (
    <div className="d-flex min-vh-100" style={{ background: "#F4F5FB" }}>
      <LeftNav />

      <div className="flex-grow-1 d-flex flex-column">
        <TopNav />

        <div className="flex-grow-1 p-4">
          {isLoadingAll ? (
            <div className="text-center mt-5">Loading payment details...</div>
          ) : (
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

                {/* TOP SECTION */}
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

                  {/* Stats */}
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
                      <div className="payment-categoriesvalues">
                        ₹{cost}/-
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM SECTION */}
                <div className="row mt-3 px-3">
                  <div className="col-4">
                    <div
                      style={{
                        background: "#fff",
                        border: "1px solid #eee",
                        borderRadius: "8px",
                        width: "144px",
                        height: "88px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
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
                          textAlign: "center",
                          marginTop: "8px",
                          fontSize: "22px",
                          fontWeight: "700",
                        }}
                      >
                        {subscription.remaining_days} Days
                      </div>
                    </div>

                    <button
                      style={{
                        marginTop: "16px",
                        background: "#27A64B",
                        border: "none",
                        padding: "8px 20px",
                        color: "#fff",
                        fontWeight: "700",
                        width: "144px",
                        borderRadius: "6px",
                      }}
                      onClick={() => {
                        sessionStorage.setItem(
                          "planData",
                          JSON.stringify({
                            packageCode,
                            type: "Renewal",
                            plan_for: "package",
                            packageId,
                            businessId,
                          })
                        );
                        router.push("/planselector");
                      }}
                    >
                      Renewal
                    </button>
                  </div>

                  {/* MIDDLE */}
                  <div className="col-4 text-center">
                    <div className="mt-3">
                      <div className="created-on">Created on</div>
                      <div className="created-value">
                        {subscription.start_date}
                      </div>
                    </div>

                    <div className="created-on mt-3">Last Updated</div>
                    <div className="created-value">
                      {subscription.updated || "Up to Date"}
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="col-4 text-end">
                    <div className="mt-3">
                      <div className="created-on">Combo Expiry Date</div>
                      <div className="created-value">
                        {subscription.end_date}
                      </div>
                    </div>

                    <button
                      style={{
                        marginTop: "24px",
                        background: "#000",
                        color: "#fff",
                        padding: "8px 20px",
                        width: "127px",
                        borderRadius: "6px",
                      }}
                      onClick={() => {
                        sessionStorage.setItem(
                          "historyData",
                          JSON.stringify({
                            businessId,
                            packageId,
                            packageName,
                          })
                        );
                        router.push("/billhistory");
                      }}
                    >
                      Bill History
                    </button>
                  </div>
                </div>
              </div>

              {/* GST + SHARE */}
              <div
                style={{
                  borderRadius: "12px",
                  padding: "20px",
                  background: "#fff",
                  border: "1px solid #eee",
                }}
              >
                <label className="combopayment-num mb-2">GST No</label>
                <input
                  type="text"
                  className="form-control combopayment-input"
                  value={subscription.gst_number || ""}
                  readOnly
                />

                <label className="combopayment-num mb-2 mt-3">
                  Your Generated Combo Menu Link
                </label>

                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control combopayment-input1"
                    value={defaultShareLink}
                    readOnly
                  />

                  <button
                    style={{
                      border: "1px solid red",
                      borderRadius: "8px",
                      padding: "0 12px",
                      background: "transparent",
                      color: "red",
                      width: "101px",
                      height: "50px",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                    onClick={handleShareModal}
                  >
                    Share <img src={redshare} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SHARE MODAL */}
        {showShareModal && (
          <div
            className="transparent-overlay d-flex justify-content-center align-items-center px-4"
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)" }}
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
              <div className="d-flex justify-content-between mb-3">
                <div style={{ fontSize: "24px", fontWeight: "800" }}>
                  Share
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  style={{ background: "transparent", border: "none" }}
                >
                  <img src={close} width={32} />
                </button>
              </div>

              <div className="share-linkvia mb-3">Share link via</div>

              <div className="d-flex gap-3 flex-wrap mb-4">
                <Link
                  href={`https://wa.me/?text=${encodeURIComponent(
                    shareLink
                  )}`}
                  target="_blank"
                >
                  <img src="/assets/share/whatsapp.svg" width={52} />
                </Link>

                <Link
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    shareLink
                  )}`}
                  target="_blank"
                >
                  <img src="/assets/share/facebook.svg" width={52} />
                </Link>

                <Link
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                    shareLink
                  )}`}
                  target="_blank"
                >
                  <img src="/assets/share/linkedin.svg" width={52} />
                </Link>
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
                    background: "transparent",
                    color: "#F62D2D",
                    fontWeight: "500",
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
  );
};

export default ComboPayment;
