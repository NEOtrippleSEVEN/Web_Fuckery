import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReviewList from "@/components/ReviewList";
import { siteImages } from "@/data/images";
import { reviews } from "@/data/reviews";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Maren Holt has sold Hudson Valley houses since 2012 — a former appraiser who takes on a handful of listings at a time and walks every one of them.",
};

const process = [
  {
    step: "The walk-through",
    text: "Maren walks the house and the land with you — attic to well head. No software, no comps printout. You'll know that day what she thinks it's worth and why.",
  },
  {
    step: "The number",
    text: "One price, argued from evidence: recent closings she was inside of, buyer demand she's already holding, and what your house has that the comps don't.",
  },
  {
    step: "The preparation",
    text: "Usually two or three things, rarely more. Paint the hallway, clear the view line, fix the gate. She'll tell you what not to spend money on, which saves more than it costs.",
  },
  {
    step: "The market",
    text: "Photography shot on site over a full day, a private showing list before the public one, and open houses only when they serve the price — not the agent.",
  },
  {
    step: "The close",
    text: "Inspection, negotiation, attorneys, keys. Maren attends everything and answers her phone through all of it. The file closes when you're moved, not when the wire clears.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="section pt-40 sm:pt-48">
        <div className="shell">
          <p className="eyebrow text-fog" data-reveal>
            About
          </p>
          <h1 className="font-display type-display mt-4 max-w-5xl" data-reveal>
            Fourteen years, one valley, no&nbsp;team&nbsp;photo.
          </h1>
        </div>
      </section>

      <section className="surface-light section">
        <div className="shell grid gap-x-10 gap-y-16 lg:grid-cols-12">
          <div className="relative lg:col-span-4" data-reveal>
            <Image
              src={siteImages.maren}
              alt={`${site.name}, portrait`}
              placeholder="blur"
              sizes="(min-width: 1024px) 32vw, 100vw"
              className="h-auto w-full"
            />
            <p className="dossier mt-4 text-evergreen/60">
              {site.name} · {site.license}
            </p>
          </div>
          <div className="max-w-2xl space-y-6 self-center text-lg text-evergreen/85 lg:col-span-7 lg:col-start-6">
            <p data-reveal>
              Maren spent seven years as a licensed appraiser for a Manhattan firm, valuing
              other people&rsquo;s houses until she could do it in her sleep. In 2012 she moved
              to Rhinebeck, got her broker&rsquo;s license, and decided to sell houses the way
              she&rsquo;d wished her clients&rsquo; agents had: fewer at a time, walked
              personally, priced from evidence rather than hope.
            </p>
            <p data-reveal>
              The practice has stayed deliberately small — one broker, one assistant, a
              photographer she has worked with for a decade. It covers the river towns from
              Beacon to Hudson and the farm country east to Millbrook.
            </p>
            <p data-reveal>
              What clients notice first is the bluntness. What they mention in reviews is that
              the bluntness was correct.
            </p>
          </div>
        </div>
      </section>

      <section className="relative" data-reveal>
        <div className="relative aspect-video max-h-[70svh] w-full overflow-hidden sm:aspect-21/9">
          <Image
            src={siteImages.valley}
            alt="The Hudson Valley at dusk, looking west across the river"
            fill
            placeholder="blur"
            sizes="100vw"
            className="object-cover"
            data-parallax
          />
        </div>
      </section>

      {/* The one legitimate sequence on the site — the process is genuinely ordered */}
      <section className="section">
        <div className="shell grid gap-x-10 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-fog" data-reveal>
              How a sale runs
            </p>
            <h2 className="font-display type-h1 mt-3" data-reveal>
              Five steps, in order.
            </h2>
          </div>
          <ol className="divide-y divide-limestone/10 lg:col-span-7 lg:col-start-6">
            {process.map((item, i) => (
              <li key={item.step} className="grid gap-4 py-10 first:pt-0 sm:grid-cols-12" data-reveal>
                <p className="dossier text-brass sm:col-span-2">{String(i + 1).padStart(2, "0")}</p>
                <div className="sm:col-span-10">
                  <h3 className="font-display type-h3">{item.step}</h3>
                  <p className="mt-3 max-w-xl text-limestone/70">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-limestone/10 section">
        <div className="shell">
          <p className="eyebrow mb-16 text-fog lg:mb-24" data-reveal>
            From past clients
          </p>
          <ReviewList items={reviews.slice(3)} />
          <p className="mt-20" data-reveal>
            <Link href="/contact" className="btn btn-line">
              Talk to Maren
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
