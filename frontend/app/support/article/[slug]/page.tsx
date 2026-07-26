"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;

  const articleTitles: Record<string, string> = {
    "welcome-to-ypa-getting-started": "Welcome to YPA - Getting Started Guide",
  };

  const articleContent: Record<string, string> = {
    "welcome-to-ypa-getting-started": `
      <h2>Welcome to YPA!</h2>
      <p>Youth Platform Africa (YPA) is a Pan-African agribusiness organization.</p>
      <h3>What is YPA?</h3>
      <ul>
        <li><strong>130,000+</strong> goats under care</li>
        <li><strong>1,000+</strong> SACCO members</li>
        <li><strong>12</strong> branches across Uganda</li>
      </ul>
      <p>Contact us to learn more about our programmes.</p>
    `,
  };

  const title = articleTitles[slug] || "Support Article";
  const content = articleContent[slug] || "<p>Article content coming soon.</p>";

  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-32 pb-12 px-6 bg-[#0E2540]">
        <div className="max-w-3xl mx-auto">
          <Link href="/support" className="text-white/50 hover:text-white text-sm flex items-center gap-2 mb-4">
            ← Back to Support
          </Link>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        <div className="mt-8 pt-8 border-t text-center">
          <Link href="/support" className="text-[#00AEEF] hover:underline">
            ← Back to Support
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}