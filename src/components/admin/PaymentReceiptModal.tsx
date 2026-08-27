import React from 'react';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Building2,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Stamp,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { PaymentTransaction } from '../../data/paymentsData';

interface PaymentReceiptModalProps {
  payment: PaymentTransaction | null;
  onClose: () => void;
}

export function PaymentReceiptModal({ payment, onClose }: PaymentReceiptModalProps) {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const isDZD = payment.currency === 'DZD';
  const amountFormatted = `${payment.amount.toLocaleString('fr-FR')} ${payment.currency}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Top Control Bar (Hidden on print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Stamp className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-black text-white">
                Quittance & Reçu Officiel d'Encaissement
              </h3>
              <p className="text-[11px] text-slate-300">
                Réf: {payment.receiptNumber} • Conforme aux normes comptables
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-8 sm:p-10 space-y-6 text-slate-900 bg-white" id="printable-receipt">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-slate-900 pb-5 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-950">
                  NISFY <span className="text-amber-500 font-serif text-xl">نصفي</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-slate-950 text-amber-400">
                  SARL MEDIA & DIGITAL
                </span>
              </div>
              <p className="text-[10px] text-slate-600 leading-tight">
                Tour d'Affaires El Qods, Niveau 12, Chéraga - Alger (16)<br />
                RC: 16/00-0987654B26 • NIF: 002616098765432 • NIS: 002616123456789<br />
                Tél: +213 (0) 23 80 00 16 / +213 550 16 00 00 • contact@nisfy.app
              </p>
            </div>

            <div className="sm:text-right border-l-2 sm:border-l-0 sm:border-r-0 border-amber-500 pl-3 sm:pl-0">
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block">
                REÇU D'ENCAISSEMENT / وصل استلام
              </span>
              <strong className="text-lg font-mono font-black text-slate-950 block">
                N° {payment.receiptNumber}
              </strong>
              <span className="text-xs text-slate-600 font-medium">
                Date : {new Date(payment.paymentDate).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          {/* Parties Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Bénéficiaire / Enseigne Partenaire
              </span>
              <strong className="text-sm font-black text-slate-900 block">
                {payment.brandName}
              </strong>
              {payment.brandNameAr && (
                <span className="text-xs font-serif text-slate-700 block" dir="rtl">
                  {payment.brandNameAr}
                </span>
              )}
              <p className="text-slate-600">
                Contact: <strong className="text-slate-800">{payment.contactPerson}</strong>
              </p>
              <p className="text-slate-600">
                Tél: {payment.phone} • {payment.city || 'Algérie'}
              </p>
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Prestation & Campagne Publicitaire
              </span>
              <strong className="text-slate-900 font-bold block">
                {payment.planLabel}
              </strong>
              <p className="text-slate-600">
                Durée : <strong className="text-slate-800">{payment.planDuration}</strong>
              </p>
              <p className="text-slate-600">
                Période couverte : <span className="font-mono text-slate-800">{payment.periodCovered}</span>
              </p>
              {payment.dueDate && (
                <p className="text-amber-800 font-medium">
                  Prochaine échéance : {payment.dueDate}
                </p>
              )}
            </div>
          </div>

          {/* Amount Box */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                  Montant Net Encaissé / المبلغ المقبوض
                </span>
                <p className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">
                  {amountFormatted}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  RÈGLEMENT VALIDÉ
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Paiement {payment.isInstallment ? `Acompte (Tranche ${payment.installmentNumber || 1}/${payment.totalInstallments || 2})` : 'Intégral'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-200 text-xs space-y-1">
              <p className="text-slate-700 italic">
                <strong>Somme en toutes lettres :</strong>{' '}
                {payment.amountInWordsFr || `${amountFormatted}`}
              </p>
              {payment.amountInWordsAr && (
                <p className="text-slate-700 font-serif" dir="rtl">
                  <strong>المبلغ بالحروف :</strong> {payment.amountInWordsAr}
                </p>
              )}
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-bold uppercase">Mode de Paiement</span>
              <strong className="text-slate-900 font-bold block mt-0.5">
                {payment.paymentMethodLabel}
              </strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-bold uppercase">Réf. Transaction / Bordereau</span>
              <strong className="text-slate-900 font-mono font-bold block mt-0.5 truncate">
                {payment.transactionReference}
              </strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 block font-bold uppercase">Validation Administration</span>
              <strong className="text-emerald-700 font-bold block mt-0.5 truncate">
                {payment.receivedByAdmin || 'Direction Financière NISFY'}
              </strong>
            </div>
          </div>

          {/* Official Seal & Legal Notice */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-[10px] text-slate-500 max-w-sm space-y-0.5">
              <p>
                Ce document tient lieu de reçu libératoire et quittance officielle de versement pour la période mentionnée.
              </p>
              <p className="font-mono text-[9px] text-slate-400">
                Signature numérique certifiée NISFY • Horodatage: {payment.createdAt}
              </p>
            </div>

            {/* Simulated Stamp / Cachet */}
            <div className="border-2 border-dashed border-amber-600/70 rounded-2xl p-3 text-center bg-amber-50/50 min-w-[160px] transform -rotate-1">
              <span className="text-[9px] font-black uppercase text-amber-900 block tracking-wider">
                ★ CACHET OFFICIEL ★
              </span>
              <strong className="text-[11px] font-black text-slate-900 block">
                NISFY MEDIA SARL
              </strong>
              <span className="text-[9px] text-emerald-700 font-bold block">
                ENCAISSÉ & CERTIFIÉ
              </span>
              <span className="text-[8px] font-mono text-slate-500 block mt-0.5">
                {payment.receiptNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Footer info (Hidden on print) */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 print:hidden">
          <span>
            💡 Vous pouvez imprimer cette quittance ou la sauvegarder en PDF (via Destination: Enregistrer au format PDF).
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-all cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
