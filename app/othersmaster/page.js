// src/components/Master.js
"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/OthersTopNav";
import LeftNav from "@/components/OthersLeftNav";
import Swal from "sweetalert2";
import {
  useProductList,
  useAssignProductToPackage,
  usePackageProductList,
  usePackageServiceList,
} from "@/components/OthersBusinessApi";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OthersMaster() {
    const noimage = "/assets/img/noimage.svg"
 
   const router = useRouter();

  // Props passed from ComboDetail
  const business_id = sessionStorage.getItem("business_id");
const package_id = sessionStorage.getItem("package_id");
const menuType = sessionStorage.getItem("menuType");
const category_id = sessionStorage.getItem("category_id");

const assignedIds = JSON.parse(sessionStorage.getItem("assignedIds") || "[]");
const assignedIdservice = JSON.parse(sessionStorage.getItem("assignedIdservice") || "[]");


  const [selectedItems, setSelectedItems] = useState([]);
  const [imgError, setImgError] = useState({});
  const [showAlreadySelectedModal, setShowAlreadySelectedModal] = useState(false);
  const [alreadySelectedItemName, setAlreadySelectedItemName] = useState("");

  // ✅ Fetch master product/service list
  const { data: productData, isLoading } = useProductList({ business_id });
  const allItems = productData?.response || [];

  // ✅ Fetch already assigned items from package
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

  // ✅ Filter by type
  const items = allItems.filter(
    (item) =>
      (item.package_type || "").toLowerCase() === (menuType || "").toLowerCase()
  );

  // ✅ Mutation for assigning
  const assignMutation = useAssignProductToPackage();

  // ✅ Toggle select
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

  // ✅ Assign to package
 const handleAssignToPackage = () => {
  if (selectedItems.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "No Items Selected",
      text: "Please select at least one product or service.",
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
    onSuccess: async (res) => {
      if (res.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Assigned Successfully!",
          text: "Products/Services assigned to the package.",
          timer: 1500,
          showConfirmButton: false,
        });

        router.back();
      } else {
        Swal.fire({
          icon: "error",
          title: "Assignment Failed",
          text: res.message || "Unknown error occurred.",
        });
      }
    },

    onError: async (err) => {
      console.error("Assign API error:", err);

      await Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Error assigning products/services to the combo.",
      });
    },
  });
};


  return (
    <div className="d-flex min-vh-100" style={{ background: "#F4F5FB" }}>
      <LeftNav />
      <div className="flex-grow-1 d-flex flex-column">
        <TopNav userName="Demo User" />

       <section className="p-4 w-100 d-flex justify-content-center">
  <div className="row w-100">
    {/* Main content area col-9 */}
    <div className="col-md-9">
      <div
        className="card px-3"
        style={{
          boxShadow: "0px 0px 112.22px 0px #00000008",
          borderRadius: "16px",
          border: "none",
        }}
      >
        {/* Title */}
        <h5
          className="mt-4"
          style={{ fontWeight: "700", marginBottom: "20px", color: "#02060C" }}
        >
          {menuType === "product" ? "Product List" : "Service List"}
        </h5>

        {/* Loader */}
        {isLoading && (
          <div className="text-center py-5 text-muted w-100">
            Loading items...
          </div>
        )}

        {/* Items Grid */}
        <div className="row ">
          {items.map((item) => {
            const name = item.product_name || item.service_name || "Unnamed";
            const mrp = item.mrp || item.service_price || 0;
            const imageUrl =
              item.product_logo || item.service_image
                ? `${BASE_URL}/${item.product_logo || item.service_image}`
                : null;
              const industryType = item.service_industrial_type || item.quantity_count + " "+item.uom_type || " "

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
                    alignItems: "center",
                    gap: "16px",
                    height: "154px",
                  }}
                >
                  {/* Left Image */}
                  <div style={{ flex: "0 0 100px" }}>
                    {imageUrl && !imgError[item.id] ? (
                      <img
                        src={imageUrl}
                        alt={name}
                        onError={() =>
                          setImgError((prev) => ({ ...prev, [item.id]: true }))
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
                        <img src={noimage} alt="No" style={{ width: "40px" }} />
                      </div>
                    )}
                  </div>

                  {/* Right Content */}
                  <div className="flex-grow-1 d-flex flex-column justify-content-between">
                    <div>
                      <div className="master-naming">
                        {name}
                      </div>
                      <div className="master-quant mt-2" >
                        {industryType}
                      </div>
                      <div className="masters-mrp mt-2 mb-3">
                        ₹{mrp}
                      </div>
                    </div>

                    {/* Button */}
                    <button
                      onClick={() => handleItemToggle(item.id)}
                      style={{
                        background: isAlreadyAssigned
                          ? "#ccc"
                          : selectedItems.includes(item.id)
                          ? "#fff"
                          : "linear-gradient(284.69deg, #F62D2D 7.92%, #FF6161 100%)",
                        border: "1px solid #F62D2D",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "14px",
                        padding: "6px",
                        width: "100%",
                        color: isAlreadyAssigned
                          ? "#666"
                          : selectedItems.includes(item.id)
                          ? "#F62D2D"
                          : "#fff",
                        cursor: isAlreadyAssigned ? "not-allowed" : "pointer",
                        transition: "0.2s",
                      }}
                      disabled={isAlreadyAssigned}
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
            <div className="text-center py-5 text-muted w-100">
              No items found.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-2">
        <div
          className="d-flex justify-content-between align-items-center px-4 py-3"
          style={{
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
            height: "80px",
            position: "sticky",
            bottom: "0",
            zIndex: "100",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#02060CB2",
            }}
          >
            Selected Items <br />
            <span
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#02060CCC",
              }}
            >
              {selectedItems.length}
            </span>
          </span>

          <button
            onClick={handleAssignToPackage}
            disabled={selectedItems.length === 0 || assignMutation.isLoading}
            style={{
              background: "#27A376",
              border: "none",
              borderRadius: "10px",
              opacity: selectedItems.length === 0 ? 0.5 : 1,
              padding: "12px 40px",
              color: "#fff",
              fontWeight: "600",
              fontSize: "18px",
            }}
          >
            {assignMutation.isLoading ? "Saving..." : "Proceed"}
          </button>
        </div>
      </div>
    </div>

    {/* Right spacer col-3 */}
    <div className="col-md-3"></div>
  </div>
</section>


        {/* ✅ Bottom bar styled like screenshot */}
       

        {/* Already added modal */}
        {showAlreadySelectedModal && (
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.5)",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1050,
            }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content p-4 text-center">
                <h5 className="modal-title text-success">Already Added!</h5>
                <p className="text-muted mt-3">
                  You’ve already added <strong>{alreadySelectedItemName}</strong>.
                </p>
                <button
                  type="button"
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
