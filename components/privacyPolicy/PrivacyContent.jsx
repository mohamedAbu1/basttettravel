"use client";
import { motion } from "framer-motion";
import DividerWithIcon from "../layout/DividerWithIcon";
import Link from "next/link";

export default function PrivacyContent({ theme }) {
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
        <h1 className={`${theme.title} text-3xl pt-5`}>Privacy Policy</h1>
        <DividerWithIcon />
        <p>
          <strong className="capitalize">Effective date:</strong> July 1, 2026
        </p>
        <p>
          BasttetTravel (“us”, “we”, or “our”) operates the BasttetTravel
          website (the “Service”). This page informs you of our policies
          regarding the collection, use, and disclosure of personal data.
        </p>
        <p>
          We use your data to provide and improve the Service. By using the
          Service, you agree to the collection and use of information in
          accordance with this policy. Unless otherwise defined in this Privacy
          Policy, terms used in this Privacy Policy have the same meanings as in
          our Terms and Conditions, accessible from{" "}
          <Link href={"/cancellationPolicy"} className="pb-1.5 border-b-2 border-amber-300"> <strong className="capitalize"> payment and cancellation policy </strong> </Link> .
        </p>
        <DividerWithIcon />

        <h2 className={theme.heading}>
          <strong className="capitalize">
            {" "}
            Information Collection And Use
          </strong>
        </h2>
        <p>
          We collect several different types of information for various purposes
          to provide and improve our Service.
        </p>
        <DividerWithIcon />

        <h3 className={theme.heading}>
          <strong className="capitalize">Types of Data Collected</strong>
        </h3>
        <h4 className={theme.subText}>Personal Data</h4>
        <ul>
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Phone number</li>
          <li>Address, State, Province, ZIP/Postal code, City</li>
          <li>Cookies and Usage Data</li>
        </ul>

        <h4 className={theme.subText}>Usage Data</h4>
        <p>
          We may also collect information on how the Service is accessed and
          used...
        </p>

        <h4 className={theme.subText}>Tracking & Cookies Data</h4>
        <p>
          We use cookies and similar tracking technologies to track activity and
          improve our Service.
        </p>
        <DividerWithIcon />

        <h2 className={theme.heading}>
          <strong className="capitalize">Use of Data</strong>
        </h2>
        <ul>
          <li>To provide and maintain the Service</li>
          <li>To notify you about changes</li>
          <li>To allow interactive features</li>
          <li>To provide customer care</li>
          <li>To monitor usage</li>
          <li>To detect and prevent issues</li>
        </ul>
        <DividerWithIcon />

        <h2 className={theme.heading}>
          <strong className="capitalize">Contact Us</strong>
        </h2>
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
