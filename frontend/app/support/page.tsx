"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6 bg-[#0E2540]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white">Help Center</h1>
          <p className="text-white/60 mt-4 text-lg">Find answers and get support</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/support/category/general" className="p-6 border rounded-xl hover:shadow-lg transition bg-white">
            <h3 className="font-semibold text-lg">General Help</h3>
            <p className="text-gray-500 text-sm mt-1">Common questions and answers</p>
          </Link>
          <Link href="/support/category/membership" className="p-6 border rounded-xl hover:shadow-lg transition bg-white">
            <h3 className="font-semibold text-lg">Membership</h3>
            <p className="text-gray-500 text-sm mt-1">Join and manage your membership</p>
          </Link>
          <Link href="/support/category/programmes" className="p-6 border rounded-xl hover:shadow-lg transition bg-white">
            <h3 className="font-semibold text-lg">Programmes</h3>
            <p className="text-gray-500 text-sm mt-1">Goats, Maize, SACCO & more</p>
          </Link>
          <Link href="/support/category/payments" className="p-6 border rounded-xl hover:shadow-lg transition bg-white">
            <h3 className="font-semibold text-lg">Payments & Fees</h3>
            <p className="text-gray-500 text-sm mt-1">Billing and payments</p>
          </Link>
          <Link href="/support/category/security" className="p-6 border rounded-xl hover:shadow-lg transition bg-white">
            <h3 className="font-semibold text-lg">Security & Privacy</h3>
            <p className="text-gray-500 text-sm mt-1">Account security</p>
          </Link>
          <Link href="/support/category/technical" className="p-6 border rounded-xl hover:shadow-lg transition bg-white">
            <h3 className="font-semibold text-lg">Technical Support</h3>
            <p className="text-gray-500 text-sm mt-1">Website and app help</p>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}