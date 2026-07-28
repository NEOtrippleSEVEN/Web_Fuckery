import type { Review } from "@/data/reviews";

export default function ReviewList({ items }: { items: Review[] }) {
  return (
    <div className="space-y-20 lg:space-y-28">
      {items.map((review, i) => (
        <blockquote
          key={review.name}
          className={`max-w-3xl ${i % 2 === 1 ? "lg:ml-[30%]" : ""}`}
          data-reveal
        >
          <p className="font-display type-h3 italic leading-snug">“{review.quote}”</p>
          <footer className="dossier mt-6 opacity-70">
            {review.name} · {review.context}
          </footer>
        </blockquote>
      ))}
    </div>
  );
}
