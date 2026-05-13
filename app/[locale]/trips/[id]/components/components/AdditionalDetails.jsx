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
  const { theme } = useTheme(); // ✅ جلب الثيم

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

  const options = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div className={`mb-6 p-4 border-b ${theme.border}`}>
      <h3 className={`text-lg font-semibold mb-3 ${theme.title}`}>
        Additional Details
      </h3>

      <div className="flex flex-row gap-8">
        {/* الأطفال */}
        <div className="flex flex-col">
          <label className="flex items-center gap-2 mb-2 cursor-pointer">
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
            <div className="ml-6 p-3 flex items-center gap-2">
              <label className={`font-medium ${theme.subText}`}>
                Number of children:
              </label>
              <select
                value={childrenCount}
                onChange={(e) => setChildrenCount(Number(e.target.value))}
                className={`p-2 rounded focus:outline-none focus:ring-2 ${theme.border} ${theme.text}`}
              >
                {options.map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* الحيوانات */}
        <div className="flex flex-col">
          <label className="flex items-center gap-2 mb-2 cursor-pointer">
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
            <div className="ml-6 p-3">
              <label className={`font-medium block mb-2 ${theme.subText}`}>
                Select pets:
              </label>
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
            </div>
          )}
        </div>

        {/* المرشد السياحي */}
        <div className="flex flex-col">
          <label className="flex items-center gap-2 mb-2 cursor-pointer">
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
            <div className="ml-6 p-3">
              <label
                className={`font-medium block mb-2 flex items-center gap-2 ${theme.subText}`}
              >
                <FaLanguage className={theme.icon} /> Select up to 2 languages:
              </label>
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
                    {lang}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* حجم المجموعة */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-row items-center gap-2">
            <FaUsers className={theme.icon} />
            <label className={`block mb-1 font-medium ${theme.subText}`}>
              Group Size
            </label>
          </div>
          <select
            value={groupSize}
            onChange={(e) => setGroupSize(Number(e.target.value))}
            className={`p-2 rounded focus:outline-none focus:ring-2 ${theme.border} ${theme.text}`}
          >
            {options.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
