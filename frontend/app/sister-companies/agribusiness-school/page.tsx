import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowRight, BookOpen, BriefcaseBusiness, CircleCheckBig, GraduationCap } from "lucide-react";

const modules = [
  "Farm planning and enterprise development",
  "Financial literacy and farm record keeping",
  "Value chain thinking and market access",
  "Practical agri-business leadership",
];

export default function AgribusinessSchoolPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navigation />

      <section className="pt-28 pb-16 px-6 bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3 text-emerald-600">
            <GraduationCap className="h-5 w-5" />
            <span className="text-xs font-medium uppercase tracking-[0.24em]">Agribusiness School</span>
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">Training the next generation of farm leaders.</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            We equip farmers, youth, and entrepreneurs with practical skills to manage land, money, value chains, and business decisions with confidence.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <BookOpen className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold">Key learning areas</h2>
              <ul className="mt-6 space-y-4">
                {modules.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700">
                    <CircleCheckBig className="mt-0.5 h-5 w-5 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-[#0E2540] p-8 text-white shadow-lg">
              <p className="text-sm uppercase tracking-[0.2em] text-[#33C1F5]">Built for impact</p>
              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-3">
                  <BriefcaseBusiness className="h-5 w-5 text-[#33C1F5]" />
                  <span>Career and enterprise readiness</span>
                </div>
                <div className="flex items-center gap-3">
                  <CircleCheckBig className="h-5 w-5 text-[#33C1F5]" />
                  <span>Actionable learning with local relevance</span>
                </div>
              </div>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#00AEEF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0bb7ff]">
                Enquire about training
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
