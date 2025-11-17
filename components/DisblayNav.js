
"use client"
import React from "react";


export default function DisblayNav() {
  const disblay = "/assets/img/disblayNav.svg"; // ✅ adjust path if needed

  return (
    <header
      style={{
        width: "100%",
        height: "60px",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
       
      }}
    >
      <img
        src={disblay}
        alt="Disblay Logo"
        style={{ height: "45px", cursor: "pointer" }}
      />
    </header>
  );
}
