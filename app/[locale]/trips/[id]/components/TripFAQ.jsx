"use client";

import { useTheme } from "@/context/ThemeContext";

const questions = [
  ["What is included in this trip?", "Open the Includes section above to see what is covered. Items listed under Exclusions are not part of the displayed price."],
  ["Can I customize the itinerary?", "Yes. Contact Basttet Travel before booking and tell us what you would like to add, remove or change."],
  ["How do I choose my dates?", "Add the number of adults or children in the booking card, then choose an available check-in and check-out date."],
  ["Do I need an account to book?", "An account is required to complete a booking and payment. You can create one when you start the booking process."],
];

export default function TripFAQ() {
  const { theme } = useTheme();

  return (
    <section className={theme.card + " rounded-2xl border border-[#d4b56f]/25 p-6 " + theme.text} aria-labelledby="trip-faq-title">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4b56f]">Before you go</p>
      <h2 id="trip-faq-title" className="mt-2 text-2xl font-bold">Frequently asked questions</h2>
      <div className="mt-5 divide-y divide-[#d4b56f]/15">
        {questions.map(([question, answer]) => (
          <details key={question} className="group py-4">
            <summary className="cursor-pointer list-none pr-8 font-semibold marker:hidden">
              <span className="relative block">{question}<span className="absolute right-0 text-[#d4b56f] transition group-open:rotate-45">+</span></span>
            </summary>
            <p className={"mt-3 max-w-3xl text-sm leading-7 " + theme.subText}>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
