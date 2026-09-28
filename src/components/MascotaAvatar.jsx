import React from 'react';

export default function MascotaAvatar({ especie = 'fox', accesorio = 'ninguno', isJumping = false }) {
  
  // Renderizado vectorial según la especie
  const renderCuerpoEspecie = () => {
    switch (especie) {
      case 'panda':
        return (
          <g>
            {/* Orejas */}
            <circle cx="35" cy="45" r="22" fill="#1e293b" />
            <circle cx="165" cy="45" r="22" fill="#1e293b" />
            {/* Cabeza */}
            <circle cx="100" cy="95" r="65" fill="#f8fafc" stroke="#1e293b" strokeWidth="6" />
            {/* Manchas en los ojos */}
            <ellipse cx="75" cy="85" rx="18" ry="24" fill="#1e293b" transform="rotate(-15 75 85)" />
            <ellipse cx="125" cy="85" rx="18" ry="24" fill="#1e293b" transform="rotate(15 125 85)" />
            {/* Ojos brillantes */}
            <circle cx="78" cy="82" r="6" fill="#ffffff" />
            <circle cx="122" cy="82" r="6" fill="#ffffff" />
            {/* Nariz y hocico */}
            <ellipse cx="100" cy="105" rx="12" ry="8" fill="#1e293b" />
            <path d="M 94 115 Q 100 125 106 115" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'unicorn':
        return (
          <g>
            {/* Cuerno mágico */}
            <polygon points="100,5 88,45 112,45" fill="url(#gradCuerno)" />
            {/* Orejas */}
            <path d="M 40 60 Q 30 20 60 45 Z" fill="#f472b6" stroke="#db2777" strokeWidth="4" />
            <path d="M 160 60 Q 170 20 140 45 Z" fill="#f472b6" stroke="#db2777" strokeWidth="4" />
            {/* Cabeza */}
            <ellipse cx="100" cy="100" rx="55" ry="60" fill="#fbcfe8" stroke="#db2777" strokeWidth="6" />
            {/* Hocico */}
            <ellipse cx="100" cy="125" rx="35" ry="22" fill="#fce7f3" />
            <circle cx="90" cy="122" r="4" fill="#db2777" />
            <circle cx="110" cy="122" r="4" fill="#db2777" />
            {/* Ojos soñadores */}
            <path d="M 70 90 Q 80 100 90 90" stroke="#db2777" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 110 90 Q 120 100 130 90" stroke="#db2777" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'dragon':
        return (
          <g>
            {/* Cuernitos / Cresta */}
            <polygon points="80,45 70,20 90,35" fill="#047857" />
            <polygon points="120,45 130,20 110,35" fill="#047857" />
            {/* Cabeza */}
            <path d="M 45 95 C 45 50 155 50 155 95 C 155 135 120 145 100 145 C 80 145 45 135 45 95 Z" fill="#10b981" stroke="#047857" strokeWidth="6" />
            {/* Hocico de dragón */}
            <ellipse cx="100" cy="120" rx="40" ry="25" fill="#34d399" />
            <circle cx="85" cy="115" r="5" fill="#065f46" />
            <circle cx="115" cy="115" r="5" fill="#065f46" />
            {/* Ojos felinos */}
            <ellipse cx="75" cy="85" rx="10" ry="14" fill="#fde047" />
            <ellipse cx="75" cy="85" rx="4" ry="9" fill="#000000" />
            <ellipse cx="125" cy="85" rx="10" ry="14" fill="#fde047" />
            <ellipse cx="125" cy="85" rx="4" ry="9" fill="#000000" />
          </g>
        );

      case 'fox':
      default:
        return (
          <g>
            {/* Orejas de zorro */}
            <polygon points="45,65 30,15 75,45" fill="#d97706" stroke="#b45309" strokeWidth="4" strokeLinejoin="round" />
            <polygon points="50,55 40,25 65,42" fill="#fef3c7" />
            <polygon points="155,65 170,15 125,45" fill="#d97706" stroke="#b45309" strokeWidth="4" strokeLinejoin="round" />
            <polygon points="150,55 160,25 135,42" fill="#fef3c7" />
            
            {/* Cabeza base (forma de diamante / zorro) */}
            <polygon points="100,150 45,85 155,85" fill="#f59e0b" stroke="#b45309" strokeWidth="6" strokeLinejoin="round" />
            
            {/* Parte blanca inferior de la cara */}
            <path d="M 45 85 L 100 150 L 155 85 Q 140 130 100 135 Q 60 130 45 85 Z" fill="#fffbeb" />
            
            {/* Nariz */}
            <polygon points="100,118 92,108 108,108" fill="#1e293b" />
            
            {/* Ojos tiernos */}
            <circle cx="75" cy="78" r="7" fill="#1e293b" />
            <circle cx="73" cy="76" r="2.5" fill="#ffffff" />
            <circle cx="125" cy="78" r="7" fill="#1e293b" />
            <circle cx="123" cy="76" r="2.5" fill="#ffffff" />
          </g>
        );
    }
  };

  // Renderizado de accesorios vectoriales sobre la mascota
  const renderAccesorio = () => {
    switch (accesorio) {
      case 'sombrero':
        return (
          <g transform="translate(0, -15)">
            {/* Sombrero de aventurero */}
            <ellipse cx="100" cy="35" rx="55" ry="12" fill="#78350f" stroke="#451a03" strokeWidth="3" />
            <path d="M 70 35 L 75 -5 Q 100 -15 125 -5 L 130 35 Z" fill="#92400e" stroke="#451a03" strokeWidth="3" />
            <rect x="73" y="22" width="54" height="8" rx="3" fill="#b91c1c" />
          </g>
        );

      case 'capa':
        return (
          <g transform="translate(0, 10)">
            {/* Capa de héroe ondeando */}
            <path d="M 65 120 Q 100 140 135 120 L 155 185 Q 100 195 45 185 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="4" />
            <path d="M 85 122 Q 100 132 115 122" stroke="#fbbf24" strokeWidth="4" fill="none" />
          </g>
        );

      case 'lentes':
        return (
          <g transform="translate(0, -5)">
            {/* Lentes de sabio */}
            <rect x="62" y="70" width="28" height="20" rx="6" fill="none" stroke="#1e293b" strokeWidth="4" />
            <rect x="110" y="70" width="28" height="20" rx="6" fill="none" stroke="#1e293b" strokeWidth="4" />
            <line x1="90" y1="80" x2="110" y2="80" stroke="#1e293b" strokeWidth="4" />
          </g>
        );

      case 'ninguno':
      default:
        return null;
    }
  };

  return (
    <div className={`relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center transition-transform duration-300 ${isJumping ? '-translate-y-6 scale-110 rotate-3' : 'hover:scale-105'}`}>
      
      {/* Resplandor mágico de fondo */}
      <div className="absolute inset-0 bg-white/20 rounded-full blur-xl pointer-events-none animate-pulse"></div>

      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl overflow-visible">
        <defs>
          <linearGradient id="gradCuerno" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Cuerpo / Personaje */}
        {renderCuerpoEspecie()}

        {/* Accesorio / Ropa */}
        {renderAccesorio()}
      </svg>
    </div>
  );
}