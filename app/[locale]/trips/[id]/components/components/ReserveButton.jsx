import { toast } from "react-toastify";

export default function ReserveButton({
  trip,
  arrivalDate,
  departureDate,
  hasChildren,
  childrenCount,
  hasPets,
  pets,
  groupSize,
  hasGuide,
  guideLanguages,
  savePaymentData,
  user,
}) {
  const handleReserve = async () => {
    await savePaymentData({
      tripId: trip, // لازم يكون UUID صحيح
      numPersons: groupSize,
      hasChildren,
      numChildren: childrenCount,
      hasPets,
      petTypes: pets,
      hasGuide,
      selectedLanguages: guideLanguages,
      arrivalDate,
      departureDate,
      userId: user?.id, // لازم يكون UUID صحيح من Supabase Auth
      status: "reserved",
      platform: "web",
    });

    toast.info("📌 Reservation saved. Payment pending.");
  };

  return (
    <button
      onClick={handleReserve}
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold mt-6"
    >
      Reserve & Pay Later
    </button>
  );
}
