import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Building, Coffee, Landmark, Wrench, GraduationCap, ArrowRight } from 'lucide-react';

export default function SisterCompanies() {
  const companies = [
    {
      icon: Coffee,
      title: "Mbuzi Choma Restaurant",
      description: "Premium dining experience featuring authentic goat meat dishes and African cuisine.",
      href: "/sister-companies/mbuzi-choma"
    },
    {
      icon: Landmark,
      title: "YPA SACCO",
      description: "Member-owned savings and credit cooperative offering low-interest loans and financial literacy.",
      href: "/sister-companies/ypa-sacco"
    },
    {
      icon: Wrench,
      title: "YPA Machinery Hub",
      description: "One-stop center for agricultural machinery including silage balers, chaff cutters, and feed mixers.",
      href: "/sister-companies/machinery-hub"
    },
    {
      icon: GraduationCap,
      title: "Agribusiness School",
      description: "Training and capacity building for modern agribusiness practices and sustainable farming.",
      href: "/sister-companies/agribusiness-school"
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#F0F7FE] via-white to-[#E8F4FD]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-[#2196F3] font-medium text-sm uppercase tracking-wider">Sister Companies</span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A3A5C] mt-3 mb-4">
              Our <span className="text-[#2196F3]">Ecosystem</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Building a comprehensive agribusiness ecosystem across Africa
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {companies.map((company, i) => {
              const Icon = company.icon;
              return (
                <div 
                  key={i}
                  className="group bg-white p-8 rounded-3xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#E8F4FD]"
                >
                  <div className="w-16 h-16 bg-[#E3F2FD] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#2196F3] transition-all duration-300">
                    <Icon className="w-8 h-8 text-[#2196F3] group-hover:text-white transition-all duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A3A5C] mb-3 group-hover:text-[#2196F3] transition-colors">
                    {company.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed mb-4">{company.description}</p>
                  <Link 
                    href={company.href}
                    className="inline-flex items-center gap-2 text-[#2196F3] font-medium hover:gap-3 transition-all"
                  >
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}