"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddCombo } from "@/components/BusinessApi/page"; 
import imageCompression from "browser-image-compression";
import Swal from "sweetalert2";
export default function AddCombo({ onCancel }) {
  const router = useRouter();
  const imageplus1 = "/assets/img/imageplus1.svg"
  const imagepdf ="/assets/img/imagepdf.svg"
  const imagemp3= "/assets/img/imagemp3.svg"
  const viewpdf ="/assets/img/viewpdf.svg"
  const viewmp3="/assets/img/viewmp3.svg"
  const [comboName, setComboName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [packageId, setPackageId] = useState(0);
  const [poster, setPoster] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [audio, setAudio] = useState(null);
  const [error, setError] = useState("");
  const { mutate: addCombo, isLoading } = useAddCombo();
  const formatDate = (date) => date.toISOString().split("T")[0];4
  const handleNameChange = (e) => {
    const value = e.target.value;
    setComboName(value);

    const nameRegex = /^(?! )[A-Za-z0-9 ]*(?<! )$/;

    if (!value.trim()) {
      setError("Combo name is required.");
    } else if (!nameRegex.test(value)) {
      setError("Only letters, numbers, and spaces allowed. No leading/trailing spaces.");
    } else {
      setError("");
    }
  };

  const handleCreate = async () => {
    const business_id = localStorage.getItem("businessId");

    if (!comboName.trim() || error) {
      Swal.fire({
        icon: "warning",
        title: "Required!",
        text: "Please enter a valid combo name before creating.",
      });
      return;
    }

    const startDate = formatDate(new Date());
    const endDate = formatDate(
      new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    );

    const formData = new FormData();
    formData.append("business_id", business_id);
    formData.append("package_name", comboName.trim());
    formData.append("package_url", videoUrl);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);

    // Compress poster if > 2MB
    if (poster) {
      let fileToUpload = poster;
      if (fileToUpload.size > 2 * 1024 * 1024) {
        try {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          fileToUpload = await imageCompression(fileToUpload, options);
        } catch (err) {
          console.error("Compression error:", err);
        }
      }
      formData.append("poster", fileToUpload);
    }

    if (pdf) formData.append("pdf", pdf);
    if (audio) formData.append("audio", audio);

    // Preview object
    const newCombo = {
      business_id,
      package_name: comboName.trim(),
      package_url: videoUrl,
      start_date: startDate,
      end_date: endDate,
      poster: poster ? URL.createObjectURL(poster) : null,
      pdf: pdf ? pdf.name : null,
      audio: audio ? audio.name : null,
    };

    addCombo(formData, {
      onSuccess: (res) => {
        console.log("Response:", res);

        if (res?.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Combo Created!",
            text: "Your combo has been created successfully.",
            confirmButtonText: "Continue",
          }).then(() => {
            setPackageId(res.response.id);

          // Build a single state object (clean + organized)
const comboState = {
  combo: newCombo,
  packageId: res.response.id,
  businessId: business_id,
};

// Save inside sessionStorage
sessionStorage.setItem("comboDetailState", JSON.stringify(comboState));

// Navigate to details page
router.push("/combodetail");


          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: res?.msg || "Something went wrong.",
          });
        }
      },

      onError: (err) => {
        console.error("❌ Network/API error:", err);

        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "Failed to create combo. Please try again.",
        });
      },
    });
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="container-fluid">
      <div className="row justify-content-start">
        
        <div className="col-lg-9 col-md-10 col-12">
          <div
            className="p-4 mt-4"
            style={{
              background: "#fff",
              borderRadius: "12px",
              fontFamily: "Manrope, sans-serif",
            }}
          >
            <div
              className="d-flex justify-content-between align-items-center mb-4 pb-2"
              style={{ borderBottom: "1px solid #EAEAEA" }}
            >
              <div className="comboid">Create Combo</div>
            </div>

            {/* Combo Name */}
            <div className="mb-3 position-relative">
              <label className="comboname mb-1">Combo Name *</label>

              <input
                type="text"
                maxLength={30}
                className={`form-control mt-2 pe-5 ${error ? "is-invalid" : ""}`}
                placeholder="Enter combo name"
                value={comboName}
                onChange={handleNameChange}
                style={{ paddingRight: "48px" }}
              />

              <span
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "12px",
                  fontSize: "12px",
                  color: "#6c757d",
                  pointerEvents: "none",
                }}
              >
                {comboName.length}/30
              </span>

              {error && (
                <div className="text-danger mt-1" style={{ fontSize: "14px" }}>
                  {error}
                </div>
              )}
            </div>

            {/* Upload Media */}
            <label className="comboname mb-3">Upload Media (Optional)</label>

            <div className="d-flex justify-content-between gap-3 flex-wrap w-100">
              
              {/* Poster */}
              <label
                className="d-flex flex-column justify-content-center align-items-center"
                style={{
                  width: "120px",
                  height: "120px",
                  border: "2px dashed #86909A",
                  borderRadius: "8px",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setPoster(file);
                  }}
                />

                {poster ? (
                  <img
                    src={URL.createObjectURL(poster)}
                    alt="poster preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <>
                    <img src={imageplus1.src} width={32} height={32} alt="plus" />
                    <div className="mt-2">Poster</div>
                  </>
                )}
              </label>

              {/* PDF */}
              <label
                className="d-flex flex-column justify-content-center align-items-center"
                style={{
                  width: "120px",
                  height: "120px",
                  border: pdf ? "2px dashed #28a745" : "2px dashed #86909A",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={(e) => setPdf(e.target.files[0])}
                />

                {pdf ? (
                  <img src={viewpdf.src} width={40} height={40} alt="pdf" />
                ) : (
                  <>
                    <img src={imagepdf.src} width={32} height={32} alt="pdf" />
                    <div className="mt-2">PDF</div>
                  </>
                )}
              </label>

              {/* Audio */}
              <label
                className="d-flex flex-column justify-content-center align-items-center"
                style={{
                  width: "120px",
                  height: "120px",
                  border: audio ? "2px dashed #28a745" : "2px dashed #86909A",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="file"
                  accept="audio/*"
                  hidden
                  onChange={(e) => setAudio(e.target.files[0])}
                />

                {audio ? (
                  <img src={viewmp3.src} width={40} height={40} alt="mp3" />
                ) : (
                  <>
                    <img src={imagemp3.src} width={32} height={32} alt="mp3" />
                    <div className="mt-2">MP3</div>
                  </>
                )}
              </label>
            </div>

            {/* Video URL */}
            <div className="mb-4 mt-3">
              <label className="comboname mb-3">Video URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://www.youtube.com"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>

            {/* Footer */}
            <div className="d-flex justify-content-end gap-3">
              <button
                onClick={onCancel}
                className="cancel-btn1"
                disabled={isLoading}
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                disabled={isLoading || !comboName.trim() || !!error}
                className="create-btn1"
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
