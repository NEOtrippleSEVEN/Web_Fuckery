import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Call ${site.phone}, write to ${site.email}, or send a note — Maren answers within the day.`,
};

export default function ContactPage() {
  return (
    <section className="section pt-40 sm:pt-48">
      <div className="shell">
        <p className="eyebrow text-fog" data-reveal>
          Contact
        </p>
        <h1 className="font-display type-display mt-4 max-w-4xl" data-reveal>
          Start with a conversation.
        </h1>

        <div className="mt-20 grid gap-x-10 gap-y-16 lg:mt-28 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-5" data-reveal>
            <div>
              <p className="eyebrow text-fog">Call or text</p>
              <p className="mt-3">
                <a
                  href={site.phoneHref}
                  className="font-display type-h2 transition-colors duration-300 hover:text-brass"
                >
                  {site.phone}
                </a>
              </p>
            </div>
            <div>
              <p className="eyebrow text-fog">Write</p>
              <p className="mt-3">
                <a
                  href={`mailto:${site.email}`}
                  className="font-display type-h3 transition-colors duration-300 hover:text-brass"
                >
                  {site.email}
                </a>
              </p>
            </div>
            <div>
              <p className="eyebrow text-fog">The office</p>
              <p className="mt-3 text-limestone/80">{site.office}</p>
              <p className="text-limestone/60">{site.hours}</p>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7" data-reveal>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
