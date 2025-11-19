// src/components/PlanSelector.js
"use client"
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import TopNav from "@/components/OthersTopNav";
import { usePlanDetails } from "@/components/OthersBusinessApi"; // ✅ custom hook for API
import { Check } from "lucide-react"; // ✅ tick icon


const OthersPlanSelector = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const router = useRouter();

  const [packageCode, setPackageCode] = useState("");
const [packageId, setPackageId] = useState(null);
const [businessId, setBusinessId] = useState(null);
const [planFor, setPlanFor] = useState("business");

React.useEffect(() => {
  if (typeof window !== "undefined") {
    setPackageCode(sessionStorage.getItem("packageCode") || "");
    setPackageId(sessionStorage.getItem("packageId") || null);
    setBusinessId(sessionStorage.getItem("businessId") || null);
    setPlanFor(sessionStorage.getItem("plan_for") || "business");
  }
}, []);



  // ✅ fetch plans
  const { data, isLoading, error } = usePlanDetails({ plan_for: planFor });
  const plans = data?.res || [];

  // ✅ select plan
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan.id);
  };

  // ✅ continue to payment/share page
  const handleContinue = (plan) => {
    const amount = parseInt(plan.plan_paid_amount);
   sessionStorage.setItem("amount", amount);
sessionStorage.setItem("planId", plan.id);
sessionStorage.setItem("packageId", packageId);
sessionStorage.setItem("businessId", businessId);
sessionStorage.setItem("plan_for", planFor);
sessionStorage.setItem("durationDays", plan.duration_days);

router.push("/othersshare/" + packageCode);

  };

  return (
    <>
      <TopNav />
      <div className="container my-5">
        {/* Heading */}
        <div
          className="text-center mb-5"
          style={{
            fontFamily: "Manrope",
            fontWeight: "800",
            fontSize: "40px",
            color: "#000",
          }}
        >
          Choose the{" "}
          <span className="right-plan">
            Right Plan
          </span>{" "}
          for Your Business
        </div>

        {/* Plan Cards */}
        <div className="d-flex flex-wrap justify-content-center gap-4">
          {isLoading && <p>Loading plans...</p>}
          {error && <p className="text-danger">Failed to load plans.</p>}
          {!isLoading &&
            !error &&
            plans.map((plan) => {
              const isPopular = plan.badge === "Most Popular";
              const isSelected = selectedPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  onClick={() => handleSelectPlan(plan)}
                  style={{
                    flex: "0 0 300px",
                    borderRadius: "12px",
                    width:"404px",
                    

                    border: isSelected
                      ? "2px solid #1A2B49"
                      : isPopular
                      ? "1.5px solid #FF4F4F"
                      : "1px solid #E0E0E0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    background: "#fff",
                    padding: "24px",
                    position: "relative",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* Badge */}
                  {isPopular && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        background: "#FF4F4F",
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "700",
                        fontSize: "14px",
                        padding: "6px 0",
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                      }}
                    >
                      Most Popular
                    </div>
                  )}

                  {/* Duration & Price */}
                  <div style={{ marginTop: isPopular ? "40px" : "0px" }}>
                    <div className="plan-duration">
                      {plan.plan_duration}
                    </div>
                    <div className="plan-amount mt-2">
                      ₹{parseInt(plan.plan_paid_amount)}
                    </div>
                  </div>

                  {/* Features */}
                 <ul
  className="mt-4"
  style={{
    listStyle: "none",
    padding: 0,
    marginBottom: "20px",
  }}
>
  {plan.description
    ?.replace(/<\/?ul>/g, "") // remove <ul>
    .replace(/<\/?p>/g, "")   // remove <p>
    .split("<li>")
    .filter((item) => item.trim() !== "" && !item.includes("</ul>"))
    .map((item, idx) => (
      <li key={idx} className="list-itemplan mt-2">
        <Check className="tick-icon" />
        <div
          className="list-text"
          dangerouslySetInnerHTML={{ __html: item.replace("</li>", "") }}
        />
      </li>
    ))}
</ul>


                  {/* Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContinue(plan);
                    }}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      background: "linear-gradient(92.1deg, #34495E -6.94%, #162635 120.42%)",

                      border: "none",
                      height: "48px",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Choose this Plan
                  </Button>
                </div>
              );
            })}
        </div>

        {/* Notes */}
        <div
          className="mt-5"
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            fontFamily: "Manrope",
          }}
        >
          <div className="important-noteplan mt-3 mb-2" >
            Important Note :
          </div>
          <ul className="import-noteitems mt-2"
          >
            <li className="mt-2">
              Once a bill is paid for a combo, it will remain active for one full year from the date of payment.
            </li>
            <li className="mt-2">
             If you choose to delete a combo in the middle of the subscription period, please note that the entire combo ID will be permanently removed from your account. To use it again, you will need to  recreate the  
   combo and repay the applicable charges.
            </li>
            <li className="mt-2">
              Kindly exercise caution before deleting any combo.
            </li>
            <li className="mt-2">
              The subscription fee covers the maintenance and usage of your account for one year.
            </li>
            <li className="mt-2">After the subscription period expires, your business account and combos will not be deleted, but they will no longer be visible or shareable until you renew the subscription.</li>
            <li className="mt-2">
              We appreciate your understanding and support.
            </li>
          </ul>
        </div>
      </div>

    
    </>
  );
};

export default OthersPlanSelector;
