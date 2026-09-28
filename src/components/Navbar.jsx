import React from 'react';
import { Compass, Target, Trophy, Backpack, Store, PawPrint } from 'lucide-react';

export default function Navbar({ activeView, onNavigate }) {
  const navItems = [
    { id: 'aventura', label: 'Aventura', icon: <Compass className="w-6 h-6" /> },
    { id: 'misiones', label: 'Misiones', icon: <Target className="w-6 h-6" /> },
    { id: 'mascota', label: 'Mascota', icon: <PawPrint className="w-6 h-6" /> },
    { id: 'trofeos', label: 'Trofeos', icon: <Trophy className="w-6 h-6" /> },
    { id: 'mochila', label: 'Mochila', icon: <Backpack className="w-6 h-6" /> },
    { id: 'tienda', label: 'Tienda', icon: <Store className="w-6 h-6" /> },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-emerald-100 px-2 py-3 shadow-lg z-20">
      <div className="flex justify-around items-center max-w-xl mx-auto">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 cursor-pointer ${
                isActive ? 'text-emerald-600 scale-105' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`p-1.5 rounded-2xl transition-colors ${isActive ? 'bg-emerald-100 shadow-sm' : 'bg-transparent'}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}