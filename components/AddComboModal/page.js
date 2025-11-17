"use client";

import React, { useState } from "react";
import { Modal } from "react-bootstrap";

const AddComboModal = ({ show, onClose, onCreate }) => {
  const [comboName, setComboName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "24px",
          fontFamily: "Manrope, sans-serif",
        }}
      >
        {/* Header */}
        <div
          className="d-flex justify-content-between align-items-center mb-4"
          style={{
            borderBottom: "1px solid #EAEAEA",
            paddingBottom: "12px",
          }}
        >
          <h5 style={{ fontWeight: "600", fontSize: "18px" }}>
            Create Combo
            <span
              style={{
                color: "#888",
                fontSize: "14px",
                marginLeft: "8px",
              }}
            >
              Combo ID : 507089TOP
            </span>
          </h5>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div>
          {/* Combo Name */}
          <div className="mb-3">
            <label style={{ fontWeight: "600", fontSize: "14px" }}>
              Combo Name <span style={{ color: "red" }}>*</span>
            </label>

            <input
              type="text"
              placeholder="Enter combo name"
              value={comboName}
              onChange={(e) => setComboName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginTop: "6px",
              }}
            />
          </div>

          {/* Upload Section */}
          <label style={{ fontWeight: "600", fontSize: "14px" }}>
            Upload Media <span style={{ color: "#888" }}>(Optional)</span>
          </label>

          <div className="d-flex gap-3 mb-3 mt-2">
            {["Poster", "PDF", "MP3"].map((type) => (
              <div
                key={type}
                style={{
                  border: "1px dashed #ccc",
                  borderRadius: "8px",
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#666",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                <div style={{ fontSize: "22px", marginBottom: "6px" }}>＋</div>
                {type}
              </div>
            ))}
          </div>

          {/* Video URL */}
          <div className="mb-4">
            <label style={{ fontWeight: "600", fontSize: "14px" }}>
              Video URL
            </label>

            <input
              type="url"
              placeholder="https://www.youtube.com"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginTop: "6px",
              }}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="d-flex justify-content-end gap-3">
          <button
            onClick={onClose}
            style={{
              border: "1px solid #ccc",
              background: "#fff",
              borderRadius: "8px",
              padding: "10px 24px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={() => onCreate({ comboName, videoUrl })}
            style={{
              background: "#1A2B49",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 24px",
              cursor: "pointer",
            }}
          >
            Create
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddComboModal;
