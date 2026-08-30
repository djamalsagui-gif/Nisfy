import React from 'react';
import { SlidersHorizontal, MapPin, Users, GraduationCap, Calendar, HeartHandshake, Compass, Plane } from 'lucide-react';
import { WILAYAS_69 } from '../../data/wilayas';

interface FiltersProps {
  filters: {
    wilaya: string;
    ageMin: number;
    ageMax: number;
    gender: 'all' | 'men' | 'women';
    educationLevel: string;
    marriageTimeline?: string;
    familyOrigin?: string;
    relocation?: string;
  };
  onChange: (key: string, value: any) => void;
  onClose: () => void;
}

export function Filters({ filters, onChange, onClose }: FiltersProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-sm sm:items-center sm:justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 relative">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs py-1 z-10 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <SlidersHorizontal className="w-5 h-5 text-[#FF3823]" />
            <h2 className="text-xl font-bold">Filtres de recherche & Projet de vie</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>

        <div className="space-y-5">
          {/* Sexe */}
          <div className="space-y-2">
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
                  type="button"
                  onClick={() => onChange('gender', opt.id)}
                  className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    filters.gender === opt.id
                      ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Wilaya (69 Wilayas & Diaspora) */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-[#FF3823]" />
              Wilaya (69 Wilayas + Diaspora DZ)
            </label>
            <select
              value={filters.wilaya}
              onChange={(e) => onChange('wilaya', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#FF3823] outline-none"
            >
              <option value="all">Toutes les wilayas & Diaspora</option>
              <optgroup label="🇩🇿 Algérie (01 à 58)">
                {WILAYAS_69.filter(w => !w.isDiaspora).map(w => (
                  <option key={w.code} value={w.code}>{w.code} - {w.name} ({w.arabicName})</option>
                ))}
              </optgroup>
              <optgroup label="🌍 Diaspora Algérienne (59 à 69)">
                {WILAYAS_69.filter(w => w.isDiaspora).map(w => (
                  <option key={w.code} value={w.code}>{w.code} - {w.name} ({w.arabicName})</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Projet Mariage Timeline */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <HeartHandshake className="w-4 h-4 text-emerald-500" />
              Projet de vie & Délais mariage
            </label>
            <select
              value={filters.marriageTimeline || 'all'}
              onChange={(e) => onChange('marriageTimeline', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#FF3823] outline-none"
            >
              <option value="all">Tous les projets</option>
              <option value="immediat">💍 Immédiat (&lt; 6 mois)</option>
              <option value="1-an">💍 Dans l'année (1 an)</option>
              <option value="2-ans">💍 D'ici 2 ans</option>
              <option value="a_discuter">🤝 À discuter posément</option>
            </select>
          </div>

          {/* Origine culturelle */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <Compass className="w-4 h-4 text-amber-500" />
              Origine culturelle / Région
            </label>
            <select
              value={filters.familyOrigin || 'all'}
              onChange={(e) => onChange('familyOrigin', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#FF3823] outline-none"
            >
              <option value="all">Toutes origines algériennes</option>
              <option value="Kabyle">Kabyle (Tizi / Béjaïa / Bouira)</option>
              <option value="Chaoui">Chaoui (Batna / Khenchela / Oum El Bouaghi)</option>
              <option value="Algérois">Algérois / Mitidja</option>
              <option value="Oranais">Oranais / Ouest</option>
              <option value="Constantinois">Constantinois / Est</option>
              <option value="Sahraoui">Sahraoui / Sud (Ghardaïa / Ouargla / Biskra)</option>
              <option value="Chenoui">Chenoui (Tipaza / Cherchell)</option>
            </select>
          </div>

          {/* Mobilité / Déménagement */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <Plane className="w-4 h-4 text-sky-500" />
              Mobilité & Installation
            </label>
            <select
              value={filters.relocation || 'all'}
              onChange={(e) => onChange('relocation', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#FF3823] outline-none"
            >
              <option value="all">Indifférent</option>
              <option value="possible">Prêt(e) à déménager</option>
              <option value="dans_le_pays">Dans la même région / Wilaya</option>
              <option value="a_letranger">Prêt(e) pour l'étranger / Diaspora</option>
            </select>
          </div>

          {/* Âge */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-slate-400" />
                Tranche d'âge
              </label>
              <span className="text-sm font-black text-[#FF3823]">
                {filters.ageMin} - {filters.ageMax} ans
              </span>
            </div>
            <div className="flex gap-4">
              <input
                type="range"
                min="18"
                max="65"
                value={filters.ageMin}
                onChange={(e) => onChange('ageMin', parseInt(e.target.value))}
                className="w-full accent-[#FF3823]"
              />
              <input
                type="range"
                min="18"
                max="65"
                value={filters.ageMax}
                onChange={(e) => onChange('ageMax', parseInt(e.target.value))}
                className="w-full accent-[#FF3823]"
              />
            </div>
          </div>

          {/* Niveau d'études */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <GraduationCap className="w-4 h-4 text-slate-400" />
              Niveau d'études
            </label>
            <select
              value={filters.educationLevel}
              onChange={(e) => onChange('educationLevel', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#FF3823] outline-none"
            >
              <option value="all">Tous les niveaux</option>
              <option value="Universitaire">Universitaire (Master / Doctorat / Licence)</option>
              <option value="Secondaire">Secondaire / Lycée</option>
              <option value="Formation">Formation Professionnelle</option>
            </select>
          </div>
        </div>

        <button 
          type="button"
          onClick={onClose}
          className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white rounded-2xl font-black text-sm shadow-lg shadow-orange-500/25 active:scale-98 transition-transform cursor-pointer"
        >
          Appliquer les critères
        </button>
      </div>
    </div>
  );
}
