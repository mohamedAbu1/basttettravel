"use client";
import {
  FaChild,
  FaDog,
  FaUsers,
  FaCat,
  FaUserTie,
  FaLanguage,
} from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import Select from "react-select";

export default function AdditionalDetails({
  hasChildren,
  setHasChildren,
  childrenCount,
  setChildrenCount,
  hasPets,
  setHasPets,
  pets,
  setPets,
  groupSize,
  setGroupSize,
  hasGuide,
  setHasGuide,
  guideLanguages,
  setGuideLanguages,
}) {
  const { theme } = useTheme();

  const availableLanguages = [
    "English",
    "Chinese",
    "French",
    "German",
    "Spanish",
    "Italian",
  ];

  const toggleLanguage = (lang) => {
    if (guideLanguages.includes(lang)) {
      setGuideLanguages(guideLanguages.filter((l) => l !== lang));
    } else {
      if (guideLanguages.length < 2) {
        setGuideLanguages([...guideLanguages, lang]);
      } else {
        alert("❌ You can select only up to 2 languages.");
      }
    }
  };

  const options = Array.from({ length: 100 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}`,
  }));

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "transparent",
      borderColor: theme.logoBorderColor || "#c9a34a",
      color: theme.text,
      padding: "2px",
      boxShadow: "none",
      "&:hover": { borderColor: "#c9a34a" },
    }),
    singleValue: (base) => ({
      ...base,
      color: theme.text,
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? "#c9a34a33" : "transparent",
      color: theme.text,
      cursor: "pointer",
    }),
  };

  return (
    <div className={`mb-6 p-6 rounded-xl shadow-lg ${theme.card}`}>
      <h3 className={`text-xl font-bold mb-4 ${theme.title}`}>
        Additional Details
      </h3>

      {/* الأطفال */}
      <div className="flex flex-col gap-3">
        <label className="relative flex items-center cursor-pointer gap-2">
          <input
            type="checkbox"
            checked={hasChildren}
            onChange={() => setHasChildren(!hasChildren)}
            className="peer hidden"
          />
          <span
            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center 
                  bg-white/10 dark:bg-black/20 backdrop-blur-md 
                  border-[#c9a34a]/50 shadow-sm 
                  peer-checked:bg-[#c9a34a]/80 peer-checked:border-[#c9a34a] 
                  transition-all duration-300`}
          >
            <svg
              className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <FaChild className={theme.icon} />
          <span className={theme.subText}>Traveling with children</span>
        </label>

        {hasChildren && (
          <div className="flex flex-col gap-2">
            <label className={`font-medium ${theme.subText}`}>
              Number of children:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setChildrenCount(num)}
                  className={`px-3 py-2 rounded-lg font-semibold 
                      ${childrenCount === num ? "bg-[#c9a34a] text-white" : `${theme.card} ${theme.text}`} 
                      hover:bg-[#c9a34a]/70 transition`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* الحيوانات */}
        <div className="flex flex-col gap-3">
          {/* ✅ Checkbox رئيسي */}
          <label className="relative flex items-center cursor-pointer gap-2">
            <input
              type="checkbox"
              checked={hasPets}
              onChange={() => setHasPets(!hasPets)}
              className="peer hidden"
            />
            <span
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center 
                  bg-white/10 dark:bg-black/20 backdrop-blur-md 
                  border-[#c9a34a]/50 shadow-sm 
                  peer-checked:bg-[#c9a34a]/80 peer-checked:border-[#c9a34a] 
                  transition-all duration-300`}
            >
              <svg
                className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <FaDog className={theme.icon} />
            <span className={theme.subText}>Traveling with pets</span>
          </label>

          {/* ✅ اختيارات الحيوانات */}
          {hasPets && (
            <div className="flex gap-6 mt-2">
              {/* Cat */}
              <label className="relative flex items-center cursor-pointer gap-2">
                <input
                  type="checkbox"
                  checked={pets.includes("cat")}
                  onChange={() =>
                    setPets(
                      pets.includes("cat")
                        ? pets.filter((p) => p !== "cat")
                        : [...pets, "cat"],
                    )
                  }
                  className="peer hidden"
                />
                <span
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center 
                      bg-white/10 dark:bg-black/20 backdrop-blur-md 
                      border-[#c9a34a]/50 shadow-sm 
                      peer-checked:bg-[#c9a34a]/80 peer-checked:border-[#c9a34a] 
                      transition-all duration-300`}
                >
                  <svg
                    className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <FaCat className={theme.icon} /> Cat
              </label>

              {/* Dog */}
              <label className="relative flex items-center cursor-pointer gap-2">
                <input
                  type="checkbox"
                  checked={pets.includes("dog")}
                  onChange={() =>
                    setPets(
                      pets.includes("dog")
                        ? pets.filter((p) => p !== "dog")
                        : [...pets, "dog"],
                    )
                  }
                  className="peer hidden"
                />
                <span
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center 
                      bg-white/10 dark:bg-black/20 backdrop-blur-md 
                      border-[#c9a34a]/50 shadow-sm 
                      peer-checked:bg-[#c9a34a]/80 peer-checked:border-[#c9a34a] 
                      transition-all duration-300`}
                >
                  <svg
                    className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <FaDog className={theme.icon} /> Dog
              </label>
            </div>
          )}
        </div>

        {/* المرشد السياحي */}
        <div className="flex flex-col gap-3">
          {/* ✅ Checkbox رئيسي للمرشد */}
          <label className="relative flex items-center cursor-pointer gap-2">
            <input
              type="checkbox"
              checked={hasGuide}
              onChange={() => setHasGuide(!hasGuide)}
              className="peer hidden"
            />
            <span
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center 
                  bg-white/10 dark:bg-black/20 backdrop-blur-md 
                  border-[#c9a34a]/50 shadow-sm 
                  peer-checked:bg-[#c9a34a]/80 peer-checked:border-[#c9a34a] 
                  transition-all duration-300`}
            >
              <svg
                className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <FaUserTie className={theme.icon} />
            <span className={theme.subText}>Tour Guide</span>
          </label>

          {/* ✅ اختيارات اللغات */}
          {hasGuide && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              {availableLanguages.map((lang) => (
                <label
                  key={lang}
                  className="relative flex items-center cursor-pointer gap-2"
                >
                  <input
                    type="checkbox"
                    checked={guideLanguages.includes(lang)}
                    onChange={() => toggleLanguage(lang)}
                    className="peer hidden"
                  />
                  <span
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center 
                        bg-white/10 dark:bg-black/20 backdrop-blur-md 
                        border-[#c9a34a]/50 shadow-sm 
                        peer-checked:bg-[#c9a34a]/80 peer-checked:border-[#c9a34a] 
                        transition-all duration-300`}
                  >
                    <svg
                      className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>

                  {/* ✅ أيقونة اللغة + العلم */}
                  <FaLanguage className={theme.icon} />

                  <span className={theme.subText}>{lang}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* حجم المجموعة */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2">
            <FaUsers className={theme.icon} />
            <span className={theme.subText}>Group Size</span>
          </label>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setGroupSize(num)}
                className={`px-3 py-2 rounded-lg font-semibold 
                    ${groupSize === num ? "bg-[#c9a34a] text-white" : `${theme.card} ${theme.text}`} 
                    hover:bg-[#c9a34a]/70 transition`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
