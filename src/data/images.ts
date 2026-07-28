// Static imports so Next knows dimensions and generates blur placeholders.
// Files are placeholder art until real photography lands — same names, drop-in.
import type { StaticImageData } from "next/image";

import hero from "../../public/images/hero.webp";
import valley from "../../public/images/valley.webp";
import maren from "../../public/images/maren.webp";

import thornfield1 from "../../public/images/thornfield-house-1.webp";
import thornfield2 from "../../public/images/thornfield-house-2.webp";
import thornfield3 from "../../public/images/thornfield-house-3.webp";
import glasswing1 from "../../public/images/the-glasswing-1.webp";
import glasswing2 from "../../public/images/the-glasswing-2.webp";
import glasswing3 from "../../public/images/the-glasswing-3.webp";
import beacon1 from "../../public/images/beacon-hollow-1.webp";
import beacon2 from "../../public/images/beacon-hollow-2.webp";
import beacon3 from "../../public/images/beacon-hollow-3.webp";
import larch1 from "../../public/images/larch-and-stone-1.webp";
import larch2 from "../../public/images/larch-and-stone-2.webp";
import larch3 from "../../public/images/larch-and-stone-3.webp";
import quarry1 from "../../public/images/quarry-edge-house-1.webp";
import quarry2 from "../../public/images/quarry-edge-house-2.webp";
import quarry3 from "../../public/images/quarry-edge-house-3.webp";
import meridian1 from "../../public/images/the-meridian-1.webp";
import meridian2 from "../../public/images/the-meridian-2.webp";
import meridian3 from "../../public/images/the-meridian-3.webp";

export const siteImages = { hero, valley, maren };

export const propertyImages: Record<
  string,
  { main: StaticImageData; interior: StaticImageData; wide: StaticImageData }
> = {
  "thornfield-house": { main: thornfield1, interior: thornfield2, wide: thornfield3 },
  "the-glasswing": { main: glasswing1, interior: glasswing2, wide: glasswing3 },
  "beacon-hollow": { main: beacon1, interior: beacon2, wide: beacon3 },
  "larch-and-stone": { main: larch1, interior: larch2, wide: larch3 },
  "quarry-edge-house": { main: quarry1, interior: quarry2, wide: quarry3 },
  "the-meridian": { main: meridian1, interior: meridian2, wide: meridian3 },
};
