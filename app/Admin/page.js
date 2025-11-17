"use client";

import dynamic from "next/dynamic";

const Admin = dynamic(() => import("../../components/AdminPage"), {
  ssr: false,
});

export default function Page() {
  return <Admin />;
}
