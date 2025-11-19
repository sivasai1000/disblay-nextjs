"use client"
import React, { useState, useEffect } from "react";
import LeftNav from "@/components/LeftNav";
import TopNav from "@/components/TopNav";
import { FaCrosshairs } from "react-icons/fa6";
import AddCombo from "@/components/OthersAddCombo";
import "@/css/admin.css";
import "@/css/businesscreditionals.css";
import "@/css/combodetails.css";


const share = "/assets/img/share.svg";
const homeadd = "/assets/img/homeadd.svg";

import ComboAddCard from "@/components/OthersComboAddCard";

import CompleteProfile from "@/components/OthersCompleteProfile";

import ComboList from "@/components/OthersComboList";

const pen = "/assets/img/pen.svg";
const whatsapp1 = "/assets/img/whatsapp1.svg";
const linkedin1 = "/assets/img/linkedin1.svg";
const x1 = "/assets/img/x1.svg";
const youtube1 = "/assets/img/youtube1.svg";
const instagram1 = "/assets/img/instagram1.svg";
const facebook1 = "/assets/img/facebook1.svg";
const mail = "/assets/img/mail.svg";
const telegram1 = "/assets/img/telegram1.svg";
const others1 = "/assets/img/others1.svg";
const link3 = "/assets/img/link3.svg";
const google = "/assets/img/google.svg";
const leftarrow = "/assets/img/leftarrow.svg";
const imageplus = "/assets/img/imageplus.svg";
const imageplus1 = "/assets/img/imageplus1.svg";
const shareIcon = "/assets/img/shareIcon.svg";
const storeIcon = "/assets/img/storeIcon.svg";
const map = "/assets/img/map.svg";
const selectedleft = "/assets/img/selectedleft.svg";
const selectedright = "/assets/img/selectedright.svg";
const insta = "/assets/img/insta.svg";
const noimage = "/assets/img/noimage.svg";
const close ="/assets/img/close.svg"

import Swal from "sweetalert2";

import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react"; // arrow icons
import {
  useBusinessDetails,
  useUpdateBusiness,
  useMasterAddProduct,
  useMasterUpdateProduct,
  useMasterAddService,
  useProductList,
  useMasterUpdateService,
  useComboList,
  useDeleteMasterPackageProduct,
  useDeleteMasterPackageService
} from "@/components/OthersBusinessApi";

import { Modal, Button, Form, Card } from "react-bootstrap";
export default function OthersAdmin() {
 const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [page, setPage] = useState("home");
  const [showProducts, setShowProducts] = useState(true);
  const [showServices, setShowServices] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showBuyPlanModal, setShowBuyPlanModal] = useState(false);
  const [planContext, setPlanContext] = useState(null); 
// "business" or "package"
const [uomType, setUomType] = useState("");
const [customUom, setCustomUom] = useState("");



// Industry type
const [serviceIndustryType, setServiceIndustryType] = useState("");
const [customIndustry, setCustomIndustry] = useState("");

// Booking type
const [bookingType, setBookingType] = useState("");
const [customBooking, setCustomBooking] = useState("");



  	
  const [editMode, setEditMode] = useState(false);
  const [showComboModal, setShowComboModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [aboutEditMode, setAboutEditMode] = useState(false);
  const [isModifiedProfile, setIsModifiedProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // top of Admin.js (inside component)
  const [contactEditMode, setContactEditMode] = useState(false);
  const [initialContactData, setInitialContactData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
const [shareLink, setShareLink] = useState("");
const [copied, setCopied] = useState(false);

  const isContactModified = JSON.stringify(initialContactData) !== JSON.stringify(formData);
  const [productImagesPreview, setProductImagesPreview] = useState([
    null,
    null,
    null,
    null,
  ]);
  const [productImages, setProductImages] = useState([null, null, null, null]);
 const [business_id, setBusinessId] = useState(null);

useEffect(() => {
  setBusinessId(localStorage.getItem("businessId"));
}, []);


  const {
    data,
    isLoading,
    isError
  } = useBusinessDetails(
    { business_id },
    { enabled: !!business_id }
  );
  const {
    data: businessData,
    isLoading: isLoadingBusiness,
    refetch: getBusinessDetails,
  } = useBusinessDetails({ business_id: business_id });
  const business = data?.response;
  const { mutateAsync: MasterAddProduct, isPending: isCreating } =
    useMasterAddProduct();
  const { mutateAsync: MasterAddService, isPending: isCreatingService } =
    useMasterAddService();
  const { mutateAsync: MasterUpdateProduct, isPending: isCreatingUpdate } =
    useMasterUpdateProduct();
  const { mutateAsync: MasterUpdateService, isPending: isCreatingUpdateService } =
    useMasterUpdateService();
    const { mutateAsync: deleteMasterProduct } = useDeleteMasterPackageProduct();
const { mutateAsync: deleteMasterService } = useDeleteMasterPackageService();

  const { mutateAsync: updateBusiness } = useUpdateBusiness();
  const handleSave = async () => {
  try {
    setIsSaving(true);

    const userId = JSON.parse(localStorage.getItem("businessId"));
    const form = new FormData();
    form.append("business_id", userId);

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, value);
      }
    });

    const res = await updateBusiness(form);

    if (res.status === "success") {
      await Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Business updated successfully.",
        confirmButtonText: "OK",
      });

      getBusinessDetails(); // refresh
      setAboutEditMode(false);
      setIsModifiedProfile(false);
    } else {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: res.msg || "Could not update business.",
      });
    }
  } catch (err) {
    console.error(err);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Update failed. Please try again.",
    });
  } finally {
    setIsSaving(false);
  }
};

  const { data: productData, isLoading: isLoadingList, refetch } = useProductList({
    business_id,
  });
  const formatSocialLink = (label, value) => {
    if (!value) return "#";

    const isFullLink = value.startsWith("http://") || value.startsWith("https://");
    const clean = value.trim().replace(/\s+/g, "");

    switch (label.toLowerCase()) {
      case "whatsapp": {
        let phone = clean.replace(/[^0-9]/g, ""); // keep only digits
        if (!phone.startsWith("91")) {
          phone = "91" + phone; // default India code
        }
        return `https://wa.me/${phone}`;
      }

      case "facebook":
        return `https://facebook.com/${clean.replace(/^facebook\.com\//, "")}`;

      case "instagram":
        return `https://instagram.com/${clean.replace(/^@/, "").replace(/^instagram\.com\//, "")}`;

      case "linkedin":
        return `https://linkedin.com/in/${clean.replace(/^linkedin\.com\/in\//, "")}`;

      case "x":
      case "twitter":
      case "x/twitter":
        return `https://x.com/${clean.replace(/^@/, "").replace(/^twitter\.com\//, "").replace(/^x\.com\//, "")}`;

      case "youtube":
        return `https://youtube.com/${clean.replace(/^youtube\.com\//, "")}`;

      case "mail":
      case "email":
      case "business_email":
        return `mailto:${clean}`;

      case "telegram":
        if (isFullLink) return clean;
        return `https://t.me/${clean.replace(/^@/, "")}`;

      case "website":
      case "other":
        return isFullLink ? clean : `https://${clean}`;

      default:
        return isFullLink ? clean : `https://${clean}`;
    }
  };
  const { data: comboData, isLoading: isLoadingCombos } = useComboList({ business_id });
  const combos = comboData?.response || [];
  const items = productData?.response || [];
  const products = items.filter((i) => i.package_type === "product");
  const services = items.filter((i) => i.package_type === "service");
  
  const hasPaidCombo = combos.some((c) => c.isPaid === "1");

  const isProfileIncomplete =
    !business?.business_name || !business?.business_address;
// state at top of component


// inside handleCreate
const handleCreate = async (e) => {
  e.preventDefault();
  const form = e.target;
  const formValues = Object.fromEntries(new FormData(form).entries());
  const formData = new FormData();

  formData.append("business_id", parseInt(business_id, 10));
  formData.append("package_id", "");
  formData.append("user_id", parseInt(business_id, 10));
  formData.append("package_type", "product");
  formData.append("product_name", formValues.product_name);
  formData.append("product_brand_name", formValues.product_brand_name || "");

  formData.append(
    "uom_type",
    uomType === "other" ? customUom : uomType
  );

  formData.append("quantity_count", formValues.quantity_count || "");
  formData.append("mrp", formValues.mrp || "");
  formData.append("currency", "INR");
  formData.append("product_url", formValues.product_url || "");
  formData.append("product_description", formValues.product_description || "");

  productImages.forEach((file, index) => {
    if (file) {
      formData.append(index === 0 ? "product_logo" : `logo${index}`, file);
    }
  });

  try {
    const res = await MasterAddProduct(formData);

    if (res?.status === "success") {
      // ✅ If business is not paid → redirect to plan selector
     if (business?.isPaid === "0") {

  sessionStorage.setItem("businessId", business_id);
  sessionStorage.setItem(
    "plan_for",
    activeTab === "home" ? "business" : "package"
  );

  router.push("/othersplanselector");
  return;
}


      // ✅ Success flow (no popup — as per your pattern)
      setPage("home");
      refetch();
      setProductImages([null, null, null, null]);
      setProductImagesPreview([null, null, null, null]);
    }

  } catch (err) {
    console.error(err);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error creating product. Please try again.",
    });
  }
};


  const getLocation = () => {
    if (!navigator.geolocation) {
      setLoading(false);
      return Promise.resolve({
        latitude: null,
        longitude: null,
        accuracy: null,
        house: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        address: "Geolocation not supported by your browser.",
      });
    }

    setLoading(true);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const addr = data.address || {};

            // More granular fields
            const house = addr.house_number || "";
            const street =
              addr.road ||
              addr.residential ||
              addr.neighbourhood ||
              addr.suburb ||
              addr.pedestrian ||
              "";
            const landmark =
              addr.amenity ||
              addr.shop ||
              addr.attraction ||
              addr.public_building ||
              "";
            const city = addr.city || addr.town || addr.village || "";
            const state = addr.state || "";
            const country = addr.country || "";
            const pincode = addr.postcode || "";

            const fullAddress = [
              house,
              street,
              landmark,
              city,
              state,
              pincode,
              country,
            ]
              .filter(Boolean)
              .join(", ");

            setLoading(false);

            resolve({
              latitude,
              longitude,
              accuracy,
              house,
              street,
              landmark,
              city,
              state,
              country,
              pincode,
              address: fullAddress || "Address not found",
            });
          } catch (error) {
            console.error("Error fetching address:", error);
            setLoading(false);
            resolve({
              latitude,
              longitude,
              accuracy,
              house: "",
              street: "",
              landmark: "",
              city: "",
              state: "",
              country: "",
              pincode: "",
              address: "Error fetching address",
            });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoading(false);

          let message = "Error fetching location.";
          if (error.code === error.PERMISSION_DENIED) {
            message = "Location access denied.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            message = "Location unavailable.";
          } else if (error.code === error.TIMEOUT) {
            message = "Location request timed out.";
          }

          resolve({
            latitude: null,
            longitude: null,
            accuracy: null,
            house: "",
            street: "",
            landmark: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
            address: message,
          });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // ✅ best GPS accuracy
      );
    });
  };
  const handleGetLocation = async () => {
  const result = await getLocation();

  if (result.latitude && result.longitude) {
    setFormData(prev => ({
      ...prev,
      street: result.street,
      state_name: result.state,
      postal_zip: result.pincode,
      country_name: result.country,
      direction: result.address, // full address if needed
    }));
  } else {
    Swal.fire({
      icon: "error",
      title: "Location Error",
      text: result.address || "Unable to fetch your location.",
    });
  }
};

  const handleCreateService = async (e) => {
  e.preventDefault();
  const formValues = Object.fromEntries(new FormData(e.target).entries());

  const formData = new FormData();
  formData.append("business_id", parseInt(business_id, 10));
  formData.append("package_id", "");
  formData.append("user_id", parseInt(business_id, 10));
  formData.append("package_type", "service");

  formData.append("service_name", formValues.service_name);

  formData.append(
    "service_industrial_type",
    serviceIndustryType === "other" ? customIndustry : serviceIndustryType
  );

  formData.append(
    "booking_type",
    bookingType === "other" ? customBooking : bookingType
  );

  formData.append("mrp", formValues.mrp || "");
  formData.append("currency", "INR");
  formData.append("service_url", formValues.service_url || "");
  formData.append(
    "service_description",
    formValues.service_description || ""
  );

  // ✅ Add images
  productImages.forEach((file, index) => {
    if (file) {
      formData.append(index === 0 ? "service_image" : `logo${index}`, file);
    }
  });

  try {
    const res = await MasterAddService(formData);

    if (res?.status === "success") {
      // ✅ Redirect to plan selector if business not paid
     if (business?.isPaid === "0") {

  sessionStorage.setItem("businessId", business_id);
  sessionStorage.setItem(
    "plan_for",
    activeTab === "home" ? "business" : "package"
  );

  router.push("/othersplanselector");
  return;
}


      // ✅ Success – no popup because your flow router.pushs
      setPage("home");
      refetch();
      setProductImages([null, null, null, null]);
      setProductImagesPreview([null, null, null, null]);
    }

  } catch (err) {
    console.error(err);

    Swal.fire({
      icon: "error",
      title: "Error Creating Service",
      text: "Something went wrong. Please try again.",
    });
  }
};

 // add state at top of component (same as in handleCreate)


// inside handleUpdate
const handleUpdate = async (e) => {
  e.preventDefault();
  const formValues = Object.fromEntries(new FormData(e.target).entries());
  const formData = new FormData();

  formData.append("business_id", parseInt(business_id, 10));
  formData.append("package_product_id", selectedItem.id);
  formData.append("user_id", parseInt(business_id, 10));
  formData.append("package_type", "product");
  formData.append("product_name", formValues.product_name);
  formData.append("product_brand_name", formValues.product_brand_name || "");

  formData.append(
    "uom_type",
    uomType === "other" ? customUom : uomType
  );

  formData.append("quantity_count", formValues.quantity_count || "");
  formData.append("mrp", formValues.mrp || "");
  formData.append("currency", "INR");
  formData.append("product_url", formValues.product_url || "");
  formData.append("product_description", formValues.product_description || "");

  // ✅ Image handling
  productImagesPreview.forEach((preview, index) => {
    if (productImages[index]) {
      formData.append(index === 0 ? "product_logo" : `logo${index}`, productImages[index]);
    } else if (preview === null || preview === "") {
      formData.append(index === 0 ? "product_logo" : `logo${index}`, "");
    }
  });

  try {
    const res = await MasterUpdateProduct(formData);
    console.log("masterupdateproduct", res);

    if (res?.status === "success") {
      setPage("detail");
      refetch();
    } else {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: res?.msg || "Failed to update product.",
      });
    }
  } catch (err) {
    console.error("Update failed:", err);

    Swal.fire({
      icon: "error",
      title: "Unexpected Error",
      text: "Unexpected error updating product.",
    });
  }
};


 const handleUpdateService = async (e) => {
  e.preventDefault();
  const formValues = Object.fromEntries(new FormData(e.target).entries());
  const formData = new FormData();

  formData.append("business_id", parseInt(business_id, 10));
  formData.append("id", selectedItem.id);
  formData.append("user_id", parseInt(business_id, 10));
  formData.append("package_type", "service");

  formData.append("service_name", formValues.service_name);

  formData.append(
    "service_industrial_type",
    serviceIndustryType === "other" ? customIndustry : serviceIndustryType
  );

  formData.append(
    "booking_type",
    bookingType === "other" ? customBooking : bookingType
  );

  formData.append("mrp", formValues.mrp || "");
  formData.append("currency", "INR");
  formData.append("service_url", formValues.service_url || "");
  formData.append("service_description", formValues.service_description || "");

  // ✅ image logic
  productImagesPreview.forEach((preview, index) => {
    if (productImages[index]) {
      formData.append(index === 0 ? "service_image" : `logo${index}`, productImages[index]);
    } else if (preview === null || preview === "") {
      formData.append(index === 0 ? "service_image" : `logo${index}`, "");
    }
  });

  try {
    const res = await MasterUpdateService(formData);
    console.log("masterupdateservice", res);

    if (res?.status === "success") {
      refetch();
      setPage("detail");
    } else {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: res?.msg || "Failed to update service.",
      });
    }
  } catch (err) {
    console.error("Update service failed:", err);

    Swal.fire({
      icon: "error",
      title: "Unexpected Error",
      text: "Unexpected error updating service.",
    });
  }
};

 const handleSelectedDelete = async (id, type) => {
  try {
    // ✅ Confirmation Popup
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: `Do you want to delete this ${type}?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return; // ❌ user cancelled

    let res;

    if (type === "product") {
      const payload = new FormData();
      payload.append("package_product_id", id);
      payload.append("business_id", business_id);
      payload.append("user_id", business_id);

      res = await deleteMasterProduct(payload);
    } else {
      res = await deleteMasterService({ id });
    }

    // ✅ Handle API response
    if (res?.status === "success") {
      await Swal.fire({
        icon: "success",
        title: `${type === "product" ? "Product" : "Service"} Deleted`,
        text: `${type === "product" ? "Product" : "Service"} deleted successfully!`,
      });

      refetch();
      setPage("home");
    } else {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: res?.msg || `Failed to delete ${type}.`,
      });
    }
  } catch (err) {
    console.error("Delete failed:", err);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Unexpected error deleting item.",
    });
  }
};


  useEffect(() => {
    if (businessData?.status === "success" && businessData.response) {
      setFormData(businessData.response); // no [0] here
    }
  }, [businessData]);
  const handleFileChange = (file, index) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const updatedPreviews = [...productImagesPreview];
      const updatedFiles = [...productImages];
      updatedPreviews[index] = ev.target.result;
      updatedFiles[index] = file;
      setProductImagesPreview(updatedPreviews);
      setProductImages(updatedFiles);
    };
    reader.readAsDataURL(file);
  };
  // ✅ calculate completion %
const profileSteps = [
  !!business?.business_logo,
  !!business?.business_name,
  !!business?.business_tagline,
  !!business?.about_business,
  !!business?.business_address,
  !!business?.city,
  !!business?.state,
  !!business?.country,
  !!business?.pincode,
];
const completedSteps = profileSteps.filter(Boolean).length;
const progressPercent = Math.round((completedSteps / profileSteps.length) * 100);

  function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-")
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
useEffect(() => {
  if (business?.business_slug) {
    localStorage.setItem("business_slug1", business.business_slug);
  }
}, [business?.business_slug]);


const handleShareModal = (item) => {
  const BASE_URL = "https://app.disblay.com";
  const businessName = business?.business_slug || item.business_slug || "unknown";
  let sharelink = "";

  if (item?.package_name && item?.totalItems) {
    // ✅ Combo case
    sharelink = `${BASE_URL}/s/${encodeURIComponent(businessName)}/${encodeURIComponent(slugify(item.package_name))}`;
  } 
  else if (item?.business_slug && !item?.package_name && !item?.product_name && !item?.service_name) {
    sharelink = `${BASE_URL}/s/${encodeURIComponent(item.business_slug)}`;
  } 
  else if (item?.package_name) {
    sharelink = `${BASE_URL}/s/${encodeURIComponent(businessName)}/${encodeURIComponent(slugify(item.package_name))}`;
  } 
  else if (item?.package_type === "product") {
    sharelink = `${BASE_URL}/share-handler.php?title=${encodeURIComponent(item.product_name)}&description=${encodeURIComponent(item.product_description || "")}&image=${BASE_URL}/${item.product_logo}&type=product&price=${item.mrp}&url=${BASE_URL}/${businessName}/${slugify(item.product_name)}`;
  } 
  else if (item?.package_type === "service") {
    sharelink = `${BASE_URL}/share-handler.php?title=${encodeURIComponent(item.service_name)}&description=${encodeURIComponent(item.service_description || "")}&image=${BASE_URL}/${item.service_image}&type=service&price=${item.mrp}&url=${BASE_URL}/${businessName}/${slugify(item.service_name)}`;
  } 
  else {
    sharelink = `${BASE_URL}/shared-item`;
  }

  setShareLink(sharelink);
  setShowShareModal(true);
};
useEffect(() => {
  const handlePopState = () => {
    if (page === "detail") {
      // 👈 when in detail page and user presses back
      setPage("home");
    }
  };

  window.addEventListener("popstate", handlePopState);

  return () => {
    window.removeEventListener("popstate", handlePopState);
  };
}, [page]);
useEffect(() => {
  if (selectedItem) {
    if (
      ["Unit", "pcs", "gram", "kgs", "liters"].includes(selectedItem.uom_type)
    ) {
      setUomType(selectedItem.uom_type);
      setCustomUom("");
    } else {
      // treat it as "other"
      setUomType("other");
      setCustomUom(selectedItem.uom_type);
    }
  }
}, [selectedItem]);
useEffect(() => {
  if (selectedItem) {
    // Industry Type
    if (["Real Estate", "Home Services", "Health & Wellness", "Legal", "Education"].includes(selectedItem.service_industrial_type)) {
      setServiceIndustryType(selectedItem.service_industrial_type);
      setCustomIndustry("");
    } else {
      setServiceIndustryType("other");
      setCustomIndustry(selectedItem.service_industrial_type);
    }

    // Booking Type
    if (["Appointments", "Pre-Booking", "Direct Call", "Direct Visit"].includes(selectedItem.booking_type)) {
      setBookingType(selectedItem.booking_type);
      setCustomBooking("");
    } else {
      setBookingType("other");
      setCustomBooking(selectedItem.booking_type);
    }
  }
}, [selectedItem]);




  return (
    <div className="d-flex min-vh-100" style={{ background: "#F4F5FB" }}>
      <div style={{ width: "240px" }}>
              <LeftNav />
            </div>
      <div className="flex-grow-1 d-flex flex-column">
        <TopNav/>
        <div className="row w-100">
          <div className="col-lg-10 main-card">
            {page === "home" && (
              <>
                {/* Banner Section */}
                <section className="p-4">
                  <div className="card banner-card">
                    <div className="bannersection1"
                      style={{
                        border:
                          business?.business_logo &&
                            business?.business_logo !== "null" &&
                            business?.business_logo !== ""
                            ? "none" // ✅ logo exists → no border
                            : "3px dashed #27A376", // ✅ no logo → green dashed border

                      }}>
                      {business?.business_logo &&
                        business?.business_logo !== "null" &&
                        business?.business_logo !== "" ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${business.business_logo}`}
                          alt={business?.business_name || "Business"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="text-center"
                          onClick={() => document.getElementById("bannerLogoInput").click()} // ✅ trigger file input
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src={imageplus}
                            alt="placeholder"
                            style={{
                              width: "54px",
                              height: "54px",
                              marginBottom: "8px",
                              opacity: 0.6,
                            }}
                          />
                          <div
                            className="mb-1"
                            style={{
                              fontSize: "18px",
                              lineHeight: "32px",
                              fontWeight: "500",
                              fontFamily: "Manrope",
                              color: "#5C7169",
                            }}
                          >
                            Upload your Business Logo or Store Image
                          </div>
                          <div
                            style={{
                              color: "#2F78EE",
                              fontSize: "18px",
                              lineHeight: "32px",
                              fontWeight: "800",
                              fontFamily: "Manrope",
                            }}
                          >
                            UPLOAD
                          </div>
                        </div>
                      )}

                      {/* ✅ Hidden File Input */}
                      <input
                        type="file"
                        id="bannerLogoInput"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const payload = new FormData();
                            payload.append("business_id", business_id); // ✅ your current businessId
                            payload.append("business_logo", file);

                            try {
                              await updateBusiness(payload);   // upload logo
                              await getBusinessDetails();      // refresh details immediately
                            } catch (err) {
                              console.error("Error updating logo:", err);
                            }
                          }
                        }}
                      />


                    </div>

                    {/* Store Info */}
                    <section>
                      <div className="store-info d-flex justify-content-between align-items-center">
                        <div>
                          <div
                            className="mb-0"
                            style={{
                              color: "#24313E",
                              fontWeight: "700",
                              fontSize: "28px",
                              fontFamily: "Manrope",
                            }}
                          >
                            {isLoading
                              ? "Loading..."
                              : isError
                                ? "Error!"
                                : business?.business_name}
                          </div>
                          <div
                            style={{
                              color: "#3A3A3A",
                              fontWeight: "500",
                              fontSize: "16px",
                              fontFamily: "Manrope",
                            }}
                          >
                            {business?.business_tagline || "Your tagline here"}
                          </div>
                        </div>
                        <button
  className="share-btnall"
  onClick={() => handleShareModal(business)} // 👈 pass whole business object
>
  <img src={share} width={48} height={48} alt="share" />
</button>

                      </div>
                    </section>
                  </div>
                </section>

                {/* Tabs Section */}
                <section className="p-4">
                  <div className="card banner-card">
                    {/* Tabs with disabling logic */}
                    <ul className="nav nav-tabs px-4 m-4">
                      {["Home", "Combos", "About us", "My Links"].map((tab) => {
                        const tabKey = tab.toLowerCase();
                        const isDisabled =
                          (tabKey === "combos" ||
                            tabKey === "about us" ||
                            tabKey === "my links") &&
                          (!business?.business_name || !business?.business_address);

                        return (
                          <li className="nav-item" key={tab}>
                            <button
                              className={`nav-link ${activeTab === tabKey ? "active" : ""
                                }`}
                              onClick={() => !isDisabled && setActiveTab(tabKey)}
                              disabled={isDisabled}
                              style={{
                                cursor: isDisabled ? "not-allowed" : "pointer",
                                opacity: isDisabled ? 0.5 : 1,
                              }}
                            >
                              {tab}
                            </button>
                          </li>
                        );
                      })}
                    </ul>

                    {/* Tab Contents */}
                    <div>
                      {/* Home tab */}
                      {activeTab === "home" && (
                        <div className="card px-4" style={{ border: "none" }}>
                          {!business?.business_name || !business?.business_address ? (
                            <div className="text-center pb-5">
                              <div className=" profile-set text-start mb-3">Complete your Business profile to create your first Products and Services.</div>
                              {/* Progress Bar */}
<div className="mb-3">
  <div className="progress" style={{ height: "10px", borderRadius: "10px" }}>
    <div
      className="progress-bar"
      role="progressbar"
      style={{
        width: `${progressPercent}%`,
        background: "#27A376",
        borderRadius: "10px",
      }}
      aria-valuenow={progressPercent}
      aria-valuemin="0"
      aria-valuemax="100"
    ></div>
  </div>
 
</div>
{progressPercent < 100 && (
  <button
    className="complete-btn mt-4"
    style={{ borderRadius: "10px", padding: "12px 32px" }}
    onClick={() => setPage("completeprofile")}
  >
    <span className="complete-txt">Complete Profile</span>
  </button>
)}

                              
                             
                            </div>
                          ) : (
                            <div className="card px-4" style={{ border: "none" }}>
                              {products.length === 0 && services.length === 0 ? (
                                <>
                                  {/* Empty state */}
                                  <div
                                    style={{
                                      color: "#FF6161",
                                      fontSize: "20px",
                                      lineHeight: "24px",
                                      fontWeight: "800",
                                      fontFamily: "Manrope",
                                    }}
                                  >
                                    Add Your Products & Services
                                  </div>
                                  <div
                                    className="mt-2 mb-3"
                                    style={{
                                      color: "#0000008F",
                                      fontSize: "16px",
                                      lineHeight: "24px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    You’ve successfully created your business — Create your first
                                    Product or Service.
                                  </div>
                                  <div className="text-center mt-3 mb-4">
                                    <button
                                      style={{
                                        background: "#262626",
                                        borderRadius: "10px",
                                        width: "350px",
                                        height: "56px",
                                        border: "none",
                                      }}
                                      onClick={() => setShowModal(true)}
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
                                </>
                              ) : (
                                <>


                                  {/* Products Section */}
                                  {products.length > 0 && (
                                    <div className="mb-4">
                                      <div
                                        className="d-flex justify-content-between align-items-center mb-3"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setShowProducts(!showProducts)}
                                      >
                                        <div className="productname">Products ({products.length})</div>
                                        {showProducts ? <ChevronUp /> : <ChevronDown />}
                                      </div>

                                      {showProducts && (
                                        <div className="row">
                                          {products.map((item) => (
                                            <div className="col-12 col-md-6 mb-3" key={item.id}>
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  borderRadius: "16px",
                                                  border: "1px solid #EDEDED",
                                                  boxShadow:
                                                    "0px 0px 10px 0px #0000000A, 0px 2px 22.4px 0px #6161610A",
                                                  padding: "12px",
                                                  background: "#fff",
                                                  height: "100%",
                                                }}
                                              >
                                                {/* Left Image */}
                                                {/* Left Image */}
{item.product_logo ? (
  <img
    src={`${process.env.NEXT_PUBLIC_API_URL}/${item.product_logo}`}
    alt={item.product_name}
    style={{
      width: "140px",
      height: "140px",
      borderRadius: "10px",
      objectFit: "cover",
      flexShrink: 0,
    }}
  />
) : (
  <div
    style={{
      width: "140px",
      height: "140px",
      borderRadius: "10px",
      background: "#F5F5F5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      flexDirection: "column",
      border: "1px solid #E0E0E0",
    }}
  >
    <img
      src={noimage}
      alt="No image"
      style={{ width: "50px", height: "50px", marginBottom: "6px" }}
    />
    <span style={{ fontSize: "12px", color: "#888" }}>No Image</span>
  </div>
)}


                                                {/* Right Content */}
                                                <div
                                                  style={{
                                                    flex: 1,
                                                    marginLeft: "12px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "space-between",
                                                    height: "100%",
                                                    minWidth:"0"
                                                  }}
                                                >
                                                  <div>
                                                    <div className="productsubname mt-1">
                                                      {item.product_name}
                                                    </div>
                                                    <div className="productsubquant mt-3">
                                                      {item.quantity_count} {item.uom_type}
                                                    </div>
                                                    <div className="productsubmrp mt-3">
                                                      ₹{item.mrp}
                                                    </div>
                                                  </div>

                                                  <button
                                                    className="sharebtn"
                                                    onClick={() => {
                                                      setSelectedItem(item);
                                                      setPage("detail");     
                                                    }}
                                                  >
                                                    <span className="sharetext">view</span>
                                                  </button>

                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Services Section */}
                                  {services.length > 0 && (
                                    <div>
                                      <div
                                        className="d-flex justify-content-between align-items-center mb-3"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setShowServices(!showServices)}
                                      >
                                        <div className="productname">Services ({services.length})</div>
                                        {showServices ? <ChevronUp /> : <ChevronDown />}
                                      </div>

                                      {showServices && (
                                        <div className="row">
                                          {services.map((item) => (
                                            <div className="col-12 col-md-6 mb-3" key={item.id}>
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  borderRadius: "16px",
                                                  border: "1px solid #EDEDED",
                                                  boxShadow:
                                                    "0px 0px 10px 0px #0000000A, 0px 2px 22.4px 0px #6161610A",
                                                  padding: "12px",
                                                  background: "#fff",
                                                  height: "100%",
                                                }}
                                              >
                                                {/* Left Image */}
                                                {/* Left Image */}
{item.service_image ? (
  <img
    src={`${process.env.NEXT_PUBLIC_API_URL}/${item.service_image}`}
    alt={item.service_name}
    style={{
      width: "140px",
      height: "140px",
      borderRadius: "10px",
      objectFit: "cover",
      flexShrink: 0,
    }}
  />
) : (
  <div
    style={{
      width: "140px",
      height: "140px",
      borderRadius: "10px",
      background: "#F5F5F5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      flexDirection: "column",
      border: "1px solid #E0E0E0",
    }}
  >
    <img
      src={noimage}
      alt="No image"
      style={{ width: "50px", height: "50px", marginBottom: "6px" }}
    />
    <span style={{ fontSize: "12px", color: "#888" }}>No Image</span>
  </div>
)}


                                                {/* Right Content */}
                                                <div
                                                  style={{
                                                    flex: 1,
                                                    marginLeft: "12px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "space-between",
                                                    height: "100%",
                                                    minWidth:"0",
                                                  }}
                                                >
                                                  <div>
                                                    <div className="productsubname mt-1">
                                                      {item.service_name}
                                                    </div>
                                                    <div className="productsubquant mt-3">
                                                      {item.booking_type || "Sample"}
                                                    </div>
                                                    <div className="productsubmrp mt-3">
                                                      ₹{item.mrp}
                                                    </div>
                                                  </div>

                                                  {/* Share Button at Bottom */}
                                                  <button
                                                    className="sharebtn"
                                                    onClick={() => {
                                                      setSelectedItem(item); // store clicked item
                                                      setPage("detail");     // switch to detail page
                                                    }}
                                                  >
                                                    <span className="sharetext">view</span>
                                                  </button>

                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      {activeTab === "combos" && page === "home" && (
                        <div className="card px-4" style={{ border: "none" }}>
                          {isLoadingCombos ? (
                            <div>Loading combos...</div>
                          ) : combos.length === 0 ? (
   
                      <ComboAddCard
      onAdd={() => {
        // open your combo create flow:
        setPage("addcombo");
      }}
    />



                          ) : (
                            <ComboList combos={combos} onShare={handleShareModal} />

                          )}
                        </div>
                      )}
                      {activeTab === "about us" && (
                        <div className="card px-4" style={{ border: "none" }}>
                          {isLoadingBusiness ? (
                            <div>Loading business details...</div>
                          ) : !formData || Object.keys(formData).length === 0 ? (
                            <div
                              style={{
                                color: "#FF6161",
                                fontSize: "20px",
                                fontWeight: "800",
                                fontFamily: "Manrope",
                                textAlign: "center",
                                margin: "40px 0",
                              }}
                            >
                              No Business Info Found
                            </div>
                          ) : (
                            <div className="px-3 mt-4 mb-4">
                              {aboutEditMode ? (
                                <>
                                  {/* ✅ Business Logo */}
                                  <div className="mb-3 mt-3 sub-title" style={{ fontWeight: "600" }}  >Business Logo</div>
                                  <div className="mb-4">
                                    {formData.business_logo ? (
                                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                        <img
                                          src={
                                            formData.business_logo instanceof File
                                              ? URL.createObjectURL(formData.business_logo)
                                              : `${process.env.NEXT_PUBLIC_API_URL}/${formData.business_logo}`
                                          }
                                          alt="Business Logo"
                                          style={{
                                            width: "120px",
                                            height: "120px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            border: "1px solid #ddd",
                                          }}
                                        />
                                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                          <button
                                            type="button"
                                            className="btn btn-dark"
                                            onClick={() => document.getElementById("logoUploadWeb").click()}
                                          >
                                            Change Image
                                          </button>

                                        </div>
                                        <input
                                          type="file"
                                          id="logoUploadWeb"
                                          accept="image/*"
                                          style={{ display: "none" }}
                                          onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            setFormData((prev) => ({ ...prev, business_logo: file }));
                                            setIsModifiedProfile(true);
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                        <div
                                          style={{
                                            width: "100px",
                                            height: "100px",
                                            borderRadius: "8px",
                                            border: "2px dashed #27A376",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "#f9f9f9",
                                          }}
                                        >
                                          <img src={imageplus} alt="Upload" style={{ width: "32px", opacity: 0.6 }} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                          <span style={{ fontSize: "14px", fontWeight: "500" }}>Business Logo</span>
                                          <button
                                            type="button"
                                            className="btn btn-dark"
                                            onClick={() => document.getElementById("logoUploadWeb").click()}
                                          >
                                            Upload Image
                                          </button>
                                        </div>
                                        <input
                                          type="file"
                                          id="logoUploadWeb"
                                          accept="image/*"
                                          style={{ display: "none" }}
                                          onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            setFormData((prev) => ({ ...prev, business_logo: file }));
                                            setIsModifiedProfile(true);
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>

                                  {/* ✅ Business Name */}
                                  <div className="mt-3">
                                    <div className="sub-title" style={{ fontWeight: "600" }}>Business Name</div>
                                    <input
                                      className="form-control mt-2 sub-input"
                                      value={formData.business_name || ""}
                                      onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, business_name: e.target.value }));
                                        setIsModifiedProfile(true);
                                      }}
                                    />
                                  </div>

                                  {/* ✅ Tagline */}
                                  <div className="mt-3">
                                    <div className="sub-title" style={{ fontWeight: "600" }}>Tagline</div>
                                    <input
                                      className="form-control mt-2 sub-input"
                                      value={formData.business_tagline || ""}
                                      onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, business_tagline: e.target.value }));
                                        setIsModifiedProfile(true);
                                      }}
                                    />
                                  </div>

                                  {/* ✅ About Business */}
                                  <div className="mt-3 ">
                                    <div className="sub-title" style={{ fontWeight: "600" }}>About Business</div>
                                    <textarea
                                      className="form-control mt-2 "
                                      maxLength={800}
                                      rows={3}
                                      value={formData.about_business || ""}
                                      onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, about_business: e.target.value }));
                                        setIsModifiedProfile(true);
                                      }}
                                    />
                                    <div className="text-end">{formData.about_business?.length || 0}/800</div>
                                  </div>

                                  {/* ✅ City */}
                                  <div className="mt-3">
                                    <div className="sub-title" style={{ fontWeight: "600" }}>City</div>
                                    <input
                                      className="form-control mt-2 sub-input"
                                      value={formData.city || ""}
                                      onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, city: e.target.value }));
                                        setIsModifiedProfile(true);
                                      }}
                                    />
                                  </div>

                                  {/* ✅ State */}
                                  <div className="mt-3 ">
                                    <div className="sub-title" style={{ fontWeight: "600" }}>State</div>
                                    <input
                                      className="form-control mt-2 sub-input"
                                      value={formData.state || ""}
                                      onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, state: e.target.value }));
                                        setIsModifiedProfile(true);
                                      }}
                                    />
                                  </div>

                                  {/* ✅ Country */}
                                  <div className="mt-3">
                                    <div className="sub-title" style={{ fontWeight: "600" }}>Country</div>
                                    <input
                                      className="form-control mt-2 sub-input"
                                      value={formData.country || ""}
                                      onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, country: e.target.value }));
                                        setIsModifiedProfile(true);
                                      }}
                                    />
                                  </div>

                                  {/* ✅ Pincode */}
                                  <div className="mt-3 ">
                                    <div className="sub-title" style={{ fontWeight: "600" }}>Pincode</div>
                                    <input
                                      className="form-control mt-2 sub-input"
                                      value={formData.pincode || ""}
                                      onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "");
                                        if (val.length <= 6) {
                                          setFormData((prev) => ({ ...prev, pincode: val }));
                                          setIsModifiedProfile(true);
                                        }
                                      }}
                                    />
                                  </div>

                                  {/* ✅ Address */}
                                  <div className="mt-3">
                                    <div className="sub-title" style={{ fontWeight: "600" }}>Address</div>
                                    <textarea
                                      className="form-control mt-2"
                                      rows={2}
                                      value={formData.business_address || ""}
                                      onChange={(e) => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          business_address: e.target.value,
                                          address: e.target.value,
                                        }));
                                        setIsModifiedProfile(true);
                                      }}
                                    />
                                  </div>

                                  {/* ✅ Location (Directions + Lat/Lng) */}
                                  <div className="mt-3">
                                    <div className="sub-title" style={{ fontWeight: "600" }}>Directions</div>
                                    <div className="d-flex gap-2 align-items-center mt-2">
                                      <button
                                        type="button"
                                        className="btn "
                                        onClick={() => {
                                          handleGetLocation();
                                          setIsModifiedProfile(true);
                                        }}
                                      >
                                        <FaCrosshairs className="fs-1" style={{ color: "black" }} />
                                      </button>
                                      <input
                                        type="text"

                                        className="form-control sub-input"
                                        placeholder="Street, City, State"
                                        value={formData.direction || ""}
                                        onChange={(e) => {
                                          setFormData((prev) => ({ ...prev, direction: e.target.value }));
                                          setIsModifiedProfile(true);
                                        }}
                                      />
                                    </div>
                                    <div className="mt-3">
                                      <label className="sub-title">Latitude , Longitude</label>
                                      <input
                                        type="text"
                                        className="form-control mt-1 sub-input"
                                        value={`${formData.latitude || ""}${formData.longitude ? ", " + formData.longitude : ""}`}
                                        onChange={(e) => {
                                          const [lat, lng] = e.target.value.split(",").map((v) => v.trim());
                                          setFormData((prev) => ({ ...prev, latitude: lat || "", longitude: lng || "" }));
                                          setIsModifiedProfile(true);
                                        }}
                                      />
                                    </div>
                                  </div>

                                  {/* ✅ Save / Cancel */}
                                  <div className="text-end mt-4">
                                    {isModifiedProfile ? (
                                      <button
                                        style={{ background: " #27A376" }}
                                        className="btn save_btn1"
                                        disabled={isSaving}
                                        onClick={handleSave}
                                      >
                                        <span className="save-text">Save Changes</span>
                                      </button>
                                    ) : (
                                      <button
                                        className="btn btn-outline-danger"
                                        onClick={() => setAboutEditMode(false)}
                                      >
                                        Cancel
                                      </button>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <>
                                  {/* ✅ View Mode */}
                                  <div className="d-flex justify-content-end align-items-center mb-4">

                                    <button
                                      className="btn edit-btn"
                                      onClick={() => setAboutEditMode(true)}
                                    >
                                      Edit
                                    </button>
                                  </div>

                                  <div className="mt-3 mb-2" style={{ fontWeight: "600" }}>Business Logo</div>
                                  <div className="mb-4">
                                   {formData.business_logo ? (
  <img
    src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.business_logo}`}
    alt="Business Logo"
    style={{
      width: "150px",
      height: "150px",
      borderRadius: "14px",
      objectFit: "cover",
    }}
  />
) : (
  <div
    style={{
      width: "150px",
      height: "150px",
      borderRadius: "14px",
      background: "#F5F5F5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      border: "1px solid #E0E0E0",
    }}
  >
    <img
      src={imageplus}
      alt="Upload Logo"
      style={{ width: "50px", height: "50px", marginBottom: "6px" }}
    />
    <span style={{ fontSize: "12px", color: "#888" }}>No Logo</span>
  </div>
)}

                                  </div>

                                  <div className="mt-3 mb-2" style={{ fontWeight: "600" }}>Business Name</div>
                                  <div className="px-3 py-3 border rounded">
                                    {formData.business_name || "No information provided"}
                                  </div>

                                  <div className="mt-3 mb-2" style={{ fontWeight: "600" }}>Tagline</div>
                                  <div className="px-3 py-3 border rounded">
                                    {formData.business_tagline || "No information provided"}
                                  </div>

                                  <div className="mt-3 mb-2" style={{ fontWeight: "600" }}>About Business</div>
                                  <div className="px-3 py-3 border rounded" style={{ whiteSpace: "pre-wrap" }}>
                                    {formData.about_business || "No information provided"}
                                  </div>


                                  <div
                                    className="p-3 mb-4 mt-4"
                                    style={{
                                      borderRadius: "16px",
                                      backgroundColor: "#fff",
                                      boxShadow: "0 0 12px rgba(0,0,0,0.08)",
                                      position: "relative",
                                      border: "1px solid #CFD3D4",
                                    }}
                                  >
                                    {/* Title + Share */}
                                    <div className="d-flex justify-content-between align-items-center mb-3 ">
                                      <h5
                                        style={{
                                          fontWeight: "700",
                                          fontSize: "16px",
                                          lineHeight: "19px",
                                          margin: 0,
                                        }}
                                      >
                                        Store Location
                                      </h5>
                                      <img
  src={shareIcon}
  alt="Share"
  style={{ width: "20px", height: "20px", cursor: "pointer" }}
  onClick={async () => {
    let shareUrl = "";

    if (formData.latitude && formData.longitude) {
      shareUrl = `https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`;
    } else if (
      formData.business_address ||
      formData.city ||
      formData.state ||
      formData.country
    ) {
      const address = `${formData.business_address || ""}, ${formData.city || ""}, ${formData.state || ""}, ${formData.country || ""}`;
      shareUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    } else if (formData.direction) {
      shareUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.direction)}`;
    } else {
      await Swal.fire({
        icon: "error",
        title: "No Location Found",
        text: "No location information available!",
      });
      return;
    }

    if (navigator.share) {
      navigator.share({
        title: "My Store Location",
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      await Swal.fire({
        icon: "success",
        title: "Link Copied!",
        text: "Location link copied to clipboard.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  }}
/>

                                    </div>

                                    {/* Google Maps Preview */}
                                    <a
                                      href={
                                        formData.latitude && formData.longitude
                                          ? `https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`
                                          : formData.business_address || formData.city || formData.state || formData.country
                                            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                              `${formData.business_address || ""}, ${formData.city || ""}, ${formData.state || ""}, ${formData.country || ""}`
                                            )}`
                                            : formData.direction
                                              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.direction)}`
                                              : "#"
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        display: "block",
                                        borderRadius: "12px",
                                        overflow: "hidden",
                                        marginBottom: "12px",
                                        position: "relative",
                                      }}
                                    >
                                      <div style={{ width: "100%", height: "200px", position: "relative" }}>
                                        <iframe
                                          title="store-map"
                                          width="100%"
                                          height="100%"
                                          frameBorder="0"
                                          style={{ border: 0, pointerEvents: "none" }}
                                          src={
                                            formData.latitude && formData.longitude
                                              ? `https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&z=13&output=embed`
                                              : formData.business_address || formData.city || formData.state || formData.country
                                                ? `https://maps.google.com/maps?q=${encodeURIComponent(
                                                  `${formData.business_address || ""} ${formData.city || ""} ${formData.state || ""} ${formData.country || ""}`
                                                )}&z=13&output=embed`
                                                : formData.direction
                                                  ? `https://maps.google.com/maps?q=${encodeURIComponent(formData.direction)}&z=13&output=embed`
                                                  : ""
                                          }
                                          allowFullScreen
                                        ></iframe>

                                        {/* Overlay */}
                                        <div
                                          style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: "rgba(255,255,255,0.8)",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            color: "#444",
                                            pointerEvents: "none",
                                          }}
                                        >
                                          <img
                                            src={storeIcon}
                                            alt="Store Icon"
                                            style={{ width: "50px", height: "50px", marginBottom: "8px" }}
                                          />
                                          <span
                                            style={{
                                              fontFamily: "Manrope",
                                              fontSize: "14px",
                                              fontWeight: "800",
                                              lineHeight: "20px",
                                              color: "#7A7A7A",
                                            }}
                                          >
                                            Click to open in Google Maps
                                          </span>
                                        </div>
                                      </div>
                                    </a>

                                    {/* Address Text */}
                                    <div
                                      style={{
                                        fontSize: "14px",
                                        color: "#333",
                                        fontWeight: 500,
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "6px",
                                        margin: "0 auto",
                                      }}
                                    >
                                      <img src={map} alt="Location" style={{ width: "16px", height: "16px" }} />
                                      <div
                                        className="px-2"
                                        style={{
                                          fontFamily: "Manrope",
                                          fontSize: "14px",
                                          fontWeight: "500",
                                          lineHeight: "20px",
                                          color: "#061F35",
                                        }}
                                      >
                                        {`${formData.business_address || ""} ${formData.city || ""} ${formData.state || ""} ${formData.country || ""}`}
                                      </div>
                                    </div>
                                  </div>


                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === "my links" && (
                        <div className="px-3 mt-4 mb-4">
                          {/* Header + Edit button */}
                          {!contactEditMode && (
                            <div className="d-flex justify-content-end align-items-center mb-3">

                              <div className="text-end" style={{ border: "1px solid #262626", borderRadius: "8px" }}>
                                <button
                                  className="btn edit-btn"
                                  style={{
                                    color: "#34495E",
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    border: "none",
                                  }}
                                  onClick={() => {
                                    setContactEditMode(true);
                                    setInitialContactData({ ...formData });
                                  }}
                                >
                                  <span
                                    className="d-flex justify-content-center"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "500",
                                      color: "#262626",
                                      fontFamily: "Manrope",
                                      lineHeight: "12px",
                                    }}
                                  >
                                    Edit
                                  </span>
                                </button>
                              </div>

                            </div>
                          )}

                          {/* 📝 EDIT MODE */}
                          {contactEditMode ? (
                            <>
                              {[
                                { label: "Whatsapp", key: "whatsapp", placeholder: "whatsapp.com/business" },
                                { label: "Youtube", key: "youtube", placeholder: "youtube.com/yourchannel" },
                                { label: "Facebook", key: "facebook", placeholder: "facebook.com/yourpage" },
                                { label: "Mail", key: "business_email", placeholder: "your@email.com" },
                                { label: "Instagram", key: "instagram", placeholder: "instagram.com/yourprofile" },
                                { label: "Linkedin", key: "linkedin", placeholder: "linkedin.com/in/username" },
                                { label: "X", key: "twitter", placeholder: "x.com/username" },
                                { label: "Telegram", key: "telegram", placeholder: "your@telegram.com" },
                                { label: "Website", key: "other_link1", placeholder: "https://yourwebsite.com" },
                                { label: "Google My Business", key: "other_link2", placeholder: "Google My Business Link" },
                                { label: "Link1", key: "other_link3", placeholder: "Copy & Paste Your Respective Links" },
                                { label: "Link2", key: "other_link4", placeholder: "Copy & Paste Your Respective Links" },
                              ].map(({ label, key, placeholder }) => (
                                <div className="mb-3" key={key}>
                                  <div style={{ fontFamily: "Manrope", fontWeight: "600" }}>{label}</div>
                                  <input
                                    className="form-control sub-input"
                                    value={formData[key] || ""}
                                    placeholder={placeholder}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))}
                                    style={{
                                      height: "48px",
                                      borderRadius: "8px",
                                      marginTop: "8px",
                                    }}
                                  />
                                </div>
                              ))}

                              <div className="text-end mt-2">
                                {isContactModified ? (
                                  <button
                                    className="btn mt-4 mb-4 save-btn1"
                                    style={{
                                      backgroundColor: "#0E8931",
                                      color: "white",
                                      fontWeight: "600",
                                      cursor: "pointer",
                                    }}
                                    disabled={isSaving}
                                    onClick={() => {
                                      handleSave();
                                      setContactEditMode(false);
                                    }}
                                  >
                                    Save Changes
                                  </button>
                                ) : (
                                  <button
                                    className="btn mt-4 mb-4"
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "1px solid red",
                                      color: "red",

                                      minHeight: "36px",
                                      borderRadius: "8px",
                                      fontWeight: "600",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => setContactEditMode(false)}
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </>
                          ) : (
                            // 👁️ VIEW MODE
                            <div className="row g-3">
                              {[
                                { label: "WhatsApp", key: "whatsapp", icon: whatsapp1, color: "rgba(37, 211, 102, 1)", bg: "#25D36626" },
                                { label: "YouTube", key: "youtube", icon: youtube1, color: "rgba(255, 0, 0, 1)", bg: "rgba(255, 0, 0, 0.1)" },
                                { label: "Facebook", key: "facebook", icon: facebook1, color: "rgba(66, 103, 178, 1)", bg: "#4267B21A" },
                                { label: "Instagram", key: "instagram", icon: instagram1, color: "rgba(215, 63, 143, 1)", bg: "rgba(215, 63, 143, 0.1)" },
                                { label: "LinkedIn", key: "linkedin", icon: linkedin1, color: "rgba(0, 119, 181, 1)", bg: "#0077B51A" },
                                { label: "X", key: "twitter", icon: x1, color: "#000", bg: "rgba(0, 0, 0, 0.05)" },
                                { label: "Mail", key: "business_email", icon: mail, color: "#EA4335", bg: "rgba(234, 67, 53, 0.1)" },
                                { label: "Telegram", key: "telegram", icon: telegram1, color: "rgba(0, 119, 181, 1)", bg: "rgba(234, 67, 53, 0.1)" },
                                { label: "Website", key: "other_link1", icon: others1, color: "rgba(66, 133, 244, 1)", bg: "rgba(66, 133, 244, 0.1)" },
                                { label: "Business", key: "other_link2", icon: google, color: "rgba(66, 133, 244, 1)", bg: "rgba(66, 133, 244, 0.1)" },
                                { label: "Link1", key: "other_link3", icon: link3, color: "rgba(66, 133, 244, 1)", bg: "rgba(66, 133, 244, 0.1)" },
                                { label: "Link2", key: "other_link4", icon: link3, color: "rgba(66, 133, 244, 1)", bg: "rgba(66, 133, 244, 0.1)" },
                              ].map(({ label, key, icon, color, bg }) => {
                                const isFilled = !!formData[key];
                                return (
                                  <div className="col-6" key={key}>
                                    <a
                                      href={isFilled ? formatSocialLink(label, formData[key]) : "#"}
                                      target={label.toLowerCase().includes("mail") ? undefined : "_blank"}
                                      rel="noopener noreferrer"
                                      style={{
                                        textDecoration: "none",
                                        pointerEvents: isFilled ? "auto" : "none",
                                        opacity: isFilled ? 1 : 0.4,
                                        cursor: isFilled ? "pointer" : "not-allowed",
                                      }}
                                    >
                                      <div
                                        className="d-flex align-items-center gap-2 px-3"
                                        style={{
                                          background: bg,
                                          borderRadius: "12px",
                                          height: "62px",
                                        }}
                                      >
                                        <img src={icon} alt={label} width="46" height="46" />
                                        <span
                                          style={{
                                            fontFamily: "Manrope",
                                            fontWeight: "700",
                                            fontSize: "16px",
                                            lineHeight: "20px",
                                            color,
                                          }}
                                        >
                                          {label}
                                        </span>
                                      </div>
                                    </a>
                                  </div>
                                );
                              })}
                            </div>
                          )}


                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </>
            )}

            {page === "completeprofile" && (
              <CompleteProfile
                businessId={business_id}
                onFinish={() => {
                  // After finishing wizard → go back home & refresh business data
                  setPage("home");
                  window.location.reload();
                }}
              />
            )}
{page === "addcombo" && (
  <AddCombo
    onCancel={() => setPage("home")} // go back to list
  />
)}

            {page === "product" && (
              <section className="p-4">
                <div className="card banner-card p-4">
                  <h4 className="mb-4">Add Product</h4>
                  <Form onSubmit={handleCreate}>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label className="formnames">
                            Product Name*
                          </Form.Label>
                          <Form.Control
                            name="product_name"
                            placeholder="Enter product name"
                            required
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label className="formnames">Brand Name</Form.Label>
                          <Form.Control
                            name="product_brand_name"
                            placeholder="Enter brand name"
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                       <Form.Group className="mb-3">
  <Form.Label className="formnames">Measurement Type*</Form.Label>
  <Form.Select
    name="uom_type"
    value={uomType}
    onChange={(e) => setUomType(e.target.value)}
    required
  >
    <option value="">Select</option>
    <option value="Unit">Unit</option>
    <option value="pcs">Pcs</option>
    <option value="gram">Gram</option>
    <option value="kgs">Kgs</option>
    <option value="liters">Liters</option>
    <option value="other">Other</option>
  </Form.Select>

  {uomType === "other" && (
    <Form.Control
      className="mt-2"
      placeholder="Enter custom measurement"
      value={customUom}
      onChange={(e) => setCustomUom(e.target.value)}
    />
  )}
</Form.Group>

                      </div>
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label className="formnames">
                            Quantity Count*
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="quantity_count"
                            placeholder="Enter count"
                            required
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label className="formnames">MRP*</Form.Label>
                          <Form.Control
                            type="number"
                            name="mrp"
                            placeholder="0.00"
                            required
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label className="formnames">Video URL</Form.Label>
                          <Form.Control
                            type="url"
                            name="product_url"
                            placeholder="https://www.youtube.com"
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label className="formnames">Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        maxLength={200}
                        placeholder="Enter text here.."
                        name="product_description"
                      />
                    </Form.Group>

                    {/* Upload Media */}
<Form.Group className="mb-3">
  <Form.Label className="formnames">Upload Media</Form.Label>
  <div className="d-flex flex-wrap justify-content-between w-100">
    {productImagesPreview.map((img, index) => (
      <label
        key={index}
        htmlFor={`productImage${index}`}
        className="position-relative d-flex flex-column align-items-center justify-content-center"
        style={{
          width: "120px",   // fixed width
          height: "120px",  // fixed height
          border: "2px dashed #B0B0B0",
          borderRadius: "12px",
          cursor: "pointer",
          backgroundColor: "#fff",
          overflow: "hidden",
        }}
      >
        {img ? (
          <>
            <img
              src={img}
              alt={`Product ${index + 1}` || "product"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <img
              src={close}
              alt="remove"
              onClick={(e) => {
                e.preventDefault();
                const updatedPreviews = [...productImagesPreview];
                const updatedFiles = [...productImages];
                updatedPreviews[index] = null;
                updatedFiles[index] = null;
                setProductImagesPreview(updatedPreviews);
                setProductImages(updatedFiles);
              }}
              style={{
                position: "absolute",
                top: "2px",
                right: "2px",
                width: "25px",
                height: "25px",
                cursor: "pointer",
              }}
            />
          </>
        ) : (
          <>
            <img
              src={imageplus1}
              style={{ width: "24px", marginBottom: "8px" }}
              alt="upload"
            />
            <span style={{ fontSize: "12px", fontWeight: "500" }}>
              {index === 0 ? "Main Image" : `Image ${index}`}
            </span>
          </>
        )}

        <input
          type="file"
          accept="image/*"
          id={`productImage${index}`}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              handleFileChange(file, index);
            }
          }}
        />
      </label>
    ))}
  </div>
</Form.Group>



                    <div className="d-flex justify-content-end gap-3 mt-4">
                      <button  onClick={() => setPage("home")} className="cancel-btn1">
                        Cancel
                      </button>
                      <button  type="submit" className="create-btn1" disabled={isCreating}>
                        {isCreating ? "Creating..." : "Create"}
                      </button>
                    </div>
                  </Form>
                </div>
              </section>
            )}
            {page === "updateproduct" && selectedItem && (
              <section className="p-4">
                <div className="card banner-card p-4">
                  <h4 className="mb-4">Update Product</h4>
                  <Form onSubmit={handleUpdate}>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label className="formnames">Product Name*</Form.Label>
                          <Form.Control
                            name="product_name"
                            defaultValue={selectedItem.product_name}
                            placeholder="Enter product name"
                            required
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label className="formnames">Brand Name</Form.Label>
                          <Form.Control
                            name="product_brand_name"
                            defaultValue={selectedItem.product_brand_name}
                            placeholder="Enter brand name"
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
  <Form.Label className="formnames">Measurement Type*</Form.Label>


 <Form.Select
  name="uom_type"
  value={uomType}
  onChange={(e) => setUomType(e.target.value)}
  required
>
  <option value="">Select</option>
  <option value="Unit">Unit</option>
  <option value="pcs">Pcs</option>
  <option value="gram">Gram</option>
  <option value="kgs">Kgs</option>
  <option value="liters">Liters</option>
  <option value="other">Other</option>
</Form.Select>

{uomType === "other" && (
  <Form.Control
    className="mt-2"
    placeholder="Enter custom measurement"
    value={customUom}
    onChange={(e) => setCustomUom(e.target.value)}
  />
)}


</Form.Group>

                      </div>
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label className="formnames">Quantity Count*</Form.Label>
                          <Form.Control
                            type="number"
                            name="quantity_count"
                            defaultValue={selectedItem.quantity_count}
                            placeholder="Enter count"
                            required
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label className="formnames">MRP*</Form.Label>
                          <Form.Control
                            type="number"
                            name="mrp"
                            defaultValue={selectedItem.mrp}
                            placeholder="0.00"
                            required
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label className="formnames">Video URL</Form.Label>
                          <Form.Control
                            type="url"
                            name="product_url"
                            defaultValue={selectedItem.product_url}
                            placeholder="https://www.youtube.com"
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label className="formnames">Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        maxLength={200}
                        name="product_description"
                        defaultValue={selectedItem.product_description}
                        placeholder="Enter text here.."
                      />
                    </Form.Group>

                    {/* Upload Media */}
                  <Form.Group className="mb-4">
  <Form.Label className="formnames">Upload Media</Form.Label>
  <div className="d-flex flex-wrap justify-content-between w-100" >
    {productImagesPreview.map((img, index) => (
      <label
        key={index}
        htmlFor={`updateProductImage${index}`}
        className="position-relative d-flex flex-column align-items-center justify-content-center"
        style={{
          width: "100px",
          height: "100px",
          border: "1px dashed #B0B0B0",
          borderRadius: "12px",
          cursor: "pointer",
          backgroundColor: "#fff",
          overflow: "hidden",
        }}
      >
        {img ? (
          <>
            <img
              src={img}
              alt={`Product ${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            {/* Close button */}
            <img
              src={close}
              alt="remove"
              onClick={(e) => {
                e.preventDefault();
                const updatedPreviews = [...productImagesPreview];
                const updatedFiles = [...productImages];
                updatedPreviews[index] = null;
                updatedFiles[index] = null;
                setProductImagesPreview(updatedPreviews);
                setProductImages(updatedFiles);
              }}
              style={{
                position: "absolute",
                top: "2px",
                right: "2px",
                width: "25px",
                height: "25px",
                cursor: "pointer",
              }}
            />
          </>
        ) : (
          <>
            <img
              src={imageplus}
              style={{ width: "24px", marginBottom: "8px" }}
              alt="upload"
            />
            <span style={{ fontSize: "12px", fontWeight: "500" }}>
              {index === 0 ? "Main Image" : `Image ${index}`}
            </span>
          </>
        )}

        <input
          type="file"
          accept="image/*"
          id={`updateProductImage${index}`}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) handleFileChange(file, index);
          }}
        />
      </label>
    ))}
  </div>
</Form.Group>




                    <div className="d-flex justify-content-end gap-3 mt-4">
                      <button className="cancel-btn1" onClick={() => setPage("detail")}>
                        Cancel
                      </button>
                      <button className="create-btn1" type="submit">
                        Update
                      </button>
                    </div>
                  </Form>
                </div>
              </section>
            )}

{showShareModal && (
  <div
    className="transparent-overlay d-flex justify-content-center align-items-center px-4"
    style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      zIndex: 9999,
    }}
  >
    <div
      className="share-card-wrapper px-3"
      style={{
        background: "#fff",
        borderRadius: "16px",
        width: "450px", // ✅ fixed width for web
        maxWidth: "95%",
        boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.15)",
        position: "relative",
        padding: "20px"
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div style={{ fontSize: "24px", fontWeight: "800" }}>Share</div>
        <button
          onClick={() => setShowShareModal(false)}
          style={{ border: "none", background: "transparent", cursor: "pointer" }}
        >
          <img src={close} style={{ width: "32px", height: "32px" }} alt="close"/>
        </button>
      </div>

      {/* Share links */}
      <div className="share-linkvia mb-3">Share link via</div>
     <div className="d-flex gap-3 flex-wrap mb-4">
  <a
    href={`https://wa.me/?text=${encodeURIComponent(shareLink)}`}
    target="_blank"
    rel="noreferrer"
  >
    <img src={whatsapp1} width={52} height={52} alt="WhatsApp" />
  </a>

  <a
    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareLink
    )}`}
    target="_blank"
    rel="noreferrer"
  >
    <img src={facebook1} width={52} height={52} alt="Facebook" />
  </a>

  {/* ✅ Instagram (after Facebook) */}
  <a
    href={`https://www.instagram.com/?url=${encodeURIComponent(shareLink)}`}
    target="_blank"
    rel="noreferrer"
  >
    <img src={insta} width={52} height={52} alt="Instagram" />
  </a>

  <a
    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      shareLink
    )}`}
    target="_blank"
    rel="noreferrer"
  >
    <img src={linkedin1} width={52} height={52} alt="LinkedIn" />
  </a>

  <a
    href={`https://t.me/share/url?url=${encodeURIComponent(shareLink)}`}
    target="_blank"
    rel="noreferrer"
  >
    <img src={telegram1} width={52} height={52} alt="Telegram" />
  </a>

  <a
    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareLink
    )}`}
    target="_blank"
    rel="noreferrer"
  >
    <img src={x1} width={52} height={52} alt="X" />
  </a>
</div>


      {/* Copy link */}
      <div className="share-linkvia mb-2">or copy link</div>
      <div className="d-flex align-items-center rounded px-2" style={{height:"54px",background:"#F62D2D1A"}}>
        <input
          type="text"
          readOnly
          value={shareLink}
          className="form-control border-0 p-0 me-2"
          style={{ color: "#F62D2D", fontFamily:"Manrope", background:"transparent" ,fontWeight: "500", fontSize: "14px",border:"none" }}
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(shareLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="btn  "
          style={{background: "linear-gradient(284.69deg, #F62D2D 7.92%, #FF6161 100%)",
            color:"#ffffff"
}}

        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  </div>
)}


            {/* ================= SERVICE FORM ================= */}
            {page === "service" && (
              <section className="p-4">
                <div className="card banner-card p-4">
                  <h4 className="mb-4">Add Service</h4>
                  <Form onSubmit={handleCreateService}>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label className="formnames">Service Name*</Form.Label>
                          <Form.Control
                            name="service_name"
                            placeholder="Enter service name"
                            required
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
  <Form.Label className="formnames">Service Industry Type*</Form.Label>
  <Form.Select
    name="service_industrial_type"
    value={serviceIndustryType}
    onChange={(e) => setServiceIndustryType(e.target.value)}
    required
  >
    <option value="">Select</option>
    <option value="Real Estate">Real Estate</option>
    <option value="Home Services">Home Services</option>
    <option value="Health & Wellness">Health & Wellness</option>
    <option value="Legal">Legal</option>
    <option value="Education">Education</option>
    <option value="other">Other</option>
  </Form.Select>

  {serviceIndustryType === "other" && (
    <Form.Control
      className="mt-2"
      placeholder="Enter custom industry type"
      value={customIndustry}
      onChange={(e) => setCustomIndustry(e.target.value)}
      required
    />
  )}
</Form.Group>

                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
  <Form.Label className="formnames">Booking Type*</Form.Label>
  <Form.Select
    name="booking_type"
    value={bookingType}
    onChange={(e) => setBookingType(e.target.value)}
    required
  >
    <option value="">Select</option>
    <option value="Appointments">Appointments</option>
    <option value="Pre-Booking">Pre-Booking</option>
    <option value="Direct Call">Direct Call</option>
    <option value="Direct Visit">Direct Visit</option>
    <option value="other">Other</option>
  </Form.Select>

  {bookingType === "other" && (
    <Form.Control
      className="mt-2"
      placeholder="Enter custom booking type"
      value={customBooking}
      onChange={(e) => setCustomBooking(e.target.value)}
      required
    />
  )}
</Form.Group>

                      </div>
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label className="formnames">Video URL</Form.Label>
                      <Form.Control
                        type="url"
                        name="service_url"
                        placeholder="https://www.youtube.com"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="formnames">Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        maxLength={200}
                        placeholder="Enter text here.."
                        name="service_description"
                      />
                    </Form.Group>

                    {/* Upload Media */}
                   <Form.Group className="mb-3">
  <Form.Label className="formnames">Upload Media</Form.Label>
  <div className="d-flex flex-wrap justify-content-between w-100">
    {productImagesPreview.map((img, index) => (
      <label
        key={index}
        htmlFor={`serviceImage${index}`}
        className="position-relative d-flex flex-column align-items-center justify-content-center"
        style={{
          width: "100px",   // ✅ fixed width
          height: "100px",  // ✅ fixed height
          border: "2px dashed #B0B0B0",
          borderRadius: "12px",
          cursor: "pointer",
          backgroundColor: "#fff",
          overflow: "hidden",
        }}
      >
        {img ? (
          <>
            <img
              src={img}
              alt={`Service ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <img
              src={close}
              alt="remove"
              onClick={(e) => {
                e.preventDefault();
                const updatedPreviews = [...productImagesPreview];
                const updatedFiles = [...productImages];
                updatedPreviews[index] = null;
                updatedFiles[index] = null;
                setProductImagesPreview(updatedPreviews);
                setProductImages(updatedFiles);
              }}
              style={{
                position: "absolute",
                top: "2px",
                right: "2px",
                width: "25px",
                height: "25px",
                cursor: "pointer",
              }}
            />
          </>
        ) : (
          <>
            <img
              src={imageplus1}
              style={{ width: "24px", marginBottom: "8px" }}
              alt="upload"
            />
            <span style={{ fontSize: "12px", fontWeight: "500" }}>
              {`Image ${index + 1}`}
            </span>
          </>
        )}

        <input
          type="file"
          accept="image/*"
          id={`serviceImage${index}`}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              handleFileChange(file, index);
            }
          }}
        />
      </label>
    ))}
  </div>
</Form.Group>


                    <div className="d-flex justify-content-end gap-3 mt-4">
                      <button className="cancel-btn1" onClick={() => setPage("home")}>
                        Cancel
                      </button>
                      <button className="create-btn1" type="submit">
                        Create
                      </button>
                    </div>
                  </Form>
                </div>
              </section>
            )}
            {page === "updateservice" && selectedItem && (
              <section className="p-4">
                <div className="card banner-card p-4">
                  <h4 className="mb-4">Update Service</h4>
                  <Form onSubmit={handleUpdateService}>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label className="formnames">Service Name*</Form.Label>
                          <Form.Control
                            name="service_name"
                            defaultValue={selectedItem.service_name}
                            required
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
  <Form.Label className="formnames">Service Industry Type*</Form.Label>
  <Form.Select
    name="service_industrial_type"
    value={serviceIndustryType}
    onChange={(e) => setServiceIndustryType(e.target.value)}
    required
  >
    <option value="">Select</option>
    <option value="Real Estate">Real Estate</option>
    <option value="Home Services">Home Services</option>
    <option value="Health & Wellness">Health & Wellness</option>
    <option value="Legal">Legal</option>
    <option value="Education">Education</option>
    <option value="other">Other</option>
  </Form.Select>

  {serviceIndustryType === "other" && (
    <Form.Control
      className="mt-2"
      placeholder="Enter custom industry type"
      value={customIndustry}
      onChange={(e) => setCustomIndustry(e.target.value)}
      required
    />
  )}
</Form.Group>

                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
  <Form.Label className="formnames">Booking Type*</Form.Label>
  <Form.Select
    name="booking_type"
    value={bookingType}
    onChange={(e) => setBookingType(e.target.value)}
    required
  >
    <option value="">Select</option>
    <option value="Appointments">Appointments</option>
    <option value="Pre-Booking">Pre-Booking</option>
    <option value="Direct Call">Direct Call</option>
    <option value="Direct Visit">Direct Visit</option>
    <option value="other">Other</option>
  </Form.Select>

  {bookingType === "other" && (
    <Form.Control
      className="mt-2"
      placeholder="Enter custom booking type"
      value={customBooking}
      onChange={(e) => setCustomBooking(e.target.value)}
      required
    />
  )}
</Form.Group>

                      </div>
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label className="formnames">MRP</Form.Label>
                          <Form.Control
                            type="number"
                            name="mrp"
                            defaultValue={selectedItem.mrp}
                            placeholder="0.00"
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label className="formnames">Video URL</Form.Label>
                      <Form.Control
                        type="url"
                        name="service_url"
                        defaultValue={selectedItem.service_url}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="formnames">Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="service_description"
                        defaultValue={selectedItem.service_description}
                      />
                    </Form.Group>

                    {/* Upload Media */}
                  <Form.Group className="mb-3">
  <Form.Label className="formnames">Upload Media</Form.Label>
  <div className="d-flex flex-wrap justify-content-between w-100">
    {productImagesPreview.map((img, index) => (
      <label
        key={index}
        htmlFor={`updateServiceImage${index}`}
        className="position-relative d-flex flex-column align-items-center justify-content-center"
        style={{
          width: "100px",   // ✅ fixed width
          height: "100px",  // ✅ fixed height
          border: "1px dashed #B0B0B0",
          borderRadius: "12px",
          cursor: "pointer",
          backgroundColor: "#fff",
          overflow: "hidden",
        }}
      >
        {img ? (
          <>
            <img
              src={img}
              alt={`Service ${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            {/* Close button */}
            <img
              src={close}
              alt="remove"
              onClick={(e) => {
                e.preventDefault();
                const updatedPreviews = [...productImagesPreview];
                const updatedFiles = [...productImages];
                updatedPreviews[index] = null;
                updatedFiles[index] = null;
                setProductImagesPreview(updatedPreviews);
                setProductImages(updatedFiles);
              }}
              style={{
                position: "absolute",
                top: "2px",
                right: "2px",
                width: "25px",
                height: "25px",
                cursor: "pointer",
              }}
            />
          </>
        ) : (
          <>
            <img
              src={imageplus}
              style={{ width: "24px", marginBottom: "8px" }}
              alt="upload"
            />
            <span style={{ fontSize: "12px", fontWeight: "500" }}>
              {index === 0 ? "Main Image" : `Image ${index}`}
            </span>
          </>
        )}

        <input
          type="file"
          accept="image/*"
          id={`updateServiceImage${index}`}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) handleFileChange(file, index);
          }}
        />
      </label>
    ))}
  </div>
</Form.Group>


                    <div className="d-flex justify-content-end gap-3 mt-4">
                      <button className="cancel-btn1" onClick={() => setPage("detail")}>
                        Cancel
                      </button>
                      <button className="create-btn1" type="submit">
                        Update
                      </button>
                    </div>
                  </Form>
                </div>
              </section>
            )}

           {page === "detail" && selectedItem && (() => {
  // ✅ Define mediaList here
  const mediaList = [
    selectedItem.product_logo || selectedItem.service_image,
    selectedItem.logo1,
    selectedItem.logo2,
    selectedItem.logo3,
    (selectedItem.product_url || selectedItem.service_url)?.includes("youtube")
      ? "youtube"
      : null,
  ].filter(Boolean);

  return (
    <section className="p-4 d-flex justify-content-center">
      
       <div
    className="card"
    style={{
      maxWidth: "1100px",
      width: "100%",
      borderRadius: "20px",
      background: "#FFFFFF",
      boxShadow: "0px 0px 112px 0px #00000008, 0px 0px 22px 0px #6060600D",
    }}
  >
    {/* Back button row - no padding */}
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        padding: "16px 24px 0 24px", // ✅ only side + top spacing
      }}
    >
      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          border: "none",
          background: "transparent",
          fontSize: "20px",
          fontWeight: "700",
          cursor: "pointer",
        }}
        onClick={() => setPage("home")}
      >
        <img src={leftarrow} alt="Back" style={{ width: "24px" }} />
        Back
      </button>
    </div>
                          <div style={{ padding: "24px" }}>
        <div className="row g-4">
          {/* LEFT SECTION */}
          <div className="col-md-6">
            <div style={{ position: "relative" }}>
              {mediaList[activeIndex] === "youtube" ? (
                <iframe
                  width="100%"
                  style={{
                    aspectRatio: "1/1",
                    borderRadius: "12px",
                    border: "none",
                  }}
                  src={(selectedItem.product_url || selectedItem.service_url).replace(
                    "watch?v=",
                    "embed/"
                  )}
                  title="YouTube video"
                  allowFullScreen
                />
              ) : mediaList[activeIndex] ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${mediaList[activeIndex]}`}
                  alt={selectedItem.product_name || selectedItem.service_name}
                  className="img-fluid"
                  style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    borderRadius: "12px",
                    objectFit: "cover",
                  }}
                  onError={(e) => (e.target.src = "/noimage.png")}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    borderRadius: "12px",
                    background: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#888",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  No Image
                </div>
              )}

              {/* Carousel Arrows */}
              <button
                className="btn "
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "10px",
                  transform: "translateY(-50%)",
                  borderRadius: "50%",
                }}
                onClick={() =>
                  setActiveIndex(
                    (prev) => (prev - 1 + mediaList.length) % mediaList.length
                  )
                }
              >
                <img src={selectedleft} width={28} height={28} alt="left" />
              </button>
              <button
                className="btn"
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  borderRadius: "50%",
                }}
                onClick={() =>
                  setActiveIndex((prev) => (prev + 1) % mediaList.length)
                }
              >
                <img src={selectedright} width={28} height={28}  alt="right"/>
              </button>
            </div>

            {/* Thumbnails */}
            <div className="d-flex gap-2 mt-3 flex-wrap">
              {mediaList.map((media, idx) =>
                media === "youtube" ? (
                  <div
                    key={idx}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "6px",
                      background: "#000",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => setActiveIndex(idx)}
                  >
                    <img
                      src="https://img.icons8.com/ios-filled/50/fa314a/youtube-play.png"
                      alt="YouTube"
                      style={{ width: "30px", height: "30px" }}
                    />
                  </div>
                ) : media ? (
                  <img
                    key={idx}
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${media}`}
                    alt={`thumb-${idx}`}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "6px",
                      objectFit: "cover",
                      cursor: "pointer",
                      border:
                        idx === activeIndex
                          ? "2px solid #27A376"
                          : "1px solid #ddd",
                    }}
                    onClick={() => setActiveIndex(idx)}
                    onError={(e) => (e.target.src = "/noimage.png")}
                  />
                ) : (
                  <div
                    key={idx}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "6px",
                      background: "#f0f0f0",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#aaa",
                      fontSize: "12px",
                    }}
                  >
                    No Img
                  </div>
                )
              )}
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="col-md-6 d-flex flex-column justify-content-between">
            <div>
              <h3 style={{ fontWeight: "600", fontFamily: "Manrope" }}>
                {selectedItem.product_name || selectedItem.service_name}
              </h3>
              <div
                style={{
                  color: "#27A376",
                  fontSize: "22px",
                  fontWeight: "700",
                }}
              >
                ₹{selectedItem.mrp}
              </div>
              <p style={{ color: "#555", margin: "8px 0" }}>
                Listed ID: <strong>{selectedItem.id}</strong>
              </p>
              <h6 style={{ marginTop: "16px", fontWeight: "600" }}>
                Description
              </h6>
              <p style={{ color: "#333", lineHeight: "1.6" }}>
                {selectedItem.product_description ||
                  selectedItem.service_description}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button
  style={{
    width: "250px",
    height: "52px",
    borderRadius: "10px",
    background: "transparent",
    border: "1px solid #F62D2D",
  }}
  onClick={async () => {
    // Show SweetAlert confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      // Call the delete handler if confirmed
      handleSelectedDelete(selectedItem.id, selectedItem.package_type);

      // Show success message after delete
      Swal.fire(
        'Deleted!',
        'The item has been deleted.',
        'success'
      );
    }
  }}
>
  <span className="admin-delete">Delete</span>
</Button>


            <Button
              style={{
                width: "250px",
                height: "52px",
                borderRadius: "10px",
                background: "#34495E",
                border: "none",
              }}
              onClick={() => {
                setEditMode(true);

                if (selectedItem.package_type === "product") {
                  setProductImagesPreview([
                    selectedItem.product_logo
                      ? `${process.env.NEXT_PUBLIC_API_URL}/${selectedItem.product_logo}`
                      : null,
                    selectedItem.logo1
                      ? `${process.env.NEXT_PUBLIC_API_URL}/${selectedItem.logo1}`
                      : null,
                    selectedItem.logo2
                      ? `${process.env.NEXT_PUBLIC_API_URL}/${selectedItem.logo2}`
                      : null,
                    selectedItem.logo3
                      ? `${process.env.NEXT_PUBLIC_API_URL}/${selectedItem.logo3}`
                      : null,
                  ]);
                  setProductImages([null, null, null, null]);
                  setPage("updateproduct");
                } else {
                  setProductImagesPreview([
                    selectedItem.service_image
                      ? `${process.env.NEXT_PUBLIC_API_URL}/${selectedItem.service_image}`
                      : null,
                    selectedItem.logo1
                      ? `${process.env.NEXT_PUBLIC_API_URL}/${selectedItem.logo1}`
                      : null,
                    selectedItem.logo2
                      ? `${process.env.NEXT_PUBLIC_API_URL}/${selectedItem.logo2}`
                      : null,
                    selectedItem.logo3
                      ? `${process.env.NEXT_PUBLIC_API_URL}/${selectedItem.logo3}`
                      : null,
                  ]);
                  setProductImages([null, null, null, null]);
                  setPage("updateservice");
                }
              }}
            >
              <span className="admin-edit">Edit</span>
            </Button>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
})()}

            {page === "combo" && (
              <AddCombo
                onCancel={() => setPage("home")}
                onCreate={(data) => {
                  console.log("New combo data:", data);
                  setPage("home");
                  // TODO: call API to save combo here
                }}
              />
            )}






          </div>
          {page === "home" && activeTab === "home" && (products.length > 0 || services.length > 0) && (
            <div className="col-lg-2 d-flex">
              <div
                className="mt-4"
                style={{
                  background: "#fff",
                  boxShadow: "0px 0px 250px 0px #0000000F",
                  borderRadius: "16px",
                  width: "100%",
                  maxHeight: "150px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
               
                onClick={() => {
  if (business?.isPaid === "0") {
    setPlanContext("business");
    setShowBuyPlanModal(true); // show buy plan modal
  } else {
    setShowModal(true); // normal add product modal
  }
}}

              >
                <img
                  src={homeadd}
                  alt="add"
                  style={{ width: "80px", height: "80px", marginBottom: "12px" }}
                />
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#27A376",
                    fontFamily: "Manrope",
                  }}
                >
                  Add Product
                </span>
              </div>
            </div>
          )}
          {page === "home" && activeTab === "combos" && combos.length > 0 && (
            <div className="col-lg-2 d-flex">
              <div
                className="mt-4"
                style={{
                  background: "#fff",
                  boxShadow: "0px 0px 250px 0px #0000000F",
                  borderRadius: "16px",
                  width: "100%",
                  maxHeight: "150px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
onClick={() => {
  const lastCombo = combos[0]; // assuming combos are sorted latest-first

  if (!lastCombo || String(lastCombo.isPaid) !== "1") {
    // Block and send to plan selector
    setPlanContext("package");
    setShowBuyPlanModal(true);

    // 👉 store comboId for reference
    localStorage.setItem("blockedComboId", lastCombo?.package_code || "");
  } else {
    // Allow creating new combo
    setPage("addcombo");
  }
}}




              >
                <img
                  src={homeadd}
                  alt="add"
                  style={{ width: "80px", height: "80px", marginBottom: "12px" }}
                />
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#27A376",
                    fontFamily: "Manrope",
                  }}
                >
                  Add Combo
                </span>
              </div>
            </div>
          )}


        </div>

      </div>

      {/* ================= MODAL ================= */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Body>
          <p className="listing-id">
            Listing ID: <strong>{business?.business_id || "000000"}</strong>
          </p>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">
              Select Product or Service<span className="required">*</span>
            </Form.Label>
            <Form.Select
              className="form-select-custom"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Select</option>
              <option value="product">Product</option>
              <option value="service">Service</option>
            </Form.Select>
          </Form.Group>

          <Button
            className="btn-continue mt-4 mb-4"
            disabled={!selectedType}
            onClick={() => {
              setShowModal(false);
              setPage(selectedType);
            }}
          >
            <div className="continuebtn">Continue</div>
          </Button>

          <div className="note-text">
            <div className="notetext mt-2">Note :</div>
            <div className="notetext1 mt-2">
              While creating a product or service, you can add only one type at
              a time. However, when creating a combo, you can add other products
              or services in a single combo — not both together.
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showBuyPlanModal} onHide={() => setShowBuyPlanModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Upgrade Required</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p style={{ fontSize: "16px", fontWeight: "500" }}>
      You need to purchase a plan before adding more products or services.
    </p>
  </Modal.Body>
 <Modal.Footer className="d-flex justify-content-between">
  <Button
    className="cancel-planbtn"
    onClick={() => setShowBuyPlanModal(false)}
  >
    <span className="cancel-plantext">Cancel</span>
  </Button>

  <Button
    className="buy-planbtn"
    onClick={() => {
      setShowBuyPlanModal(false);
      const blockedComboId = localStorage.getItem("blockedComboId");
     sessionStorage.setItem("businessId", business_id);
sessionStorage.setItem("plan_for", planContext);
sessionStorage.setItem("packageCode", blockedComboId);

router.push("/othersplanselector");

    }}
  >
    <span className="buy-plantext">Buy Plan</span>
  </Button>
</Modal.Footer>

</Modal>

    </div>
  );
}
