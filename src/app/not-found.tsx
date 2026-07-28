import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section flex min-h-svh flex-col justify-center pt-40">
      <div className="shell">
        <p className="eyebrow text-fog">404</p>
        <h1 className="font-display type-display mt-4 max-w-3xl">Off the market.</h1>
        <p className="mt-8 max-w-md text-limestone/70">
          The page you&rsquo;re after has been taken down, renamed, or never existed. The
          houses are all still here.
        </p>
        <div className="mt-12 flex flex-wrap gap-6">
          <Link href="/properties" className="btn btn-solid">
            See the properties
          </Link>
          <Link href="/" className="btn btn-line">
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}
