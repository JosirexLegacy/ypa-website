"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, Inter } from "next/font/google";
import { motion, useInView, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import { ArrowUpRight, ChevronDown, ChevronRight, Target, Globe, Users, Clock, Heart, Handshake, MapPin, FileText, ShieldCheck, Plus } from "lucide-react";

// ============================================================
// FONTS — display + body only, used with restraint
// ============================================================
const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-inter" });

// ============================================================
// TOKENS
// ============================================================
const INK = "#0B0D0E";
const PAPER = "#FFFFFF";
const CLOUD = "#F5F6F7";
const STONE = "#68707A";
const HAIRLINE = "#E7E9EC";
const BLUE = "#00AEEF";
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
// Reveal — shared scroll-in primitive
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
  return <span className={`${inter.className} text-[11px] md:text-xs font-medium uppercase tracking-[0.18em]`} style={{ color: light ? "rgba(255,255,255,0.5)" : STONE }}>{children}</span>;
}

// ============================================================
// MorphButton — the button-level signature. Pill that expands on
// hover/tap to slide a second label into view. Used for every primary CTA.
// ============================================================
function MorphButton({ href, idleText, revealText, variant = "solid", icon: Icon = ArrowUpRight }: { href: string; idleText: string; revealText: string; variant?: "solid" | "outline"; icon?: any }) {
  const [hover, setHover] = useState(false);
  const solid = variant === "solid";
  return (
    <Link href={href} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)}>
      <motion.div
        className={`${inter.className} relative overflow-hidden inline-flex items-center h-12 rounded-full text-sm font-medium cursor-pointer select-none`}
        style={solid ? { background: PAPER, color: INK } : { border: "1px solid rgba(255,255,255,0.28)", color: PAPER }}
        animate={{ paddingLeft: 24, paddingRight: hover ? 20 : 24 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="relative h-5 overflow-hidden">
          <motion.span className="block" animate={{ y: hover ? -20 : 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            {idleText}
          </motion.span>
          <motion.span className="block absolute top-0 left-0 whitespace-nowrap" animate={{ y: hover ? 0 : 20 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            {revealText}
          </motion.span>
        </span>
        <motion.span className="ml-2 flex items-center" animate={{ rotate: hover ? 45 : 0, width: hover ? 18 : 16 }} transition={{ duration: 0.35 }}>
          <Icon className="h-4 w-4" />
        </motion.span>
      </motion.div>
    </Link>
  );
}

// ============================================================
// SectionNav — sticky scroll-spy pill bar. The "modern, navigable" element.
// Appears once the hero clears, tracks the active section, smooth-scrolls.
// ============================================================
const SECTIONS = [
  { id: "story", label: "Story" },
  { id: "people", label: "People" },
  { id: "purpose", label: "Purpose" },
  { id: "values", label: "Values" },
  { id: "timeline", label: "Timeline" },
  { id: "trust", label: "Trust" },
  { id: "faq", label: "FAQ" },
];

function SectionNav() {
  const [active, setActive] = useState("story");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const io1 = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting), { threshold: 0 });
    if (hero) io1.observe(hero);

    const observers = SECTIONS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(id); }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
      io.observe(el);
      return io;
    });
    return () => { io1.disconnect(); observers.forEach((o) => o?.disconnect()); };
  }, []);

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="hidden md:flex fixed top-20 left-1/2 -translate-x-1/2 z-40 items-center gap-0.5 p-1 rounded-full"
          style={{ background: "rgba(11,13,14,0.85)", backdropFilter: "blur(12px)" }}
        >
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => jump(s.id)}
              className={`${inter.className} relative px-4 py-2 text-xs font-medium rounded-full transition-colors`}
              style={{ color: active === s.id ? INK : "rgba(255,255,255,0.6)" }}
            >
              {active === s.id && (
                <motion.span layoutId="navpill" className="absolute inset-0 rounded-full" style={{ background: PAPER }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />
              )}
              <span className="relative z-10">{s.label}</span>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// HERO
// ============================================================
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const reduce = useReducedMotion();

  return (
    <section id="hero" ref={ref} className="relative h-[94vh] min-h-[580px] overflow-hidden" style={{ background: INK }}>
      <motion.div style={reduce ? {} : { y }} className="absolute inset-0">
        <img src="https://res.cloudinary.com/owwvyprb/image/upload/v1784726249/3P0D0002_tg15tl.jpg" alt="" className="w-full h-full object-cover scale-110" style={{ filter: "grayscale(0.35) brightness(0.42)" }} />
      </motion.div>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,13,14,0.15) 0%, rgba(11,13,14,0.78) 100%)" }} />

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
            <MorphButton href="#story" idleText="Our story" revealText="Scroll down" icon={ChevronDown} />
            <MorphButton href="#trust" idleText="Verify us" revealText="See the record" variant="outline" />
          </div>
        </Reveal>
      </motion.div>
    </section>
  );
}

// ============================================================
// STORY
// ============================================================
function Story({ content }: { content: any }) {
  return (
    <section id="story" className="py-24 md:py-36 px-6 md:px-16 scroll-mt-24" style={{ background: PAPER }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
        <Reveal>
          <div className={`${display.className} font-medium leading-none tracking-tight text-[20vw] sm:text-8xl lg:text-9xl`} style={{ color: INK }}>08</div>
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
                  <p>Youth Platform Africa began in 2008 as a village group of 21 people. By 2010 it had grown into a Community Based Organisation with 60 members, who formed the Board of Governors and management that still guide the organisation today.</p>
                  <p>As the work grew into international trade, we registered formally as BREC Youth Empowerment Africa Limited. Today YPA runs agribusiness and financial-inclusion programmes across 12 branches in Uganda, with international offices in Dubai and Zambia.</p>
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
// SCALE — count-up numbers, full-bleed dark
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
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * target));
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
      <div className={`${display.className} font-medium tracking-tight text-white text-[15vw] sm:text-7xl md:text-8xl`}>{n.toLocaleString()}{suffix}</div>
      <div className={`${inter.className} mt-3 text-sm md:text-base font-light text-white/50`}>{label}</div>
    </div>
  );
}

function Scale() {
  return (
    <section className="py-28 md:py-40 px-6 md:px-16" style={{ background: INK }}>
      <div className="max-w-5xl mx-auto text-center mb-16 md:mb-24">
        <Reveal><Kicker light>What we've built</Kicker></Reveal>
        <Reveal delay={0.08}><h2 className={`${display.className} text-white text-3xl md:text-5xl font-medium tracking-tight mt-3`}>The numbers, plainly.</h2></Reveal>
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
// LEADERSHIP — preview of 4, pulled (for now, hardcoded) from the team
// roster. Each card slides its bio up from the bottom on hover/tap —
// the "morph to reveal" interaction. "Meet the full team" leads to /team.
// ============================================================
interface Leader { role: string; name: string; bio: string; image: string }

// NOTE: hardcoded preview — keep this array in sync with the first 4
// entries on /team manually until that page has a shared data source.
const LEADERSHIP_PREVIEW: Leader[] = [
  { role: "Managing Director", name: "Obed Ben", bio: "Leads YPA's agribusiness strategy and community development work.", image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784716326/acc94e42-c5d5-489c-b335-6ee5353253be.jpg" },
  { role: "Executive Director", name: "JB Magezi", bio: "Drives YPA's expansion across Africa and its financial-inclusion programmes.", image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784716480/587e2393-e360-4ac2-bae3-22b7cec94705.jpg" },
  { role: "General Manager", name: "Charles Kalemera", bio: "Oversees day-to-day operations across all 12 branches.", image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784716382/5fd55b99-ec2f-4990-b3c7-8a5b69837aad.jpg" },
  { role: "Founding Member", name: "Name pending", bio: "Role summary and credentials to be added.", image: "https://res.cloudinary.com/owwvyprb/image/upload/v1784726254/3P0D0022_gqfkkg.jpg" },
];

function LeaderCard({ leader, index }: { leader: Leader; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={index * 0.06}>
      <div
        className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group"
        style={{ background: CLOUD }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        tabIndex={0}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <img src={leader.image} alt={leader.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: "50% 22%" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,13,14,0) 40%, rgba(11,13,14,0.88) 100%)" }} />

        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
          <div className={`${display.className} text-white text-base md:text-lg font-medium`}>{leader.name}</div>
          <div className={`${inter.className} text-xs md:text-sm text-white/60`}>{leader.role}</div>

          <motion.div
            initial={false}
            animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className={`${inter.className} text-xs md:text-sm font-light text-white/75 leading-relaxed pt-2`}>{leader.bio}</p>
          </motion.div>
        </div>

        <motion.div
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)" }}
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Plus className="h-3.5 w-3.5 text-white" />
        </motion.div>
      </div>
    </Reveal>
  );
}

function Leadership() {
  return (
    <section id="people" className="py-24 md:py-32 px-6 md:px-16 scroll-mt-24" style={{ background: PAPER }}>
      <div className="max-w-6xl mx-auto">
        <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-12 md:mb-16">
          <div>
            <Kicker>Governance</Kicker>
            <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: INK }}>Led by real people.</h2>
          </div>
          <MorphButton href="/team" idleText="Meet the full team" revealText="View all →" variant="outline" />
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {LEADERSHIP_PREVIEW.map((l, i) => <LeaderCard key={l.name} leader={l} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// PURPOSE — flip cards. Front is the label, click/tap flips to the
// full mission/vision statement. Cards live inside a shared border grid.
// ============================================================
function FlipCard({ icon: Icon, label, front, back }: { icon: any; label: string; front: string; back: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="p-10 md:p-14" style={{ background: PAPER }}>
      <div className="relative" style={{ perspective: 1200 }}>
        <motion.div
          className="relative cursor-pointer"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => setFlipped((f) => !f)}
        >
          <div style={{ backfaceVisibility: "hidden" }}>
            <Icon className="h-6 w-6" style={{ color: BLUE }} strokeWidth={1.5} />
            <Kicker><span className="mt-4 block">{label}</span></Kicker>
            <p className={`${display.className} mt-3 text-2xl md:text-3xl font-medium leading-[1.15] tracking-tight`} style={{ color: INK }}>{front}</p>
            <span className={`${inter.className} inline-flex items-center gap-1.5 mt-5 text-xs font-medium`} style={{ color: STONE }}>
              Tap to read the full statement <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <p className={`${inter.className} text-base md:text-lg font-light leading-relaxed`} style={{ color: "#3C4650" }} dangerouslySetInnerHTML={{ __html: back }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Purpose({ content }: { content: any }) {
  return (
    <section id="purpose" className="py-24 md:py-32 px-6 md:px-16 scroll-mt-24" style={{ background: PAPER }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-px" style={{ background: HAIRLINE }}>
        <FlipCard icon={Target} label="Mission" front="Economic empowerment, through agribusiness." back={content?.mission || "To economically empower individuals through agribusiness that competes internationally."} />
        <FlipCard icon={Globe} label="Vision" front="The greatest empowerment platform in Africa." back={content?.vision || "To be the greatest empowerment platform in Africa, and push back poverty with it."} />
      </div>
    </section>
  );
}

// ============================================================
// VALUES — expandable rows. Click a value to slide open supporting detail.
// ============================================================
const VALUES = [
  { text: "We walk in faith, guided by kindness, compassion and service.", detail: "Every branch decision starts from how it treats the people it touches, not just the numbers behind it.", icon: Heart },
  { text: "We are honest and transparent in everything we do.", detail: "Our registration, tax status and financials are published, not just claimed — see the Trust section below.", icon: ShieldCheck },
  { text: "We respect time — punctuality and efficiency matter.", detail: "Members and partners can expect commitments to be kept on the date they're made.", icon: Clock },
  { text: "We believe collaboration is key. Together, we achieve more.", detail: "From the original 21-person group to today's 12 branches, growth has always come through shared effort.", icon: Handshake },
  { text: "We build lasting connections between young Africans and their communities.", detail: "Our programmes are designed to stay rooted in the communities they start in, not extract from them.", icon: Users },
];

function ValueRow({ v, i }: { v: (typeof VALUES)[number]; i: number }) {
  const [open, setOpen] = useState(false);
  const Icon = v.icon;
  return (
    <Reveal delay={i * 0.05}>
      <div style={{ borderTop: i === 0 ? `1px solid ${HAIRLINE}` : "none", borderBottom: `1px solid ${HAIRLINE}` }}>
        <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-5 md:gap-8 py-6 md:py-7 text-left">
          <Icon className="h-5 w-5 md:h-6 md:w-6 shrink-0" style={{ color: BLUE }} strokeWidth={1.5} />
          <p className={`${inter.className} flex-1 text-base md:text-xl font-light leading-snug`} style={{ color: "#2A323B" }}>{v.text}</p>
          <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3 }} className="shrink-0">
            <Plus className="h-4 w-4 md:h-5 md:w-5" style={{ color: STONE }} />
          </motion.span>
        </button>
        <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
          <p className={`${inter.className} text-sm md:text-base font-light pb-6 md:pb-7 pl-10 md:pl-14 pr-8`} style={{ color: STONE }}>{v.detail}</p>
        </motion.div>
      </div>
    </Reveal>
  );
}

function Values() {
  return (
    <section id="values" className="py-24 md:py-32 px-6 md:px-16 scroll-mt-24" style={{ background: CLOUD }}>
      <div className="max-w-4xl mx-auto">
        <Reveal className="mb-12 md:mb-16">
          <Kicker>What we believe</Kicker>
          <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: INK }}>Five things we don't compromise on.</h2>
        </Reveal>
        <div>{VALUES.map((v, i) => <ValueRow key={i} v={v} i={i} />)}</div>
      </div>
    </section>
  );
}

// ============================================================
// TIMELINE — drag-scroll cards, click to expand the description
// ============================================================
const MILESTONES = [
  { year: "2008", label: "Founded as a village group", desc: "21 members started the journey that would become YPA." },
  { year: "2010", label: "Registered as a CBO", desc: "60 members formed the Board of Governors and management structure." },
  { year: "2015", label: "Expanded to 5 branches", desc: "Growth from a single office into a regional presence across Uganda." },
  { year: "2020", label: "Launched YPA SACCO", desc: "Formal savings and credit services became available to members." },
  { year: "2023", label: "Reached 100,000 goats", desc: "A major milestone for the organisation's agribusiness projects." },
  { year: "2025", label: "Opened Dubai & Zambia offices", desc: "The first step toward a genuinely Pan-African footprint." },
];

function TimelineCard({ m, i }: { m: (typeof MILESTONES)[number]; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={i * 0.05} className="shrink-0 snap-start w-[68vw] sm:w-[300px]">
      <button onClick={() => setOpen((o) => !o)} className="text-left w-full pt-6" style={{ borderTop: `2px solid ${i % 2 ? GOLD : BLUE}` }}>
        <div className={`${display.className} text-3xl md:text-4xl font-medium`} style={{ color: INK }}>{m.year}</div>
        <p className={`${inter.className} mt-2 text-sm md:text-base font-light leading-snug`} style={{ color: "#3C4650" }}>{m.label}</p>
        <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
          <p className={`${inter.className} text-xs md:text-sm font-light pt-2`} style={{ color: STONE }}>{m.desc}</p>
        </motion.div>
        <span className={`${inter.className} inline-flex items-center gap-1 mt-2 text-xs font-medium`} style={{ color: STONE }}>
          {open ? "Show less" : "Read more"} <motion.span animate={{ rotate: open ? 180 : 0 }}><ChevronDown className="h-3 w-3" /></motion.span>
        </span>
      </button>
    </Reveal>
  );
}

function Timeline() {
  return (
    <section id="timeline" className="py-24 md:py-32 pl-6 md:pl-16 scroll-mt-24" style={{ background: PAPER }}>
      <Reveal className="mb-12 md:mb-16 pr-6 md:pr-16">
        <Kicker>Timeline</Kicker>
        <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: INK }}>Year by year.</h2>
      </Reveal>
      <div className="flex gap-6 md:gap-8 overflow-x-auto pb-4 pr-6 md:pr-16 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]" style={{ scrollbarWidth: "none" }}>
        {MILESTONES.map((m, i) => <TimelineCard key={i} m={m} i={i} />)}
      </div>
    </section>
  );
}

// ============================================================
// TRUST — plain rows, one row expands to show a linked doc if present
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
    <section id="trust" className="py-24 md:py-32 px-6 md:px-16 scroll-mt-24" style={{ background: CLOUD }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
        <div>
          <Reveal>
            <Kicker>Due diligence</Kicker>
            <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: INK }}>The paperwork, on record.</h2>
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
            <p className={`${inter.className} text-sm italic mt-2`} style={{ color: STONE }}>Documents to be linked once available.</p>
          </Reveal>
        </div>
        <div>
          <Reveal delay={0.1}><Kicker>Find us</Kicker></Reveal>
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
// FAQ
// ============================================================
function FAQ({ faqs }: { faqs: any[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-24 md:py-32 px-6 md:px-16 scroll-mt-24" style={{ background: PAPER }}>
      <div className="max-w-3xl mx-auto">
        <Reveal className="mb-12 md:mb-16 text-center">
          <Kicker>FAQ</Kicker>
          <h2 className={`${display.className} text-3xl md:text-5xl font-medium tracking-tight mt-3`} style={{ color: INK }}>Common questions.</h2>
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
                    <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.3 }}><Plus className="h-5 w-5" style={{ color: STONE }} /></motion.span>
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
// CLOSE
// ============================================================
function Close() {
  return (
    <section className="py-24 md:py-36 px-6 md:px-16 text-center" style={{ background: INK }}>
      <Reveal>
        <div className="h-px w-10 mx-auto mb-8" style={{ background: GOLD }} />
        <h2 className={`${display.className} text-white text-3xl md:text-5xl font-medium tracking-tight max-w-2xl mx-auto`}>Now you know who we are.</h2>
        <p className={`${inter.className} mt-4 text-white/50 font-light max-w-md mx-auto`}>Join Africa's leading youth agribusiness platform, or ask us anything else.</p>
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <MorphButton href="/contact" idleText="Get in touch" revealText="Let's talk" />
          <MorphButton href="/sacco" idleText="See YPA SACCO" revealText="Explore →" variant="outline" icon={ChevronRight} />
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
      <SectionNav />
      <Hero />
      <Story content={content} />
      <Scale />
      <Leadership />
      <Purpose content={content} />
      <Values />
      <Timeline />
      <Trust />
      <FAQ faqs={faqs} />
      <Close />
      <Footer />
    </main>
  );
}