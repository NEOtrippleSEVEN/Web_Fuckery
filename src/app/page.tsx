import Image from "next/image";
import Link from "next/link";
import PropertyRow from "@/components/PropertyRow";
import ReviewList from "@/components/ReviewList";
import { siteImages } from "@/data/images";
import { properties } from "@/data/properties";
import { reviews } from "@/data/reviews";
import { site } from "@/data/site";

export default function Home() {
  const featured = properties.filter((p) => p.featured);
  const showing = featured[0];

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-svh flex-col justify-end" data-hero>
        <Image
          src={siteImages.hero}
          alt="A Hudson Valley ridgeline at dusk"
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="object-cover"
          data-hero-img
        />
        <div className="absolute inset-0 bg-linear-to-b from-evergreen/55 via-transparent to-evergreen" />

        <div className="shell relative pb-14 sm:pb-20">
          <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-10">
            <h1 className="font-display type-display max-w-4xl" data-hero-title>
              Houses worth slowing down&nbsp;for.
            </h1>
            <dl className="dossier space-y-1 text-limestone/80 lg:ml-auto lg:text-right" data-hero-meta>
              <div>
                <dt className="sr-only">Territory</dt>
                <dd>{site.region.toUpperCase()}</dd>
              </div>
              <div>
                <dt className="sr-only">Established</dt>
                <dd>EST. {site.established}</dd>
              </div>
              <div>
                <dt className="sr-only">Record</dt>
                <dd className="max-w-[36ch] lg:ml-auto">{site.soldLine.toUpperCase()}</dd>
              </div>
            </dl>
          </div>

          <p className="mt-12 border-t border-limestone/20 pt-6" data-hero-showing>
            <Link
              href={`/properties/${showing.slug}`}
              className="link-underline dossier text-limestone/90"
            >
              Currently showing: {showing.name}, {showing.town}
            </Link>
          </p>
        </div>
      </section>

      {/* The practice */}
      <section className="surface-light section">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <p className="eyebrow text-evergreen/60 lg:col-span-3" data-reveal>
            The practice
          </p>
          <div className="max-w-3xl space-y-8 lg:col-span-9">
            <h2 className="font-display type-h1" data-reveal>
              A small number of houses, sold properly.
            </h2>
            <div className="space-y-6 text-lg text-evergreen/80" data-reveal>
              <p>
                {site.name} takes on a handful of listings at a time — never more than she can
                walk personally, photograph properly, and answer for at midnight. Some years
                that means twelve houses. It has never meant forty.
              </p>
              <p>
                The trade-off is deliberate. Buyers get straight answers about septic systems
                and school districts. Sellers get a broker who has already met the three
                families most likely to buy their house.
              </p>
            </div>
            <p data-reveal>
              <Link href="/about" className="link-underline dossier text-evergreen/80">
                About Maren
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* On the market */}
      <section className="section">
        <div className="shell">
          <div className="mb-16 flex flex-wrap items-baseline justify-between gap-6 lg:mb-24">
            <div>
              <p className="eyebrow text-fog" data-reveal>
                On the market
              </p>
              <h2 className="font-display type-h1 mt-3" data-reveal>
                Currently showing.
              </h2>
            </div>
            <Link href="/properties" className="link-underline dossier text-limestone/80" data-reveal>
              All {properties.length} properties
            </Link>
          </div>

          <div className="space-y-24 lg:space-y-36">
            {featured.map((property, i) => (
              <PropertyRow key={property.slug} property={property} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* From past clients */}
      <section className="surface-light section">
        <div className="shell">
          <p className="eyebrow mb-16 text-evergreen/60 lg:mb-24" data-reveal>
            From past clients
          </p>
          <ReviewList items={reviews.slice(0, 3)} />
        </div>
      </section>

      {/* Contact band */}
      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-fog" data-reveal>
              Contact
            </p>
            <h2 className="font-display type-h1 mt-3 max-w-2xl" data-reveal>
              Thinking of selling? Start with a walk-through.
            </h2>
            <p className="mt-8 max-w-xl text-limestone/70" data-reveal>
              No valuation software, no pitch deck. Maren walks the house, tells you what it
              will sell for and what to fix first, and leaves you her cell number.
            </p>
            <p className="mt-10" data-reveal>
              <Link href="/contact" className="btn btn-solid">
                Book a walk-through
              </Link>
            </p>
          </div>
          <div className="space-y-4 self-end lg:col-span-5 lg:text-right" data-reveal>
            <p>
              <a href={site.phoneHref} className="font-display type-h3 transition-colors duration-300 hover:text-brass">
                {site.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="link-underline text-limestone/80">
                {site.email}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
