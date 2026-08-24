import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowRight, Building2, GraduationCap, Leaf, Sprout, Utensils, Wrench } from "lucide-react";

const pillars = [
  {
    title: "Projects",
    description: "Goat, maize, and climate-smart agricultural programmes that create income for real communities.",
    href: "/projects",
    icon: Sprout,
    accent: "#00AEEF",
  },
  {
    title: "SACCO",
    description: "Member-led savings, loans, and financial discipline that keep farming businesses sustainable.",
    href: "/sacco",
    icon: Building2,
    accent: "#F0B429",
  },
  {
    title: "Agribusiness School",
    description: "Practical learning that equips farmers, youth, and entrepreneurs with modern agribusiness skills.",
    href: "/sister-companies/agribusiness-school",
    icon: GraduationCap,
    accent: "#34D399",
  },
  {
    title: "Machinery Hub",
    description: "Access to agricultural tools, implements, and mechanisation support for better productivity.",
    href: "/sister-companies/machinery-hub",
    icon: Wrench,
    accent: "#F59E0B",
  },
  {
    title: "Mbuzi Choma",
    description: "A restaurant brand that connects agriculture to consumer experiences and local value chains.",
    href: "/sister-companies/mbuzi-choma",
    icon: Utensils,
    accent: "#EF4444",
  },
  {
    title: "Agri-Learning & Growth",
    description: "A coordinated model turning land, labour, finance, and knowledge into measurable prosperity.",
    href: "/about",
    icon: Leaf,
    accent: "#8B5CF6",
  },
];

export default function EcosystemPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navigation />

      <section className="pt-28 pb-16 px-6 bg-gradient-to-br from-[#F2FAFF] via-white to-[#f3f8ff]">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#00AEEF]">YPA ecosystem</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">One ecosystem. Many pathways to growth.</h1>
            <p className="mt-5 text-lg text-slate-600">
              Youth Platform Africa connects production, finance, education, and market access so farmers and entrepreneurs can build resilient agribusinesses.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pillars.map(({ title, description, href, icon: Icon, accent }) => (
              <Link key={title} href={href} className="group block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${accent}20`, color: accent }}>
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-slate-900">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0E2540]">
                  Explore
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl bg-[#0E2540] px-8 py-10 text-white md:px-12">
          <p className="text-sm uppercase tracking-[0.22em] text-[#33C1F5]">How it works</p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">From farm input to market value, every link matters.</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              "Farmers and communities access structured programmes and support.",
              "Savings, partnerships, and working capital make growth credible.",
              "Skills, machinery, and consumer-facing businesses turn output into impact.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-6 text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
