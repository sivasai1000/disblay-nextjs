"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/css/admin.css"
import LeftNav from "@/components/LeftNav";
import TopNav from "@/components/TopNav";

import {
  useProductList,
  useAssignProductToPackage,
  usePackageProductList,
  usePackageServiceList,
} from "@/components/BusinessApi/page";

import Swal from "sweetalert2";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const noimage = "/assets/img/noimage.svg";

export default function Master() {
  const router = useRouter();

  // -----------------------------
  // 1) Load values from sessionStorage
  // -----------------------------
  const [params, setParams] = useState(null);

useEffect(() => {
  const saved = sessionStorage.getItem("masterState");  // FIXED KEY
  if (!saved) return;

  try {
    setParams(JSON.parse(saved));
  } catch (err) {
    console.error("Error parsing masterState:", err);
  }
}, []);


let business_id = null;
let package_id = null;
let menuType = null;
let category_id = null;
let assignedIds = [];
let assignedIdservice = [];

if (params) {
  business_id = params.business_id;
  package_id = params.package_id;
  menuType = params.menuType;
  category_id = params.category_id;
  assignedIds = params.assignedIds || [];
  assignedIdservice = params.assignedIdservice || [];
}


  // -----------------------------
  // State
  // -----------------------------
  const [selectedItems, setSelectedItems] = useState([]);
  const [imgError, setImgError] = useState({});
  const [showAlreadySelectedModal, setShowAlreadySelectedModal] = useState(false);
  const [alreadySelectedItemName, setAlreadySelectedItemName] = useState("");

  // -----------------------------
  // Fetch all master items
  // -----------------------------
  const { data: productData, isLoading } = useProductList({ business_id });
  const allItems = productData?.response || [];

  // Fetch already assigned items
  const { data: packageProducts } = usePackageProductList({
    package_id,
    business_id,
  });
  const { data: packageServices } = usePackageServiceList({
    package_id,
    business_id,
  });

  const alreadyAssignedIds = [
    ...(packageProducts?.response?.map((p) => String(p.id)) || []),
    ...(packageServices?.response?.map((s) => String(s.id)) || []),
    ...assignedIds.map(String),
    ...assignedIdservice.map(String),
  ];

  // Filter only product/service type
  const items = allItems.filter(
    (item) =>
      (item.package_type || "").toLowerCase() ===
      (menuType || "").toLowerCase()
  );

  // Mutation
  const assignMutation = useAssignProductToPackage();

  // -----------------------------------------
  // Toggle Select
  // -----------------------------------------
  const handleItemToggle = (itemId) => {
    const item = items.find((itm) => itm.id === itemId);
    const name = item?.product_name || item?.service_name || "Item";

    const isAlreadyAssigned = alreadyAssignedIds.includes(String(itemId));
    const isSelected = selectedItems.includes(itemId);

    if (isAlreadyAssigned) {
      setAlreadySelectedItemName(name);
      setShowAlreadySelectedModal(true);
      return;
    }

    setSelectedItems((prev) =>
      isSelected ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  // -----------------------------------------
  // Assign to package
  // -----------------------------------------
  const handleAssignToPackage = () => {
    if (selectedItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Items Selected",
        text: "Please select at least one item.",
      });
      return;
    }

    const payload = {
      package_id,
      category_id,
      product_ids: selectedItems,
      business_id,
      package_type: menuType,
    };

    assignMutation.mutate(payload, {
      onSuccess: (res) => {
        if (res.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Assigned Successfully!",
            text: "Products/Services assigned successfully!",
            confirmButtonText: "OK",
          }).then(() => router.back());
        } else {
          Swal.fire({
            icon: "error",
            title: "Assignment Failed",
            text: res.message || "Unknown error occurred.",
          });
        }
      },
      onError: () => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error assigning products/services.",
        });
      },
    });
  };
if (!params) {
  return (
    <div className="p-4 d-flex justify-content-center align-items-center">
      Loading...
    </div>
  );
}

  // -----------------------------------------
  // UI
  // -----------------------------------------
  return (
    <div className="d-flex min-vh-100" style={{ background: "#F4F5FB" }}>
      <LeftNav />
      <div className="flex-grow-1 d-flex flex-column">
        <TopNav />

        <section className="p-4 w-100 d-flex justify-content-center">
          <div className="row w-100">
            {/* Main content */}
            <div className="col-md-9">
              <div
                className="card px-3"
                style={{
                  boxShadow: "0px 0px 112.22px 0px #00000008",
                  borderRadius: "16px",
                  border: "none",
                }}
              >
                <h5 className="mt-4" style={{ fontWeight: "700", marginBottom: 20 }}>
                  {menuType === "product" ? "Product List" : "Service List"}
                </h5>

                {isLoading && (
                  <div className="text-center py-5 text-muted">Loading...</div>
                )}

                <div className="row">
                  {items.map((item) => {
                    const name = item.product_name || item.service_name || "Unnamed";
                    const mrp = item.mrp || item.service_price || 0;

                    const imageUrl =
                      item.product_logo || item.service_image
                        ? `${BASE_URL}/${item.product_logo || item.service_image}`
                        : null;

                    const industryType =
                      item.service_industrial_type ||
                      `${item.quantity_count} ${item.uom_type}` ||
                      "";

                    const isAlreadyAssigned = alreadyAssignedIds.includes(
                      String(item.id)
                    );

                    return (
                      <div className="col-md-6 mb-4" key={item.id}>
                        <div
                          style={{
                            border: "1px solid #E0E0E0",
                            borderRadius: "12px",
                            background: "#fff",
                            padding: "12px",
                            display: "flex",
                            gap: "16px",
                            height: "154px",
                          }}
                        >
                          {/* Image */}
                          <div style={{ flex: "0 0 100px" }}>
                            {imageUrl && !imgError[item.id] ? (
                              <img
                                src={imageUrl}
                                alt={name}
                                onError={() =>
                                  setImgError((p) => ({ ...p, [item.id]: true }))
                                }
                                style={{
                                  width: "128px",
                                  height: "128px",
                                  borderRadius: "8px",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "128px",
                                  height: "128px",
                                  borderRadius: "8px",
                                  background: "#f0f0f0",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <img src={noimage} alt="" width={40} />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-grow-1 d-flex flex-column justify-content-between">
                            <div>
                              <div className="master-naming">{name}</div>
                              <div className="master-quant mt-2">{industryType}</div>
                              <div className="masters-mrp mt-2 mb-3">₹{mrp}</div>
                            </div>

                            <button
                              onClick={() => handleItemToggle(item.id)}
                              disabled={isAlreadyAssigned}
                              style={{
                                background: isAlreadyAssigned
                                  ? "#ccc"
                                  : selectedItems.includes(item.id)
                                  ? "#fff"
                                  : "linear-gradient(284.69deg, #F62D2D 7.92%, #FF6161 100%)",
                                border: "1px solid #F62D2D",
                                borderRadius: "8px",
                                padding: "6px",
                                color: isAlreadyAssigned
                                  ? "#666"
                                  : selectedItems.includes(item.id)
                                  ? "#F62D2D"
                                  : "#fff",
                                fontWeight: "600",
                                cursor: isAlreadyAssigned ? "not-allowed" : "pointer",
                              }}
                            >
                              {isAlreadyAssigned
                                ? "Already Added"
                                : selectedItems.includes(item.id)
                                ? "Remove"
                                : "Add"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {!isLoading && items.length === 0 && (
                    <div className="text-center py-5 text-muted">
                      No items found.
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom action bar */}
              <div className="mt-2">
                <div
                  className="d-flex justify-content-between align-items-center px-4 py-3"
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
                    position: "sticky",
                    bottom: 0,
                    height: "80px",
                  }}
                >
                  <span style={{ fontSize: "16px", fontWeight: "600" }}>
                    Selected Items <br />
                    <span style={{ fontSize: "20px", fontWeight: "700" }}>
                      {selectedItems.length}
                    </span>
                  </span>

                  <button
                    onClick={handleAssignToPackage}
                    disabled={selectedItems.length === 0}
                    style={{
                      background: "#27A376",
                      border: "none",
                      borderRadius: "10px",
                      padding: "12px 40px",
                      color: "#fff",
                      fontWeight: "600",
                      opacity: selectedItems.length === 0 ? 0.5 : 1,
                    }}
                  >
                    {assignMutation.isLoading ? "Saving..." : "Proceed"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Spacer */}
            <div className="col-md-3" />
          </div>
        </section>

        {/* Already Added Modal */}
        {showAlreadySelectedModal && (
          <div
            className="modal fade show"
            style={{
              display: "block",
              background: "rgba(0,0,0,0.5)",
              position: "fixed",
              inset: 0,
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content p-4 text-center">
                <h5 className="text-success">Already Added!</h5>
                <p className="text-muted mt-3">
                  You’ve already added <strong>{alreadySelectedItemName}</strong>.
                </p>
                <button
                  className="btn btn-success mt-2"
                  onClick={() => setShowAlreadySelectedModal(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
