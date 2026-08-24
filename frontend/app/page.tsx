import HomeClient from "@/components/HomeClient";

// ============================================================
// API BASE
// ============================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

// Revalidate the whole page's data every 60s (ISR) instead of the old
// cache: "no-store" everywhere, which forced every single visitor to
// wait on 5 fresh network round-trips to Directus/YouTube on every load.
const REVALIDATE_SECONDS = 60;

// ============================================================
// SERVER-SIDE DATA FETCHING (cached + revalidated, not "no-store")
// ============================================================
async function getPressCoverage() {
  try {
    const res = await fetch(`${API_URL}/items/press?sort[]=-date&limit=3`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching press:", error);
    return [];
  }
}

async function getEvents() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(
      `${API_URL}/items/events?filter[status][_eq]=upcoming&filter[date][_gte]=${today}&sort[]=date&limit=5`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

async function getBlogPosts() {
  try {
    const res = await fetch(
      `${API_URL}/items/posts?filter[status][_eq]=published&sort[]=-featured&sort[]=-published_at&limit=4`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
    if (!res.ok) {
      console.error("Failed to fetch blog posts:", res.status);
      return [];
    }
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

async function getSignalArticles() {
  try {
    const res = await fetch(
      `${API_URL}/items/signal_articles?filter[status][_eq]=published&sort[]=-date&limit=3`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
    if (!res.ok) {
      console.error("Failed to fetch signal articles:", res.status);
      return [];
    }
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching signal articles:", error);
    return [];
  }
}

const YPA_CHANNEL_HANDLE = "youthplatformafrica";

async function getChannelVideos(maxResults = 8) {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!apiKey) return [];
  try {
    const chRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${YPA_CHANNEL_HANDLE}&key=${apiKey}`,
      { next: { revalidate: 3600 } } // channel uploads don't need to be checked every minute
    );
    const chData = await chRes.json();
    const channelId = chData?.items?.[0]?.id;
    if (!channelId) return [];

    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=${maxResults}&type=video&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    const searchData = await searchRes.json();
    const items = searchData?.items || [];
    const palette = ["#00AEEF", "#F0B429", "#33C1F5", "#34D399"];

    return items
      .filter((it: any) => it?.id?.videoId)
      .map((item: any, idx: number) => ({
        id: `yt-${item.id.videoId}`,
        videoId: item.id.videoId,
        title: item.snippet.title,
        subtitle: item.snippet.channelTitle || "Youth Platform Africa",
        tag: "Latest",
        color: palette[idx % palette.length],
        location: "Uganda",
        stat: new Date(item.snippet.publishedAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        publishedAt: item.snippet.publishedAt,
      }));
  } catch (err) {
    console.error("Error fetching YPA channel videos:", err);
    return [];
  }
}

// ============================================================
// PAGE (Server Component) — data is fetched here, cached, and
// streamed straight into the client component as props. No more
// client-side spinner gating the whole page behind 5 fetches.
// ============================================================
export default async function Home() {
  const [press, events, blogs, signalArticles, channelVideos] = await Promise.all([
    getPressCoverage(),
    getEvents(),
    getBlogPosts(),
    getSignalArticles(),
    getChannelVideos(),
  ]);

  return (
    <HomeClient
      press={press}
      events={events}
      blogs={blogs}
      signalArticles={signalArticles}
      channelVideos={channelVideos}
    />
  );
}