"use client";

import React from "react";
import LeftNav from "@/components/LeftNav";
import TopNav from "@/components/TopNav";

export default function Help() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Left Navigation */}
      <LeftNav />

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        <TopNav />

        <div
          className="d-flex justify-content-center align-items-center"
          style={{ flexGrow: 1 }}
        >
          <h4 className="text-muted">Currently Not Available</h4>
        </div>
      </div>
    </div>
  );
}
