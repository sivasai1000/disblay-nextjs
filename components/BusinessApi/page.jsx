"use client";
import { useMutation, useQuery } from "@tanstack/react-query";

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
const signupUser = async (payload) => {
  const { data } = await api.post("/bregister.php", payload);
  return data;
};

const verifyOtp = async (payload) => {
  const { data } = await api.post("/bverifyotp.php", payload);
  return data;
};


const createMpin = async (payload) => {
  const { data } = await api.post("/bcreatempin.php", payload);
  return data;
};

const loginUser = async (payload) => {
  const { data } = await api.post("/login.php", payload);
  return data;
};
const sendSubscriptionRequest = async (payload) => {
  const { data } = await api.post("/sendSubscriptionRequest.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

const getBusinessDetails = async (payload) => {
  const { data } = await api.post("/getBusinessDetails.php", payload);
  return data;
};
const getProductList = async (payload) => {
  const { data } = await api.post("/getProductList.php", payload);
  return data;
};
const getComboList = async (payload) => {
  const { data } = await api.post("/getPackageList.php", payload);
  return data;
};
const getPackageCategoryList = async (payload) => {
  const { data } = await api.post("/getpackagecategorylist.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};
const getPackageProductList = async (payload) => {
  const { data } = await api.post("/getpackageproduct_v1.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

const getPackageServiceList = async (payload) => {
  const { data } = await api.post("/getpackageservicelist_v1.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};
const masterAddProduct = async (payload) => {
  const { data } = await api.post("/addpackageproduct.php", payload, {
    headers: payload instanceof FormData ? {} : { "Content-Type": "application/json" },
  });
  return data;
};
const masterAddService = async (payload) => {
  const { data } = await api.post("/addpackageservice.php", payload, {
    headers: payload instanceof FormData ? {} : { "Content-Type": "application/json" },
  });
  return data;
};
const masterUpdateProduct = async (payload) => {
  const { data } = await api.post("/update_masterProducts.php", payload, {
    headers: payload instanceof FormData ? {} : { "Content-Type": "application/json" },
  });
  return data;
};
const masterUpdateService = async (payload) => {
  const { data } = await api.post("/update_masterServices.php", payload, {
    headers: payload instanceof FormData ? {} : { "Content-Type": "application/json" },
  });
  return data;
};


const AddCombo = async (payload) => {
  const { data } = await api.post("/addpackage.php", payload, {
    headers:
      payload instanceof FormData
        ? {} 
        : { "Content-Type": "application/json" },
  });
  return data;
};
const addPackageCategory = async (payload) => {
  const { data } = await api.post("/addPackageCategory.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};
const assignProductToPackage = async (payload) => {
  const { data } = await api.post("/assignProductToPackage.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};
const getPlanDetails = async (payload) => {
  const { data } = await api.post("/get_plan_details.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

const updateBusiness = async (payload) => {
  const { data } = await api.post("/updatebusiness.php", payload, {
    headers: payload instanceof FormData ? {} : { "Content-Type": "application/json" },
  });
  return data;
};
const updatePackageProduct = async (payload) => {
  const { data } = await api.post("/updatepackageproduct_v2.php", payload, {
    headers: payload instanceof FormData ? {} : { "Content-Type": "application/json" },
  });
  return data;
};
const updatePackageService = async (payload) => {
  const { data } = await api.post("/updatepackageservice_v1.php", payload, {
    headers: payload instanceof FormData ? {} : { "Content-Type": "application/json" },
  });
  return data;
};
const deletePackageProduct = async (payload) => {
  const { data } = await api.post("/deletepackageproduct.php", payload, {
    headers: payload instanceof FormData ? {} : { "Content-Type": "application/json" },
  });
  return data;
};
const deletePackageService = async (payload) => {
  const { data } = await api.post("/deletepackageservice.php", payload, {
    headers: payload instanceof FormData ? {} : { "Content-Type": "application/json" },
  });
  return data;
};
const deleteMasterPackageProduct = async (payload) => {
  const { data } = await api.post("/deletemasterpackageproduct.php", payload, {
    headers: payload instanceof FormData ? {} : { "Content-Type": "application/json" },
  });
  return data;
};
const deleteMasterPackageService = async (payload) => {
  const { data } = await api.post("/deletemasterpackageservice.php", payload, {
    headers: payload instanceof FormData ? {} : { "Content-Type": "application/json" },
  });
  return data;
};
const updatePackage = async (payload) => {
  const { data } = await api.post("/updatepackage.php", payload, {
    headers: payload instanceof FormData ? {} : { "Content-Type": "application/json" },
  });
  return data;
};

const deletePackage = async(payload) =>{
   const { data } = await api.post("/deletepackage.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}
const updatePackageCategory = async (payload) => {
  const { data } = await api.post("/updatePackageCategory.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

const deletePackageCategory = async (payload) => {
  const { data } = await api.post("/deletePackageCategory.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};
const freeSubscription = async (payload) => {
  const { data } = await api.post("/freeSubcription.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};
const getNotificationCount = async (payload) => {
  const { data } = await api.post("/get_notificationlist_v3.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};
const getBusinessSubscription = async (payload) => {
  const { data } = await api.post("/get_business_subscription.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};
// ===== NEW: Forgot M-PIN Flow (absolute URLs) =====
const resendOtp = async (payload) => {
  // payload: { username: "8309220441" }
  const { data } = await axios.post("https://app.disblay.com/bresendotp.php", payload);
  return data;
};

const verifyForgotOtp = async (payload) => {
  // payload: { username: "8309220441", otp: "7338" }
  const { data } = await axios.post("https://app.disblay.com/bverifyotp.php", payload);
  return data;
};

const resetMpin = async (payload) => {
  // payload: { username: "8309220441", otp: "7338", new_mpin: "2344" }
  const { data } = await axios.post("https://app.disblay.com/bforgotmpin.php", payload);
  return data;
};


export const useSignup = () => useMutation({ mutationFn: signupUser });
export const useVerifyOtp = () => useMutation({ mutationFn: verifyOtp });
export const useCreateMpin = () => useMutation({ mutationFn: createMpin });
export const useLogin = () => useMutation({ mutationFn: loginUser });
export const useMasterAddProduct = () => useMutation({ mutationFn: masterAddProduct });
export const useMasterAddService = () => useMutation({ mutationFn: masterAddService });
export const useMasterUpdateProduct = () => useMutation({ mutationFn: masterUpdateProduct });
export const useMasterUpdateService = () => useMutation({ mutationFn: masterUpdateService });
export const useAddCombo = () =>useMutation({ mutationFn: AddCombo });
export const useAddPackageCategory = () =>useMutation({ mutationFn: addPackageCategory });
export const useAssignProductToPackage = () =>useMutation({ mutationFn: assignProductToPackage });
export const useUpdateBusiness = () => useMutation({ mutationFn: updateBusiness });
export const useUpdatePackageProduct = () =>useMutation({ mutationFn: updatePackageProduct });
export const useUpdatePackageService = () =>useMutation({ mutationFn: updatePackageService });
export const useDeletePackageProduct = () =>useMutation({ mutationFn: deletePackageProduct });
export const useDeletePackageService = () =>useMutation({ mutationFn: deletePackageService});
export const useDeleteMasterPackageProduct = () =>useMutation({ mutationFn: deleteMasterPackageProduct });
export const useDeleteMasterPackageService = () =>useMutation({ mutationFn: deleteMasterPackageService});
export const useUpdatePackage = () => useMutation({ mutationFn: updatePackage });
export const useDeletePackage = () => useMutation({ mutationFn: deletePackage });
export const useUpdatePackageCategory = () =>useMutation({ mutationFn: updatePackageCategory });
export const useDeletePackageCategory = () =>useMutation({ mutationFn: deletePackageCategory });
export const useFreeSubscription = () =>useMutation({ mutationFn: freeSubscription });
export const useSendSubscriptionRequest = () =>useMutation({ mutationFn: sendSubscriptionRequest });
export const useResendOtp = () => useMutation({ mutationFn: resendOtp });
export const useVerifyForgotOtp = () => useMutation({ mutationFn: verifyForgotOtp });
export const useResetMpin = () => useMutation({ mutationFn: resetMpin });


export const useBusinessDetails = (payload, options = {}) =>
  useQuery({
    queryKey: ["businessDetails", payload],
    queryFn: () => getBusinessDetails(payload),
    enabled: !!payload?.business_id && (options.enabled ?? true),
    ...options,
  });
  
  
export const useProductList = (payload, options = {}) =>
  useQuery({
    queryKey: ["productList", payload],
    queryFn: () => getProductList(payload),
    enabled: !!payload?.business_id ,
    ...options,
  });
  export const useComboList = (payload, options = {}) =>
  useQuery({
    queryKey: ["comboList", payload],
    queryFn: () => getComboList(payload),
    enabled: !!payload?.business_id && (options.enabled ?? true),
    ...options,
  });
export const usePackageCategoryList = (payload, options = {}) =>
  useQuery({
    queryKey: ["packageCategoryList", payload],
    queryFn: () => getPackageCategoryList(payload),
    enabled: !!payload?.package_id,
    ...options,
  });
  export const usePackageProductList = (payload, options = {}) =>
  useQuery({
    queryKey: ["packageProductList", payload],
    queryFn: () => getPackageProductList(payload),
    enabled: !!payload?.package_id && !!payload?.business_id,
    ...options,
  });


export const usePackageServiceList = (payload, options = {}) =>
  useQuery({
    queryKey: ["packageServiceList", payload],
    queryFn: () => getPackageServiceList(payload),
    enabled: !!payload?.package_id && !!payload?.business_id,
    ...options,
  });
  export const usePlanDetails = (payload, options = {}) =>
  useQuery({
    queryKey: ["planDetails", payload],
    queryFn: () => getPlanDetails(payload),
    enabled: !!payload?.plan_for, // only fetch if plan_for exists
    ...options,
  });
export const useNotificationCount = (payload, options = {}) =>
  useQuery({
    queryKey: ["notificationCount", payload],
    queryFn: () => getNotificationCount(payload),
    enabled: !!payload?.business_id,
    ...options,
  });
  export const useBusinessSubscription = (payload, options = {}) =>
  useQuery({
    queryKey: ["businessSubscription", payload],
    queryFn: () => getBusinessSubscription(payload),
    enabled: !!payload?.business_id && !!payload?.package_id,
    ...options,
  });
