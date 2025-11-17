"use client";

import React, { useEffect, useState } from "react";
import LeftNav from "@/components/LeftNav";
import TopNav from "@/components/TopNav";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const fetchBusinessBillHistory = async ({ queryKey }) => {
  const [, { businessId }] = queryKey;

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/getBusinessSubscriptionHistory.php`,
    { business_id: businessId }
  );

  return data;
};

export default function BusinessBillHistory() {
  // Local storage safe access
  const [businessId, setBusinessId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBusinessId(localStorage.getItem("businessId"));
    }
  }, []);

  // API call
  const { data, isLoading } = useQuery({
    queryKey: ["businessBillHistory", { businessId }],
    queryFn: fetchBusinessBillHistory,
    enabled: !!businessId,
  });

  if (isLoading || !businessId) {
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

  const history = data?.res || [];

  return (
    <div className="d-flex min-vh-100" style={{ background: "#F4F5FB" }}>
      <LeftNav />

      <div className="flex-grow-1 d-flex flex-column">
        <TopNav />

        <div className="flex-grow-1 p-4">
          <div
            style={{
              maxWidth: "788px",
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div className="bill-history">Business Bill History</div>
            <hr />

            {history.length === 0 ? (
              <p>No history found</p>
            ) : (
              <div className="d-flex flex-column gap-3 mt-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: "1px solid #E2E4E9",
                      borderRadius: "12px",
                      padding: "16px 20px",
                      background: "#fff",
                      boxShadow: "0px 0px 8px 0px #0000000A",
                    }}
                  >
                    {/* Row 1 */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="billhistory-comboid">Business Name</div>
                        <div className="billhistory-combovalue mt-1">
                          {item.business_name}
                        </div>
                      </div>

                      <div className="text-end">
                        <div className="billhistory-comboid">Start Date</div>
                        <div className="billhistory-combovalue mt-1">
                          {item.start_date}
                        </div>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="billhistory-comboid">End Date</div>
                        <div className="billhistory-combovalue mt-1">
                          {item.end_date}
                        </div>
                      </div>

                      <div className="text-end">
                        <Link
                          href={`${process.env.NEXT_PUBLIC_API_URL}/${item.invoice_pdf}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#000",
                            color: "#fff",
                            borderRadius: "6px",
                            padding: "6px 16px",
                            textDecoration: "none",
                            fontWeight: "600",
                            height: "40px",
                          }}
                        >
                          Download Invoice
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
