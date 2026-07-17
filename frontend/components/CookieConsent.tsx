"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const BLUE = "#2196F3";
const INK_ON_LIGHT = "#0E2540";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("ypa-cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("ypa-cookie-consent", "accepted");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t shadow-lg" style={{ borderColor: "#E8ECF0" }}>
      <div className="container mx-auto max-w-6xl px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <p className="text-sm text-[#4B5A68] text-center sm:text-left flex-1">
            We use essential cookies to keep this site running smoothly. 
            <Link href="/privacy" className="ml-1.5 font-medium hover:underline" style={{ color: BLUE }}>
              Learn more
            </Link>
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={acceptCookies}
              className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ background: BLUE }}
            >
              Got it
            </button>
            <button
              onClick={acceptCookies}
              className="p-2 rounded-full hover:bg-[#F6F8FA] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}