import React, { useState, useMemo } from 'react';
import {
  Store,
  Star,
  MapPin,
  Phone,
  Instagram,
  CheckCircle2,
  Filter,
  Search,
  PlusCircle,
  Calculator,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Send,
  X,
  FileText,
  DollarSign,
} from 'lucide-react';
import { INITIAL_WEDDING_VENDORS } from '../data/weddingVendorsData';
import { WeddingVendor, WeddingVendorCategory } from '../types';
import { WILAYAS_LIST } from '../data/wilayas';

const CATEGORY_ITEMS: { id: WeddingVendorCategory | 'all'; labelFr: string; labelAr: string; icon: string }[] = [
  { id: 'all', labelFr: 'Tous les Prestataires', labelAr: 'كل الخدمات', icon: '✨' },
  { id: 'salle_fetes', labelFr: 'Salles des Fêtes', labelAr: 'قاعات الحفلات', icon: '🏰' },
  { id: 'neggafa_tenues', labelFr: 'Neggafa & Tenues', labelAr: 'نكافة وأزياء تقليدية', icon: '👑' },
  { id: 'photographe_video', labelFr: 'Photographes & Vidéo', labelAr: 'تصوير فوتوغرافي وفيديو', icon: '📸' },
  { id: 'traiteur_repas', labelFr: 'Traiteurs & Repas', labelAr: 'متعهدو ولائم وحفلات', icon: '🍲' },
  { id: 'patisserie_gateaux', labelFr: 'Pâtisseries & Gâteaux', labelAr: 'حلويات الأعراس', icon: '🍯' },
  { id: 'zorna_orchestre', labelFr: 'Zorna & Orchestres', labelAr: 'زرنة وفرق موسيقية', icon: '🎺' },
  { id: 'voyage_noces', labelFr: 'Lune de Miel & Voyages', labelAr: 'شهر العسل والسياحة', icon: '✈️' },
];

export const WeddingMarketplaceView: React.FC = () => {
  const [vendors, setVendors] = useState<WeddingVendor[]>(INITIAL_WEDDING_VENDORS);
  const [selectedCategory, setSelectedCategory] = useState<WeddingVendorCategory | 'all'>('all');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected vendor for modal
  const [activeVendor, setActiveVendor] = useState<WeddingVendor | null>(null);

  // Quote & Budget Simulator Modal
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [quoteSuccess, setQuoteSuccess] = useState<boolean>(false);
  const [guestCount, setGuestCount] = useState<number>(200);
  const [includeTenues, setIncludeTenues] = useState<boolean>(true);
  const [includePhoto, setIncludePhoto] = useState<boolean>(true);
  const [includeGateaux, setIncludeGateaux] = useState<boolean>(true);
  const [includeZorna, setIncludeZorna] = useState<boolean>(false);

  // Filtered vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      if (selectedCategory !== 'all' && vendor.category !== selectedCategory) {
        return false;
      }
      if (selectedWilaya !== 'all' && vendor.wilayaCode !== selectedWilaya) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = vendor.name.toLowerCase().includes(q);
        const matchesWilaya = vendor.wilayaName.toLowerCase().includes(q);
        const matchesDesc = vendor.descriptionFr.toLowerCase().includes(q);
        const matchesServices = vendor.services.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesWilaya && !matchesDesc && !matchesServices) {
          return false;
        }
      }
      return true;
    });
  }, [vendors, selectedCategory, selectedWilaya, searchQuery]);

  // Budget calculation in DZD
  const estimatedBudgetDZD = useMemo(() => {
    let total = 250000; // base venue estimate
    total += guestCount * 1400; // repas
    if (includeTenues) total += 60000;
    if (includePhoto) total += 70000;
    if (includeGateaux) total += guestCount * 160;
    if (includeZorna) total += 45000;
    return total;
  }, [guestCount, includeTenues, includePhoto, includeGateaux, includeZorna]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-900 text-white p-6 md:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 text-amber-100 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Store className="w-3.5 h-3.5 text-amber-300" />
              DZ Wedding Marketplace Certifiée 🇩🇿
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Prestataires de Mariage & Salles des Fêtes
            </h1>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              Trouvez les meilleurs professionnels certifiés pour votre mariage dans les 69 wilayas : Salles, Neggafa, Photographes, Traiteurs, Gâteaux et Orchestres traditionnels.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => setIsQuoteModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white text-slate-900 font-extrabold text-sm shadow-xl hover:bg-amber-50 transition"
            >
              <Calculator className="w-4 h-4 text-amber-600" />
              Simulateur de Budget (عرسي بالدينار)
            </button>
          </div>
        </div>

        {/* Search & Wilaya Bar */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un prestataire, une salle, un gâteau ou un service..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/15 text-white placeholder-white/60 text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-300 backdrop-blur-md"
            />
          </div>

          <div>
            <select
              value={selectedWilaya}
              onChange={(e) => setSelectedWilaya(e.target.value)}
              aria-label="Filtrer par wilaya"
              className="w-full py-3 px-4 rounded-2xl bg-white/15 text-white text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-300 backdrop-blur-md"
            >
              <option value="all" className="text-slate-900">
                📍 Toutes les 69 Wilayas
              </option>
              {WILAYAS_LIST.map((w) => (
                <option key={w.code} value={w.code} className="text-slate-900">
                  {w.code} - {w.name} ({w.arabicName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_ITEMS.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2 border transition ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.labelFr}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-600" />
            Prestataires Certifiés ({filteredVendors.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Contact direct et vérification d’identité garantie
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                {/* Photo Banner */}
                <div className="h-48 relative overflow-hidden bg-slate-100">
                  <img
                    src={vendor.photos[0] || vendor.avatarUrl}
                    alt={vendor.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {vendor.wilayaName} ({vendor.wilayaCode})
                  </div>
                  {vendor.verified && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Certifié DZ
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-extrabold shadow-md">
                    À partir de {vendor.priceStartingAt}
                  </div>
                </div>

                {/* Vendor Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {vendor.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="ml-1 text-slate-800">{vendor.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-xs text-slate-400">({vendor.reviewsCount} avis)</span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-600">
                        {vendor.priceRange}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                    {vendor.descriptionFr}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1 pt-1 border-t border-slate-100">
                    {vendor.services.slice(0, 2).map((srv, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveVendor(vendor)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition"
                >
                  Voir fiche complète
                </button>
                <a
                  href={`tel:${vendor.phone}`}
                  className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
                  title="Appeler directement"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vendor Detail Modal */}
      {activeVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6 relative animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setActiveVendor(null)}
              aria-label="Fermer"
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                  {activeVendor.wilayaName} ({activeVendor.wilayaCode})
                </span>
                {activeVendor.verified && (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Prestataire Agréé
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {activeVendor.name}
              </h2>
              <p className="text-emerald-800 font-bold text-sm" dir="rtl">
                {activeVendor.descriptionAr}
              </p>
            </div>

            {/* Photo Gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {activeVendor.photos.map((p, i) => (
                <img
                  key={i}
                  src={p}
                  alt={`Photo ${i + 1}`}
                  className="h-32 w-full object-cover rounded-2xl border border-slate-100"
                />
              ))}
            </div>

            {/* Description & Services */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                Description & Prestations incluses
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                {activeVendor.descriptionFr}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeVendor.services.map((srv, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{srv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500 font-medium">Tarif estimatif</div>
                <div className="text-lg font-extrabold text-amber-600">
                  {activeVendor.priceStartingAt}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={`tel:${activeVendor.phone}`}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  Appeler {activeVendor.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget & Quote Simulator Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsQuoteModalOpen(false)}
              aria-label="Fermer"
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                <Calculator className="w-3.5 h-3.5 text-amber-600" />
                Calculateur de Budget Mariage Algérien (DZD)
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Simuler le coût de mon mariage 💍
              </h2>
              <p className="text-slate-600 text-xs">
                Ajustez le nombre d’invités et cochez les options pour estimer le budget global en Dinars Algériens.
              </p>
            </div>

            {/* Sliders and options */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex items-center justify-between text-sm font-bold text-slate-800 mb-2">
                  <span>Nombre d’invités prévus :</span>
                  <span className="text-amber-600 text-base">{guestCount} personnes</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="600"
                  step="25"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Prestations souhaitées :
                </span>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <span className="text-xs font-semibold text-slate-800">
                    👑 Neggafa & Pack 5 Tenues régionales (Chedda, Karakou, etc.)
                  </span>
                  <input
                    type="checkbox"
                    checked={includeTenues}
                    onChange={(e) => setIncludeTenues(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <span className="text-xs font-semibold text-slate-800">
                    📸 Photographe & Équipe Vidéo 4K + Teaser
                  </span>
                  <input
                    type="checkbox"
                    checked={includePhoto}
                    onChange={(e) => setIncludePhoto(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <span className="text-xs font-semibold text-slate-800">
                    🍯 Gâteaux traditionnels fins (Dziriettes, Baklawa, Mkhabez)
                  </span>
                  <input
                    type="checkbox"
                    checked={includeGateaux}
                    onChange={(e) => setIncludeGateaux(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <span className="text-xs font-semibold text-slate-800">
                    🎺 Troupe Zorna & Cortège El Kharja
                  </span>
                  <input
                    type="checkbox"
                    checked={includeZorna}
                    onChange={(e) => setIncludeZorna(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600"
                  />
                </label>
              </div>
            </div>

            {/* Total Estimated Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 text-white space-y-1 shadow-lg">
              <div className="text-xs text-amber-100 uppercase tracking-wider font-bold">
                Estimation Totale Globale
              </div>
              <div className="text-3xl font-black">
                {estimatedBudgetDZD.toLocaleString('fr-FR')} DZD
              </div>
              <div className="text-xs text-white/80">
                Soit environ {Math.round(estimatedBudgetDZD / guestCount).toLocaleString('fr-FR')} DZD par convive
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setQuoteSuccess(true);
                  setTimeout(() => {
                    setQuoteSuccess(false);
                    setIsQuoteModalOpen(false);
                  }, 2000);
                }}
                className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition flex items-center justify-center gap-2"
              >
                {quoteSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Devis synthétisé sauvegardé !
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-amber-400" />
                    Recevoir la checklist & propositions par email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
