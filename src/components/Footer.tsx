import Link from "next/link";
import { nav, site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-limestone/10 bg-evergreen">
      <div className="shell grid gap-12 py-16 sm:py-20 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="font-display type-h2 text-limestone">{site.name}</p>
          <p className="dossier mt-4 text-fog">{site.region.toUpperCase()} · EST. {site.established}</p>
        </div>

        <nav aria-label="Footer" className="lg:col-span-3">
          <ul className="space-y-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-underline text-limestone/90">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3 lg:col-span-3">
          <p>
            <a href={site.phoneHref} className="link-underline text-limestone/90">
              {site.phone}
            </a>
          </p>
          <p>
            <a href={`mailto:${site.email}`} className="link-underline text-limestone/90">
              {site.email}
            </a>
          </p>
          <p className="text-limestone/60">{site.office}</p>
        </div>
      </div>

      <div className="shell flex flex-wrap items-baseline justify-between gap-4 border-t border-limestone/10 py-6">
        <p className="dossier text-fog">{site.license}</p>
        <p className="dossier text-fog">
          Equal Housing Opportunity · © {new Date().getFullYear()} {site.legalName}
        </p>
      </div>
    </footer>
  );
}
