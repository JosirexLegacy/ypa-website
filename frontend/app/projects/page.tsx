export default function ProjectsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F8FA]">
      <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md">
        <h1 className="text-3xl font-bold mb-4" style={{ color: "#00AEEF" }}>Our Projects</h1>
        <p className="text-gray-600 mb-6">Explore YPA's transformative agribusiness programmes.</p>
        <div className="flex flex-col gap-3">
          <a href="/projects/goats" className="text-[#00AEEF] hover:underline">Goats Programme</a>
          <a href="/projects/maize" className="text-[#00AEEF] hover:underline">Maize Contract Farming</a>
        </div>
        <a href="/" className="text-[#00AEEF] hover:underline font-medium block mt-4">? Back to Home</a>
      </div>
    </div>
  );
}
