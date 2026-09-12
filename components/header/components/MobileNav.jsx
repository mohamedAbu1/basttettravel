"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation("header");
  const [locale = "en"] = pathname.split("/").filter(Boolean);
  const links = [
    ["home", "/" + locale],
    ["trips", "/" + locale + "/trips"],
    ["about", "/" + locale + "/about"],
    ["contact", "/" + locale + "/contact"],
  ];

  return (
    <div className="lg:hidden relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        className="mobile-nav-trigger min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg border border-white/30 text-current"
      >
        {open ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
      </button>
      {open && (
        <nav className="mobile-nav-panel absolute right-0 top-14 w-56 rounded-xl border border-[var(--ui-gold)]/40 p-3 shadow-2xl" aria-label="Mobile navigation">
          {links.map(([key, href]) => (
            <Link key={key} href={href} onClick={() => setOpen(false)} className="block rounded-lg px-4 py-3 text-white hover:bg-white/10">
              {t(key)}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
