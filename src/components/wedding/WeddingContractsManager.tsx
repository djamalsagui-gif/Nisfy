import React, { useState, useEffect } from 'react';
import {
  FileText,
  FileCheck2,
  Calendar,
  Phone,
  MapPin,
  Clock,
  Printer,
  Share2,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  CreditCard,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { WeddingBookingContract, WeddingBookingStatus } from '../../types';
import { getWeddingBookings, updateWeddingBookingStatus } from '../../utils/storage';
import { useLanguage } from '../../context/LanguageContext';

interface WeddingContractsManagerProps {
  onNavigateToMarketplace?: () => void;
}

export const WeddingContractsManager: React.FC<WeddingContractsManagerProps> = ({
  onNavigateToMarketplace,
}) => {
  const { isArabic } = useLanguage();
  const [contracts, setContracts] = useState<WeddingBookingContract[]>(() => getWeddingBookings());
  const [selectedContract, setSelectedContract] = useState<WeddingBookingContract | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | WeddingBookingStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setContracts(getWeddingBookings());
    };
    window.addEventListener('nisfy_wedding_bookings_updated', handleUpdate);
    return () => window.removeEventListener('nisfy_wedding_bookings_updated', handleUpdate);
  }, []);

  const handleStatusChange = (id: string, newStatus: WeddingBookingStatus) => {
    const updated = updateWeddingBookingStatus(id, newStatus);
    setContracts(updated);
    if (selectedContract && selectedContract.id === id) {
      setSelectedContract({ ...selectedContract, status: newStatus });
    }
  };

  const filteredContracts = contracts.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesSearch =
      c.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.vendorWilaya.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalValueDzd = contracts.reduce((acc, c) => acc + c.totalAmountDzd, 0);
  const totalDepositDzd = contracts.reduce((acc, c) => acc + c.depositAmountDzd, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white p-5 sm:p-7 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5" />
                {isArabic ? 'منظومة العقود والحجوزات الرسمية' : 'Portail Contrats & Réservations Nisfy'}
              </span>
              <span className="text-xs text-slate-400">100% Légal & Sécurisé</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {isArabic ? 'إدارة عقود ومقدمي خدمات الأعراس 📑' : 'Gestion des Contrats & Devis Prestataires 📑'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {isArabic
                ? 'متابعة كافة الاتفاقيات، شهادات الحجز، تسديد العربون (BaridiMob/CCP) وبنود الضمان المتبادل مع قاعات الحفلات، سيارات الموكب ومقدمي الخدمات.'
                : 'Suivez tous vos contrats signés, états des acomptes et bons de commande certifiés avec nos prestataires (Salles, Zekri Auto, Traiteurs).'}
            </p>
          </div>

          {onNavigateToMarketplace && (
            <button
              onClick={onNavigateToMarketplace}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-[#FF3823] hover:opacity-95 text-white font-black text-xs shadow-md transition-transform active:scale-95 cursor-pointer flex items-center gap-2 shrink-0 self-start md:self-center"
            >
              <span>{isArabic ? 'تصفح خدمات وحجز جديد' : 'Nouveau Devis Prestataire'}</span>
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-black block mb-1">
            {isArabic ? 'إجمالي العقود' : 'Total Contrats'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {contracts.length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-emerald-500 uppercase font-black block mb-1">
            {isArabic ? 'عقود مؤكدة' : 'Contrats Signés'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {contracts.filter((c) => c.status === 'confirme_signe').length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-amber-500 uppercase font-black block mb-1">
            {isArabic ? 'إجمالي المبالغ' : 'Volume Total'}
          </span>
          <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400">
            {totalValueDzd.toLocaleString()} DZD
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-blue-500 uppercase font-black block mb-1">
            {isArabic ? 'العربون المحصل (30%)' : 'Acomptes Sécurisés'}
          </span>
          <span className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400">
            {totalDepositDzd.toLocaleString()} DZD
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isArabic ? 'بحث برمز العقد أو اسم المزود...' : 'Recherche code contrat, prestataire...'}
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(
            [
              { id: 'all', label: isArabic ? 'الكل' : 'Tous' },
              { id: 'confirme_signe', label: isArabic ? 'مؤكد وموقع' : 'Signé' },
              { id: 'acompte_attente', label: isArabic ? 'بانتظار العربون' : 'En attente' },
              { id: 'devis_demande', label: isArabic ? 'طلب تسعيرة' : 'Devis' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === item.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-3">
        {filteredContracts.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">
              {isArabic ? 'لا توجد عقود مسجلة بهذا المعيار' : 'Aucun contrat ne correspond à votre recherche.'}
            </p>
          </div>
        ) : (
          filteredContracts.map((contract) => (
            <div
              key={contract.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    {contract.bookingCode}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      contract.status === 'confirme_signe'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : contract.status === 'acompte_attente'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {contract.status === 'confirme_signe' && (isArabic ? '✓ عقد مؤكد' : '✓ Validé & Signé')}
                    {contract.status === 'acompte_attente' && (isArabic ? '⏳ بانتظار العربون' : '⏳ Acompte en attente')}
                    {contract.status === 'devis_demande' && (isArabic ? '📝 قيد المراجعة' : '📝 Devis émis')}
                    {contract.status === 'annule' && (isArabic ? '✕ ملغى' : '✕ Annulé')}
                  </span>

                  <span className="text-[11px] text-slate-400">
                    📅 {new Date(contract.createdAt).toLocaleDateString(isArabic ? 'ar-DZ' : 'fr-FR')}
                  </span>
                </div>

                <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
                  {contract.vendorName}
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <span>👤 Client : <strong className="text-slate-800 dark:text-slate-200">{contract.clientName}</strong></span>
                  <span>🗓️ Date Fête : <strong className="text-slate-800 dark:text-slate-200">{contract.weddingDate}</strong></span>
                  <span>📍 {contract.vendorWilaya}</span>
                  <span>💳 {contract.paymentMethod.toUpperCase()}</span>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    {isArabic ? 'المبلغ الإجمالي' : 'Montant Total'}
                  </span>
                  <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {contract.totalAmountDzd.toLocaleString()} DZD
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-bold">
                    Acompte : {contract.depositAmountDzd.toLocaleString()} DZD
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedContract(contract)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'عرض العقد' : 'Voir Contrat'}</span>
                  </button>

                  {contract.status === 'acompte_attente' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(contract.id, 'confirme_signe')}
                      className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition cursor-pointer"
                      title="Valider la réception de l'acompte"
                    >
                      {isArabic ? 'تأكيد العربون' : 'Valider Acompte'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Contract Detail Modal */}
      {selectedContract && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">📜</span>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-sm">
                    {isArabic ? 'عقد تقديم خدمة زفاف موثق' : 'Contrat de Prestation de Mariage Homologué'}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">{selectedContract.bookingCode}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedContract(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Vendor & Client Cards */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-amber-600 block">Prestataire</span>
                <p className="font-bold text-slate-900 dark:text-white">{selectedContract.vendorName}</p>
                <p className="text-slate-500">📞 {selectedContract.vendorPhone}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-[#FF3823] block">Client</span>
                <p className="font-bold text-slate-900 dark:text-white">{selectedContract.clientName}</p>
                <p className="text-slate-500">📞 {selectedContract.clientPhone}</p>
              </div>
            </div>

            {/* Prestations */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Options & Engagements</span>
              <ul className="space-y-1">
                {selectedContract.selectedOptions.map((opt, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Finance Details */}
            <div className="p-4 bg-slate-950 text-white rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Prestation :</span>
                <span className="font-mono font-bold">{selectedContract.totalAmountDzd.toLocaleString()} DZD</span>
              </div>
              <div className="flex justify-between text-amber-400 font-bold">
                <span>Acompte Versé (30%) :</span>
                <span className="font-mono">{selectedContract.depositAmountDzd.toLocaleString()} DZD</span>
              </div>
              <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800">
                <span>Solde restant :</span>
                <span className="font-mono">{selectedContract.remainingAmountDzd.toLocaleString()} DZD</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isArabic ? 'طباعة العقد' : 'Imprimer en PDF'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedContract(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
              >
                {isArabic ? 'إغلاق' : 'Fermer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
