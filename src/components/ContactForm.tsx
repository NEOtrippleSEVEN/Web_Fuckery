"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/data/site";

const topics = ["Buying", "Selling", "A specific property", "Something else"] as const;

const field =
  "w-full border-b border-limestone/25 bg-transparent py-3 text-limestone placeholder:text-limestone/35 focus:border-brass focus:outline-none transition-colors duration-300";

export default function ContactForm() {
  const [topic, setTopic] = useState<(typeof topics)[number]>(topics[0]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const from = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const subject = `${topic} — ${name}`;
    const body = `${message}\n\n${name}\n${from}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={submit} className="space-y-10">
      <div>
        <label htmlFor="contact-name" className="eyebrow text-fog">
          Your name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="eyebrow text-fog">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={field}
        />
      </div>

      <fieldset>
        <legend className="eyebrow text-fog">This is about</legend>
        <div className="mt-4 flex flex-wrap gap-3">
          {topics.map((t) => (
            <label key={t} className="cursor-pointer">
              <input
                type="radio"
                name="topic"
                value={t}
                checked={topic === t}
                onChange={() => setTopic(t)}
                className="peer sr-only"
              />
              <span className="dossier inline-block rounded-[2px] border border-limestone/25 px-4 py-2 transition-colors duration-300 peer-checked:border-brass peer-checked:bg-brass peer-checked:text-evergreen peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-brass">
                {t}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="contact-message" className="eyebrow text-fog">
          What&rsquo;s on your mind
        </label>
        <textarea id="contact-message" name="message" rows={4} required className={field} />
      </div>

      <div className="space-y-4">
        <button type="submit" className="btn btn-solid">
          Send to Maren
        </button>
        <p className="dossier text-fog">
          Opens your email app with the note ready to send — or skip the form and call.
        </p>
      </div>
    </form>
  );
}
