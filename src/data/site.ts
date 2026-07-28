// Placeholder identity — swap once for the real agent and the whole site follows.
export const site = {
  name: "Maren Holt",
  legalName: "Maren Holt Real Estate LLC",
  region: "Hudson Valley, NY",
  established: 2012,
  license: "Licensed NY real estate broker · 10401-2214",
  phone: "(845) 555-0148",
  phoneHref: "tel:+18455550148",
  email: "maren@marenholt.com",
  office: "6 Garden Street, Rhinebeck, NY 12572",
  hours: "By appointment, seven days a week",
  soldLine: "41 houses sold since 2012 · median 9 days to accepted offer",
};

export const nav = [
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
