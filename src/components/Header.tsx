import Link from "next/link";
import { nav, site } from "@/data/site";

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="shell flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-6 sm:py-8">
        <Link
          href="/"
          className="font-display text-xl tracking-[0.02em] text-limestone sm:text-2xl"
        >
          {site.name}
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-baseline gap-5 sm:gap-9">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="eyebrow text-limestone/80 transition-colors duration-300 hover:text-brass"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
