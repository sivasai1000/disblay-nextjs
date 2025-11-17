import React from "react";
import LeftNav from "@/components/OthersLeftNav";
import TopNav from "@/components/OthersTopNav"; // assuming you already have TopNav

export default function OthersSupport() {
  return (
    <div className="d-flex">

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
