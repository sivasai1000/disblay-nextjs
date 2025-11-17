"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddCombo } from "@/components/OthersBusinessApi"; // ✅ import mutation hook

import Swal from "sweetalert2";
const OthersAddCombo = ({ onCancel }) => {
    const imageplus1 = "/assets/img/imageplus1.svg";
const imagepdf = "/assets/img/imagepdf.svg";
const imagemp3 = "/assets/img/imagemp3.svg";
const viewpdf = "/assets/img/viewpdf.svg";
const viewmp3 = "/assets/img/viewmp3.svg";

     const router = useRouter();
  const [comboName, setComboName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [packageId,setPackageId]=useState(0);
  const [poster, setPoster] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [audio, setAudio] = useState(null);
  const { mutate: addCombo, isLoading } = useAddCombo();
  const formatDate = (date) => date.toISOString().split("T")[0];

const handleCreate = () => {
  const business_id = localStorage.getItem("businessId");

  // ✅ Validation
  if (!comboName.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Combo Name Required",
      text: "Please enter a combo name.",
    });
    return;
  }

  const startDate = formatDate(new Date());
  const endDate = formatDate(
    new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  );

  const formData = new FormData();
  formData.append("business_id", business_id);
  formData.append("package_name", comboName);
  formData.append("package_url", videoUrl);
  formData.append("start_date", startDate);
  formData.append("end_date", endDate);

  if (poster) formData.append("poster", poster);
  if (pdf) formData.append("pdf", pdf);
  if (audio) formData.append("audio", audio);

  const newCombo = {
    business_id,
    package_name: comboName,
    package_url: videoUrl,
    start_date: startDate,
    end_date: endDate,
    poster: poster ? URL.createObjectURL(poster) : null,
    pdf: pdf ? pdf.name : null,
    audio: audio ? audio.name : null,
  };

  addCombo(formData, {
    onSuccess: async (res) => {
      console.log("Response for the combo is :", res);

      if (res?.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Combo Created!",
          text: "✅ Combo created successfully!",
          confirmButtonText: "Continue",
        });

        setPackageId(res.response.id);

       sessionStorage.setItem("combo", JSON.stringify(newCombo));
sessionStorage.setItem("packageId", res.response.id);

router.push("/otherscombodetail");

      } else {
        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: res?.msg || "Something went wrong.",
        });
      }
    },

    onError: (err) => {
      console.error("❌ Network/API error:", err);

      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "❌ Failed to create combo (network error)",
      });
    },
  });
};



  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        {/* main form column */}
        <div className="col-lg-9 col-md-10 col-12">
          <div
            className="p-4 mt-4"
            style={{
              background: "#fff",
              borderRadius: "12px",
              fontFamily: "Manrope, sans-serif",
            }}
          >
            {/* Header */}
            <div
              className="d-flex justify-content-between align-items-center mb-4 pb-2"
              style={{ borderBottom: "1px solid #EAEAEA" }}
            >
              <div className="comboid">
                Create Combo
                
              </div>
            </div>
            

            {/* Combo Name */}
            <div className="mb-3">
              <label className="comboname mb-1">Combo Name *</label>
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Enter combo name"
                value={comboName}
                onChange={(e) => setComboName(e.target.value)}
              />
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
    color: "#666",
    cursor: "pointer",
    fontSize: "14px",
    position: "relative",
    overflow: "hidden",
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
        objectFit: "cover",
        borderRadius: "8px",
      }}
    />
  ) : (
    <>
      <img src={imageplus1} width={32} height={32} alt="plus" />
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
    color: "#666",
    cursor: "pointer",
    fontSize: "14px",
  }}
>
  <input
    type="file"
    accept="application/pdf"
    hidden
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) setPdf(file);
    }}
  />
  {pdf ? (
    <>
      <img src={viewpdf} width={40} height={40} alt="pdf" />
     
    </>
  ) : (
    <>
      <img src={imagepdf} width={32} height={32} alt="pdf" />
      <div className="mt-2">PDF</div>
    </>
  )}
</label>

{/* MP3 */}
<label
  className="d-flex flex-column justify-content-center align-items-center"
  style={{
    width: "120px",
    height: "120px",
    border: "2px dashed #ccc",
     border: audio ? "2px dashed #28a745" : "2px dashed #86909A",
    borderRadius: "8px",
    color: "#666",
    cursor: "pointer",
    fontSize: "14px",
  }}
>
  <input
    type="file"
    accept="audio/*"
    hidden
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) setAudio(file);
    }}
  />
  {audio ? (
    <>
      <img src={viewmp3} width={40} height={40} alt="mp3" />
     
    </>
  ) : (
    <>
      <img src={imagemp3} width={32} height={32} alt="mp3" />
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
                className="btn cancel-btn1"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={isLoading}
                className=" create-btn1"
               
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OthersAddCombo;
