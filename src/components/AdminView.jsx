import React, { useState } from 'react';
import { ShieldAlert, BookOpen, Globe, LogOut } from 'lucide-react';
import MundoCompletoCrud from './admin/MundoCompletoCrud';

export default function AdminView({ onVolver, onIrAppPublica }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row w-full font-sans select-none relative">
      
      {/* Sidebar Lateral Fijo */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-5 md:p-6 shrink-0 shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xs font-black text-slate-900 tracking-wider uppercase">Aventurilandia</h1>
              <p className="text-[11px] font-bold text-indigo-600">Panel Docente v2.0</p>
            </div>
          </div>

          <nav className="space-y-1.5 pt-2">
            <div className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black bg-indigo-600 text-white shadow-md">
              <BookOpen className="w-4 h-4" /> Gestión de Mundos & Retos
            </div>
          </nav>
        </div>

        {/* Botones de acción inferiores restaurados */}
        <div className="pt-6 border-t border-slate-100 space-y-2.5">
          {onIrAppPublica && (
            <button
              onClick={onIrAppPublica}
              className="w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 border border-emerald-200 cursor-pointer shadow-xs"
            >
              <Globe className="w-4 h-4" /> Ver App Pública
            </button>
          )}
          <button
            onClick={onVolver}
            className="w-full py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 border border-rose-200 cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <MundoCompletoCrud />
        </div>
      </main>

    </div>
  );
}