"use client";
import { useParams } from "next/navigation";
import { useTrip } from "@/context/TripContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useState,useEffect } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import TripSchedule from "../../trips/[id]/components/components/TripSchedule";
import AdditionalDetails from "../../trips/[id]/components/components/AdditionalDetails";
import TripDetails from "../../trips/[id]/components/components/TripDetails";
import ConfirmButton from "../../trips/[id]/components/components/ConfirmButton";

export default function PurchasePage() {
  const { id } = useParams();
  const { getTripById } = useTrip();
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const { user } = useAuth();

  const trip = getTripById(id);
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [hasChildren, setHasChildren] = useState(false);
  const [childrenCount, setChildrenCount] = useState(0);
  const [hasGuide, setHasGuide] = useState(false);
  const [guideLanguages, setGuideLanguages] = useState([]);
  const [hasPets, setHasPets] = useState(false);
  const [pets, setPets] = useState([]);
  const [groupSize, setGroupSize] = useState(1);

  if (!trip) {
    return <p className={`${theme.text}`}>Trip not found</p>;
  }

  const tripTitle =
    trip.title?.[lang] ||
    trip.translations?.[lang] ||
    trip.title?.en ||
    trip.title;

  const handlePurchase = () => {
    if (!fullName || !email || !cardNumber || !expiry || !cvv) {
      toast.error("❌ Please fill all fields");
      return;
    }
    toast.success("✅ Purchase completed successfully!");
  };
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize(); // أول مرة
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <Header />
      <main
        className={`min-h-screen relative ${theme.background} ${theme.text}`}
      >
        {/* ✅ العمود الأيسر */}
        <div className="absolute scale-x-[-1] h-full flex flex-col items-center"  style={{
          left: screenSize.width * 0.05, // 10% من عرض الشاشة
          top: screenSize.height * 0.14, // 20% من ارتفاع الشاشة
          width: "240px",
          height: "200px",
        }}> 
          {Array.from({ length: 5 }).map((_, i) => (
            <img
              key={i}
              src="/HomePageImage/Temple-of-Bell-Street-2015100903.svg"
              className="mb-4 opacity-30"
            />
          ))}
        </div>

        {/* ✅ العمود الأيمن */}
        <div className="absolute h-full flex flex-col items-center" style={{
          right: screenSize.width * 0.05, // 10% من عرض الشاشة
          top: screenSize.height * 0.14, // 20% من ارتفاع الشاشة
          width: "240px",
          height: "200px",
        }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <img
              key={i}
              src="/HomePageImage/Temple-of-Bell-Street-2015100903.svg"
              className="mb-4 opacity-30"
            />
          ))}
        </div>

        {/* ✅ المحتوى في المنتصف */}
        <div className="max-w-4xl mx-auto pt-32 p-6 relative z-10">
          {/* عنوان الرحلة */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-4xl font-bold mb-6 ${theme.title}`}
          >
            {tripTitle}
          </motion.h1>

          {/* تفاصيل الرحلة */}
          <div
            className={`p-6 mb-8 rounded-xl shadow-lg ${theme.card} flex flex-col gap-4`}
          >
            <p className={theme.subText}>Duration: {trip.duration} days</p>
            <p className={theme.subText}>
              Price: {trip.price} {trip.currency}
            </p>

            {trip.trip_cities?.length > 0 && (
              <div>
                <h3 className={`font-semibold mb-2 ${theme.heading}`}>
                  Cities:
                </h3>
                <ul className="list-disc pl-6">
                  {trip.trip_cities.map((city, idx) => (
                    <li key={idx} className={theme.subText}>
                      {city.cities?.name?.[lang] ||
                        city.cities?.name?.en ||
                        city.cities?.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {trip.includes?.length > 0 && (
              <div>
                <h3 className={`font-semibold mb-2 ${theme.heading}`}>
                  Includes:
                </h3>
                <ul className="list-disc pl-6">
                  {trip.includes.map((inc, idx) => (
                    <li key={idx} className={theme.subText}>
                      {inc.include_translations?.[lang] ||
                        inc.include_translations?.en}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* باقي المكونات */}
          <TripSchedule
            arrivalDate={arrivalDate}
            setArrivalDate={setArrivalDate}
            departureDate={departureDate}
            setDepartureDate={setDepartureDate}
          />

          <AdditionalDetails
            hasChildren={hasChildren}
            setHasChildren={setHasChildren}
            childrenCount={childrenCount}
            setChildrenCount={setChildrenCount}
            hasPets={hasPets}
            setHasPets={setHasPets}
            pets={pets}
            setPets={setPets}
            groupSize={groupSize}
            setGroupSize={setGroupSize}
            hasGuide={hasGuide}
            setHasGuide={setHasGuide}
            guideLanguages={guideLanguages}
            setGuideLanguages={setGuideLanguages}
          />

          <TripDetails trip={trip} groupSize={groupSize} />

          {/* فورم الدفع */}
          <div
            className={`p-6 rounded-xl shadow-lg ${theme.card} flex flex-col gap-4`}
          >
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="p-3 rounded-md border focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-md border focus:outline-none"
            />
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="p-3 rounded-md border focus:outline-none"
            />
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="p-3 rounded-md border focus:outline-none flex-1"
              />
              <input
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="p-3 rounded-md border focus:outline-none flex-1"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePurchase}
              className={theme.buttonPrimary}
            >
              Confirm Purchase
            </motion.button>
          </div>
        </div>

        {/* زر التأكيد */}
        <ConfirmButton
          trip={trip.id}
          arrivalDate={arrivalDate}
          departureDate={departureDate}
          hasChildren={hasChildren}
          childrenCount={childrenCount}
          hasPets={hasPets}
          pets={pets}
          groupSize={groupSize}
          hasGuide={hasGuide}
          guideLanguages={guideLanguages}
        />

        <Footer />
      </main>
    </>
  );
}
