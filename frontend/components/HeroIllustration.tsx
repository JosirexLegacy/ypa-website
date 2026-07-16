"use client";

export const HeroIllustration = () => {
  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
      <div className="relative w-full max-w-md aspect-square">
        {/* Background circle with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] rounded-full opacity-50"></div>
        <div className="absolute inset-4 bg-gradient-to-br from-[#2196F3]/10 to-[#64B5F6]/10 rounded-full backdrop-blur-sm"></div>
        
        {/* Main circle - Africa */}
        <div className="absolute inset-8 flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Continent silhouette */}
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Africa shape with gradient */}
              <defs>
                <linearGradient id="africaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2196F3" stopOpacity="0.3"/>
                  <stop offset="50%" stopColor="#64B5F6" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#1A3A5C" stopOpacity="0.1"/>
                </linearGradient>
                <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2196F3"/>
                  <stop offset="100%" stopColor="#64B5F6"/>
                </linearGradient>
              </defs>
              
              {/* Africa continent */}
              <path 
                d="M100,20 C80,20 60,40 55,60 C50,80 40,90 35,110 C30,130 35,150 45,165 C55,180 70,185 85,180 C100,175 115,170 125,160 C135,150 140,135 145,120 C150,105 155,90 150,75 C145,60 135,45 120,35 C110,28 105,20 100,20Z"
                fill="url(#africaGrad)"
                stroke="#2196F3"
                strokeWidth="1.5"
                className="animate-pulse"
              />
              
              {/* Map markers - showing YPA presence */}
              <circle cx="70" cy="80" r="4" fill="#2196F3" className="animate-bounce">
                <animate attributeName="r" from="4" to="8" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="80" cy="100" r="3" fill="#64B5F6" className="animate-pulse"/>
              <circle cx="100" cy="70" r="3" fill="#64B5F6" className="animate-pulse"/>
              
              {/* Leaf elements - Agriculture symbols */}
              <g transform="translate(130, 60) rotate(45)">
                <path d="M0,0 C5,-10 15,-15 20,-10 C25,-5 20,5 15,10 C10,15 5,10 0,0Z" fill="url(#leafGrad)" opacity="0.8"/>
              </g>
              <g transform="translate(140, 90) rotate(-30)">
                <path d="M0,0 C5,-10 15,-15 20,-10 C25,-5 20,5 15,10 C10,15 5,10 0,0Z" fill="url(#leafGrad)" opacity="0.6"/>
              </g>
              <g transform="translate(120, 110) rotate(15)">
                <path d="M0,0 C5,-10 15,-15 20,-10 C25,-5 20,5 15,10 C10,15 5,10 0,0Z" fill="url(#leafGrad)" opacity="0.7"/>
              </g>
            </svg>
            
            {/* Floating elements */}
            <div className="absolute top-0 right-0 animate-float">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-[#E3F2FD]">
                <span className="text-xs font-semibold text-[#2196F3]">🐐</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-0 animate-float-delayed">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-[#E3F2FD]">
                <span className="text-xs font-semibold text-[#2196F3]">🌽</span>
              </div>
            </div>
            <div className="absolute top-1/3 -right-2 animate-float">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-[#E3F2FD]">
                <span className="text-xs font-semibold text-[#2196F3]">🍯</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative rings */}
        <div className="absolute inset-0 rounded-full border border-[#2196F3]/10 animate-spin-slow"></div>
        <div className="absolute inset-8 rounded-full border border-[#2196F3]/5 animate-spin-slower"></div>
        
        {/* Floating dots */}
        <div className="absolute top-1/4 -left-2 w-2 h-2 bg-[#2196F3] rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 -right-1 w-1.5 h-1.5 bg-[#64B5F6] rounded-full animate-ping-delayed"></div>
        <div className="absolute top-1/2 left-0 w-1.5 h-1.5 bg-[#2196F3] rounded-full animate-ping-delayed-2"></div>
      </div>
    </div>
  );
};