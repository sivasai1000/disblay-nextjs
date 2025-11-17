"use client"
import React, { useState, useEffect } from "react";
import LeftNav from "@/components/LeftNav";
import TopNav from "@/components/TopNav";
import { useBusinessDetails, useUpdateBusiness } from "@/components/BusinessApi/page";
import { ChevronDown, ChevronUp } from "lucide-react";
import "@/css/setting.css";
import Swal from "sweetalert2";


// icons


export default function Settings() {
const call = "/assets/img/call.svg";
const pay = "/assets/img/pay.svg";
const truck = "/assets/img/truck.svg";
const redtruck = "/assets/img/redtruck.svg";
const redpay = "/assets/img/redpay.svg";

    const [businessId, setBusinessId] = useState("");

useEffect(() => {
  if (typeof window !== "undefined") {
    setBusinessId(localStorage.getItem("businessId") || "");
  }
}, []);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const { data, isLoading, refetch } = useBusinessDetails({
        business_id: businessId,
    });

    const { mutateAsync: updateBusiness } = useUpdateBusiness();

    const [formData, setFormData] = useState({
        direct_call: "0",
        payment_upi_id: "",
        payment_type: "",
        delivery_type: "",
        onDemands: "0",
    });

    // Keep a copy of initial data to detect changes
    const [initialData, setInitialData] = useState({});

    const [openPayment, setOpenPayment] = useState(false);
    const [openDelivery, setOpenDelivery] = useState(false);

    // Load initial data
    useEffect(() => {
        if (data?.status === "success" && data.response) {
            const b = data.response;
            const initial = {
                direct_call: b.direct_call || "0",
                payment_upi_id: b.payment_upi_id || "",
                payment_type: b.payment_type || "",
                delivery_type: b.delivery_type || "",
                onDemands: b.onDemands || "0",
            };
            setFormData(initial);
            setInitialData(initial); // Save for change detection
        }
    }, [data]);

    // ✅ Detect changes for Save button
    const hasPaymentChanges =
        formData.payment_upi_id !== initialData.payment_upi_id ||
        formData.payment_type !== initialData.payment_type;

    const hasDeliveryChanges =
        formData.onDemands !== initialData.onDemands ||
        formData.delivery_type !== initialData.delivery_type;

    // ✅ Direct call toggle updates immediately
    const handleDirectCallToggle = async (checked) => {
  const newValue = checked ? "1" : "0";
  setFormData((prev) => ({ ...prev, direct_call: newValue }));

  try {
    const form = new FormData();
    form.append("business_id", businessId);
    form.append("direct_call", newValue);

    const res = await fetch(`${BASE_URL}/updatebusiness.php`, {
      method: "POST",
      body: form,
    });

    const result = await res.json();

    if (result.status !== "success") {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update Direct Call setting.",
      });
    } else {
      refetch(); // ✅ refresh data silently
    }
  } catch (err) {
    console.error("Direct Call update failed:", err);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while updating Direct Call.",
    });
  }
};


    // ✅ Save Payment settings only
    const handleSavePayment = async () => {
  try {
    const form = new FormData();
    form.append("business_id", businessId);
    form.append("payment_upi_id", formData.payment_upi_id);
    form.append("payment_type", formData.payment_type);

    const res = await updateBusiness(form);

    if (res.status === "success") {
      await Swal.fire({
        icon: "success",
        title: "Payment Updated!",
        text: "Payment settings updated successfully.",
        confirmButtonText: "OK",
      });

      refetch();
      setInitialData((prev) => ({
        ...prev,
        payment_upi_id: formData.payment_upi_id,
        payment_type: formData.payment_type,
      }));
    } else {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: res.msg || "Failed to update payment settings.",
      });
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error updating payment settings. Please try again.",
    });
  }
};


    // ✅ Save Delivery settings only
 const handleSaveDelivery = async () => {
  try {
    const form = new FormData();
    form.append("business_id", businessId);
    form.append("onDemands", formData.onDemands);
    form.append("delivery_type", formData.delivery_type);

    const res = await updateBusiness(form);

    if (res.status === "success") {
      await Swal.fire({
        icon: "success",
        title: "Delivery Updated!",
        text: "Delivery settings updated successfully.",
        confirmButtonText: "OK",
      });

      refetch();
      setInitialData((prev) => ({
        ...prev,
        onDemands: formData.onDemands,
        delivery_type: formData.delivery_type,
      }));
    } else {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: res.msg || "Failed to update delivery settings.",
      });
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error updating delivery settings. Please try again.",
    });
  }
};


    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="d-flex">
                <LeftNav />
            </div>

            {/* Main Content */}
            <div className="flex-grow-1">
                <TopNav />

                <div
                    className="container-fluid"
                    style={{ padding: "20px", background: "#F8F9FB", minHeight: "100vh" }}
                >
                    <div
                        className="card p-4"
                        style={{
                            borderRadius: "16px",
                            background: "#fff",
                            boxShadow: "0 0 12px rgba(0,0,0,0.08)",
                            maxWidth: "800px",
                             margin: "20px 20px",
                        }}
                    >
                        {/* Direct Call */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div className="d-flex align-items-center gap-2">
                                <img
                                    src={call}
                                    alt="Direct Call"
                                    style={{ width: "24px", height: "24px" }}
                                />
                                <span className="direct-call px-2">Direct Call</span>
                            </div>

                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input custom-switch-style"
                                    type="checkbox"
                                    id="direct-call-switch"
                                    checked={formData.direct_call === "1"}
                                    onChange={(e) => handleDirectCallToggle(e.target.checked)}
                                />
                            </div>
                        </div>

                        {/* Payment Settings */}
                        <div className="mb-4 mt-4">
                            <div
                                className="d-flex justify-content-between align-items-center"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    setOpenPayment(!openPayment);
                                    if (!openPayment) setOpenDelivery(false); // Close delivery if opening payment
                                }}
                            >
                                <div className="d-flex align-items-center gap-2">
                                    <img
                                        src={openPayment ? redpay : pay}
                                        alt="Payment"
                                        style={{ width: "22px", height: "22px" }}
                                    />
                                    <span
                                        style={{
                                            fontWeight: "700",
                                            fontSize: "18px",
                                            color: openPayment ? "#FF6161" : "#262626",
                                        }}
                                    >
                                        Payment Settings
                                    </span>
                                </div>
                                {openPayment ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>

                            {openPayment && (
                                <div className="mt-3">
                                    <div className="mb-3">
                                        <label className="form-label upi-text mt-3">UPI ID</label>
                                        <input
                                            type="text"
                                            className="form-control upi-input"
                                            placeholder="yournumber@ybl"
                                            value={formData.payment_upi_id}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    payment_upi_id: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="d-flex align-items-center mb-2">
                                        <label
                                            className="me-auto mt-3"
                                            style={{
                                                fontSize: "16px",
                                                color:
                                                    formData.payment_type === "online"
                                                        ? "#000000"
                                                        : "#A0A0A0",
                                                fontWeight:
                                                    formData.payment_type === "online" ? "600" : "400",
                                            }}
                                        >
                                            Online Payments
                                        </label>
                                        <input
                                            type="checkbox"
                                            className="form-check-input custom-checkbox"
                                            checked={formData.payment_type === "online"}
                                            onChange={() =>
                                                setFormData({ ...formData, payment_type: "online" })
                                            }
                                        />
                                    </div>

                                    <div className="d-flex align-items-center mb-2">
                                        <label
                                            className="me-auto mt-3"
                                            style={{
                                                fontSize: "16px",
                                                color:
                                                    formData.payment_type === "cod"
                                                        ? "#000000"
                                                        : "#A0A0A0",
                                                fontWeight:
                                                    formData.payment_type === "cod" ? "600" : "400",
                                            }}
                                        >
                                            Cash on Delivery
                                        </label>
                                        <input
                                            type="checkbox"
                                            className="form-check-input custom-checkbox"
                                            checked={formData.payment_type === "cod"}
                                            onChange={() =>
                                                setFormData({ ...formData, payment_type: "cod" })
                                            }
                                        />
                                    </div>

                                    <div className="d-flex align-items-center mb-2">
                                        <label
                                            className="me-auto mt-3 mb-3"
                                            style={{
                                                fontSize: "16px",
                                                color:
                                                    formData.payment_type === "both"
                                                        ? "#000000"
                                                        : "#A0A0A0",
                                                fontWeight:
                                                    formData.payment_type === "both" ? "600" : "400",
                                            }}
                                        >
                                            Both
                                        </label>
                                        <input
                                            type="checkbox"
                                            className="form-check-input custom-checkbox"
                                            checked={formData.payment_type === "both"}
                                            onChange={() =>
                                                setFormData({ ...formData, payment_type: "both" })
                                            }
                                        />
                                    </div>

                                    <div className="text-end mt-3">
                                        <button
                                            className="btn"
                                            style={{
                                                 backgroundColor: "#27A376",
                                                color: "#fff",

                                                fontWeight: "600",
                                                width: "250px",
                                                height:"52px",
                                                borderRadius:"10px"
                                            }}
                                            onClick={handleSavePayment}
                                            disabled={!hasPaymentChanges} // disable if no changes
                                        >
                                           <span style={{fontSize:"16px",fontWeight:"700",lineHeight:"20px"}}>Save</span> 
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Delivery Settings */}
                        <div className="mb-4 mt-4">
                            <div
                                className="d-flex justify-content-between align-items-center"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    setOpenDelivery(!openDelivery);
                                    if (!openDelivery) setOpenPayment(false); // Close payment if opening delivery
                                }}
                            >
                                <div className="d-flex align-items-center gap-2">
                                    <img
                                        src={openDelivery ? redtruck : truck}
                                        alt="Delivery"
                                        style={{ width: "22px", height: "22px" }}
                                    />
                                    <span
                                        style={{
                                            fontWeight: "700",
                                            fontSize: "18px",
                                            color: openDelivery ? "#FF6161" : "#262626",
                                        }}
                                    >
                                        Delivery Settings
                                    </span>
                                </div>
                                {openDelivery ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>

                            {openDelivery && (
                                <div className="mt-3">
                                    {/* On Demand */}
                                    <div className="d-flex align-items-center mb-2 justify-content-between">
                                        <label
                                            className="pay-text mt-4"
                                            style={{
                                                color: formData.onDemands === "1" ? "#000" : "#888",
                                            }}
                                        >
                                            On Demand
                                        </label>
                                        <input
                                            type="checkbox"
                                            className="form-check-input custom-checkbox mt-4"
                                            checked={formData.onDemands === "1"}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    onDemands: e.target.checked ? "1" : "0",
                                                    delivery_type: e.target.checked ? "" : formData.delivery_type,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="mb-2 text-center">OR</div>

                                    {/* Other Delivery Types */}
                                    {[
                                        "Next Day Delivery",
                                        "Same Day Delivery",
                                        "Scheduled",
                                        "All the above",
                                    ].map((opt, idx) => (
                                        <div
                                            key={idx}
                                            className="d-flex align-items-center mb-4 mt-4 justify-content-between"
                                            style={{ gap: "8px" }}
                                        >
                                            <label
                                                style={{
                                                    color:
                                                        formData.onDemands === "0" &&
                                                        formData.delivery_type === opt
                                                            ? "#000"
                                                            : "#888",
                                                }}
                                            >
                                                {opt}
                                            </label>
                                            <input
                                                type="checkbox"
                                                className="form-check-input custom-checkbox"
                                                checked={
                                                    formData.onDemands === "0" &&
                                                    formData.delivery_type === opt
                                                }
                                                onChange={() =>
                                                    setFormData({
                                                        ...formData,
                                                        onDemands: "0",
                                                        delivery_type: opt,
                                                    })
                                                }
                                            />
                                        </div>
                                    ))}

                                    <div className="text-end mt-4">
                                        <button
                                            className="btn"
                                            style={{
                                                backgroundColor: "#27A376",
                                                color: "#fff",

                                                fontWeight: "600",
                                                width: "250px",
                                                height:"52px",
                                                borderRadius:"10px"
                                            }}
                                            onClick={handleSaveDelivery}
                                            disabled={!hasDeliveryChanges} // disable if no changes
                                        >
                                           <span style={{fontSize:"16px",fontWeight:"700",lineHeight:"20px"}}>Save</span> 
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
