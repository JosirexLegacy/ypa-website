import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const BRANCHES = [
  { name: "Kampala Headquarters", region: "Central", address: "Plot 456, Lumumba Avenue" },
  { name: "Jinja Branch", region: "Eastern", address: "Plot 89, Main Street" },
  { name: "Mbale Branch", region: "Eastern", address: "Plot 123, Bungokho Road" },
  { name: "Gulu Branch", region: "Northern", address: "Plot 45, Gulu Main Road" },
  { name: "Mbarara Branch", region: "Western", address: "Plot 234, High Street" },
  { name: "Fort Portal Branch", region: "Western", address: "Plot 67, Rukungiri Road" },
  { name: "Masaka Branch", region: "Central", address: "Plot 89, Kampala Road" },
  { name: "Lira Branch", region: "Northern", address: "Plot 34, Obote Avenue" },
  { name: "Hoima Branch", region: "Western", address: "Plot 56, Main Street" },
  { name: "Tororo Branch", region: "Eastern", address: "Plot 78, Tororo-Kampala Road" },
  { name: "Entebbe Branch", region: "Central", address: "Plot 12, Airport Road" },
  { name: "Arua Branch", region: "Northern", address: "Plot 45, Avenue Road" },
];

export default function BranchesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-32 pb-12 px-6 bg-[#0E2540]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white">Find a YPA Branch</h1>
          <p className="text-white/60 mt-4 text-lg">12 locations across Uganda</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-4">
          {BRANCHES.map((branch, i) => (
            <div key={i} className="p-4 border rounded-xl bg-white">
              <h3 className="font-semibold">{branch.name}</h3>
              <p className="text-sm text-gray-500">{branch.region}</p>
              <p className="text-sm text-gray-600 mt-1">{branch.address}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/" className="text-[#00AEEF] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}