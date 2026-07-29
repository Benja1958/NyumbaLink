import Link from "next/link";
import {
  Building2,
  House,
  MapPin,
  MessageCircle,
  ShieldCheck,
  User,
} from "lucide-react";

export default function HomePage() {
  return (
    <main
      className="relative min-h-screen bg-cover bg-center text-white"
          style={{
        backgroundImage: "url('/nairobi-hero.jpg')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col">

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-5 md:px-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
              <House className="h-5 w-5 text-white" />
            </div>

            <span className="text-xl font-semibold tracking-tight">
              NyumbaLink
            </span>
          </Link>

          <span className="hidden text-sm text-white/80 sm:block">
            Kenya&apos;s Rental Platform
          </span>
        </header>

        {/* Hero */}
        <section className="flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-8 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            <MapPin className="h-4 w-4 text-amber-400" />
            Across 47 Counties · Kenya
          </div>

          <h1 className="max-w-3xl font-serif text-5xl font-bold leading-tight md:text-7xl">
            Your next home,
            <span className="block text-amber-400">
              one link away.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-7 text-white/80">
            NyumbaLink connects tenants with verified landlords across Kenya —
            from Nairobi to Kisumu, Mombasa to Eldoret.
          </p>

          {/* Role cards */}
          <div className="mt-10 grid w-full max-w-3xl gap-5 md:grid-cols-2">

            {/* Tenant */}
            <section className="rounded-2xl bg-white p-6 text-left text-gray-900 shadow-xl">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                <User className="h-5 w-5 text-orange-600" />
              </div>

              <h2 className="mt-4 text-xl font-semibold">
                I&apos;m a Tenant
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Browse verified listings, filter by county and town, save
                favourites, and chat with landlords.
              </p>

              <div className="mt-5 space-y-3">
                <Link
                  href="/signup/tenant"
                  className="block rounded-lg bg-orange-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-700"
                >
                  Create Account
                </Link>

                <Link
                  href="/login"
                  className="block rounded-lg border border-orange-200 px-4 py-3 text-center text-sm font-medium text-orange-700 transition hover:bg-orange-50"
                >
                  Sign In
                </Link>
              </div>
            </section>

            {/* Landlord */}
            <section className="rounded-2xl bg-white p-6 text-left text-gray-900 shadow-xl">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                <Building2 className="h-5 w-5 text-green-700" />
              </div>

              <h2 className="mt-4 text-xl font-semibold">
                I&apos;m a Landlord
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                List your properties with photos and amenities, track interest,
                and respond to tenant enquiries.
              </p>

              <div className="mt-5 space-y-3">
                <Link
                  href="/signup/landlord"
                  className="block rounded-lg bg-green-800 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-900"
                >
                  Create Account
                </Link>

                <Link
                  href="/login"
                  className="block rounded-lg border border-green-200 px-4 py-3 text-center text-sm font-medium text-green-800 transition hover:bg-green-50"
                >
                  Sign In
                </Link>
              </div>
            </section>
          </div>
        </section>

        {/* Bottom trust strip */}
        <footer className="border-t border-white/10 bg-black/30 px-6 py-4 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 text-sm text-white/75 md:flex-row md:gap-10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              ID-verified landlords
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-400" />
              15+ counties covered
            </div>

            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-amber-400" />
              Direct tenant–landlord messaging
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}