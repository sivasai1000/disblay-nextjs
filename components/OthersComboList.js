"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";


const OthersComboList = ({ combos = [], onShare }) => {
  
 const router = useRouter();
  const comboshare = "/assets/img/comboshare.svg";
const noimage = "/assets/img/noimage.svg";
const freecombo = "/assets/img/freecombo.svg";

  const [showModal, setShowModal] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(null);

  // ✅ Free combos first
  const sortedCombos = [...combos].sort((a, b) => {
    if (a.isComboSubcription === "Free" && b.isComboSubcription !== "Free") return -1;
    if (a.isComboSubcription !== "Free" && b.isComboSubcription === "Free") return 1;
    return 0;
  });

 const handleOpenDetail = (combo) => {
  sessionStorage.setItem("combo", JSON.stringify(combo));
  sessionStorage.setItem("packageId", combo.id);

  router.push("/otherscombodetail");
};


  const handleShareClick = (e, combo) => {
    e.stopPropagation();

    if (combo.isPaid === "1") {
      // ✅ Normal share
      onShare && onShare(combo);
    } else {
      // ✅ Open Buy modal
      setSelectedCombo(combo);
      setShowModal(true);
    }
  };

const handleBuyNow = () => {
  if (!selectedCombo) return;

  sessionStorage.setItem("packageCode", selectedCombo.package_code);
  sessionStorage.setItem("packageId", selectedCombo.id);
  sessionStorage.setItem("businessId", selectedCombo.business_id);
  sessionStorage.setItem("type", "Subscription");
  sessionStorage.setItem("plan_for", "package");

  router.push("/othersplanselector");
};


  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="productname">Products Combos ({combos.length})</div>
      </div>

      <div className="row">
        {sortedCombos.map((combo) => (
          <div key={combo.id} className="col-12 col-md-6 mb-3">
            <div
              onClick={() => handleOpenDetail(combo)}
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "16px",
                border: "1px solid #EDEDED",
                boxShadow: "0px 0px 10px 0px #0000000A, 0px 2px 22.4px 0px #6161610A",
                padding: "12px",
                background: "#fff",
                height: "100%",
                cursor: "pointer",
              }}
            >
              {/* Left Image Wrapper */}
              <div style={{ position: "relative", width: "140px", height: "140px", flexShrink: 0 }}>
                {combo.package_poster ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${combo.package_poster}`}
                    alt={combo.package_name}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "10px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "10px",
                      background: "#F5F5F5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      border: "1px solid #E0E0E0",
                    }}
                  >
                    <img
                      src={noimage}
                      alt="No Poster"
                      style={{ width: "50px", height: "50px", marginBottom: "6px" }}
                    />
                    <span style={{ fontSize: "12px", color: "#888" }}>No Image</span>
                  </div>
                )}

                {/* ✅ Free Combo Badge */}
                {combo.isComboSubcription === "Free" && (
                  <img
                    src={freecombo}
                    alt="Free Combo"
                    style={{
                      position: "absolute",
                      top: "6px",
                      right: "6px",
                      width: "28px",
                      height: "28px",
                    }}
                  />
                )}
              </div>

              {/* Right Content */}
              <div
                style={{
                  flex: 1,
                  marginLeft: "12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <div>
                  <div className="productsubname mt-1">{combo.package_name}</div>
                  <div
                    className="mt-2"
                    style={{
                      color: "#27A376",
                      fontWeight: "700",
                      fontSize: "16px",
                    }}
                  >
                    {combo.package_type === "service"
                      ? `Services`
                      : `${combo.totalItems} Items - ₹${combo.totalPrice}`}
                  </div>

                  <div
                    style={{
                      color: "#888",
                      fontSize: "13px",
                      marginTop: "6px",
                    }}
                  >
                    Valid Upto :{" "}
                    {combo.end_date
                      ? new Date(combo.end_date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </div>
                </div>

                {/* Share Button */}
                <button
  onClick={(e) => handleShareClick(e, combo)}
  style={{
    border: "1px solid #3A3A3A",
    background: combo.isPaid === "0" ? "#f5f5f5" : "#fff",
    padding: "6px 16px",
    borderRadius: "8px",
    cursor: combo.isPaid === "0" ? "not-allowed" : "pointer",
    marginTop: "10px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    opacity: combo.isPaid === "0" ? 0.6 : 1,
    pointerEvents: "auto", // ✅ force events still fire
  }}
>
  <span className="share-btncombo">Share</span>
  <img src={comboshare} alt="share" style={{ width: "18px" }} />
</button>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              width: "320px",
              textAlign: "center",
            }}
          >
            <h5>Buy Package</h5>
            <p>You need to buy this package to unlock the share option.</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  marginRight: "10px",
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleBuyNow}
                style={{
                  flex: 1,
                  marginLeft: "10px",
                  padding: "8px 12px",
                  background: "#27A376",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OthersComboList;
