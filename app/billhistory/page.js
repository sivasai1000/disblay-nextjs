"use client";

import React, { useEffect, useState } from "react";
import TopNav from "@/components/TopNav";
import LeftNav from "@/components/LeftNav";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/** Fetcher for react-query */
const fetchBillHistory = async ({ queryKey }) => {
  const [, { businessId, packageId }] = queryKey;

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/getSubscriptionHistory.php`,
    { business_id: businessId, package_id: packageId }
  );

  return data;
};

export default function BillHistory() {
  const router = useRouter();

  const [packageId, setPackageId] = useState(null);
  const [packageName, setPackageName] = useState(null);
  const [businessId, setBusinessId] = useState(null);

  // Read sessionStorage/localStorage safely on client
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = sessionStorage.getItem("historyData");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Normalize to string because localStorage returns strings
        setPackageId(parsed?.packageId ?? null);
        setPackageName(parsed?.packageName ?? null);
      }
    } catch (err) {
      // Malformed JSON — ignore and continue
      console.warn("Failed to parse historyData from sessionStorage", err);
    }

    const bId = localStorage.getItem("businessId");
    setBusinessId(bId || null);
  }, []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["billHistory", { businessId, packageId }],
    queryFn: fetchBillHistory,
    enabled: !!businessId && !!packageId,
    // optional: staleTime, retry, etc.
  });

  // Loading / initial state
  if (isLoading || !businessId || !packageId) {
    return (
      <div className="d-flex min-vh-100" style={{ background: "#F4F5FB" }}>
        <LeftNav />
        <div className="flex-grow-1 d-flex flex-column">
          <TopNav />
          <div className="flex-grow-1 p-4">Loading bill history...</div>
        </div>
      </div>
    );
  }

  // Error state from react-query
  if (isError) {
    return (
      <div className="d-flex min-vh-100" style={{ background: "#F4F5FB" }}>
        <LeftNav />
        <div className="flex-grow-1 d-flex flex-column">
          <TopNav />
          <div className="flex-grow-1 p-4">
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <h3>Unable to load bill history</h3>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {error?.message || JSON.stringify(error)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const history = data?.res ?? [];

  return (
    <div className="d-flex min-vh-100" style={{ background: "#F4F5FB" }}>
      <LeftNav />

      <div className="flex-grow-1 d-flex flex-column">
        <TopNav />

        <div className="flex-grow-1 p-4">
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div className="bill-history">Bill History</div>
            <hr />

            {history.length === 0 ? (
              <p>No history found</p>
            ) : (
              <div className="d-flex flex-column gap-3 mt-4">
                {history.map((item) => {
                  const invoiceUrl =
                    item?.invoice_pdf && item.invoice_pdf !== ""
                      ? `${process.env.NEXT_PUBLIC_API_URL}/${item.invoice_pdf}`
                      : null;

                  return (
                    <div
                      key={item.id}
                      className="d-flex justify-content-between align-items-center"
                      style={{
                        border: "1px solid #E2E4E9",
                        borderRadius: "12px",
                        padding: "16px 20px",
                        background: "#fff",
                        boxShadow: "0px 0px 8px 0px #0000000A",
                      }}
                    >
                      <div>
                        <div className="billhistory-comboid">Combo ID</div>
                        <div className="billhistory-combovalue mt-2">
                          {item.package_id}
                        </div>

                        <div className="billhistory-comboid mt-4">
                          Combo Name
                        </div>
                        <div className="billhistory-combovalue mt-1">
                          {packageName || "-"}
                        </div>
                      </div>

                      <div className="text-end" style={{ minWidth: 220 }}>
                        <div className="billhistory-comboid">Created On</div>

                        <div className="billhistory-combovalue text-end mt-2">
                          {item.start_date}
                        </div>

                        {invoiceUrl ? (
                          <a
                            href={invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: "20px",
                              background: "#000",
                              color: "#fff",
                              borderRadius: "6px",
                              padding: "10px 20px",
                              textDecoration: "none",
                              height: "48px",
                              fontWeight: "600",
                            }}
                          >
                            Download Invoice
                          </a>
                        ) : (
                          <div
                            style={{
                              marginTop: 20,
                              height: 48,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#666",
                              fontWeight: 600,
                            }}
                          >
                            Invoice not available
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
