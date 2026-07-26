"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;

  const categoryNames: Record<string, string> = {
    general: "General Help",
    membership: "Membership",
    programmes: "Programmes",
    payments: "Payments & Fees",
    security: "Security & Privacy",
    technical: "Technical Support",
  };

  const categoryDescriptions: Record<string, string> = {
    general: "Common questions and answers about YPA",
    membership: "Join, renew, or manage your membership",
    programmes: "Goats, Maize, SACCO & more",
    payments: "Billing, payments, and refunds",
    security: "Account security and data privacy",
    technical: "Website, app, and technical issues",
  };

  const displayName = categoryNames[category] || category;
  const description = categoryDescriptions[category] || "Support articles";

  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-32 pb-12 px-6 bg-[#0E2540]">
        <div className="max-w-4xl mx-auto">
          <Link href="/support" className="text-white/50 hover:text-white text-sm flex items-center gap-2 mb-4">
            ← Back to Support
          </Link>
          <h1 className="text-3xl font-bold text-white">{displayName}</h1>
          <p className="text-white/60 mt-2">{description}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="p-8 border-2 border-dashed rounded-xl text-center text-gray-400 bg-gray-50">
          <p className="text-lg">📝 Articles coming soon</p>
          <p className="text-sm mt-2">Check back later for helpful articles in this category.</p>
          <Link href="/support" className="inline-block mt-4 text-[#00AEEF] hover:underline">
            Browse all categories →
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}