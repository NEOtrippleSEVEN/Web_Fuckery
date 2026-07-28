import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Property } from "@/data/properties";
import { propertyImages } from "@/data/images";

type Props = {
  property: Property;
  index: number;
  priority?: boolean;
};

export default function PropertyRow({ property, index, priority }: Props) {
  const img = propertyImages[property.slug];
  const flip = index % 2 === 1;

  return (
    <article className="grid items-end gap-x-10 gap-y-6 lg:grid-cols-12" data-reveal>
      <Link
        href={`/properties/${property.slug}`}
        aria-label={`${property.name}, ${property.town}`}
        className={`group relative block lg:col-span-7 ${flip ? "lg:order-2" : ""}`}
        data-viewing={property.slug}
      >
        <span className="relative block aspect-3/2 overflow-hidden">
          <Image
            src={img.main}
            alt={`${property.name}, ${property.town} — exterior`}
            fill
            placeholder="blur"
            priority={priority}
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </span>
      </Link>

      <div className={`space-y-4 lg:col-span-5 ${flip ? "lg:order-1 lg:text-right" : ""}`}>
        <div>
          <h3 className="font-display type-h3">
            <Link
              href={`/properties/${property.slug}`}
              className="transition-colors duration-300 hover:text-brass"
            >
              {property.name}
            </Link>
          </h3>
          <p className="eyebrow mt-2 text-fog">{property.town}</p>
        </div>

        <p className="dossier text-limestone/80">
          {property.beds} BD · {property.baths} BA · {property.sqft.toLocaleString("en-US")} SQFT ·{" "}
          {property.acres} AC
        </p>

        <p className="font-display text-2xl text-brass">{formatPrice(property.price)}</p>

        <p className={`max-w-md text-limestone/70 ${flip ? "lg:ml-auto" : ""}`}>{property.card}</p>

        <p>
          <Link href={`/properties/${property.slug}`} className="link-underline dossier text-limestone/90">
            View the house
          </Link>
        </p>
      </div>
    </article>
  );
}
