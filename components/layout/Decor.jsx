import React from "react";

const Decor = ({ pos }) => {
  // عدد الرموز حسب حجم الشاشة
  const symbolsCount =
    typeof window !== "undefined" && window.innerWidth < 640
      ? 8 // موبايل
      : window.innerWidth < 1409 
      ? 19 // تابلت
      : window.innerWidth < 1800
      ? 30 // لاب توب
      : 31; // شاشات أكبر (ديسكتوب كبير)

  return (
    <div
      className={`absolute ${pos}-0 flex justify-around text-5xl text-[#C2A878]`}
    >
      {Array.from({ length: symbolsCount }).map((_, i) => (
        <span key={i}>𓎛</span>
      ))}
    </div>
  );
};

export default Decor;
