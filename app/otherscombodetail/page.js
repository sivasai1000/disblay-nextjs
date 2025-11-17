"use client"
import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import LeftNav from "@/components/OthersLeftNav";
import "@/css/combodetails.css";
import TopNav from "@/components/OthersTopNav";
import { Card, Button, Modal, Form } from "react-bootstrap";

import Swal from "sweetalert2";


import {
  useComboList,
  useAddPackageCategory,
  usePackageCategoryList,
  useMasterAddProduct,
  useMasterAddService,
  usePackageProductList,
  usePackageServiceList,
  useUpdatePackageProduct,
  useUpdatePackageService,
  useDeletePackageService,
  useDeletePackageProduct,
  useUpdatePackage,
  useDeletePackage,
  useUpdatePackageCategory,
  useDeletePackageCategory ,
 
  useBusinessDetails,
   useFreeSubscription
} from "@/components/OthersBusinessApi"; 


export default function OthersComboDetails() {
    const imagepdf = "/assets/img/imagepdf.svg";
const imagemp3 = "/assets/img/imagemp3.svg";
const viewmp3 = "/assets/img/viewmp3.svg";
const viewpdf = "/assets/img/viewpdf.svg";

const imageplus1 = "/assets/img/imageplus1.svg";
const close = "/assets/img/close.svg";
const uparrow = "/assets/img/uparrow.svg";
const downarrow = "/assets/img/downarrow.svg";
const noimage = "/assets/img/noimage.svg";
const editicon2 = "/assets/img/editicon2.svg";
const editicon = "/assets/img/editicon.svg";
const deleteicon = "/assets/img/deleteicon.svg";
const dot = "/assets/img/dot.svg";

const router = useRouter();

const [combo, setCombo] = useState(null);

useEffect(() => {
  const stored = sessionStorage.getItem("combo");
  if (stored) {
    setCombo(JSON.parse(stored));
  }
}, []);


const packageId =typeof window !== "undefined" ? sessionStorage.getItem("packageId") : null;



  const [selectedType, setSelectedType] = useState(null);

  const business_id =typeof window !== "undefined" ? localStorage.getItem("businessId"): null;

  const [editingCategory, setEditingCategory] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [uomType, setUomType] = useState("");
const [customUom, setCustomUom] = useState("");

const business_slug =typeof window !== "undefined" ? localStorage.getItem("business_slug1"): null;
 const BASE_URL = "https://app.disblay.com";





  const [showTypeModal, setShowTypeModal] = useState(false);

  const [typeSelectValue, setTypeSelectValue] = useState("");
  const [page, setPage] = useState("home");
  const queryClient = useQueryClient();

  // category modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [catName, setCatName] = useState("");
  const [catSubtitle, setCatSubtitle] = useState("");
  const [catNote, setCatNote] = useState("");
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  // Update combo form state
const [comboName, setComboName] = useState("");
const [videoUrl, setVideoUrl] = useState("");

// Files + previews
const [posterFile, setPosterFile] = useState(null);
const [posterPreview, setPosterPreview] = useState(null);
const [pdfFile, setPdfFile] = useState(null);
const [mp3File, setMp3File] = useState(null);

  // For product update


// For service update
const [serviceImages, setServiceImages] = useState([]);
const [serviceImagesPreview, setServiceImagesPreview] = useState([]);
// For Service Industry & Booking Type
const [industryType, setIndustryType] = useState("");
const [customIndustry, setCustomIndustry] = useState("");

const [bookingType, setBookingType] = useState("");
const [customBooking, setCustomBooking] = useState("");


  const updatePackageProductMutation = useUpdatePackageProduct();
  const updatePackageServiceMutation = useUpdatePackageService();
  const deletePackageProductMutation = useDeletePackageProduct();
  const deletePackageServiceMutation = useDeletePackageService();
  const updateCategoryMutation = useUpdatePackageCategory();
  const deletepackageMutation = useDeletePackage();
  const deleteCategoryMutation = useDeletePackageCategory();
  const freeSubMutation = useFreeSubscription();

const { data: businessDetails } = useBusinessDetails(
  { business_id: combo?.business_id },
  { enabled: !!combo?.business_id }
);





  // ✅ API hooks
  const addCategoryMutation = useAddPackageCategory();
  const { data: categoryData, refetch } = usePackageCategoryList(
    { package_id: packageId },
    { enabled: !!packageId }
  );
  const categories = categoryData?.res || [];

  // Product/Service add API
  const { mutateAsync: MasterAddProduct } = useMasterAddProduct();
  const { mutateAsync: MasterAddService } = useMasterAddService();
  const updatePackageMutation = useUpdatePackage();


  // which category is open
  const [openCategoryId, setOpenCategoryId] = useState(null);

  // file states
  const [productImagesPreview, setProductImagesPreview] = useState([
    null,
    null,
    null,
    null,
  ]);
  const [productImages, setProductImages] = useState([null, null, null, null]);
  const { data: packageData } = useComboList(
    { business_id: combo?.business_id },
    { enabled: !!combo?.business_id }
  );

 let packageInfo = null;

if (Array.isArray(packageData?.response)) {
  packageInfo = packageData.response.find(
    (p) => String(p.id) === String(packageId)
  );
} else if (packageData?.response) {
  packageInfo = packageData.response;
}



  // ✅ Fetch products/services list for this combo
  const { data: productData,refetch: refetchProducts,} = usePackageProductList(
    { business_id: combo?.business_id, package_id: packageId },
    { enabled: selectedType === "product" }
  );
  const { data: serviceData,refetch: refetchServices, } = usePackageServiceList(
    { business_id: combo?.business_id, package_id: packageId },
    { enabled: selectedType === "service" }
  );

  const allProducts = productData?.response || [];
  const allServices = serviceData?.response || [];


  const handleCreateCategoryClick = () => {
  if (categories.length === 0) {
    // Always ask product/service if there are no categories
    setShowTypeModal(true);
  } else if (!selectedType) {
    // Fallback if type was never set
    setShowTypeModal(true);
  } else {
    // Already chosen → open category modal directly
    setShowCategoryModal(true);
  }
};



  // save type
  const handleContinueAfterType = () => {
    if (!typeSelectValue) return;

    setSelectedType(typeSelectValue);
    localStorage.setItem(`comboType_${packageId}`, typeSelectValue); // ✅ persist type

    setShowTypeModal(false);
    setShowCategoryModal(true);
  };

 const resetCategoryForm = () => {
  setCatName("");
  setCatSubtitle("");
  setCatNote("");
  setEditingCategory(null);
  setShowCategoryModal(false);
};

const handleCategorySubmit = (e) => {
  e.preventDefault();

  // ✅ Validation
  if (!catName.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Category Name Required",
      text: "Please enter a category name.",
    });
    return;
  }

  const payload = {
    business_id: combo?.business_id,
    package_id: packageId,
    category_name: catName,
    category_subtitle: catSubtitle,
    category_tagline: catNote,
  };

  // ✅ Update Category
  if (editingCategory) {
    payload.id = editingCategory.id;

    updateCategoryMutation.mutate(payload, {
      onSuccess: async (res) => {
        await Swal.fire({
          icon: "success",
          title: "Category Updated!",
          text: res?.msg || "Category updated successfully!",
        });

        resetCategoryForm();
        refetch();
      },
      onError: (err) => {
        console.error("Update category failed:", err);

        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: err?.response?.data?.msg || "Error updating category.",
        });
      },
    });

    return;
  }

  // ✅ Create New Category
  payload.type = selectedType;

  addCategoryMutation.mutate(payload, {
    onSuccess: async (res) => {
      await Swal.fire({
        icon: "success",
        title: "Category Added!",
        text: res?.msg || "Category added successfully!",
      });

      resetCategoryForm();
      refetch();
    },
    onError: (err) => {
      console.error("Add category failed:", err);

      Swal.fire({
        icon: "error",
        title: "Add Failed",
        text: err?.response?.data?.msg || "Error adding category.",
      });
    },
  });
};



  const toggleCategory = (id) => {
    setOpenCategoryId(openCategoryId === id ? null : id);
  };

  // ================== FILE PREVIEW ==================
 const handleFileChange = (file, index, type = "product") => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    if (type === "product") {
      const updatedPreviews = [...productImagesPreview];
      const updatedFiles = [...productImages];
      updatedPreviews[index] = ev.target.result;
      updatedFiles[index] = file;
      setProductImagesPreview(updatedPreviews);
      setProductImages(updatedFiles);
    } else if (type === "service") {
      const updatedPreviews = [...serviceImagesPreview];
      const updatedFiles = [...serviceImages];
      updatedPreviews[index] = ev.target.result;
      updatedFiles[index] = file;
      setServiceImagesPreview(updatedPreviews);
      setServiceImages(updatedFiles);
    }
  };
  reader.readAsDataURL(file);
};


  // ================== PRODUCT CREATE ==================
const handleCreateProduct = async (e) => {
  e.preventDefault();
  const formValues = Object.fromEntries(new FormData(e.target).entries());

  const formData = new FormData();
  formData.append("business_id", parseInt(combo?.business_id, 10));
  formData.append("package_id", packageId);
  formData.append("category_id", selectedCategoryId);
  formData.append("user_id", parseInt(combo?.business_id, 10));

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

  // ✅ Handle images
  productImages.forEach((file, index) => {
    if (file) {
      formData.append(index === 0 ? "product_logo" : `logo${index}`, file);
    } else if (productImagesPreview[index]) {
      const key = index === 0 ? "product_logo" : `logo${index}`;
      const url = productImagesPreview[index].replace(
        process.env.NEXT_PUBLIC_API_URL + "/",
        ""
      );
      formData.append(key, url);
    }
  });

  try {
    const res = await MasterAddProduct(formData);

    if (res?.status === "success") {
      await Swal.fire({
        icon: "success",
        title: "Product Created!",
        text: "Product created successfully.",
      });

      refetchProducts();
      setPage("home");
      setProductImages([null, null, null, null]);
      setProductImagesPreview([null, null, null, null]);
      setSelectedCategoryId(null);
      refetch();
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: res?.msg || "Failed to create product.",
      });
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

const handlePosterChange = (e) => {
  const f = e.target.files?.[0];
  if (!f) return;
  setPosterFile(f);
  setPosterPreview(URL.createObjectURL(f));
};
const handlePdfChange = (e) => {
  const f = e.target.files?.[0];
  if (!f) return;
  setPdfFile(f);
};
const handleMp3Change = (e) => {
  const f = e.target.files?.[0];
  if (!f) return;
  setMp3File(f);
};

const removePoster = () => {
  setPosterFile(null);
  if (posterPreview) {
    URL.revokeObjectURL(posterPreview);
  }
  setPosterPreview(null);
};
const removePdf = () => setPdfFile(null);
const removeMp3 = () => setMp3File(null);

useEffect(() => {
  if (packageInfo) {
    setComboName(packageInfo.package_name || "");

    // ✅ Correct key from API
    setVideoUrl(packageInfo.package_url || "");

    setPosterPreview(
      packageInfo.package_poster
        ? `${process.env.NEXT_PUBLIC_API_URL}/${packageInfo.package_poster}`
        : null
    );

    // ✅ Prefill PDF if it exists
    if (packageInfo.package_pdf) {
      setPdfFile({
        name: packageInfo.package_pdf.split("/").pop(), // show file name
        url: `${process.env.NEXT_PUBLIC_API_URL}/${packageInfo.package_pdf}`,
      });
    }

    // ✅ Prefill MP3 if it exists
    if (packageInfo.package_audio) {
      setMp3File({
        name: packageInfo.package_audio.split("/").pop(),
        url: `${process.env.NEXT_PUBLIC_API_URL}/${packageInfo.package_audio}`,
      });
    }
  }
}, [packageInfo]);



const handleUpdatePackage = async (e) => {
  if (e && e.preventDefault) e.preventDefault();

  try {
    const fd = new FormData();
    fd.append("business_id", combo?.business_id);
    fd.append("package_id", packageInfo.id || packageInfo._id);
    fd.append("package_name", comboName);
    fd.append("package_code", packageInfo.package_code || "");
    fd.append("start_date", packageInfo.start_date || "");
    fd.append("end_date", packageInfo.end_date || "");
    fd.append("package_url", packageInfo.package_url || "");
    fd.append("package_type", packageInfo.package_type || "");
    fd.append("video_url", videoUrl || "");

    // ✅ Optional files
    if (posterFile) fd.append("poster", posterFile);
    if (pdfFile) fd.append("pdf", pdfFile);
    if (mp3File) fd.append("audio", mp3File);

    const result = await updatePackageMutation.mutateAsync(fd);

    await Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Combo updated successfully!",
    });

    console.log("✅ Response:", result);

    queryClient.invalidateQueries(["comboList"]);
    setPage("home");
    setShowOptions(false);

  } catch (err) {
    console.error("❌ Update package error:", err);

    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: err?.response?.data?.msg || "Failed to update combo?.",
    });
  }
};




  // ================== SERVICE CREATE ==================
  const handleCreateService = async (e) => {
  e.preventDefault();
  const formValues = Object.fromEntries(new FormData(e.target).entries());

  const formData = new FormData();
  formData.append("business_id", parseInt(combo?.business_id, 10));
  formData.append("package_id", packageId);
  formData.append("category_id", selectedCategoryId);
  formData.append("user_id", parseInt(combo?.business_id, 10));

  formData.append("package_type", "service");
  formData.append("service_name", formValues.service_name);

  formData.append(
    "service_industrial_type",
    industryType === "other" ? customIndustry : industryType
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

  // ✅ Images
  productImages.forEach((file, index) => {
    if (file) {
      formData.append(index === 0 ? "service_image" : `logo${index}`, file);
    }
  });

  try {
    await MasterAddService(formData);

    // ✅ successful — no popup (your UX goes home automatically)
    refetchServices();
    setPage("home");

    setProductImages([null, null, null, null]);
    setProductImagesPreview([null, null, null, null]);
    setSelectedCategoryId(null);
    refetch();

  } catch (err) {
    console.error(err);

    Swal.fire({
      icon: "error",
      title: "Error Creating Service",
      text: "Something went wrong. Please try again.",
    });
  }
};


  // ================== UPDATE PRODUCT ==================
const handleUpdate = async (e) => {
  e.preventDefault();
  const formValues = Object.fromEntries(new FormData(e.target).entries());

  const formData = new FormData();
  formData.append("package_product_id", selectedItem.id);
  formData.append("business_id", combo?.business_id);
  formData.append("user_id", combo?.business_id);
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

  // ✅ Images: new OR existing
  productImages.forEach((file, index) => {
    const key = index === 0 ? "product_logo" : `logo${index}`;

    if (file) {
      formData.append(key, file); // new file
    } else if (productImagesPreview[index]) {
      const path = productImagesPreview[index].replace(
        process.env.NEXT_PUBLIC_API_URL + "/",
        ""
      );
      formData.append(key, path); // existing filename
    }
  });

  try {
    await updatePackageProductMutation.mutateAsync(formData);

    await Swal.fire({
      icon: "success",
      title: "Product Updated!",
      text: "Product updated successfully.",
    });

    setPage("home");
    setSelectedItem(null);
    queryClient.invalidateQueries(["packageProductList"]);

  } catch (err) {
    console.error(err);

    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: "Failed to update product. Please try again.",
    });
  }
};

const handleDeleteCategory = async (catId) => {
  if (!catId || !packageId) return;

  // ✅ Confirmation popup
  const confirm = await Swal.fire({
    icon: "warning",
    title: "Delete Category?",
    text: "Are you sure you want to delete this category?",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
  });

  if (!confirm.isConfirmed) return;

  deleteCategoryMutation.mutate(
    { id: catId, package_id: packageId },
    {
      onSuccess: async (res) => {
        await Swal.fire({
          icon: "success",
          title: "Category Deleted",
          text: res?.msg || "Category deleted successfully!",
        });

        refetch();
      },

      onError: (err) => {
        console.error("Delete category failed:", err);

        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: err?.response?.data?.msg || "Error deleting category.",
        });
      },
    }
  );
};



// ================== UPDATE SERVICE ==================
const handleUpdateService = async (e) => {
  e.preventDefault();
  const formValues = Object.fromEntries(new FormData(e.target).entries());

  const formData = new FormData();
  formData.append("id", selectedItem.id);
  formData.append("business_id", combo?.business_id);
  formData.append("user_id", combo?.business_id);
  formData.append("package_id", packageId);
  formData.append("package_type", "service");

  formData.append("service_name", formValues.service_name);

  formData.append(
    "service_industrial_type",
    industryType === "other" ? customIndustry : industryType
  );

  formData.append(
    "booking_type",
    bookingType === "other" ? customBooking : bookingType
  );

  formData.append("mrp", formValues.mrp || "");
  formData.append("service_url", formValues.service_url || "");
  formData.append("service_description", formValues.service_description || "");

  // ✅ Handle images
  serviceImages.forEach((file, index) => {
    const key = index === 0 ? "service_image" : `image${index}`;

    if (file) {
      formData.append(key, file);
    } else if (serviceImagesPreview[index]) {
      const path = serviceImagesPreview[index].replace(
        process.env.NEXT_PUBLIC_API_URL + "/",
        ""
      );
      formData.append(key, path);
    }
  });

  try {
    const res = await updatePackageServiceMutation.mutateAsync(formData);

    if (res?.status === "success") {
      await Swal.fire({
        icon: "success",
        title: "Service Updated!",
        text: "Service updated successfully.",
      });

      setPage("home");
      setSelectedItem(null);
      queryClient.invalidateQueries(["packageServiceList"]);
    } else {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: res?.msg || "Failed to update service.",
      });
    }
  } catch (err) {
    console.error(err);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to update service. Please try again.",
    });
  }
};

const handleDeletePackage = async (id) => {
  if (!id) return;

  
  const confirm = await Swal.fire({
    icon: "warning",
    title: "Delete Package?",
    text: "Are you sure you want to delete this package?",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
  });

  if (!confirm.isConfirmed) return;

  const payload = {
    business_id: business_id,
    package_id: id,
  };

  try {
    const res = await deletepackageMutation.mutateAsync(payload);

    if (res?.status === "success") {
      await Swal.fire({
        icon: "success",
        title: "Deleted Successfully!",
        text: "The package has been deleted.",
      });

      router.push("/othersadmin");
      queryClient.invalidateQueries(["packageServiceList"]);
    } else {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: res?.msg || "Failed to delete package.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error deleting package: " + error.message,
    });
  }
};

const handledeleteproduct = async (id) => {
  if (!id) return;

  
  const confirm = await Swal.fire({
    icon: "warning",
    title: "Delete Product?",
    text: "Are you sure you want to delete this product?",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
  });

  if (!confirm.isConfirmed) return;

  // ✅ Prepare form data
  const formData = new FormData();
  formData.append("package_product_id", id);
  formData.append("business_id", business_id);
  formData.append("user_id", business_id);

  try {
    const res = await deletePackageProductMutation.mutateAsync(formData);

    if (res?.status === "success") {
      await Swal.fire({
        icon: "success",
        title: "Deleted Successfully!",
        text: "Product removed from the package.",
      });

      setPage("home");
      queryClient.invalidateQueries(["packageServiceList"]);
    } else {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: res?.msg || "Failed to delete product.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error deleting product: " + error.message,
    });
  }
};

const handledeleteservice = async (id) => {
  if (!id) return;

  
  const confirm = await Swal.fire({
    icon: "warning",
    title: "Delete Service?",
    text: "Are you sure you want to delete this service?",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
  });

  if (!confirm.isConfirmed) return;

  const payload = { id };

  try {
    const res = await deletePackageServiceMutation.mutateAsync(payload);

    if (res?.status === "success") {
      await Swal.fire({
        icon: "success",
        title: "Deleted Successfully!",
        text: "Service removed from the package.",
      });

      setPage("home");
      queryClient.invalidateQueries(["packageServiceList"]);
    } else {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: res?.msg || "Failed to delete service.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error deleting service: " + error.message,
    });
  }
};




 // ✅ Single source of truth for selectedType
useEffect(() => {
  const savedType = localStorage.getItem(`comboType_${packageId}`);

  if (savedType) {
    // Always prefer what user picked earlier
    setSelectedType(savedType);
  } else if (packageInfo?.package_type) {
    // Only use API value if nothing saved
    setSelectedType(packageInfo.package_type);
    localStorage.setItem(`comboType_${packageId}`, packageInfo.package_type);
  }
  // 🚨 Notice: depend only on packageId, NOT packageInfo
}, [packageId]);



  useEffect(() => {
  if (page === "updateproduct" && selectedItem) {
    const previews = [null, null, null, null];
    if (selectedItem.product_logo) {
      previews[0] = `${process.env.NEXT_PUBLIC_API_URL}/${selectedItem.product_logo}`;
    }
    if (selectedItem.logo1) previews[1] = `${process.env.NEXT_PUBLIC_API_URL}/${selectedItem.logo1}`;
    if (selectedItem.logo2) previews[2] = `${process.env.NEXT_PUBLIC_API_URL}/${selectedItem.logo2}`;
    if (selectedItem.logo3) previews[3] = `${process.env.NEXT_PUBLIC_API_URL}/${selectedItem.logo3}`;
    setProductImagesPreview(previews);
    setProductImages([null, null, null, null]); // reset file slots
  }
}, [page, selectedItem]);
useEffect(() => {
  if (selectedItem) {
    setServiceImages([null]); // reset files
    setServiceImagesPreview([
      selectedItem.service_image
        ? `${process.env.NEXT_PUBLIC_API_URL}/${selectedItem.service_image}`
        : null,
    ]);
  }
}, [selectedItem]);
useEffect(() => {
  if (selectedItem) {
    if (["Unit", "pcs", "gram", "kgs", "liters"].includes(selectedItem.uom_type)) {
      setUomType(selectedItem.uom_type);
      setCustomUom("");
    } else {
      setUomType("other");
      setCustomUom(selectedItem.uom_type); // keep custom value
    }
  }
}, [selectedItem]);
useEffect(() => {
  if (selectedItem) {
    // Service Industry
    const industryOptions = [
      "Real Estate",
      "Home Services",
      "Health & Wellness",
      "Legal",
      "Education",
    ];
    if (industryOptions.includes(selectedItem.service_industrial_type)) {
      setIndustryType(selectedItem.service_industrial_type);
      setCustomIndustry("");
    } else {
      setIndustryType("other");
      setCustomIndustry(selectedItem.service_industrial_type || "");
    }

    // Booking Type
    const bookingOptions = [
      "Appointments",
      "Pre-Booking",
      "Direct Call",
      "Direct Visit",
    ];
    if (bookingOptions.includes(selectedItem.booking_type)) {
      setBookingType(selectedItem.booking_type);
      setCustomBooking("");
    } else {
      setBookingType("other");
      setCustomBooking(selectedItem.booking_type || "");
    }
  }
}, [selectedItem]);





  return (
    <div className="d-flex min-vh-100" style={{ background: "#F4F5FB" }}>
      <LeftNav />
      <div className="flex-grow-1 d-flex flex-column">
        <TopNav userName="Demo User" />

        {/* ================= HOME PAGE ================= */}
        {page === "home" && (
          <section className="p-4 w-100 d-flex justify-content-center">
            <Card
              style={{
                maxWidth: "900px",
                width: "100%",
                borderRadius: "20px",
                boxShadow: "0px 0px 20px rgba(0,0,0,0.08)",
                padding: "24px",
              }}
            >
              <div className="detail-comboid mb-4">
                Combo ID : {combo?.id || combo?._id}
              </div>

              {packageInfo && (
                <div
                  key={packageInfo.id}
                  style={{
                    borderRadius: "12px",
                    background: "linear-gradient(90deg, #FFE7E7, #FDEFFF)",
                    padding: "20px",
                    marginBottom: "20px",
                  }}
                >
<div className="d-flex justify-content-between align-items-center">
  {/* Left side: image + name */}
  <div className="d-flex align-items-center gap-3">
    {packageInfo.package_poster ? (
  <img
    src={`${process.env.NEXT_PUBLIC_API_URL}/${packageInfo.package_poster}`}
    alt={packageInfo.package_name}
    style={{
      width: "80px",
      height: "80px",
      borderRadius: "12px",
      objectFit: "cover",
    }}
  />
) : (
  <div
    style={{
      width: "80px",
      height: "80px",
      borderRadius: "12px",
      background: "#F5F5F5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      border: "1px solid #E0E0E0",
    }}
  >
    <img
      src={noimage} // ✅ use your imported fallback image
      alt="No Poster"
      style={{ width: "30px", height: "30px", marginBottom: "4px" }}
    />
    <span style={{ fontSize: "10px", color: "#888" }}>No Image</span>
  </div>
)}

    <div style={{ flex: 1 }}>
      <div className="detail-packagename">{packageInfo.package_name}</div>
    </div>
  </div>

  {/* Right side: dot/close icon */}
  <div style={{ position: "relative" }}>
    <img
      src={showOptions ? close : dot}
      alt="options"
      style={{
        width: "32px",
        height: "32px",
        cursor: "pointer",
      }}
      onClick={() => setShowOptions(!showOptions)}
    />

    {showOptions && (
      <>
        {/* 🔹 Background overlay */}
        <div
          onClick={() => setShowOptions(false)} // click outside closes menu
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#020D1730", // your requested color
            zIndex: 999, // behind the popup
          }}
        ></div>

        {/* 🌟 Overlay small card */}
        <div
  style={{
    position: "absolute",
    top: "50px",
    right: 0,
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
    padding: "10px 0", // vertical padding for items
    zIndex: 1000,
    minWidth: "200px",
  }}
>
  {/* Edit Row */}
  <div
    style={{
      display: "flex",             // 👈 make it flex
      alignItems: "center",        // 👈 center icon + text
      gap: "8px",                  // 👈 spacing between icon and text
      padding: "8px 12px",
      cursor: "pointer",
      borderBottom: "1px solid #eee",
    }}
    onClick={() => {
  setShowOptions(false);
  setPage("updatecombo"); // open inline update page
}}

  >
    <img src={editicon} style={{ width: 18, height: 18 }} alt="Edit" />
    <span style={{ color: "#262626", fontSize: "15px", fontWeight: "600" }}>
      Edit
    </span>
  </div>

  {/* Delete Row */}
  <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    cursor: packageInfo?.isComboSubcription === "Free" ? "not-allowed" : "pointer",
    opacity: packageInfo?.isComboSubcription === "Free" ? 0.5 : 1, // faded when disabled
  }}
  onClick={() => {
    if (packageInfo?.isComboSubcription !== "Free") {
      setShowOptions(false);
      handleDeletePackage(packageInfo.id);
    }
  }}
>
  <img src={deleteicon} style={{ width: 18, height: 18 }} alt="Delete" />
  <span style={{ color: "#FF1C1C", fontSize: "15px", fontWeight: "600" }}>
    Delete Combo
  </span>
</div>
</div>

      </>
    )}
  </div>
</div>


      
  
    
                  <div className="d-flex justify-content-between mt-3">
                    <div >
                      <div className="detail-ncat">No of Categories</div>
                      <div className="text-center detail-ncatvalue">
                        {categories.length}
                      </div>
                    </div>
                    <div >
                      <div className="detail-ncat">No of Items</div>
                      <div className="text-center detail-ncatvalue">
                        {packageInfo.totalItems}
                      </div>
                    </div>
                    <div >
                      <div className="detail-ncat">Cost</div>
                      <div className="text-center detail-ncatvalue">
                        ₹{packageInfo.totalPrice}/-
                      </div>
                    </div>
                  </div>
                </div>
              )}




              {/* Button */}
<div
  className={
    categories.length > 0
      ? "d-flex justify-content-end align-items-center position-relative"
      : "text-center"
  }
  style={{ width: "100%" }}
>
  {/* 🔹 Show Payment info/button only if already paid */}
  {packageInfo?.isPaid === "1" && (
    <Button
      style={{
        position: "absolute",   // stick it to the left
        left: 0,
        background: "#fff",
        border: "1px solid #27A64B",
        borderRadius: "10px",
        padding: "12px 24px",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        fontWeight: "700",
        fontSize: "18px",
        width:"125px",
        height:"44px",
        color:"#27A64B"
      }}
      onClick={() => {
  sessionStorage.setItem("businessId", combo?.business_id);
  sessionStorage.setItem("packageId", packageInfo?.id);

  router.push("/otherscombopayment");
}}

    >
      Payment
    </Button>
  )}

  {/* 🔹 Always show Add/Create Category (right end) */}
  <Button
    style={{
      width: "180px",
      height: "50px",
      background: "#34495E",
      border: "none",
      borderRadius: "10px",
      padding: "12px 24px",
    }}
    onClick={handleCreateCategoryClick}
  >
    <div className="btn-insidetext">
      {categories.length > 0 ? "Add Category" : "Create Category"}
    </div>
  </Button>
</div>



              {/* Categories */}
              <div className="mt-4 w-100">
                {categories.map((cat) => {
                  const items =
                    selectedType === "product"
                      ? allProducts.filter((p) => p.category_id === cat.id.toString())
                      : allServices.filter((s) => s.category_id === cat.id.toString());

                  return (
                    <Card
                    className="details-card w-100"
                      key={cat.id}
                      style={{
                        borderRadius: "12px",
                        marginBottom: "12px",
                        border: "1px solid #eee",
                        width:"100%"
                      }}
                    >
                      {/* Header */}
<div 
  style={{
    background: "#F1EDFE",
    padding: "12px 16px",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    cursor: "pointer",
  }}
  onClick={() => toggleCategory(cat.id)}
>
  {/* Header row: Title + Arrow */}
  <div className="d-flex justify-content-between align-items-center">
    <div>
      <div className="details-cattitle">Category Title</div>
      <div className="details-catname mt-2">{cat.category_name}</div>
    </div>

    <span style={{ fontSize: "18px", color: "#c00" }}>
      {openCategoryId === cat.id ? (
        <img src={uparrow} alt="up"/>
      ) : (
        <img src={downarrow} alt="down" />
      )}
    </span>
  </div>

  {/* Expanded content */}
  {openCategoryId === cat.id && (
    <div className="mt-2">
      
        <>
          <div className="details-cattitle mt-2">Category Subtitle</div>
          <div className="details-catname">{cat.category_subtitle }</div>
       
      
    
        
          <div className="details-cattitle mt-2">Note</div>
          <div className="details-catnames">{cat.category_tagline }</div>
        </>
      

      {/* Buttons row at bottom right */}
      <div className="d-flex justify-content-end gap-3 mt-3 px-4">
        <button
  className="editnew d-flex align-items-center gap-1"
  onClick={(e) => {
    e.stopPropagation(); // important — prevent card collapse toggle
    setEditingCategory(cat); // store the category being edited
    setCatName(cat.category_name || "");
    setCatSubtitle(cat.category_subtitle || "");
    setCatNote(cat.category_tagline || "");
    setShowCategoryModal(true);
  }}
>
  <img src={editicon2} alt="Edit" style={{ width: "20px", height: "20px" }} />
  <span style={{ fontFamily: "Manrope", fontSize: "14px", fontWeight: "600", color: "#27A376" }}>
    Edit
  </span>
</button>


        <button
  className="editnew"
  onClick={(e) => {
    e.stopPropagation(); // avoid collapsing
    handleDeleteCategory(cat.id);
  }}
>
  <img
    src={deleteicon}
    alt="Delete"
    style={{ width: "20px", height: "20px" }}
  />
</button>

      </div>
    </div>
  )}
</div>



                      {/* Content */}
                      <div style={{ background: "#fff", padding: "16px" }}>
                        {items.length > 0 ? (
                          <>
                            {/* Header Row */}
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <div className="d-flex mt-2 mb-2" style={{ gap: "58px" }}>
                                <div>
                                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#405979" }}>ITEMS</div>
                                  <div
                                    className="text-center"
                                    style={{ fontSize: "18px", fontWeight: 700, color: "#000000" }}
                                  >
                                    {items.length}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#405979" }}>AMOUNT</div>
                                  <div
                                    className="text-center"
                                    style={{ fontSize: "18px", fontWeight: 700, color: "#000000" }}
                                  >
                                    ₹{items.reduce((sum, i) => sum + parseFloat(i.mrp || 0), 0)}
                                  </div>
                                </div>
                              </div>
                              <Button
                                style={{
                                  width: "107px",
                                  height: "48px",
                                  border: "1px solid red",
                                  borderRadius: "8px",
                                  background: "transparent",
                                  color: "#FF6161",
                                  fontWeight: 700,
                                  fontSize: "18px",
                                }}
                                onClick={() => {
                                  setSelectedCategoryId(cat.id);
                                  setShowAddItemModal(true);
                                }}
                              >
                                + Add
                              </Button>
                            </div>

                            {/* Item Cards */}
                            <div className="row g-3">
                              {items.map((item, index) =>
                                selectedType === "product" ? (
                                  // ✅ Product Layout
                                  <div key={item.id} className="col-12 col-md-6">
                                    <div
                                      className="p-3"
                                      style={{
                                        background: "#F4F6FB",
                                        borderRadius: "12px",
                                        height: "100%",
                                      }}
                                    >
                                      <div className="row">
                                        {/* ✅ Image */}
                                        <div className="col-3 text-center mt-2">
                                          {item.product_logo ? (
                                            <div className="col-3">
                                              <img
                                                src={`${process.env.NEXT_PUBLIC_API_URL}/${item.product_logo || item.service_image
                                                  }`}
                                                alt={item.product_name || item.service_name}
                                                style={{
                                                  width: "69px",
                                                  height: "66px",
                                                  objectFit: "cover",
                                                  borderRadius: "10px",
                                                }}
                                              />
                                            </div>
                                          ) : (
                                            <div
                                              style={{
                                                width: 66,
                                                height: 66,
                                                borderRadius: 8,
                                                backgroundColor: "#f0f0f0",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "10px",
                                                color: "#999",
                                                border: "2px solid white",
                                              }}
                                            >
                                              <img
                                                src={noimage}
                                                alt="No Image"
                                                style={{
                                                  width: "24px",
                                                  height: "24px",
                                                  marginBottom: "4px",
                                                  opacity: 1,
                                                }}
                                              />
                                              No Image
                                            </div>
                                          )}
                                        </div>

                                        {/* ✅ Left Details */}
                                        <div className="col-5">
                                          <div className="mb-3">
                                            <div className="productsheader">Product Name</div>
                                            <div className="productsvalue mt-1 text-ellipsis">
                                              {item.product_name || item.service_name}
                                            </div>
                                          </div>

                                          <div>
                                            <div className="productsheader">Measurement</div>
                                            <div className="productsvalue mt-1 text-ellipsis">
                                              {item.uom_type}
                                            </div>
                                          </div>

                                          <div className="mt-3">
                                            <div className="productsheader">Price</div>
                                            <div className="productsvalue mt-1 text-ellipsis">
                                              ₹{parseFloat(item.mrp || 0).toFixed(2)}
                                            </div>
                                          </div>
                                        </div>

                                        {/* ✅ Right Details + Actions */}
                                        <div className="col-4">
                                          <div>
                                            <div className="productsheader">Brand</div>
                                            <div className="productsvalue mt-1 text-ellipsis">
                                              {item.product_brand_name}
                                            </div>
                                          </div>

                                          <div className="mt-3">
                                            <div className="productsheader">Quantity</div>
                                            <div className="productsvalue mt-1 text-ellipsis">
                                              {item.quantity_count}
                                            </div>
                                          </div>

                                          {/* ✅ Actions */}
                                          <div
                                            className="d-flex mt-3 gap-3"
                                            style={{ width: "103px", height: "32px", marginLeft: "-10px" }}
                                          >
                                            <button
                                              className="editnew d-flex align-items-center gap-1"
                                              onClick={() => {
                                                setSelectedItem(item);

                                                setPage("updateproduct");

                                              }}

                                            >
                                              <img
                                                src={editicon2}
                                                alt="Edit"
                                                style={{ width: "20px", height: "20px" }}
                                              />
                                              <span
                                                style={{
                                                  width: "27px",
                                                  height: "16px",
                                                  fontFamily: "Manrope",
                                                  fontSize: "14px",
                                                  fontWeight: "600",
                                                  lineHeight: "15px",
                                                  color: "#27A376",
                                                }}
                                              >
                                                Edit
                                              </span>
                                            </button>

                                            <button
                                              className="editnew"
                                              onClick={()=>{
                                                handledeleteproduct(item.id)
                                              }}

                                            >
                                              <img
                                                src={deleteicon}
                                                alt="Delete"
                                                style={{ width: "20px", height: "20px" }}
                                              />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  // ✅ Service Layout
                                  <div key={item.id} className="col-12 col-md-6">
                                    <div
                                      className="p-3"
                                      style={{ background: "#F4F6FB", borderRadius: "12px", height: "100%" }}
                                    >
                                      <div className="row px-2">
                                        {/* Left Side */}
                                        <div className="col-8 text-start">
                                          <div className="productsheader mt-2 text-ellipsis">Service Name</div>
                                          <div className="productsvalue mt-2 mb-4 text-ellipsis">
                                            {item.service_name}
                                          </div>

                                          <div className="productsheader">Service Industry Type</div>
                                          <div className="productsvalue mt-2 mb-4 text-ellipsis">
                                            {item.service_industrial_type}
                                          </div>

                                          <div className="productsheader">Booking Type</div>
                                          <div className="productsvalue mt-2 mb-4 text-ellipsis">
                                            {item.booking_type}
                                          </div>
                                        </div>

                                        {/* Right Side */}
                                        <div className="col-4 text-end">
                                          {item.service_image ? (
                                            <img
                                              src={`${process.env.NEXT_PUBLIC_API_URL}/${item.service_image}`}
                                              alt="Service"
                                              style={{
                                                width: 60,
                                                height: 60,
                                                objectFit: "cover",
                                                borderRadius: 8,
                                                border: "2px solid white",
                                                marginBottom: "5px",
                                              }}
                                            />
                                          ) : (
                                            <div
                                              style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 8,
                                                backgroundColor: "#f0f0f0",
                                                display: "inline-flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "10px",
                                                color: "#999",
                                                border: "2px solid white",
                                                marginBottom: "5px",
                                                padding: "4px",
                                                textAlign: "center",
                                                lineHeight: "12px",
                                              }}
                                            >
                                              <img
                                                src={noimage}
                                                alt="No Image"
                                                style={{
                                                  width: 24,
                                                  height: 24,
                                                  marginBottom: 4,
                                                  opacity: 0.6,
                                                }}
                                              />
                                              No Image
                                            </div>
                                          )}

                                          {/* Service Actions */}
                                          <div className="text-end d-flex justify-content-end">
                                            <div
                                              className="d-flex justify-content-end gap-3"
                                              style={{
                                                width: "103px",
                                                height: "32px",
                                                marginTop: "80px",
                                                marginLeft: "-10px",
                                              }}
                                            >
                                              <button className="editnew d-flex align-items-center gap-1"
                                                onClick={() => {
                                                  setSelectedItem(item);

                                                  setPage("updateservice");

                                                }}>
                                                <img src={editicon2} alt="Edit" style={{ width: "20px", height: "20px" }} />
                                                <span
                                                  style={{
                                                    width: "27px",
                                                    height: "16px",
                                                    fontFamily: "Manrope",
                                                    fontSize: "14px",
                                                    fontWeight: "600",
                                                    lineHeight: "15px",
                                                    color: "#27A376",
                                                  }}
                                                >
                                                  Edit
                                                </span>
                                              </button>

                                              <button className="editnew" 
                                              onClick={()=>{
                                                handledeleteservice(item.id)
                                              }}>
                                                <img src={deleteicon} alt="Delete" style={{ width: "20px", height: "20px" }} />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                )
                              )}
                            </div>
                          </>
                        ) : (
                          // If no items, show "Add"
                          <div className="text-center py-3">
                            <Button
                              variant="outline-danger"
                              onClick={() => {
                                setSelectedCategoryId(cat.id);
                                setShowAddItemModal(true);
                              }}
                               style={{
                                  width: "190px",
                                  height: "48px",
                                  border: "1px solid red",
                                  borderRadius: "8px",
                                  background: "transparent",
                                  color: "#FF6161",
                                  fontWeight: 700,
                                  fontSize: "18px",
                                }}
                            >
                              + Add {selectedType === "service" ? "Service" : "Product"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>

{packageInfo?.isPaid !== "1" && categories.length > 0 && (
  <div className="d-flex justify-content-end mt-4">
    <Button
  style={{
    background: "#27A376",
    border: "none",
    borderRadius: "12px",
    padding: "12px 40px",
    fontSize: "16px",
    fontWeight: "600",
  }}
  onClick={async () => {
    const userId = localStorage.getItem("businessId");
    const biz = businessDetails?.response;

    // ✅ Case 1: free subscription available
    if (biz?.isPaid === "1" && biz?.has_used_free_combo === "0") {
      try {
        const payload = {
          userId,
          businessId: combo?.business_id,
          package_id: packageInfo?.id,
          package_code: packageInfo?.package_code,
        };

        const res = await freeSubMutation.mutateAsync(payload);

        if (res?.status === "success") {
          await Swal.fire({
            icon: "success",
            title: "Free Subscription Activated!",
            text: "🎉 Your free combo subscription has been applied successfully.",
          });

          const shareLink = `${BASE_URL}/s/${encodeURIComponent(business_slug)}`;

const durationDays =
  packageInfo?.start_date && packageInfo?.end_date
    ? Math.ceil(
        (new Date(packageInfo.end_date) - new Date(packageInfo.start_date)) /
          (1000 * 60 * 60 * 24)
      )
    : 365;

sessionStorage.setItem("shareLink", shareLink);
sessionStorage.setItem("durationDays", durationDays);

router.push("/otherssuccess");

          return;
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: res?.msg || "Failed to apply free subscription",
          });
        }
      } catch (err) {
        console.error("Free subscription error:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error applying free subscription",
        });
      }
    }

    // ✅ Case 2: go to paid plans normally
   sessionStorage.setItem("packageCode", packageInfo?.package_code);
sessionStorage.setItem("packageId", packageId);
sessionStorage.setItem("businessId", combo?.business_id);
sessionStorage.setItem("type", "Subscription");
sessionStorage.setItem("plan_for", "package");

router.push("/othersplanselector");

  }}
>
  <span style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "20px" }}>
    Submit
  </span>
</Button>

  </div>
)}



            </Card>
          </section>
        )}

        {page === "product" && (
          <section className="p-4">
            <div className="card banner-card p-4">
              <h4 className="mb-4">Add Product</h4>
              <Form onSubmit={handleCreateProduct}>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Product Name*</Form.Label>
                      <Form.Control
                        name="product_name"
                        placeholder="Enter product name"
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Brand Name</Form.Label>
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
      required
    />
  )}
</Form.Group>

                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Quantity Count*</Form.Label>
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
                      <Form.Label>MRP*</Form.Label>
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
                      <Form.Label>Video URL</Form.Label>
                      <Form.Control
                        type="url"
                        name="product_url"
                        placeholder="https://www.youtube.com"
                      />
                    </Form.Group>
                  </div>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
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
  <Form.Label>Upload Media</Form.Label>
  <div className="d-flex flex-wrap justify-content-between w-100">
    {productImagesPreview.map((img, index) => (
      <label
        key={index}
        htmlFor={`productImage${index}`}
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
              alt={`Product ${index + 1}`}
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
              {index === 0 ? "Main Image" : `Image ${index + 1}`}
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
                  <button className="cancel-btn1" onClick={() => setPage("home")}>
                    Cancel
                  </button>
                  <button type="submit" className="create-btn1">
                    Save
                  </button>
                </div>
              </Form>
            </div>
          </section>
        )}

        {page === "service" && (
          <section className="p-4">
            <div className="card banner-card p-4">
              <h4 className="mb-4">Add Service</h4>
              <Form onSubmit={handleCreateService}>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Service Name*</Form.Label>
                      <Form.Control
                        name="service_name"
                        placeholder="Enter service name"
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
  <Form.Label>Industry Type*</Form.Label>
  <Form.Select
    name="service_industrial_type"
    value={industryType}
    onChange={(e) => setIndustryType(e.target.value)}
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

  {industryType === "other" && (
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
  <Form.Label>Booking Type*</Form.Label>
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
                      <Form.Label>MRP*</Form.Label>
                      <Form.Control
                        type="number"
                        name="mrp"
                        placeholder="0.00"
                        required
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Video URL</Form.Label>
                      <Form.Control
                        type="url"
                        name="service_url"
                        placeholder="https://www.youtube.com"
                      />
                    </Form.Group>
                  </div>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
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
  <Form.Label>Upload Media</Form.Label>
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
              {index === 0 ? "Main Image" : `Image ${index + 1}`}
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
                  <button type="submit" className="create-btn1">
                    Save
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
      required
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
       <Form.Group className="mb-3">
  <Form.Label className="formnames">Upload Media</Form.Label>
  <div className="d-flex flex-wrap justify-content-between w-100">
    {productImagesPreview.map((img, index) => (
      <label
        key={index}
        htmlFor={`updateProductImage${index}`}
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
              alt={`Product ${index}`}
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
          <button className="cancel-btn1" onClick={() => setPage("home")}>
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
{page === "updatecombo" && packageInfo && (
  <section className="p-4 w-100 d-flex justify-content-center">
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "24px",
        fontFamily: "Manrope, sans-serif",
        width: "100%",
        maxWidth: "800px",
      }}
    >
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center mb-4"
        style={{ borderBottom: "1px solid #EAEAEA", paddingBottom: "12px" }}
      >
        <div className="comboid">
         
            Combo ID : {combo?.id || combo?._id}
          
        </div>
        <button
          onClick={() => setPage("home")}
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

      <form>
        {/* Combo Name */}
        <div style={{width:"560px"}}>
        <div className="mb-3">
          <div className="comboname mb-2">
            Combo Name <span style={{ color: "red" }}>*</span>
          </div>
          <input
            type="text"
            name="combo_name"
            className="comboinput px-2"
            value={comboName}
            onChange={(e) => setComboName(e.target.value)}
            placeholder="Enter combo name"
            required
            
          />
        </div>

        {/* Upload Section */}
        <div className="comboname mb-3" >
          Upload Media <span style={{ color: "#888" }}>(Optional)</span>
        </div>

       <div className="d-flex flex-wrap justify-content-between w-100 mb-3 mt-2">
  {/* Poster box */}
<div
  style={{
    border: "2px dashed #86909A",
    borderRadius: "8px",
    width: "100px",
    height: "100px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#666",
    cursor: "pointer",
    fontSize: "14px",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#F5F5F5", // fallback background
  }}
>
  {posterPreview ? (
    <>
      {/* ✅ Faded uploaded image */}
      <img
        src={posterPreview}
        alt="poster"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 8,
          opacity: 0.5, // ✅ background is semi-transparent
        }}
      />

      {/* ✅ Overlay icon at full opacity */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
         
          opacity:"1"
        }}
      >
        <img
          src={imageplus1}
          width={32}
          height={32}
          alt="Add more"
          style={{ opacity: 1 }} // ✅ stays fully visible
        />
        
      </div>
    </>
  ) : (
    <>
      {/* Default empty state */}
      <img src={imageplus1} alt="plus" width={32} height={32} style={{ opacity: 1 }} />
      
      
    </>
  )}

  <input
    id="updatePosterInput"
    type="file"
    accept="image/*"
    style={{ display: "none" }}
    onChange={handlePosterChange}
  />
  <label
    htmlFor="updatePosterInput"
    style={{ position: "absolute", inset: 0, cursor: "pointer" }}
  />
</div>

{/* PDF box */}
<div
  style={{
    border: pdfFile ? "2px dashed #28a745" : "2px dashed #86909A",
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
    position: "relative",
  }}
>
  {pdfFile ? (
    <>
      {/* ✅ Show view icon when PDF exists (from API OR new upload) */}
      <img src={viewpdf} alt="pdf" width={40} height={40} style={{ opacity: 1 }} />
      
    </>
  ) : (
    <>
      {/* Default empty state */}
      <img src={imagepdf} alt="pdf" width={32} height={32} style={{ opacity: 1 }} />
      <div className="mt-2">PDF</div>
    </>
  )}

  <input
    id="updatePdfInput"
    type="file"
    accept=".pdf"
    style={{ display: "none" }}
    onChange={handlePdfChange}
  />
  <label
    htmlFor="updatePdfInput"
    style={{ position: "absolute", inset: 0, cursor: "pointer" }}
  />
</div>


<div
  style={{
    border: mp3File ? "2px dashed #28a745" : "2px dashed #86909A",
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
    position: "relative",
  }}
>
  {mp3File ? (
    <>
      {/* ✅ Show view icon when MP3 exists (from API OR new upload) */}
      <img src={viewmp3} alt="mp3" width={40} height={40} style={{ opacity: 1 }} />
    
    </>
  ) : (
    <>
      {/* Default empty state */}
      <img src={imagemp3} alt="mp3" width={32} height={32} style={{ opacity: 1 }} />
      <div className="mt-2">MP3</div>
    </>
  )}

  <input
    id="updateMp3Input"
    type="file"
    accept="audio/*"
    style={{ display: "none" }}
    onChange={handleMp3Change}
  />
  <label
    htmlFor="updateMp3Input"
    style={{ position: "absolute", inset: 0, cursor: "pointer" }}
  />
</div>


</div>


        {/* Video URL */}
        <div className="mt-4 mb-4">
          <div  className="comboname mb-3"  >Video URL</div>
          <input
            type="url"
            name="video_url"
            className="comboinput px-2 mb-3" 
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com"
           
          />
          
        </div>
</div>
        {/* Footer Buttons */}
        <div className="d-flex justify-content-end gap-3">
          <button
            type="button"
            onClick={() => setPage("home")}
            className="cancel-btn1"
          >
            Cancel
          </button>
         <button
  type="button"
  onClick={handleUpdatePackage}
  disabled={updatePackageMutation.isLoading}
  className="create-btn1"
>
  {updatePackageMutation.isLoading ? "Updating..." : "Update"}
</button>

        </div>
      </form>
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
  <Form.Label>Industry Type*</Form.Label>
  <Form.Select
    name="service_industrial_type"
    value={industryType}
    onChange={(e) => setIndustryType(e.target.value)}
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

  {industryType === "other" && (
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
  <Form.Label>Booking Type*</Form.Label>
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

  {/* ✅ Spread evenly across the card */}
  <div className="d-flex flex-wrap justify-content-between w-100 gap-3">
    {serviceImagesPreview.map((img, index) => (
      <label
        key={index}
        htmlFor={`updateServiceImage${index}`}
        className="position-relative d-flex flex-column align-items-center justify-content-center"
        style={{
          flex: "1 1 120px",        // ✅ makes all boxes equal width
          maxWidth: "120px",        // ✅ keeps them from stretching too far
          height: "120px",          // ✅ consistent height
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
            <img
              src={close}
              alt="remove"
              onClick={(e) => {
                e.preventDefault();
                const updatedPreviews = [...serviceImagesPreview];
                const updatedFiles = [...serviceImages];
                updatedPreviews[index] = null;
                updatedFiles[index] = null;
                setServiceImagesPreview(updatedPreviews);
                setServiceImages(updatedFiles);
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
          id={`updateServiceImage${index}`}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              handleFileChange(file, index, "service"); // 👈 type flag
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
            Update
          </button>
        </div>
      </Form>
    </div>
  </section>
)}


        {/* ---- Type select modal ---- */}
        <Modal
          show={showTypeModal}
          onHide={() => setShowTypeModal(false)}
          centered
        >
          <Modal.Body className="text-center">
            <div className="mb-2 mt-2 selecttype text-start"> Select Product or Service *</div>
            <Form.Group controlId="selectType">
              <Form.Select
              className="mb-4"
                value={typeSelectValue}
                style={{
                  height:"48px",
                  borderRadius:"10px",
                 border: "1px solid var(--stroke-soft-200, #E2E4E9)",
                 boxShadow: "0px 1px 2px 0px #E4E5E73D"

                }}
                onChange={(e) => setTypeSelectValue(e.target.value)}
              >
                <option value="">Select</option>
                <option value="product">Product</option>
                <option value="service">Service</option>
              </Form.Select>
            </Form.Group>

            <Button
              className="mt-4 mb-4 w-100"
              onClick={handleContinueAfterType}
              disabled={!typeSelectValue}
              style={{
                height:"56px",
                borderRadius:"10px",
                background: typeSelectValue ? "#1A2B49" : "#d6d9dd",
                border: "none",
                color: typeSelectValue ? "#fff" : "#999",
                padding: "10px 16px",
                fontSize:"20px",
                fontWeight:"600",
                fontFamily:"poppins"
              }}
            >
              Continue
            </Button>

            <div style={{ marginTop: 12, fontSize: 13, textAlign: "left" }}>
              <div className="selecttypenote mb-2">Note :</div>
              <p className="selectypenotetext">
                While creating a product or service, you can add only one type at
                a time. However, when creating a combo, you can add either
                products or services in a single combo — not both together.
              </p>
            </div>
          </Modal.Body>
        </Modal>

        {/* ---- Category details modal ---- */}
       <Modal
  show={showCategoryModal}
  onHide={() => resetCategoryForm()}   // reset on close
  centered
  contentClassName="custom-modal"
>
  <Form onSubmit={handleCategorySubmit}>
    <Modal.Header closeButton>
      <Modal.Title className="cathead">
        {editingCategory ? "Edit Category Details" : "Add Category Details"}
      </Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <Form.Group className="mb-3">
        <Form.Label className="catname">Category Name*</Form.Label>
        <Form.Control
          value={catName}
          className="catinput"
          onChange={(e) => setCatName(e.target.value)}
          placeholder="Enter category name"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="catname">Subtitle (Optional)</Form.Label>
        <Form.Control
          value={catSubtitle}
          className="catinput"
          onChange={(e) => setCatSubtitle(e.target.value)}
          placeholder="Enter subtitle"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label className="catname">Note (Optional)</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={catNote}
          className="catinput"
          onChange={(e) => setCatNote(e.target.value)}
          placeholder="Enter tagline"
        />
      </Form.Group>
    </Modal.Body>

    <Modal.Footer>
      <Button
        type="submit"
        disabled={
          editingCategory
            ? updateCategoryMutation.isLoading
            : addCategoryMutation.isLoading
        }
        style={{
          background: "#34495E",
          height: "56px",
          border: "none",
          width: "100%",
          padding: "10px 24px",
          fontSize: "20px",
          fontWeight: "600",
          borderRadius: "10px",
          opacity:
            (editingCategory
              ? updateCategoryMutation.isLoading
              : addCategoryMutation.isLoading)
              ? 0.7
              : 1,
        }}
      >
        {editingCategory
          ? updateCategoryMutation.isLoading
            ? "Updating..."
            : "Update"
          : addCategoryMutation.isLoading
          ? "Saving..."
          : "Create"}
      </Button>
    </Modal.Footer>
  </Form>
</Modal>


        {/* ---- Add Product/Service choice modal ---- */}
  <Modal
  show={showAddItemModal}
  onHide={() => setShowAddItemModal(false)}
  centered
  dialogClassName="custom-add-modal1"
>
  <div
    style={{
      background: "linear-gradient(90deg, #FFFFFF 0%, #FED3D4 100%)",
      padding: "16px",
      textAlign: "center",
      borderTopLeftRadius: "12px",
      borderTopRightRadius: "12px",
    }}
  >
    <div
      style={{
    fontFamily: "Poppins",
    fontSize: "24px",
    fontWeight: "600",
    margin: 0,
    textTransform: "uppercase",
    background: "linear-gradient(284.69deg, #F62D2D 7.92%, #FF6161 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}
    >
      ADD {selectedType === "product" ? "Product" : "Service"}
    </div>
  </div>

  <Modal.Body className="text-start p-4">
    <div className="masterstype">
      Add items from your list or create new ones for better customization
    </div>

    <div className="d-flex justify-content-between align-items-center mt-3">
  {/* ADD NEW */}
  <button
    style={{
      background: "#FBF5F5",
      border: "none",
      borderRadius: "8px",
      width: "198px",
      height: "52px",
    }}
    onClick={() => {
      setShowAddItemModal(false);
      setPage(selectedType);
    }}
  >
    <span
      style={{
        fontSize: "16px",
        fontWeight: "700",
        lineHeight: "20px",
        background:
          "linear-gradient(284.69deg, #F62D2D 7.92%, #FF6161 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      Add New
    </span>
  </button>

  {/* FROM LIST */}
  <button
    style={{
      background:
        "linear-gradient(284.69deg, #F62D2D 7.92%, #FF6161 100%)",
      border: "none",
      borderRadius: "8px",
      width: "198px",
      height: "52px",
    }}
    onClick={() => {
  setShowAddItemModal(false);

  sessionStorage.setItem("business_id", combo?.business_id);
  sessionStorage.setItem("package_id", packageId);
  sessionStorage.setItem("menuType", selectedType);
  sessionStorage.setItem("category_id", selectedCategoryId);

  // arrays must be stored as JSON
  sessionStorage.setItem("assignedIds", JSON.stringify(allProducts.map((p) => p.id)));
  sessionStorage.setItem("assignedIdservice", JSON.stringify(allServices.map((s) => s.id)));

  router.push("/othersmaster");
}}

  >
    <span
      style={{
        fontSize: "16px",
        fontWeight: "700",
        lineHeight: "20px",
        color: "#fff",
      }}
    >
      From List
    </span>
  </button>
</div>

  </Modal.Body>
</Modal>


      </div>
    </div>
  );
}
