import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// ------------------------------------------------
// Core API functions
// ------------------------------------------------
const getPackageByLink = async (payload) => {
  const { data } = await api.post("/getpackagebylink.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

const getBusinessDetails = async (payload) => {
  const { data } = await api.post("/getBusinessDetails.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

export const addNotification = async (payload) => {
  const { data } = await api.post("add_notification_v1.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

export const getUserAddress = async (payload) => {
  const { data } = await api.post("/getUserAddress.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

// ------------------------------------------------
// Login APIs
// ------------------------------------------------
export const checkUserMobile = async (payload) => {
  const { data } = await api.post("/checkUserMobileNumber.php", payload);
  return data;
};

export const registerUser = async (payload) => {
  const { data } = await api.post("/register.php", payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post("/login.php", payload);
  return data;
};

export const verifyOtp = async (payload) => {
  const { data } = await api.post("/verifyotp.php", payload);
  return data;
};

export const resendOtp = async (payload) => {
  const { data } = await api.post("/resendotp.php", payload);
  return data;
};

export const createMpin = async (payload) => {
  const { data } = await api.post("/creatempin.php", payload);
  return data;
};

export const forgotPasswordSendOtp = async (payload) => {
  const { data } = await api.post("/bresendotp.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

export const resetMpin = async (payload) => {
  const { data } = await api.post("/creatempin.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

// --------------------------------------------------------
// React Query Safe Hooks (UPDATED CORRECTLY)
// --------------------------------------------------------
// ✔ User options override defaults
// ✔ No forced staleTime=0 causing auto-fetch
// ✔ No enabled:false messing with hook order
// ✔ Safe fallback when payload missing
// --------------------------------------------------------

export const usePackageByLink = (payload, options = {}) =>
  useQuery({
    ...{
      queryKey: ["packageByLink", payload],
      queryFn: () =>
        payload?.share_link ? getPackageByLink(payload) : Promise.resolve(null),
      staleTime: 5 * 60 * 1000, // default 5 min (can be overridden)
    },
    ...options, // user's options override defaults
  });

export const useUserBusinessDetails = (payload, options = {}) =>
  useQuery({
    ...{
      queryKey: ["userBusinessDetails", payload],
      queryFn: () =>
        payload?.business_id
          ? getBusinessDetails(payload)
          : Promise.resolve(null),
      staleTime: 5 * 60 * 1000,
    },
    ...options,
  });

export const useUserAddress = (payload, options = {}) =>
  useQuery({
    ...{
      queryKey: ["userAddress", payload],
      queryFn: () =>
        payload?.user_id ? getUserAddress(payload) : Promise.resolve(null),
      staleTime: 5 * 60 * 1000,
    },
    ...options,
  });

// ------------------------------------------------
// Update Address Mutation
// ------------------------------------------------
export const updateUserAddress = async (payload) => {
  const { data } = await api.post("/update_userAddress.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

export const useUpdateUserAddress = (options = {}) =>
  useMutation({
    mutationFn: updateUserAddress,
    ...options,
  });
