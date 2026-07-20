// frontend/src/app/events/page.tsx

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { format, isPast, isToday, isFuture, differenceInDays, parseISO } from "date-fns";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Ticket,
  CheckCircle,
  Users,
  Sparkles,
  AlertCircle,
  ChevronDown,
  Filter,
} from "lucide-react";

// ============================================================
// FONTS (matches homepage)
// ============================================================
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

// ============================================================
// DESIGN TOKENS
// ============================================================
const BLUE = "#2196F3";
const SKY = "#7EC8FF";
const INK_ON_LIGHT = "#0E2540";
const MUTE_ON_LIGHT = "#5B6B7A";
const MIST = "#F6F8FA";

// ============================================================
// API BASE
// ============================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

// ============================================================
// EVENT TYPE OPTIONS (future-proof)
// ============================================================
const EVENT_TYPES = [
  { value: "all", label: "All Events" },
  { value: "workshop", label: "Workshop" },
  { value: "field_day", label: "Field Day" },
  { value: "training", label: "Training" },
  { value: "conference", label: "Conference" },
  { value: "networking", label: "Networking" },
  { value: "other", label: "Other" },
];

// ============================================================
// FETCH EVENTS (with revalidation and pagination support)
// ============================================================
async function getEvents(limit?: number, offset?: number, type?: string) {
  try {
    let url = `${API_URL}/items/events?sort[]=date`;
    if (type && type !== "all") {
      url += `&filter[type][_eq]=${type}`;
    }
    if (limit) {
      url += `&limit=${limit}`;
    }
    if (offset) {
      url += `&offset=${offset}`;
    }

    const res = await fetch(url, {
      cache: "force-cache",
      next: { revalidate: 60 }, // ISR – revalidate every 60 seconds
    });

    if (!res.ok) {
      console.error("Failed to fetch events:", res.status);
      return [];
    }
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

// ============================================================
// EVENT STATUS LOGIC (enhanced)
// ============================================================
type EventStatus = "upcoming" | "today" | "past";

function getEventStatus(eventDate: string, eventStatus?: string): EventStatus {
  const date = parseISO(eventDate);
  const now = new Date();

  if (eventStatus === "past") return "past";
  if (isToday(date)) return "today";
  if (isFuture(date)) return "upcoming";
  return "past";
}

// ============================================================
// RELATIVE DATE LABEL
// ============================================================
function getRelativeDateInfo(eventDate: string) {
  const date = parseISO(eventDate);
  const now = new Date();
  const daysUntil = differenceInDays(date, now);

  if (isToday(date)) return { label: "Today", className: "bg-green-100 text-green-700" };
  if (daysUntil === 1) return { label: "Tomorrow", className: "bg-blue-100 text-blue-700" };
  if (daysUntil > 1 && daysUntil <= 7) return { label: `In ${daysUntil} days`, className: "bg-blue-50 text-blue-600" };
  if (isPast(date)) return { label: "Past", className: "bg-gray-100 text-gray-500" };
  return { label: format(date, "MMM d, yyyy"), className: "bg-gray-50 text-gray-500" };
}

// ============================================================
// MAIN PAGE COMPONENT (Server Component)
// ============================================================
interface EventsPageProps {
  searchParams?: {
    type?: string;
    page?: string;
  };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const type = searchParams?.type || "all";
  const page = parseInt(searchParams?.page || "1", 10);
  const limit = 12; // events per page
  const offset = (page - 1) * limit;

  // Fetch events – we fetch all to compute featured and pagination, but we can optimize later
  const allEvents = await getEvents(undefined, undefined, type === "all" ? undefined : type);

  // Auto-determine status for each event
  const processedEvents = allEvents.map((event: any) => {
    const autoStatus = getEventStatus(event.date, event.status);
    return {
      ...event,
      autoStatus,
      isFeatured: event.featured === true && autoStatus !== "past",
    };
  });

  // Separate upcoming and past
  const upcomingEvents = processedEvents.filter(
    (e: any) => e.autoStatus === "upcoming" || e.autoStatus === "today"
  );
  const pastEvents = processedEvents.filter((e: any) => e.autoStatus === "past");

  // Featured event: closest upcoming (by date) or first upcoming
  const featuredEvent =
    upcomingEvents.find((e: any) => e.isFeatured) ||
    upcomingEvents.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ||
    null;

  // Paginate upcoming events for the current page
  const paginatedUpcoming = upcomingEvents.slice(offset, offset + limit);
  const totalUpcoming = upcomingEvents.length;
  const totalPages = Math.ceil(totalUpcoming / limit);

  return (
    <main
      className={`${display.variable} ${mono.variable} min-h-screen bg-white font-sans antialiased selection:bg-[#2196F3]/30`}
    >
      <Navigation />

      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden bg-gradient-to-b from-[#F8FBFF] via-white to-white">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: `${BLUE}08` }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: `${SKY}08` }}
        />

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div
                className={`${mono.className} flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase mb-3`}
                style={{ color: MUTE_ON_LIGHT }}
              >
                <Calendar className="w-3.5 h-3.5" />
                Events
              </div>
              <h1
                className={`${display.className} text-4xl md:text-5xl font-medium tracking-tight`}
                style={{ color: INK_ON_LIGHT }}
              >
                Upcoming <span style={{ color: BLUE }}>Events</span>
              </h1>
              <p className="text-sm mt-2" style={{ color: MUTE_ON_LIGHT }}>
                Join us at our events across Uganda and beyond
              </p>
            </div>
            <div
              className={`${mono.className} flex items-center gap-4 text-[11px] bg-white px-4 py-2 rounded-full border shadow-sm`}
              style={{ borderColor: "#E8ECF0" }}
            >
              <span className="flex items-center gap-1.5" style={{ color: MUTE_ON_LIGHT }}>
                <Sparkles className="w-4 h-4" style={{ color: BLUE }} />
                {upcomingEvents.length} upcoming
              </span>
              <span className="w-px h-4" style={{ background: "#E8ECF0" }} />
              <span className="flex items-center gap-1.5" style={{ color: MUTE_ON_LIGHT }}>
                <CheckCircle className="w-4 h-4" style={{ color: MUTE_ON_LIGHT }} />
                {pastEvents.length} past
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TYPE FILTER (future-proof) ===== */}
      <section className="sticky top-20 z-30 bg-white/80 backdrop-blur-md border-b px-6 py-4" style={{ borderColor: "#E8ECF0" }}>
        <div className="container mx-auto max-w-5xl flex flex-wrap items-center gap-3">
          <Filter className="w-4 h-4" style={{ color: MUTE_ON_LIGHT }} />
          <span className={`${mono.className} text-[11px] tracking-[0.1em] uppercase mr-1`} style={{ color: MUTE_ON_LIGHT }}>
            Filter by type:
          </span>
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map((t) => (
              <Link
                key={t.value}
                href={`/events${t.value !== "all" ? `?type=${t.value}` : ""}`}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  type === t.value
                    ? "bg-[#2196F3] text-white shadow-md shadow-[#2196F3]/25"
                    : "hover:bg-[#F8FBFF] border border-transparent hover:border-[#E8ECF0]"
                }`}
                style={type === t.value ? {} : { color: INK_ON_LIGHT }}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED EVENT ===== */}
      {featuredEvent && (
        <section className="px-6 -mt-8">
          <div className="container mx-auto max-w-5xl">
            <div
              className="relative rounded-3xl overflow-hidden shadow-xl"
              style={{ background: `linear-gradient(135deg, ${INK_ON_LIGHT}, ${BLUE})` }}
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              </div>

              <div className="relative p-8 md:p-10 text-white">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`${mono.className} px-3 py-1 text-[10px] tracking-[0.1em] uppercase bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center gap-1`}
                      >
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </span>
                      <span
                        className={`${mono.className} px-3 py-1 text-[10px] tracking-[0.1em] uppercase backdrop-blur-sm rounded-full ${
                          featuredEvent.autoStatus === "today"
                            ? "bg-green-400/20 text-green-300"
                            : "bg-blue-400/20 text-blue-300"
                        }`}
                      >
                        {featuredEvent.autoStatus === "today" ? "🎉 Today" : "Upcoming"}
                      </span>
                    </div>
                    <h2 className={`${display.className} text-2xl md:text-3xl lg:text-4xl font-medium`}>
                      {featuredEvent.title}
                    </h2>
                    <p className="text-white/70 text-sm leading-relaxed max-w-xl">
                      {featuredEvent.description
                        ? featuredEvent.description.replace(/<[^>]*>/g, "")
                        : "Join us for this event…"}
                    </p>
                    <div className={`${mono.className} flex flex-wrap items-center gap-4 text-[11px] text-white/60`}>
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {format(parseISO(featuredEvent.date), "MMMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {featuredEvent.time || "TBD"}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {featuredEvent.location}
                      </span>
                    </div>
                  </div>
                  <div>
                    {featuredEvent.registration_link ? (
                      <Link
                        href={featuredEvent.registration_link}
                        target="_blank"
                        className="inline-flex items-center gap-2 bg-white text-[#0E2540] px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 hover:shadow-xl"
                      >
                        Register Now
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <span
                        className={`${mono.className} inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/70 px-6 py-3 rounded-xl border border-white/10 text-[11px] tracking-[0.1em] uppercase`}
                      >
                        <Ticket className="w-4 h-4" />
                        Opening soon
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== UPCOMING EVENTS GRID ===== */}
      <section className="px-6 py-16">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-6 rounded-full" style={{ background: BLUE }} />
            <h2 className={`${display.className} text-2xl font-medium`} style={{ color: INK_ON_LIGHT }}>
              All Upcoming Events
            </h2>
            <span className={`${mono.className} text-[11px]`} style={{ color: MUTE_ON_LIGHT }}>
              ({totalUpcoming})
            </span>
          </div>

          {paginatedUpcoming.length === 0 ? (
            <div className="text-center py-20 border rounded-3xl" style={{ borderColor: "#E8ECF0", background: MIST }}>
              <div className="text-6xl mb-4 opacity-30">📅</div>
              <h3 className={`${display.className} text-xl font-medium`} style={{ color: INK_ON_LIGHT }}>
                No upcoming events
              </h3>
              <p className="text-sm mt-1" style={{ color: MUTE_ON_LIGHT }}>
                Check back soon for new events
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {paginatedUpcoming.map((event: any) => {
                  const isFeatured = event.isFeatured && event.id === featuredEvent?.id;
                  const dateInfo = getRelativeDateInfo(event.date);

                  return (
                    <div
                      key={event.id}
                      className={`group bg-white rounded-3xl overflow-hidden border transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                        isFeatured ? "border-[#2196F3]/30 shadow-md" : "border-[#E8ECF0]"
                      } ${event.autoStatus === "today" ? "ring-2 ring-green-400/30" : ""}`}
                    >
                      <div className="relative h-48 bg-[#F5F9FF] overflow-hidden">
                        {event.image ? (
                          <img
                            src={`${API_URL}/assets/${event.image}`}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB]">
                            📅
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex gap-2">
                          {isFeatured && (
                            <span
                              className={`${mono.className} px-2.5 py-1 text-[10px] tracking-[0.1em] uppercase bg-[#2196F3] text-white rounded-full shadow-md flex items-center gap-1`}
                              style={{ boxShadow: `0 4px 12px ${BLUE}44` }}
                            >
                              <Sparkles className="w-3 h-3" />
                              Featured
                            </span>
                          )}
                          <span
                            className={`${mono.className} px-2.5 py-1 text-[10px] tracking-[0.1em] uppercase rounded-full shadow-md ${
                              event.autoStatus === "today"
                                ? "bg-green-500 text-white"
                                : "bg-blue-500 text-white"
                            }`}
                          >
                            {event.autoStatus === "today" ? "🎉 Today" : "Upcoming"}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <span
                            className={`${mono.className} px-2.5 py-1 text-[10px] tracking-[0.1em] uppercase rounded-full backdrop-blur-sm ${
                              event.autoStatus === "today"
                                ? "bg-white/90 text-green-700"
                                : "bg-white/90 text-[#0E2540]"
                            }`}
                          >
                            {dateInfo.label}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 space-y-3">
                        <div className={`${mono.className} flex items-center gap-4 text-[11px]`} style={{ color: MUTE_ON_LIGHT }}>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" style={{ color: BLUE }} />
                            {format(parseISO(event.date), "MMM d, yyyy")}
                          </span>
                          <span className="w-1 h-1 rounded-full" style={{ background: "#D1D9E0" }} />
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" style={{ color: BLUE }} />
                            {event.time || "TBD"}
                          </span>
                        </div>
                        <h3
                          className={`${display.className} text-xl font-medium group-hover:text-[#2196F3] transition-colors leading-tight`}
                          style={{ color: INK_ON_LIGHT }}
                        >
                          {event.title}
                        </h3>
                        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: MUTE_ON_LIGHT }}>
                          {event.description ? event.description.replace(/<[^>]*>/g, "") : "Join us for this event…"}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <span
                            className={`${mono.className} flex items-center gap-1.5 text-[11px]`}
                            style={{ color: MUTE_ON_LIGHT }}
                          >
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </span>
                          {event.registration_link ? (
                            <Link
                              href={event.registration_link}
                              target="_blank"
                              className={`${mono.className} inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all`}
                              style={{ color: BLUE }}
                            >
                              Register <ArrowRight className="w-4 h-4" />
                            </Link>
                          ) : (
                            <span
                              className={`${mono.className} text-[11px] flex items-center gap-1`}
                              style={{ color: MUTE_ON_LIGHT }}
                            >
                              <Ticket className="w-4 h-4" />
                              Soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ===== PAGINATION ===== */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/events?type=${type}&page=${p}`}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                        p === page
                          ? "bg-[#2196F3] text-white shadow-md shadow-[#2196F3]/25"
                          : "text-[#0E2540] hover:bg-[#2196F3]/10 border border-transparent hover:border-[#2196F3]/20"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ===== PAST EVENTS (collapsible) ===== */}
      {pastEvents.length > 0 && (
        <section className="px-6 py-16 border-t" style={{ borderColor: "#E8ECF0", background: MIST }}>
          <div className="container mx-auto max-w-5xl">
            <details className="group">
              <summary className="flex items-center gap-3 cursor-pointer list-none">
                <div className="w-1 h-6 rounded-full" style={{ background: MUTE_ON_LIGHT }} />
                <h2 className={`${display.className} text-2xl font-medium`} style={{ color: INK_ON_LIGHT }}>
                  Past Events
                </h2>
                <span className={`${mono.className} text-[11px]`} style={{ color: MUTE_ON_LIGHT }}>
                  ({pastEvents.length})
                </span>
                <ChevronDown
                  className="w-5 h-5 ml-auto transition-transform group-open:rotate-180"
                  style={{ color: MUTE_ON_LIGHT }}
                />
              </summary>

              <div className="mt-6 grid md:grid-cols-3 gap-6">
                {pastEvents.map((event: any) => (
                  <div
                    key={event.id}
                    className="bg-white p-6 rounded-2xl border opacity-80 hover:opacity-100 hover:shadow-md transition-all"
                    style={{ borderColor: "#E8ECF0" }}
                  >
                    <div className={`${mono.className} flex items-center gap-3 text-[11px] mb-3`} style={{ color: MUTE_ON_LIGHT }}>
                      <Calendar className="w-4 h-4" />
                      {format(parseISO(event.date), "MMM d, yyyy")}
                    </div>
                    <h4 className={`${display.className} text-lg font-medium mb-1`} style={{ color: INK_ON_LIGHT }}>
                      {event.title}
                    </h4>
                    <p className={`${mono.className} text-[11px] flex items-center gap-1.5`} style={{ color: MUTE_ON_LIGHT }}>
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </p>
                    <span
                      className={`${mono.className} inline-block mt-3 px-3 py-1 text-[10px] tracking-[0.1em] uppercase rounded-full bg-gray-100 text-gray-500`}
                    >
                      Past Event
                    </span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section className="px-6 py-20 border-t" style={{ borderColor: "#E8ECF0", background: "white" }}>
        <div className="container mx-auto max-w-3xl text-center">
          <div
            className="rounded-3xl p-10 border"
            style={{ borderColor: "#E8ECF0", background: MIST }}
          >
            <h3 className={`${display.className} text-xl font-medium`} style={{ color: INK_ON_LIGHT }}>
              Host an event with YPA?
            </h3>
            <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: MUTE_ON_LIGHT }}>
              We're always looking for partners and sponsors for our events across Africa.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 mt-5 font-medium text-sm hover:gap-3 transition-all"
              style={{ color: BLUE }}
            >
              Partner with us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
