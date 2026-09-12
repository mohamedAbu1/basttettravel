const LightTheme = {
  name: "light",

  // خلفية زجاجية شفافة مع لمسة بحرية
  background: "bg-[rgba(255,255,255,0.25)] backdrop-blur-[20px]",

  // النصوص الثانوية
  subText: "text-[#1A4D5C]", // أزرق رمادي فاتح

  // العناوين الرئيسية (ذهبي زجاجي)
  title: "text-[#C2A878] font-extrabold tracking-wide",
  text: "text-[#1A4D5C]",
  // العناوين الثانوية
  heading: "text-[#1A4D5C] font-semibold", // أزرق محايد أنيق
    pictext: "text-[#FFFFFF] font-semibold", 


  // الكروت الزجاجية
  card: "bg-[rgba(255,255,255,0.15)] backdrop-blur-[16px] rounded-[16px] border border-[#C2A878]/60 shadow-lg",

  // طبقة فوق الصور
  overlay: "bg-[rgba(0,60,90,0.25)]", // طبقة بحرية شفافة

  // الأزرار الأساسية (زجاجية ذهبية مع لمسة بحرية)
  buttonPrimary:
    "bg-[#C2A878] text-[#173B45] font-bold rounded-full px-4 py-2 border border-[#A68B5B] hover:bg-[#A68B5B] hover:text-white transition-all shadow-md tracking-wide uppercase",
  buttonSecondary:
    "bg-white/85 backdrop-blur-[12px] text-[#173B45] font-bold rounded-full px-4 py-2 hover:bg-white transition-all border border-[#A68B5B] shadow-sm",

  // الحدود
  border: "border border-[rgba(194,168,120,0.5)] rounded-[16px]",

  // الظلال
  shadow: "shadow-[0_4px_20px_rgba(0,0,0,0.15)]",

  // شعار
  logoGradientFrom: "rgba(255,255,255,3)",
  logoGradientTo: "rgba(0,150,180,0.8)", // تدرج بحري
  logoBorder: "#4F6D7A",

  // الحقول
  inputText: "#0A2E36",
  inputBorder: "#C2A878",
  inputFocus: "#0A7A8C", // تركواز بحري
  inputHoverBg: "rgba(255,255,255,0.25)",
  inputLabel: "#4F6D7A",

  // الأيقونات
  icon: "text-[#4F6D7A]", // تركواز
  iconInactive: "text-[#9E9E9E]",
  iconHover: "text-[#0A7A8C] transition-colors",

  // ألوان إضافية
  ivory: "bg-[rgba(255,255,255,0.25)] backdrop-blur-[12px]",
  stone: "text-[#C2A878]",
  brown: "text-[#5C4B3B]",
  sea: "text-[#0A7A8C]", // لون البحر
};
export default LightTheme;
