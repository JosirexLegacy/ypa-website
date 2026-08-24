import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowRight, CircleCheckBig, Tractor, Wrench } from "lucide-react";

const services = [
  "Feed mixers and processing equipment",
  "Chaff cutters and silage tools",
  "Farm implements for efficient cultivation",
  "Machinery support for small and medium agribusinesses",
];

export default function MachineryHubPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navigation />

      <section className="pt-28 pb-16 px-6 bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3 text-[#F59E0B]">
            <Wrench className="h-5 w-5" />
            <span className="text-xs font-medium uppercase tracking-[0.24em]">Machinery Hub</span>
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">Powering better farms with practical equipment.</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            YPA Machinery Hub gives farmers and agribusinesses access to tools that improve throughput, reduce labour pressure, and raise productivity.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <Tractor className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold">What we support</h2>
              <ul className="mt-6 space-y-4">
                {services.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700">
                    <CircleCheckBig className="mt-0.5 h-5 w-5 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-[#0E2540] p-8 text-white shadow-lg">
              <p className="text-sm uppercase tracking-[0.2em] text-[#33C1F5]">Why it matters</p>
              <p className="mt-4 text-3xl font-bold">Productivity is built by better tools, not more guesswork.</p>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#00AEEF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0bb7ff]">
                Talk to the team
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
