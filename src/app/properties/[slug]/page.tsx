import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bySlug, formatPrice, properties } from "@/data/properties";
import { propertyImages } from "@/data/images";
import { site } from "@/data/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const property = bySlug(slug);
  if (!property) return {};
  return {
    title: `${property.name}, ${property.town}`,
    description: property.card,
  };
}

export default async function PropertyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const property = bySlug(slug);
  if (!property) notFound();

  const img = propertyImages[property.slug];
  const index = properties.findIndex((p) => p.slug === property.slug);
  const prev = properties[(index - 1 + properties.length) % properties.length];
  const next = properties[(index + 1) % properties.length];

  return (
    <>
      {/* Hero — the Viewing lands here */}
      <section className="relative flex min-h-[82svh] flex-col justify-end">
        <Image
          src={img.main}
          alt={`${property.name}, ${property.town} — exterior`}
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="object-cover"
          data-viewing-target={property.slug}
        />
        <div className="absolute inset-0 bg-linear-to-b from-evergreen/55 via-transparent to-evergreen" />
        <div className="shell relative pb-14">
          <p className="eyebrow text-limestone/80" data-hero-meta>
            {property.town}
          </p>
          <h1 className="font-display type-display mt-3" data-hero-title>
            {property.name}
          </h1>
        </div>
      </section>

      {/* Schedule of facts */}
      <section className="border-b border-limestone/10">
        <div className="shell">
          <dl className="dossier flex flex-wrap items-baseline gap-x-10 gap-y-3 py-8 text-limestone/80">
            <div className="flex gap-2">
              <dt className="sr-only">Price</dt>
              <dd className="font-display text-2xl tracking-normal text-brass">
                {formatPrice(property.price)}
              </dd>
            </div>
            <div><dt className="sr-only">Bedrooms</dt><dd>{property.beds} BD</dd></div>
            <div><dt className="sr-only">Bathrooms</dt><dd>{property.baths} BA</dd></div>
            <div><dt className="sr-only">Interior</dt><dd>{property.sqft.toLocaleString("en-US")} SQFT</dd></div>
            <div><dt className="sr-only">Land</dt><dd>{property.acres} ACRES</dd></div>
            <div><dt className="sr-only">Built</dt><dd>BUILT {property.built.toUpperCase()}</dd></div>
          </dl>
        </div>
      </section>

      {/* The house */}
      <section className="section">
        <div className="shell grid gap-x-10 gap-y-12 lg:grid-cols-12">
          <p className="eyebrow text-fog lg:col-span-3" data-reveal>
            The house
          </p>
          <div className="max-w-2xl space-y-6 lg:col-span-6" data-reveal>
            {property.story.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-lg text-limestone/85">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Interior + particulars */}
      <section className="pb-32">
        <div className="shell grid items-end gap-x-10 gap-y-12 lg:grid-cols-12">
          <div className="relative lg:col-span-5" data-reveal>
            <Image
              src={img.interior}
              alt={`${property.name} — interior`}
              placeholder="blur"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="h-auto w-full"
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7" data-reveal>
            <h2 className="eyebrow text-fog">Particulars</h2>
            <dl className="dossier mt-6 divide-y divide-limestone/10 border-y border-limestone/10">
              {property.particulars.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-6 py-4">
                  <dt className="text-limestone/60">{label}</dt>
                  <dd className="text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Wide interior */}
      <section className="pb-32" data-reveal>
        <div className="relative aspect-video max-h-[80svh] w-full overflow-hidden sm:aspect-2/1">
          <Image
            src={img.wide}
            alt={`${property.name} — main living space`}
            fill
            placeholder="blur"
            sizes="100vw"
            className="object-cover"
            data-parallax
          />
        </div>
      </section>

      {/* Arrange a viewing */}
      <section className="surface-light section">
        <div className="shell flex flex-wrap items-end justify-between gap-10">
          <div className="max-w-xl">
            <p className="eyebrow text-evergreen/60" data-reveal>
              See it in person
            </p>
            <h2 className="font-display type-h1 mt-3" data-reveal>
              Arrange a viewing.
            </h2>
            <p className="mt-6 text-evergreen/75" data-reveal>
              Viewings are private and unhurried — plan on an hour. Call{" "}
              <a href={site.phoneHref} className="link-underline">{site.phone}</a> or write and
              Maren will suggest times within the day.
            </p>
          </div>
          <Link href="/contact" className="btn btn-solid" data-reveal>
            Arrange a viewing
          </Link>
        </div>
      </section>

      {/* Prev / next */}
      <nav aria-label="More properties" className="border-t border-limestone/10">
        <div className="shell grid gap-6 py-12 sm:grid-cols-2">
          <Link href={`/properties/${prev.slug}`} className="group">
            <p className="eyebrow text-fog">Previous</p>
            <p className="font-display type-h3 mt-2 transition-colors duration-300 group-hover:text-brass">
              {prev.name}
            </p>
          </Link>
          <Link href={`/properties/${next.slug}`} className="group sm:text-right">
            <p className="eyebrow text-fog">Next</p>
            <p className="font-display type-h3 mt-2 transition-colors duration-300 group-hover:text-brass">
              {next.name}
            </p>
          </Link>
        </div>
      </nav>
    </>
  );
}
