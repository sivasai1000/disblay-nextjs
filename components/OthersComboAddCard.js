// src/components/ComboAddCard.js
import React from "react";

const OthersComboAddCard = ({ onAdd }) => {
  return (
    <div
      className="p-4 mt-4"
      style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0px 0px 250px 0px #0000000F",
        textAlign: "start",
      }}
    >
      <div style={{
        color: "#FF6161",
        fontSize: "20px",
        lineHeight: "24px",
        fontWeight: "800",
        fontFamily: "Manrope",
      }}>First Combo Free! 🎁</div>
      <ul style={{
        textAlign: "left", marginTop: "8px", marginBottom: "16px", paddingLeft: 18,
        color: "#0000008F",
        fontSize: "16px",
        lineHeight: "24px",
        fontWeight: "600",
      }}>
        <li>Create your first combo at no cost.</li>
        <li>Charges apply from the second combo onwards.</li>
      </ul>
      <div className="text-center">
      <button
        style={{
          background: "#262626",
          borderRadius: "10px",
          width: "350px",
          height: "56px",
          border: "none",
        }}
        onClick={onAdd}
      >
        <span
          style={{
            fontSize: "20px",
            color: "#FFFEFE",
            fontWeight: "500",
            fontFamily: "Manrope",
          }}
        >
          + Add
        </span>
      </button>
      </div>
    </div>
  );
};

export default OthersComboAddCard;
