"use client";
import React from "react";
import Navbar from "@/app/components/Navbar";
import LandingPage from "@/app/components/LandingPage";

export default function Page() {
  const handleEnterPortal = () => {
    window.location.href = "/portal";
  };

  return (
    <main>
      <Navbar onEnterPortal={handleEnterPortal} />
      <LandingPage onEnterPortal={handleEnterPortal} />
    </main>
  );
}
