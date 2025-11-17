import React, { useState } from "react";
import "@/css/userdashboard.css"; 
import '@/css/Details.css'


const ComboProductDetails = ({ product, onBack }) => {
  const [selectedImage, setSelectedImage] = useState(product.product_logo);

const leftarrow = "/assets/img/leftarrow.svg";
const noimage = "/assets/img/noimage.svg";

  const images = [
    product.product_logo,
    product.logo1,
    product.logo2,
    product.logo3,
  ].filter(Boolean);

  return (
    <div >
      <div
        className="product-details-card position-relative mx-auto"
        style={{
          width: "877px",
          borderRadius: "20px",
          padding: "24px",
          background: "#FFFFFF",
          boxShadow:
            "0px 0px 112.22px 0px #00000008, 0px 0px 22.4px 0px #6060600D",
        }}
      >
        {/* Back button */}
        <button
  className="btn mb-3 d-flex align-items-center gap-2"
  onClick={onBack}
 
>
  <img src={leftarrow} alt="Back" style={{ width: "32px", height: "32px" }} />
  <div className="details-back">Back</div>
</button>


        <div className="d-flex gap-5">
          {/* Left: Main image + thumbnails */}
          <div className="d-flex flex-column align-items-center">
            <div className="main-image mb-3">
  {selectedImage ? (
    <img
      src={`${process.env.NEXT_PUBLIC_API_URL}/${selectedImage}`}
      alt={product.product_name}
      style={{
        width: "420px",
        height: "400px",
        borderRadius: "16px",
        objectFit: "cover",
        border: "1px solid #ddd",
      }}
    />
  ) : (
    <div
      style={{
        width: "420px",
        height: "400px",
        borderRadius: "16px",
        border: "1px solid #ddd",
        background: "#F5F5F5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <img
        src={noimage} // your imported fallback image asset
        alt="No Image"
        style={{ width: "40px", height: "40px", marginBottom: "6px" }}
      />
      <span style={{ fontSize: "14px", color: "#777" }}>No Image</span>
    </div>
  )}
</div>


            {/* Thumbnails */}
            <div className="d-flex justify-content-center gap-3">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${img}`}
                  alt="thumb"
                  style={{
                    width: "73px",
                    height: "74px",
                    borderRadius: "10px",
                    objectFit: "cover",
                    cursor: "pointer",
                    border:
                      selectedImage === img
                        ? "2px solid #f00"
                        : "1px solid #ddd",
                  }}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex-grow-1">
            <div className="details-name">
              {product.product_name}
            </div>
            <div className="details-brand mt-3 mb-3">{product.product_brand_name}</div>
            <div className="details-quant mb-3">
              {product.quantity_count} {product.uom_type}
            </div>
            <div className="details-price mt-4">
              ₹{parseFloat(product.mrp).toFixed(0)}
            </div>
            

            
            <div className="details-listid mt-4">
              Listed ID: {product.id}
            </div>

            <div className="mt-3">
              <div className="details-description">Description</div>
              <div className="details-descriptiontext mt-2">{product.product_description || "No description available."}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboProductDetails;
