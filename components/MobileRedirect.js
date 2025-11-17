"use client";
import { useEffect } from "react";

export default function MobileRedirect() {
  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
    const url = window.location.href;
    const hostname = window.location.hostname;

    if (isMobile && !hostname.startsWith("m.")) {
      window.location.replace(url.replace("://", "://m."));
    } else if (!isMobile && hostname.startsWith("m.")) {
      window.location.replace(url.replace("://m.", "://"));
    }
  }, []);

  return null;
}
