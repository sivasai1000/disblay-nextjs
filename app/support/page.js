"use client";

import React from "react";
import LeftNav from "@/components/LeftNav";
import TopNav from "@/components/TopNav";

export default function Support() {
  return (
    <div className="d-flex">
      {/* Left Navigation */}
      <LeftNav />

      {/* Main Content */}
      <div className="flex-grow-1">
        <TopNav />

        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <h4 className="text-muted">Currently Not Available</h4>
        </div>
      </div>
    </div>
  );
}
