"use client";
import { motion } from "framer-motion";
import DividerWithIcon from "../layout/DividerWithIcon";

export default function CancellationPolicyContent({ theme }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}
      className={`${theme.card} shadow-lg p-10 mt-[-4rem] relative z-10 max-w-5xl mx-auto`}
    >
      <article
        className={`prose max-w-none prose-lg leading-relaxed ${theme.text} flex flex-col gap-3`}
      >
        <h1 className={`${theme.title} text-3xl pt-5 capitalize`}>
          Payment and Cancellation Policy
        </h1>
        <DividerWithIcon />
        <p>
          <strong className="capitalize">Effective date:</strong> July 1, 2026
        </p>

        {/* Cancellation Policy */}
        <h2 className={theme.heading}>Cancellation Policy</h2>
        <p>
          Cancellation requests must be sent in writing via email to provide
          <strong> BasttetTravel </strong> with official confirmation.
        </p>
        <ul>
          <li>150 – 120 days prior: 25% charged</li>
          <li>120 – 90 days prior: 50% charged</li>
          <li>90 – 60 days prior: 75% charged</li>
          <li>Less than 60 days: 100% charged</li>
          <li>No Show: Full amount charged</li>
        </ul>
        <p>
          <strong>Note:</strong> For any cancellation, a 6% bank transaction fee
          will be charged on the deposit paid.
        </p>
        <DividerWithIcon />

        {/* Refunds */}
        <h2 className={theme.heading}>Refunds</h2>
        <p>
          Refunds will be processed using the same payment method within 14
          working days. No refunds for no-shows.
        </p>
        <DividerWithIcon />

        {/* Accommodation */}
        <h2 className={theme.heading}>Accommodation</h2>
        <p>
          Prices are based on twin sharing. Single rooms available with
          supplementary rate. Hotels may be substituted with similar quality.
        </p>
        <DividerWithIcon />

        {/* Responsibility & Liability */}
        <h2 className={theme.heading}>Responsibility & Liability</h2>
        <p>
          BasttetTravel acts only as an agent. We assume no liability for injury,
          illness, damage, loss, accident, delay, or irregularity caused by:
        </p>
        <ul>
          <li>Weather, acts of God, force majeure</li>
          <li>Wars, riots, theft, breakdowns, quarantines</li>
          <li>Delays or cancellations by hotels, carriers, restaurants</li>
        </ul>
        <DividerWithIcon />

        {/* Special Requests */}
        <h2 className={theme.heading}>Special Requests</h2>
        <p>
          Requests must be made at booking. We try to satisfy but cannot
          guarantee fulfillment. Bookings cannot be conditional on requests.
        </p>
        <DividerWithIcon />

        {/* Children Policy */}
        <h2 className={theme.heading}>Children Policy</h2>
        <h4 className={theme.subText}>Packages, Nile Cruises, Hotels</h4>
        <ul>
          <li>Under 2 years: Free</li>
          <li>Under 6 years: 25% charged</li>
          <li>Under 12 years: 50% charged</li>
          <li>12+ years: Full rate</li>
        </ul>
        <h4 className={theme.subText}>Sightseeing Tours & Excursions</h4>
        <ul>
          <li>Under 6 years: Free</li>
          <li>Under 12 years: 50% charged</li>
          <li>12+ years: Full rate</li>
        </ul>
        <DividerWithIcon />

        {/* Tipping */}
        <h2 className={theme.heading}>Tipping</h2>
        <p>
          Tipping is customary to express satisfaction. Entirely at your
          discretion.
        </p>
        <DividerWithIcon />

        {/* Complaints */}
        <h2 className={theme.heading}>Complaints & Dispute Resolution</h2>
        <p>
          Notify BasttetTravel immediately for issues. If unresolved, contact
          Egyptian Travel Agent Association or Ministry of Tourism.
        </p>
        <DividerWithIcon />

        {/* Acceptance */}
        <h2 className={theme.heading}>Acceptance of Agreement</h2>
        <p>
          Payment of deposit/final payment indicates acceptance of all terms and
          conditions.
        </p>
        <DividerWithIcon />

        {/* Contact */}
        <h2 className={theme.heading}>Contact Information</h2>
        <ul>
          <li>
            <strong>Owner:</strong> Ismail Haroun
          </li>
          <li>
            <strong>Email:</strong> BasttetTravel@outlook.com
          </li>
          <li>
            <strong>Phone:</strong> +20 1100507802
          </li>
        </ul>
      </article>
    </motion.div>
  );
}
