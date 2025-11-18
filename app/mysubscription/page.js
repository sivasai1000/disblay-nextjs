"use client";

import React, { useEffect, useState } from "react";
import LeftNav from "@/components/LeftNav";
import TopNav from "@/components/TopNav";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function MySubscription() {
  const router = useRouter();

  const [subscription, setSubscription] = useState(null);
  const [businessId, setBusinessId] = useState(null);

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/getBusinessSubscriptionHistory.php`;

  // ---------------------------------------------------
  // Load businessId safely on client (sessionStorage → localStorage fallback)
  // ---------------------------------------------------
  useEffect(() => {
    const id =
      sessionStorage.getItem("businessId") ||
      localStorage.getItem("businessId");

    if (id) {
      setBusinessId(id);
    }
  }, []);

  // ---------------------------------------------------
  // Fetch Subscription
  // ---------------------------------------------------
  useEffect(() => {
    if (!businessId) return;

    const fetchSubscription = async () => {
      try {
        const { data } = await axios.post(API_URL, {
          business_id: businessId,
        });

        if (data?.status === "success" && data?.res?.length > 0) {
          setSubscription(data.res[0]); // Always pick first subscription
        } else {
          setSubscription(null);
        }
      } catch (err) {
        console.error("Subscription fetch error:", err);
        setSubscription(null);
      }
    };

    fetchSubscription();
  }, [businessId]);

  return (
    <div className="d-flex min-vh-100" style={{ background: "#F4F5FB" }}>
      <LeftNav />

      <div className="flex-grow-1 d-flex flex-column">
        <TopNav />

        <div className="flex-grow-1 p-4">
          <div style={{ maxWidth: "788px" }}>
            {!subscription ? (
              <div
                style={{
                  background: "#fff",
                  padding: "40px",
                  borderRadius: "12px",
                  textAlign: "center",
                  border: "1px solid #CFD3D4",
                  marginTop: "40px",
                }}
              >
                <h5>No Subscription Found</h5>
                <p style={{ color: "#666" }}>
                  You do not have an active subscription right now.
                </p>
              </div>
            ) : (
              <>
                {/* ================== MAIN CARD ================== */}
                <div
                  className="p-4 mb-5 mt-4 text-center"
                  style={{
                    borderRadius: "16px",
                    backgroundColor: "#fff",
                    boxShadow: "0 0 12px rgba(0,0,0,0.08)",
                    border: "1px solid #CFD3D4",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div style={{ fontWeight: 600 }}>
                      Business ID : {subscription.business_id}
                    </div>
                  </div>

                  {/* DAYS LEFT CARD */}
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "12px",
                      width: "180px",
                      height: "88px",
                      display: "inline-block",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        background:
                          "linear-gradient(284.69deg, #F62D2D 7.92%, #FF6161 100%)",
                        color: "#fff",
                        fontWeight: 600,
                        borderRadius: "8px 8px 0 0",
                        padding: "6px 0",
                      }}
                    >
                      Days Left
                    </div>

                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: "700",
                        color: "#F62D2D",
                        marginTop: "6px",
                      }}
                    >
                      {subscription.remaining_days}
                    </div>
                  </div>

                  {/* RENEWAL BUTTON */}
                  <div className="mt-2">
                    <button
                      onClick={() => {

  // Main combined object (optional)
  sessionStorage.setItem(
    "planSelectorState",
    JSON.stringify({
      type: "Renewal",
      plan_for: "business",
      businessId: String(businessId || "")
    })
  );

  // Individual session keys (same style you asked for)
  sessionStorage.setItem("type", "Renewal");
  sessionStorage.setItem("plan_for", "business");
  sessionStorage.setItem("businessId", String(businessId || ""));

  

  // Navigate
  router.push("/planselector");
}}

                      style={{
                        background: "#27A64B",
                        border: "none",
                        borderRadius: "6px",
                        padding: "10px 30px",
                        width: "180px",
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "16px",
                      }}
                    >
                      Renewal
                    </button>
                  </div>

                  {/* ================== START / END DATE + BILL HISTORY ================== */}
                  <div className="d-flex justify-content-between align-items-start mt-4">
                    {/* START DATE */}
                    <div className="text-start">
                      <div
                        style={{
                          color: "#6A7576",
                          fontWeight: "600",
                          fontSize: "16px",
                          textAlign: "center",
                        }}
                      >
                        Started From
                      </div>
                      <div
                        style={{
                          color: "#045867",
                          fontWeight: "700",
                          fontSize: "18px",
                          textAlign: "center",
                        }}
                      >
                        {subscription.start_date}
                      </div>
                    </div>

                    {/* END DATE + BUTTON */}
                    <div className="text-end">
                      <div
                        style={{
                          color: "#6A7576",
                          fontWeight: "600",
                          fontSize: "16px",
                          textAlign: "center",
                        }}
                      >
                        Expires On
                      </div>
                      <div
                        style={{
                          color: "#045867",
                          fontWeight: "700",
                          fontSize: "18px",
                          textAlign: "center",
                        }}
                      >
                        {subscription.end_date}
                      </div>

                      {/* BILL HISTORY BUTTON */}
                      <div className="mt-3 text-end">
                        <button
                          onClick={() => {
                            sessionStorage.setItem(
                              "businessBillHistory",
                              JSON.stringify({ businessId })
                            );

                            router.push("/businessbillhistory");
                          }}
                          style={{
                            background: "#000",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 20px",
                            color: "#fff",
                            fontWeight: "600",
                          }}
                        >
                          Bill History
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================== GST SECTION ================== */}
                <div
                  style={{
                    borderRadius: "16px",
                    padding: "20px",
                    background: "#fff",
                    border: "1px solid #CFD3D4",
                  }}
                >
                  <label style={{ fontWeight: 500 }}>GST No (optional)</label>
                  <input
                    type="text"
                    value={subscription.gst_number || ""}
                    className="form-control mt-3"
                    readOnly
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
