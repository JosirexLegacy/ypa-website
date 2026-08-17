"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, Inter } from "next/font/google";
import { motion, useInView, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronRight, Target, Globe, Users, Clock, Heart, Handshake, MapPin, FileText, ShieldCheck } from "lucide-react";

// ============================================================
// FONTS — two roles only. No mono/ledger typeface.
// ============================================================
const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-inter" });

// ============================================================
// TOKENS — one dark, one light, one accent doing most of the work.
// Gold is used exactly once, as a single warm break in Vision 2030.
// ============================================================
const INK = "#0B0D0E";
const PAPER = "#FFFFFF";
const CLOUD = "#F5F6F7";
const STONE = "#68707A";
const HAIRLINE = "#E7E9EC";
const BLUE = "#00AEEF";
const BLUE_DEEP = "#0090C7";
const GOLD = "#F0B429";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";
const getImageUrl = (image?: string) => (!image ? null : image.startsWith("http") ? image : `${API_URL}/assets/${image}`);

async function getAboutContent() {
  try {
    const res = await fetch(`${API_URL}/items/about`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()).data?.[0] || null;
  } catch { return null; }
}
async function getFAQs() {
  try {
    const res = await fetch(`${API_URL}/items/faqs?sort[]=order`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()).data || [];
  } catch { return []; }
}

// ============================================================
// Reveal — the only motion primitive. Fade + rise, once, reduced-motion safe.
// ============================================================
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={reduce ? {} : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : reduce ? {} : { opacity: 0, y: 24 }}
      transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Kicker({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className={`${inter.className} text-[11px] md:text-xs font-medium uppercase tracking-[0.18em]`}
      style={{ color: light ? "rgba(255,255,255,0.5)" : STONE }}
    >
      {children}
    </span>
  );
}

// missing-info note — quiet, not a badge farm
function Note({ children }: { children: React.ReactNode }) {
  return <p className={`${inter.className} text-sm italic`} style={{ color: STONE }}>{children}</p>;
}

// ============================================================
// HERO — one headline, one line, one action. Full-bleed image, no frame,
// no dot grid, no eyebrow stamp.
// ============================================================
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const reduce = useReducedMotion();

  return (
    <section ref={ref} className="relative h-[92vh] min-h-[560px] overflow-hidden" style={{ background: INK }}>
      <motion.div style={reduce ? {} : { y }} className="absolute inset-0">
        <img
          src="https://res.cloudinary.com/owwvyprb/image/upload/v1784726249/3P0D0002_tg15tl.jpg"
          alt=""
          className="w-full h-full object-cover scale-110"
          style={{ filter: "grayscale(0.35) brightness(0.42)" }}
        />
      </motion.div>
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(11,13,14,0.2) 0%, rgba(11,13,14,0.75) 100%)` }} />

      <motion.div style={reduce ? {} : { opacity }} className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 pb-16 md:pb-24">
        <Reveal>
          <h1 className={`${display.className} text-white font-medium leading-[0.95] tracking-tight text-[13vw] sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl`}>
            Agribusiness,
            <br />
            built by young Africans.
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className={`${inter.className} mt-6 max-w-lg text-base md:text-lg font-light leading-relaxed text-white/70`}>
            From a 21-person village group in 2008 to a Pan-African platform with 12 branches — this is
            what we do, who leads it, and how you can check any of it.
          </p>
        </Reveal>
        <Reveal delay={0.22}>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="#story"
              className={`${inter.className} inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5`}
              style={{ background: PAPER, color: INK }}
            >
              Our story
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="#trust"
              className={`${inter.className} inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium border transition-colors hover:bg-white/10`}
              style={{ borderColor: "rgba(255,255,255,0.3)", color: PAPER }}
            >
              Verify our credentials
            </Link>
          </div>
        </Reveal>
      </motion.div>

      <motion.div
        animate={reduce ? {} : { y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <ChevronDown className="h-5 w-5 text-white/40" />
      </motion.div>
    </section>
  );
}

// ============================================================
// STORY — editorial split. One big pull-number, real copy, one image.
// ============================================================
function Story({ content }: { content: any }) {
  return (
    <section id="story" className="py-24 md:py-36 px-6 md:px-16" style={{ background: PAPER }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
        <Reveal>
          <div className={`${display.className} font-medium leading-none tracking-tight text-[20vw] sm:text-8xl lg:text-9xl`} style={{ color: INK }}>
            08
          </div>
          <Kicker>Founded 2008</Kicker>
        </Reveal>

        <div>
          <Reveal>
            <h2 className={`${display.className} text-3xl md:text-5xl font-medium leading-[1.05] tracking-tight`} style={{ color: INK }}>
              We started with 21 people and a shared problem to solve.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className={`${inter.className} mt-6 space-y-5 text-base md:text-lg font-light leading-relaxed`} style={{ color: "#3C4650" }}>
              {content?.story ? (
                <div dangerouslySetInnerHTML={{ __html: content.story }} />
              ) : (
                <>
                  <p>
                    Youth Platform Africa began in 2008 as a village group of 21 people. By 2010 it had grown
                    into a Community Based Organisation with 60 members, who formed the Board of Governors and
                    management that still guide the organisation today.
                  </p>
                  <p>
                    As the work grew into international trade, we registered formally as BREC Youth Empowerment
                    Africa Limited. Today YPA runs agribusiness and financial-inclusion programmes across 12
                    branches in Uganda, with international offices in Dubai and Zambia.
                  </p>
                </>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-10 grid grid-cols-3 gap-6 pt-8" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
              {[["2008", "Founded"], ["12", "Branches"], ["3", "Countries"]].map(([v, l]) => (
                <div key={l}>
                  <div className={`${display.className} text-2xl md:text-3xl font-medium`} style={{ color: INK }}>{v}</div>
                  <div className={`${inter.className} text-xs mt-1 font-medium`} style={{ color: STONE }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SCALE — the signature moment. Full-bleed dark section, one huge number
// per beat, counting up as it enters view. This is the page's one big risk.
// ============================================================
function useCountUp(target: number, active: boolean, duration = 1600) {
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!active) return;
    if (reduce) { setN(target); return; }
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, reduce]);
  return n;
}

function ScaleNumber({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const n = useCountUp(target, inView);
  return (
    <div ref={ref} className="text-center">
      <div className={`${display.className} font-medium tracking-tight text-white text-[15vw] sm:text-7xl md:text-8xl`}>
        {n.toLocaleString()}{suffix}
      </div>
      <div className={`${inter.className} mt-3 text-sm md:text-base font-light text-white/50`}>{label}</div>
    </div>
  );
}

function Scale() {
  return (
    <section className="py-28 md:py-40 px-6 md:px-16" style={{ background: INK }}>
      <div className="max-w-5xl mx-auto text-center mb-16 md:mb-24">
        <Reveal><Kicker light>What we've built</Kicker></Reveal>
        <Reveal delay={0.08}>
          <h2 className={`${display.className} text-white text-3xl md:text-5xl font-medium tracking-tight mt-3`}>
            The numbers, plainly.
          </h2>
        </Reveal>
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
        <ScaleNumber target={130000} suffix="+" label="Goats under care" />
        <ScaleNumber target={12} suffix="" label="Branches, nationwide" />
        <ScaleNumber target={1000} suffix="+" label="Members empowered" />
      </div>
    </section>
  );
}

// ============================================================
// MISSION & VISION — two quiet, confident statements.
// ============================================================
function Purpose({ content }: { content: any }) {
  const cards = [
    { icon: Target, label: "Mission", html: content?.mission, fallback: "To economically empower individuals through agribusiness that competes internationally." },
    { icon: Globe, label: "Vision", html: content?.vision, fallback: "To be the greatest empowerment platform in Africa, and push back poverty with it." },
  ];
  return (
    <section className="py-24 md:py-32 px-6 md:px-16" style={{ background: PAPER }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-px" style={{ background: HAIRLINE }}>
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Reveal key={i} delay={i * 0.1} className="p-10 md:p-14" >
              <div style={{ background: PAPER }} className="h-full">
                <Icon className="h-6 w-6" style={{ color: BLUE }} strokeWidth={1.5} />
                <Kicker><span className="mt-4 block">{c.label}</span></Kicker>
                <p className={`${display.className} mt-3 text-2xl md:text-3xl font-medium leading-[1.15] tracking-tight`} style={{ color: INK }}>
                  {c.html ? <span dangerouslySetInnerHTML={{ __html: c.html }} /> : c.fallback}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================
// VALUES — a plain list, not a card grid.
// ============================================================
function Values() {
  const values = [
    { text: "We walk in faith, guided by kindness, compassion and service.", icon: Heart },
    { text: "We are honest and transparent in everything we do.", icon: ShieldCheck },
    { text: "We respect time — punctuality and efficiency matter.", icon: Clock },
    { text: "We believe collaboration is key. Together, we achieve more.", icon: Handshake },
    { text: "We build lasting connections between young Africans and their communities.", icon: Users },
  ];
  return (
    <section className="py-24 md:py-32 px-6 md:px-16" style={{ background: CLOUD }}>
      <div className="max-w-4xl mx-auto">
        <Reveal className="mb-12 md:mb-16">
          <Kicker>What we believe</Kicker>
          <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: INK }}>
            Five things we don't compromise on.
          </h2>
        </Reveal>
        <div>
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal key={i} delay={i * 0.05}>
                <div className="flex items-center gap-5 md:gap-8 py-6 md:py-7" style={{ borderTop: i === 0 ? `1px solid ${HAIRLINE}` : "none", borderBottom: `1px solid ${HAIRLINE}` }}>
                  <Icon className="h-5 w-5 md:h-6 md:w-6 shrink-0" style={{ color: BLUE }} strokeWidth={1.5} />
                  <p className={`${inter.className} text-base md:text-xl font-light leading-snug`} style={{ color: "#2A323B" }}>{v.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// LEADERSHIP — clean portrait grid, name/role only, quiet placeholder.
// ============================================================
interface Leader { role: string; name: string; bio: string; image?: string }
const LEADERSHIP: Leader[] = [
  { role: "Managing Director", name: "Obed Ben", bio: "Leads YPA's agribusiness strategy and community development work.", image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784716326/acc94e42-c5d5-489c-b335-6ee5353253be.jpg" },
  { role: "Executive Director", name: "JB Magezi", bio: "Drives YPA's expansion across Africa and its financial-inclusion programmes.", image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784716480/587e2393-e360-4ac2-bae3-22b7cec94705.jpg" },
  { role: "General Manager", name: "Charles Kalemera", bio: "Oversees day-to-day operations across all 12 branches.", image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784716382/5fd55b99-ec2f-4990-b3c7-8a5b69837aad.jpg" },
  { role: "Founding Member", name: "", bio: "", image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784726254/3P0D0022_gqfkkg.jpg" },
];

function Leadership() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-16" style={{ background: PAPER }}>
      <div className="max-w-6xl mx-auto">
        <Reveal className="mb-12 md:mb-16">
          <Kicker>Governance</Kicker>
          <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: INK }}>
            Led by real people.
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {LEADERSHIP.map((l, i) => {
            const img = l.image ? getImageUrl(l.image) : null;
            const empty = !l.name;
            return (
              <Reveal key={i} delay={i * 0.06}>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden" style={{ background: CLOUD }}>
                  {img && (
                    <img src={img} alt={l.name || "Leadership"} className="w-full h-full object-cover" style={{ objectPosition: "50% 20%", filter: empty ? "grayscale(1)" : "none", opacity: empty ? 0.5 : 1 }} />
                  )}
                </div>
                <div className="mt-4">
                  <div className={`${display.className} text-base md:text-lg font-medium`} style={{ color: empty ? STONE : INK }}>
                    {empty ? "Name pending" : l.name}
                  </div>
                  <div className={`${inter.className} text-xs md:text-sm mt-0.5`} style={{ color: STONE }}>{l.role}</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TIMELINE — horizontal, snap-scroll, restrained.
// ============================================================
const MILESTONES = [
  { year: "2008", label: "Founded as a village group" },
  { year: "2010", label: "Registered as a CBO, 60 members" },
  { year: "2015", label: "Expanded to 5 branches" },
  { year: "2020", label: "Launched YPA SACCO" },
  { year: "2023", label: "Reached 100,000 goats under care" },
  { year: "2025", label: "Opened offices in Dubai & Zambia" },
];

function Timeline() {
  return (
    <section className="py-24 md:py-32 pl-6 md:pl-16" style={{ background: CLOUD }}>
      <Reveal className="mb-12 md:mb-16 pr-6 md:pr-16">
        <Kicker>Timeline</Kicker>
        <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: INK }}>
          Year by year.
        </h2>
      </Reveal>
      <div className="flex gap-6 md:gap-8 overflow-x-auto pb-4 pr-6 md:pr-16 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]" style={{ scrollbarWidth: "none" }}>
        {MILESTONES.map((m, i) => (
          <Reveal key={i} delay={i * 0.05} className="shrink-0 snap-start w-[62vw] sm:w-[280px]">
            <div className="pt-6" style={{ borderTop: `2px solid ${i % 2 ? GOLD : BLUE}` }}>
              <div className={`${display.className} text-3xl md:text-4xl font-medium`} style={{ color: INK }}>{m.year}</div>
              <p className={`${inter.className} mt-2 text-sm md:text-base font-light leading-snug`} style={{ color: "#3C4650" }}>{m.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// TRUST — replaces the old verify-grid + compliance-cards + offices
// with one calm, scannable section. Confirmed facts read as plain text;
// nothing gets a badge just to look verified.
// ============================================================
function Trust() {
  const facts = [
    { k: "Registered name", v: "BREC Youth Empowerment Africa Limited" },
    { k: "URSB registration no.", v: "80034597452632" },
    { k: "Tax ID (TIN)", v: "1036998856" },
    { k: "Established", v: "2008" },
  ];
  const offices = [
    { region: "Uganda — Headquarters", detail: "12 branches nationwide" },
    { region: "Dubai, UAE", detail: "International office" },
    { region: "Zambia", detail: "International office" },
  ];
  return (
    <section id="trust" className="py-24 md:py-32 px-6 md:px-16" style={{ background: PAPER }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
        <div>
          <Reveal>
            <Kicker>Due diligence</Kicker>
            <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: INK }}>
              The paperwork, on record.
            </h2>
          </Reveal>
          <div className="mt-10">
            {facts.map((f, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="flex items-baseline justify-between gap-4 py-4" style={{ borderTop: i === 0 ? `1px solid ${HAIRLINE}` : "none", borderBottom: `1px solid ${HAIRLINE}` }}>
                  <span className={`${inter.className} text-sm`} style={{ color: STONE }}>{f.k}</span>
                  <span className={`${inter.className} text-sm md:text-base font-medium text-right`} style={{ color: INK }}>{f.v}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Annual report", "Audited financials", "Strategic plan"].map((doc) => (
                <span key={doc} className={`${inter.className} inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full`} style={{ color: STONE, border: `1px solid ${HAIRLINE}` }}>
                  <FileText className="h-3 w-3" /> {doc}
                </span>
              ))}
            </div>
            <Note>Documents to be linked once available.</Note>
          </Reveal>
        </div>

        <div>
          <Reveal delay={0.1}>
            <Kicker>Find us</Kicker>
          </Reveal>
          <div className="mt-10 space-y-8">
            {offices.map((o, i) => (
              <Reveal key={i} delay={0.1 + i * 0.06}>
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 mt-0.5 shrink-0" style={{ color: BLUE }} strokeWidth={1.5} />
                  <div>
                    <div className={`${display.className} text-lg font-medium`} style={{ color: INK }}>{o.region}</div>
                    <div className={`${inter.className} text-sm mt-0.5`} style={{ color: STONE }}>{o.detail}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FAQ — quiet accordion, no numbered circles.
// ============================================================
function FAQ({ faqs }: { faqs: any[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-24 md:py-32 px-6 md:px-16" style={{ background: CLOUD }}>
      <div className="max-w-3xl mx-auto">
        <Reveal className="mb-12 md:mb-16 text-center">
          <Kicker>FAQ</Kicker>
          <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: INK }}>
            Common questions.
          </h2>
        </Reveal>

        {faqs.length === 0 ? (
          <p className={`${inter.className} text-center text-sm`} style={{ color: STONE }}>No FAQs published yet.</p>
        ) : (
          <div>
            {faqs.map((faq, i) => (
              <Reveal key={faq.id} delay={i * 0.04}>
                <div style={{ borderTop: i === 0 ? `1px solid ${HAIRLINE}` : "none", borderBottom: `1px solid ${HAIRLINE}` }}>
                  <button onClick={() => setOpen(open === i ? null : i)} className="w-full py-5 md:py-6 flex items-center justify-between gap-4 text-left">
                    <span className={`${inter.className} text-base md:text-lg font-medium`} style={{ color: INK }}>{faq.question}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-300" style={{ color: STONE, transform: open === i ? "rotate(180deg)" : "none" }} />
                  </button>
                  {open === i && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.25 }} className="pb-6 md:pb-7">
                      <div className={`${inter.className} text-sm md:text-base font-light leading-relaxed`} style={{ color: "#3C4650" }} dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </motion.div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================
// CLOSE — final call to action, one warm gold accent line as sign-off.
// ============================================================
function Close() {
  return (
    <section className="py-24 md:py-36 px-6 md:px-16 text-center" style={{ background: INK }}>
      <Reveal>
        <div className="h-px w-10 mx-auto mb-8" style={{ background: GOLD }} />
        <h2 className={`${display.className} text-white text-3xl md:text-5xl font-medium tracking-tight max-w-2xl mx-auto`}>
          Now you know who we are.
        </h2>
        <p className={`${inter.className} mt-4 text-white/50 font-light max-w-md mx-auto`}>
          Join Africa's leading youth agribusiness platform, or ask us anything else.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <Link href="/contact" className={`${inter.className} inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5`} style={{ background: BLUE, color: INK }}>
            Get in touch <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href="/sacco" className={`${inter.className} inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium border transition-colors hover:bg-white/10`} style={{ borderColor: "rgba(255,255,255,0.25)", color: PAPER }}>
            See YPA SACCO
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

// ============================================================
// PAGE
// ============================================================
export default function AboutPage() {
  const [content, setContent] = useState<any>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [a, f] = await Promise.all([getAboutContent(), getFAQs()]);
      setContent(a);
      setFaqs(f);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <main className={`${display.variable} ${inter.variable} min-h-screen bg-white`}>
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 rounded-full" style={{ borderColor: HAIRLINE, borderTopColor: BLUE }} />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className={`${display.variable} ${inter.variable} min-h-screen bg-white overflow-x-hidden font-sans`}>
      <Navigation />
      <Hero />
      <Story content={content} />
      <Scale />
      <Purpose content={content} />
      <Values />
      <Leadership />
      <Timeline />
      <Trust />
      <FAQ faqs={faqs} />
      <Close />
      <Footer />
    </main>
  );
}