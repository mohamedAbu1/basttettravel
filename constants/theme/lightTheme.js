const LightTheme = {
  name: "light",

  // خلفية زجاجية شفافة
  background: "bg-[rgba(255,255,255,0.25)] backdrop-blur-[20px]",

  // النصوص الأساسية
  text: "text-[#1A1A1A]",

  // النصوص الثانوية
  subText: "text-[#6B6B6B]",

  // العناوين الرئيسية (ذهبي زجاجي)
  title: "text-[#C2A878] font-extrabold tracking-wide",

  // العناوين الثانوية
  heading: "text-[#5C4B3B] font-semibold",

  // الكروت الزجاجية
  card: "bg-[rgba(255,255,255,0.15)] backdrop-blur-[16px] rounded-[16px] border border-[#C2A878]/60 shadow-lg",

  // طبقة فوق الصور
  overlay: "bg-[rgba(0,0,0,0.25)]",

  // الأزرار الأساسية (زجاجية ذهبية)
  buttonPrimary:
    "bg-[rgba(194,168,120,0.25)] backdrop-blur-[12px] text-[#C2A878] font-semibold rounded-xl px-6 py-3 border border-[#C2A878]/70 hover:bg-[#C2A878]/30 hover:text-white transition-all shadow-md tracking-wide uppercase",
  buttonSecondary:
    "bg-[rgba(255,255,255,0.25)] backdrop-blur-[12px] text-[#1A1A1A] font-medium rounded-xl px-6 py-3 hover:bg-[rgba(255,255,255,0.35)] transition-all border border-[#C2A878]/60",

  // الحدود
  border: "border border-[rgba(194,168,120,0.5)] rounded-[16px]",

  // الظلال
  shadow: "shadow-[0_4px_20px_rgba(0,0,0,0.15)]",

  // شعار
  logoGradientFrom: "rgba(255,255,255,0.6)",
  logoGradientTo: "rgba(194,168,120,0.8)",
  logoBorder: "#A68B5B",

  // الحقول
  inputText: "#1A1A1A",
  inputBorder: "#C2A878",
  inputFocus: "#A68B5B",
  inputHoverBg: "rgba(255,255,255,0.25)",
  inputLabel: "#6B6B6B",

  // الأيقونات
  icon: "text-[#C2A878]",
  iconInactive: "text-[#9E9E9E]",
  iconHover: "text-[#A68B5B] transition-colors",

  // ألوان إضافية
  ivory: "bg-[rgba(255,255,255,0.25)] backdrop-blur-[12px]",
  stone: "text-[#C2A878]",
  brown: "text-[#5C4B3B]",
};

export default LightTheme;
