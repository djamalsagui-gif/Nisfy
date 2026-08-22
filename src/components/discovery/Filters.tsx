import React from 'react';
import { SlidersHorizontal, MapPin, Users, GraduationCap, Calendar } from 'lucide-react';
import { WILAYAS_69 } from '../../data/wilayas';

interface FiltersProps {
  filters: {
    wilaya: string;
    ageMin: number;
    ageMax: number;
    gender: 'all' | 'men' | 'women';
    educationLevel: string;
  };
  onChange: (key: string, value: any) => void;
  onClose: () => void;
}

export function Filters({ filters, onChange, onClose }: FiltersProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-sm sm:items-center sm:justify-center">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <SlidersHorizontal className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl font-bold">Filtres de recherche</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors"
          >
            Fermer
          </button>
        </div>

        <div className="space-y-6">
          {/* Sexe */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <Users className="w-4 h-4 text-slate-400" />
              Sexe recherché
            </label>
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'women', label: 'Femmes' },
                { id: 'men', label: 'Hommes' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => onChange('gender', opt.id)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                    filters.gender === opt.id
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Wilaya */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-slate-400" />
              Wilaya (69 Wilayas)
            </label>
            <select
              value={filters.wilaya}
              onChange={(e) => onChange('wilaya', e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none"
            >
              <option value="all">Toutes les wilayas</option>
              {WILAYAS_69.map(w => (
                <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
              ))}
            </select>
          </div>

          {/* Âge */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-slate-400" />
                Tranche d'âge
              </label>
              <span className="text-sm font-bold text-rose-500">
                {filters.ageMin} - {filters.ageMax} ans
              </span>
            </div>
            <div className="flex gap-4">
              <input
                type="range"
                min="18"
                max="99"
                value={filters.ageMin}
                onChange={(e) => onChange('ageMin', parseInt(e.target.value))}
                className="w-full accent-rose-500"
              />
              <input
                type="range"
                min="18"
                max="99"
                value={filters.ageMax}
                onChange={(e) => onChange('ageMax', parseInt(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
          </div>

          {/* Niveau d'études */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <GraduationCap className="w-4 h-4 text-slate-400" />
              Niveau d'études
            </label>
            <select
              value={filters.educationLevel}
              onChange={(e) => onChange('educationLevel', e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none"
            >
              <option value="all">Tous les niveaux</option>
              <option value="Universitaire">Universitaire</option>
              <option value="Secondaire">Secondaire</option>
              <option value="Moyen">Moyen</option>
              <option value="Primaire">Primaire</option>
            </select>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-8 py-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl font-bold shadow-lg shadow-rose-500/20 active:scale-95 transition-transform"
        >
          Appliquer les filtres
        </button>
      </div>
    </div>
  );
}
