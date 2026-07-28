import type { Metadata } from "next";
import PropertyRow from "@/components/PropertyRow";
import { properties, sold } from "@/data/properties";

export const metadata: Metadata = {
  title: "Properties",
  description:
    "Houses currently represented by Maren Holt across the Hudson Valley — Rhinebeck to Beacon, Stone Ridge to Millbrook.",
};

export default function PropertiesPage() {
  return (
    <>
      <section className="section pt-40 sm:pt-48">
        <div className="shell">
          <p className="eyebrow text-fog" data-reveal>
            On the market
          </p>
          <h1 className="font-display type-display mt-4 max-w-4xl" data-reveal>
            {properties.length} houses, each one walked, priced, and argued&nbsp;over.
          </h1>
          <p className="mt-8 max-w-xl text-limestone/70" data-reveal>
            Every listing here is one Maren represents directly. If none of them fits, say
            what you&rsquo;re after — most of what she sells is never publicly listed.
          </p>
        </div>
      </section>

      <section className="pb-32">
        <div className="shell space-y-24 lg:space-y-36">
          {properties.map((property, i) => (
            <PropertyRow key={property.slug} property={property} index={i} priority={i === 0} />
          ))}
        </div>
      </section>

      <section className="surface-light section">
        <div className="shell">
          <p className="eyebrow text-evergreen/60" data-reveal>
            Recently sold
          </p>
          <h2 className="font-display type-h2 mt-3" data-reveal>
            Closed in the last year.
          </h2>
          <table className="dossier mt-12 w-full border-collapse text-left" data-reveal>
            <thead>
              <tr className="border-b border-evergreen/20 text-evergreen/60">
                <th scope="col" className="py-3 pr-4 font-normal">HOUSE</th>
                <th scope="col" className="py-3 pr-4 font-normal">TOWN</th>
                <th scope="col" className="hidden py-3 pr-4 font-normal sm:table-cell">CLOSED</th>
                <th scope="col" className="py-3 font-normal">RESULT</th>
              </tr>
            </thead>
            <tbody>
              {sold.map((row) => (
                <tr key={row.address} className="border-b border-evergreen/10">
                  <td className="py-4 pr-4">{row.address}</td>
                  <td className="py-4 pr-4 text-evergreen/70">{row.town}</td>
                  <td className="hidden py-4 pr-4 text-evergreen/70 sm:table-cell">{row.closed}</td>
                  <td className="py-4 text-evergreen/70">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
