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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* الأطفال */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasChildren}
              onChange={() => setHasChildren(!hasChildren)}
              className="accent-[#c9a34a]"
            />
            <FaChild className={theme.icon} />
            <span className={theme.subText}>Traveling with children</span>
          </label>

          {hasChildren && (
            <Select
              value={options.find((o) => o.value === childrenCount)}
              onChange={(opt) => setChildrenCount(opt.value)}
              options={options}
              styles={customSelectStyles}
              placeholder="Select number of children"
            />
          )}
        </div>

        {/* الحيوانات */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasPets}
              onChange={() => setHasPets(!hasPets)}
              className="accent-[#c9a34a]"
            />
            <FaDog className={theme.icon} />
            <span className={theme.subText}>Traveling with pets</span>
          </label>

          {hasPets && (
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pets.includes("cat")}
                  onChange={() =>
                    setPets(
                      pets.includes("cat")
                        ? pets.filter((p) => p !== "cat")
                        : [...pets, "cat"]
                    )
                  }
                />
                <FaCat className={theme.icon} /> Cat
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pets.includes("dog")}
                  onChange={() =>
                    setPets(
                      pets.includes("dog")
                        ? pets.filter((p) => p !== "dog")
                        : [...pets, "dog"]
                    )
                  }
                />
                <FaDog className={theme.icon} /> Dog
              </label>
            </div>
          )}
        </div>

        {/* المرشد السياحي */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasGuide}
              onChange={() => setHasGuide(!hasGuide)}
              className="accent-[#c9a34a]"
            />
            <FaUserTie className={theme.icon} />
            <span className={theme.subText}>Tour Guide</span>
          </label>

          {hasGuide && (
            <div className="grid grid-cols-2 gap-2">
              {availableLanguages.map((lang) => (
                <label
                  key={lang}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={guideLanguages.includes(lang)}
                    onChange={() => toggleLanguage(lang)}
                  />
                  <FaLanguage className={theme.icon} /> {lang}
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
          <Select
            value={options.find((o) => o.value === groupSize)}
            onChange={(opt) => setGroupSize(opt.value)}
            options={options}
            styles={customSelectStyles}
            placeholder="Select group size"
          />
        </div>
      </div>
    </div>
  );
}
