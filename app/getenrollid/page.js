"use client"
import React, { useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import { useRouter } from "next/navigation";
import axios from "axios";
import DisblayNav from "@/components/DisblayNav";
import Swal from "sweetalert2";

const enrollsuccess = "/assets/img/enrollsuccess.svg";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const GetEnrollId = () => {
    const router = useRouter();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [enrollId, setEnrollId] = useState(null);
  const [otherType, setOtherType] = useState("");

  const handleBack = () => router.back();

  const handleInitialSubmit = (e) => {
  e.preventDefault();

  if (!name || !username || !agreeTerms) {
    Swal.fire({
      icon: "warning",
      title: "Incomplete Details",
      text: "Please complete all fields and agree to the terms.",
    });
    return;
  }

  setStep(2);
};


const handleFinalSubmit = async () => {
  try {
    const payload = {
      business_user_name: name,
      business_mobile: username,
      business_type: selectedType === "Other" ? otherType : selectedType,
    };

    const response = await axios.post(`${BASE_URL}/createEnrollId.php`, payload);

    if (response.data.status === "success") {
      const { enroll_id, business_id } = response.data.res;

      localStorage.setItem("enrollId", enroll_id);
      localStorage.setItem("businessId", business_id || "");

      setEnrollId(enroll_id);
      setStep(3);
    } 
    
    else {
      await Swal.fire({
        icon: "info",
        title: "Account Already Exists",
        text: `Your account already exists. Use Enroll ID: ${response.data.res.enroll_id} to log in.`,
        confirmButtonText: "Go to Login"
      });

      router.push("/getenroll");
    }
  } catch (err) {
    console.error("Error:", err);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong. Please try again.",
    });
  }
};


  return (
     <div className="min-vh-100 d-flex flex-column bg-light">
          {/* 🔹 Top Nav */}
          <DisblayNav />
    <div
        className="flex-grow-1 d-flex flex-column align-items-center justify-content-center"
        style={{ padding: "20px" }}
      >
      <Card
        className="shadow-md"
        style={{
          width: "100%",
          maxWidth: "480px",
          borderRadius: "16px",
          padding: "30px",
          background: "#fff",
        }}
      >
        <div className="d-flex flex-column align-items-center">
          {/* Heading (only for steps 1 & 2) */}
          {step !== 3 && (
            <div
              className="fw-bold text-center mb-4"
              style={{
                fontFamily: "Manrope",
                fontSize: "22px",
                fontWeight: "700",
                color: "#34495E",
                marginTop: "10px",
              }}
            >
              To Get Enroll ID
            </div>
          )}

          {/* Step 1: Name + Mobile */}
          {step === 1 && (
            <Form
              onSubmit={handleInitialSubmit}
              style={{ width: "100%", maxWidth: "400px" }}
            >
              <Form.Group controlId="name" className="mb-4">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "15px",
                    fontWeight: "500",
                    color: "#808080",
                  }}
                >
                  Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    height: "48px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#000000",
                  }}
                />
              </Form.Group>

              <Form.Label
                style={{
                  fontFamily: "Manrope",
                  fontSize: "15px",
                  fontWeight: "500",
                  color: "#808080",
                }}
              >
                Mobile Number
              </Form.Label>
              <div
                className="mt-1 mb-4"
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ced4da",
                  borderRadius: "10px",
                  padding: "0 8px",
                }}
              >
                <div
                  style={{
                    width: "77px",
                    height: "34px",
                    background: "#F4F4F4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "6px",
                  }}
                >
                  <img
                    src="https://flagcdn.com/w20/in.png"
                    alt="India flag"
                    style={{
                      width: "20px",
                      height: "14px",
                      marginRight: "4px",
                    }}
                  />
                  <span style={{ fontSize: "14px" }}>+91</span>
                </div>

                <input
                  type="tel"
                  value={username}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setUsername(value);
                  }}
                  placeholder="Enter mobile number"
                  maxLength={10}
                  style={{
                    padding: "0px 10px",
                    border: "none",
                    outline: "none",
                    flex: 1,
                    height: "50px",
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#000000",
                  }}
                />
              </div>

              <Form.Group className="d-flex align-items-center mb-3 mt-3">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                  style={{
                    width: "18px",
                    height: "18px",
                    marginRight: "8px",
                    accentColor: "#3D7FFF",
                  }}
                />
                <span
                  className="mt-1"
                  style={{
                    fontSize: "12px",
                    fontFamily: "Manrope",
                    fontWeight: "500",
                  }}
                >
                  I agree to Disblay’s{" "}
                  <a
                  
                    style={{
                      color: "#3D7FFF",
                      textDecoration: "none",
                    }}
                  >
                    Terms & Conditions and policies
                  </a>
                </span>
              </Form.Group>

              <Button
                type="submit"
                className="w-100 fw-semibold mt-3"
                style={{
                  height: "48px",
                  backgroundColor: "#34495E",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "18px",
                }}
              >
                Create Enroll ID
              </Button>
            </Form>
          )}

          {/* Step 2: Select Type */}
          {step === 2 && (
            <Form style={{ width: "100%", maxWidth: "400px" }}>
              <Form.Group controlId="selectType" className="mb-4">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "15px",
                    fontWeight: "500",
                    color: "#808080",
                  }}
                >
                  Select Type
                </Form.Label>
                <Form.Select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    if (e.target.value !== "Other") setOtherType("");
                  }}
                  style={{
                    height: "48px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                >
                  <option value="">Select</option>
                  <option value="Freelancer">Freelancer</option>
                  <option value="Xerox Center">Running xerox/DTP center</option>
                  <option value="Printing Works">
                    Running Digital Printing Works
                  </option>
                  <option value="Auditing Firm">
                    Auditing Firm (GST filling Center)
                  </option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>

              {selectedType === "Other" && (
                <Form.Group controlId="otherInput" className="mb-4 mt-3">
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#808080",
                    }}
                  >
                    Enter Your Business Type
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your type"
                    value={otherType}
                    onChange={(e) => setOtherType(e.target.value)}
                    style={{
                      height: "48px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                </Form.Group>
              )}

              <Button
                type="button"
                className="w-100 fw-semibold mt-2"
                onClick={handleFinalSubmit}
                style={{
                  height: "48px",
                  backgroundColor: "#34495E",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "18px",
                }}
              >
                Submit
              </Button>
            </Form>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div
              className="d-flex flex-column align-items-center text-center"
              style={{ width: "100%" }}
            >
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "22px",
                  color: "#000000",
                }}
              >
                Success
              </div>
              <div
                style={{
                  fontFamily: "Manrope",
                  fontSize: "15px",
                  color: "#5E5E5E",
                  marginBottom: "20px",
                }}
              >
                Your request has been submitted!
              </div>
              <img
                className="mt-2 mb-3"
                src={enrollsuccess}
                alt="Success"
                style={{ width: "120px", height: "102px" }}
              />
              <div
                style={{
                  fontFamily: "Manrope",
                  fontSize: "14px",
                  color: "#34495E",
                }}
              >
                Enroll ID: <strong>{enrollId}</strong>
              </div>
              <div
                style={{
                  fontFamily: "Manrope",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#34495E",
                  marginTop: "8px",
                }}
              >
                Disblay team will contact you shortly
              </div>
              <div
                style={{ fontWeight: "500", fontSize: "13px", marginTop: "10px" }}
              >
                Contact us
              </div>
              <div style={{ fontWeight: "700", fontSize: "13px" }}>
                +91 8858868889
              </div>

              <div className="d-flex justify-content-between mt-4 w-100">
                <Button
                  className="flex-fill me-2"
                  style={{
                    height: "48px",
                    backgroundColor: "#fff",
                    border: "1.5px solid #2F80ED",
                    borderRadius: "8px",
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#2F80ED",
                  }}
                  onClick={() => (window.location.href = "tel:+918858868889")}
                >
                  Call
                </Button>

                <Button
                  className="flex-fill ms-2"
                  style={{
                    height: "48px",
                    backgroundColor: "#34495E",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#fff",
                  }}
                  onClick={() => router.push("/")}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
    </div>
  );
};

export default GetEnrollId;
