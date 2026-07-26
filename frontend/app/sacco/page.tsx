import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function SaccoPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6 text-center bg-[#0E2540]">
        <h1 className="text-4xl font-bold text-white">YPA SACCO</h1>
        <p className="text-white/60 mt-4 text-lg">Your financial hub for agribusiness</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="p-8 border-2 border-dashed rounded-xl text-gray-400">
          <p className="text-lg">🏦 Coming Soon</p>
          <p className="mt-2">The SACCO portal is under development.</p>
          <Link href="/" className="inline-block mt-4 text-[#00AEEF] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}