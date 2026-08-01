"use client";
import Background from "./components/Background";
import Header from "../header/Header";
import HeroText from "./components/HeroText";
import BookingForm from "./components/BookingForm";
import Packages from "./components/Packages";
import { useState } from "react";
import DownloadAppSection from "./components/DownloadAppSection";
import LeftSocialIcons from "./components/LeftSocialIcons";

export default function HeroSection() {
  const [showTrips, setShowTrips] = useState(false);
  
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col ">
      {/* الخلفية */}
      <Background />

      {/* الهيدر */}
      <Header />

      {/* المحتوى الرئيسي */}
      <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between w-full h-full mx-auto px-6 lg:px-12 mt-24 lg:mt-32">
        {/* النصوص والشرح */}
        <div className="w-full lg:w-[%70] text-center lg:text-left hidden lg:flex flex-col mb-10 lg:mb-0">
          <HeroText />
        </div>
        <DownloadAppSection />
        <LeftSocialIcons />

        {/* الفورم والباقات */}
        <div className="w-full lg:w-[%30] hidden lg:flex flex-col items-center justify-center gap-8 mt-6">
          <BookingForm setShowTrips={setShowTrips} />
          <Packages showTrips={showTrips} />
        </div>
      </div>
    </section>
  );
}
