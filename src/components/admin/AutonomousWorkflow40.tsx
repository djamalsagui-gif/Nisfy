import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Bot,
  FileCode2,
  Cpu,
  Zap,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Terminal,
  Activity,
  QrCode,
  Download,
  Copy,
  Check,
  Play,
  RotateCcw,
  Clock,
  Layers,
  Database,
  Globe,
  Radio,
  FileCheck,
  TrendingUp,
  Share2,
  Send,
  MessageCircle,
  BarChart3,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { Advertisement } from '../../data/advertisements';
import {
  SmartContractData,
  NFTProofOfContract,
  AIPerformanceReport,
  WebhookEventPayload,
  provisionSmartContractForAd,
  generateNFTProof,
  generateAIPerformanceReport,
  generateHash,
  SAMPLE_AUTONOMOUS_VENDORS,
} from '../../utils/autonomousWorkflow40Engine';

interface AutonomousWorkflow40Props {
  ads: Advertisement[];
  onViewPublicAd?: (adId: string) => void;
  onRefreshAds?: () => void;
}

export function AutonomousWorkflow40({ ads, onViewPublicAd, onRefreshAds }: AutonomousWorkflow40Props) {
  // Selected ad for smart contract inspection
  const [selectedAdId, setSelectedAdId] = useState<string>(ads[0]?.id || 'ad-1');
  const activeAd = useMemo(() => ads.find((a) => a.id === selectedAdId) || ads[0], [ads, selectedAdId]);

  // Main Active Tab within Workflow 4.0
  const [activeTab, setActiveTab] = useState<
    'pipeline' | 'chatbot_ocr' | 'smart_contract' | 'webhooks' | 'nft_proof' | 'ai_performance'
  >('pipeline');

  // Smart Contract State for selected Ad
  const [contractData, setContractData] = useState<SmartContractData | null>(null);
  const [nftData, setNftData] = useState<NFTProofOfContract | null>(null);
  const [perfReport, setPerfReport] = useState<AIPerformanceReport | null>(null);

  // Copied states
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Live Terminal Logs for Event Bus
  const [terminalLogs, setTerminalLogs] = useState<Array<{ time: string; msg: string; type: 'info' | 'success' | 'warn' | 'error' | 'crypto' }>>([
    { time: '14:22:01', msg: '⚡ NISFY Event-Driven Engine 4.0 initialized (Zero-Gas Layer-2)', type: 'crypto' },
    { time: '14:22:02', msg: '🔗 Oracle Connected: BaridiMob & SATIM CIB Webhook Listener Active', type: 'info' },
    { time: '14:22:04', msg: '🤖 AI Optimization Engine: Balancing impressions across 58 Wilayas', type: 'success' },
  ]);

  // Chatbot State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string; options?: string[] }>>([
    {
      sender: 'ai',
      text: 'Salam Alikoum ! 🇩🇿 Je suis le bot IA de la régie publicitaire NISFY. Quel type de service nuptial souhaitez-vous promouvoir auprès de nos futurs mariés ?',
      time: '14:20',
      options: ['Salle des Fêtes VIP', 'Robe de Mariée & Ziana', 'Traiteur & Gâteaux', 'Photographe / Vidéaste'],
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'scanning' | 'verified'>('idle');

  // Auto-Pilot Full Simulation State
  const [isSimulatingFullCycle, setIsSimulatingFullCycle] = useState(false);
  const [simStep, setSimStep] = useState<number>(0);

  // Synchronize Smart Contract whenever active ad changes
  useEffect(() => {
    if (activeAd) {
      const data = provisionSmartContractForAd(activeAd);
      setContractData(data);
      setNftData(generateNFTProof(data));
      setPerfReport(generateAIPerformanceReport(activeAd));
    }
  }, [activeAd]);

  const addLog = (msg: string, type: 'info' | 'success' | 'warn' | 'error' | 'crypto' = 'info') => {
    const time = new Date().toLocaleTimeString();
    setTerminalLogs((prev) => [{ time, msg, type }, ...prev.slice(0, 30)]);
  };

  // Copy helper
  const handleCopy = (text: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  // -------------------------------------------------------------
  // TRIGGER WEBHOOKS (SIMULATE EVENTS)
  // -------------------------------------------------------------
  const handleTriggerWebhookPayment = () => {
    if (!contractData) return;
    addLog(`📥 Webhook POST /api/v4/webhooks/baridimob [200 OK] Received for ${contractData.brandName}`, 'info');
    addLog(`💳 Signature HMAC-SHA256 validée • Montant: ${contractData.monthlyFeeDzd.toLocaleString()} DZD`, 'crypto');
    
    setContractData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'ACTIVE_BROADCASTING',
        eventsLog: [
          {
            timestamp: new Date().toISOString(),
            event: 'WebhookPaymentVerified',
            payloadHash: generateHash('baridimob-live-webhook'),
            details: `Webhook BaridiMob validé automatiquement. Déblocage API de diffusion en direct (< 28s).`,
          },
          ...prev.eventsLog,
        ],
      };
    });

    addLog(`🟢 SMART CONTRACT EXÉCUTÉ : Ad activated on Nisfy Feed (< 28s). NFT Minted !`, 'success');
  };

  const handleTriggerWebhookOverdueSuspension = () => {
    if (!contractData) return;
    addLog(`⚠️ Oracle Cron Trigger: Échéance dépassée pour ${contractData.brandName} sans webhook de paiement`, 'warn');
    addLog(`🚨 APPLICATION AUTOMATIQUE ARTICLE 7 : Appel méthode executeAutonomousSuspension()`, 'error');

    setContractData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'SUSPENDED_ART7',
        eventsLog: [
          {
            timestamp: new Date().toISOString(),
            event: 'Article7AutonomousSuspension',
            payloadHash: generateHash('art7-suspension-trigger'),
            details: `Coupure API autonome exécutée sans intervention humaine suite au défaut de règlement.`,
          },
          ...prev.eventsLog,
        ],
      };
    });

    addLog(`🔴 DIFFUSION INTERROMPUE EN DIRECT SUR TOUTE LA PLATEFORME (Article 7 Codé)`, 'error');
  };

  const handleTriggerInstantReactivation = () => {
    if (!contractData) return;
    addLog(`📥 Webhook POST /api/v4/webhooks/cure_payment [200 OK] Règlement de régularisation reçu`, 'info');
    addLog(`⚡ SMART CONTRACT : Appel executeInstantReactivation()`, 'crypto');

    setContractData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'ACTIVE_BROADCASTING',
        eventsLog: [
          {
            timestamp: new Date().toISOString(),
            event: 'AdReactivatedInstant',
            payloadHash: generateHash('reactivate-instant-proof'),
            details: `Paiement validé par webhook. Réactivation instantanée en direct (< 3s).`,
          },
          ...prev.eventsLog,
        ],
      };
    });

    addLog(`🟢 CAMPAGNE RÉACTIVÉE INSTANTANÉMENT EN DIRECT (< 3 secondes)`, 'success');
  };

  // -------------------------------------------------------------
  // RUN FULL AUTO-PILOT 4.0 SIMULATION (Step-by-step automated flow)
  // -------------------------------------------------------------
  const runFullAutoPilotSimulation = () => {
    setIsSimulatingFullCycle(true);
    setSimStep(1);
    addLog(`🚀 DÉMARRAGE DU RUN TEST COMPLET "WORKFLOW 4.0 SANS INTERVENTION HUMAINE"`, 'crypto');

    // Step 1: Chatbot & OCR (1.5s)
    setTimeout(() => {
      setSimStep(1);
      setOcrStatus('scanning');
      addLog(`🤖 1/6 Chatbot IA : Ingestion des critères annonceur & Scan OCR Registre de Commerce...`, 'info');
    }, 500);

    // Step 2: Smart Contract Minting (3.5s)
    setTimeout(() => {
      setSimStep(2);
      setOcrStatus('verified');
      addLog(`📜 2/6 Smart Contract généré : NisfyAdProtocol.sol compilé & hashé (SHA-256)`, 'crypto');
    }, 2500);

    // Step 3: Webhook BaridiMob & Instant Live (5.5s)
    setTimeout(() => {
      setSimStep(3);
      handleTriggerWebhookPayment();
      addLog(`💳 3/6 Webhook BaridiMob reçu : Diffusion débloquée en < 28 secondes ! NFT Proof émis.`, 'success');
    }, 4500);

    // Step 4: AI Optimization (8s)
    setTimeout(() => {
      setSimStep(4);
      addLog(`📊 4/6 IA d'Emplacement : Rééquilibrage dynamique sur Alger, Oran & Constantine (CTR +38%)`, 'info');
    }, 7000);

    // Step 5: Art 7 Auto Suspension & Instant Cure (10.5s)
    setTimeout(() => {
      setSimStep(5);
      handleTriggerWebhookOverdueSuspension();
      addLog(`🚨 5/6 Simulation Impayé : Suspension automatique API selon l'Article 7 (Zéro oubli humain)`, 'warn');
    }, 9500);

    // Step 6: Instant Cure & Renewal NFT (13s)
    setTimeout(() => {
      setSimStep(6);
      handleTriggerInstantReactivation();
      addLog(`🌟 6/6 Webhook de régularisation reçu : Réactivation immédiate + Rapport NFT & Tarif Fidélité -15%`, 'success');
      setIsSimulatingFullCycle(false);
    }, 12500);
  };

  // Chatbot message submit
  const handleSendChatMessage = (textToSend?: string) => {
    const msg = textToSend || chatInput;
    if (!msg.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    // AI Automated Response
    setTimeout(() => {
      const wilayaText = (activeAd?.wilayas && activeAd.wilayas.length > 0) ? activeAd.wilayas.join(', ') : 'Alger';
      const aiReply = {
        sender: 'ai' as const,
        text: `Parfait ! Selon votre positionnement sur ${wilayaText} et notre prédiction d'audience nuptiale (75 000 vues mensuelles), nous vous préconisons le **Pack Sponsor VIP Gold (3 Mois)**. Nous lançons la compilation du Smart Contract et l'OCR de vos documents.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: ['Valider & Générer Smart Contract', 'Modifier le ciblage Wilayas', 'Télécharger les visuels'],
      };
      setChatMessages((prev) => [...prev, aiReply]);
      setOcrStatus('verified');
      addLog(`🤖 IA Chatbot : Proposition de pack optimal calibrée sur budget & audience cible`, 'info');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 🚀 TOP BANNER: PROTOCOL 4.0 STATUS & AUTONOMOUS ENGINE                     */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 border border-indigo-500/30 shadow-2xl">
        {/* Glow backdrop fx */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black flex items-center gap-1.5 animate-pulse">
                <Radio className="w-3.5 h-3.5" />
                <span>AUTONOMOUS ENGINE 4.0 ACTIVE</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-black flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>Zero-Touch Smart Contracts</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black">
                🇩🇿 BaridiMob & CIB Webhook Web
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>🔁 Régie Publicitaire Autonome NISFY 4.0</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Workflow ultra-moderne 100% automatisé : Onboarding par Chatbot IA & OCR, Smart Contract avec clauses légales codées (Article 7), activation instantanée sur Webhook BaridiMob (&lt; 30s), et gestion des impayés par coupure API automatique.
            </p>
          </div>

          {/* Master Simulation Trigger CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={runFullAutoPilotSimulation}
              disabled={isSimulatingFullCycle}
              className={`py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                isSimulatingFullCycle
                  ? 'bg-indigo-700 text-white animate-pulse'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 hover:scale-105 shadow-emerald-950/50'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isSimulatingFullCycle ? `Exécution Auto (${simStep}/6)...` : '⚡ Lancer Simulation Complète 4.0'}</span>
            </button>
          </div>
        </div>

        {/* Global Live Stats Ticker */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              ⚡
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Délai Activation</p>
              <p className="text-sm font-black text-white">&lt; 28 secondes</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black">
              🤖
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Intervention Humaine</p>
              <p className="text-sm font-black text-emerald-400">0% (Zéro Erreur)</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FF3823]/20 text-[#FF3823] flex items-center justify-center font-black">
              🚨
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Impayés (Art. 7)</p>
              <p className="text-sm font-black text-orange-200">Coupure API Immédiate</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
              📜
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Preuve Immuable</p>
              <p className="text-sm font-black text-amber-300">NFT ERC-721 / SHA-256</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🧭 NAVIGATION TABS DEDICATED TO WORKFLOW 4.0                               */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
            activeTab === 'pipeline'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>1. Pipeline Global 4.0</span>
        </button>

        <button
          onClick={() => setActiveTab('chatbot_ocr')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
            activeTab === 'chatbot_ocr'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <Bot className="w-4 h-4 text-emerald-500" />
          <span>2. Chatbot IA & OCR Docs</span>
        </button>

        <button
          onClick={() => setActiveTab('smart_contract')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
            activeTab === 'smart_contract'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <FileCode2 className="w-4 h-4 text-amber-500" />
          <span>3. Smart Contract & Hash Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('webhooks')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
            activeTab === 'webhooks'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <Zap className="w-4 h-4 text-[#FF3823]" />
          <span>4. Simulateur Webhook (BaridiMob/CIB)</span>
        </button>

        <button
          onClick={() => setActiveTab('nft_proof')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
            activeTab === 'nft_proof'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <QrCode className="w-4 h-4 text-purple-500" />
          <span>5. Certificat NFT de Contrat</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_performance')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
            activeTab === 'ai_performance'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-teal-500" />
          <span>6. IA Performance & Renouvellement</span>
        </button>
      </div>

      {/* Target Annonceur Selector Pill */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Campagne Ciblée :</span>
          <select
            value={selectedAdId}
            onChange={(e) => setSelectedAdId(e.target.value)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white border-0 focus:ring-2 focus:ring-indigo-500"
          >
            {ads.map((ad) => (
              <option key={ad.id} value={ad.id}>
                {ad.brandName} ({(ad.wilayas && ad.wilayas.length > 0) ? ad.wilayas[0] : 'Alger'}) • {ad.monthlyFee || '18 000 DZD'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Statut Smart Contract :</span>
          <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
            contractData?.status === 'ACTIVE_BROADCASTING'
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              : contractData?.status === 'SUSPENDED_ART7'
              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
          }`}>
            {contractData?.status}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1 : PIPELINE GLOBAL 4.0 VISUALIZER                                     */}
      {/* ========================================================================= */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Visual Step-by-Step Flow Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Step 1 Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                1
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-500" />
                <span>Demande Intelligente IA</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Chatbot WhatsApp/Web autonome qualifiant les besoins, validation instantanée des documents par OCR (Registre de Commerce, NIF), et recommandation du pack optimal selon l'audience ciblée.
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <span>⚡ Zéro formulaire manuel</span>
                <span className="cursor-pointer hover:underline" onClick={() => setActiveTab('chatbot_ocr')}>Tester →</span>
              </div>
            </div>

            {/* Step 2 Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
                2
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-indigo-500" />
                <span>Smart Contract Immuable</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Génération d'un contrat Solidity horodaté sur la blockchain NISFY. Les 11 articles légaux et les conditions de suspension automatique (Article 7) sont directement codés dans les octets.
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                <span>🔐 Hash SHA-256 Infalsifiable</span>
                <span className="cursor-pointer hover:underline" onClick={() => setActiveTab('smart_contract')}>Voir code →</span>
              </div>
            </div>

            {/* Step 3 Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                3
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Paiement & Lancement &lt; 30s</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Lien BaridiMob/CIB généré dynamiquement. Dès réception du Webhook bancaire, le smart contract libère les droits de diffusion instantanément et émet le NFT de preuve légale.
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-amber-600 dark:text-amber-400">
                <span>⏱️ Activation en &lt; 28 secondes</span>
                <span className="cursor-pointer hover:underline" onClick={() => setActiveTab('webhooks')}>Simuler →</span>
              </div>
            </div>

            {/* Step 4 Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-black">
                4
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-500" />
                <span>Diffusion Autonome IA</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                L'IA analyse le taux d'engagement des futurs mariés en direct et réalloue dynamiquement les impressions sur les créneaux et wilayas les plus performants.
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-teal-600 dark:text-teal-400">
                <span>📈 ROI prédictif maximisé</span>
                <span className="cursor-pointer hover:underline" onClick={() => setActiveTab('ai_performance')}>Explorer →</span>
              </div>
            </div>

            {/* Step 5 Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black">
                5
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Gestion Impayés Art. 7</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Si aucun webhook de paiement n'est reçu à l'échéance, le smart contract coupe immédiatement la diffusion (coupure API). Dès régularisation, réactivation en &lt; 3s.
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-rose-600 dark:text-rose-400">
                <span>🚨 Zéro impayé non traité</span>
                <span className="cursor-pointer hover:underline" onClick={() => setActiveTab('webhooks')}>Tester coupure →</span>
              </div>
            </div>

            {/* Step 6 Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black">
                6
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-purple-500" />
                <span>Rapport NFT & Renouvellement</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                En fin de cycle, émission d'un certificat NFT de performance infalsifiable et proposition automatisée de renouvellement avec réduction fidélité calculée par l'algorithme.
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-purple-600 dark:text-purple-400">
                <span>💎 Remise fidélité auto -15%</span>
                <span className="cursor-pointer hover:underline" onClick={() => setActiveTab('nft_proof')}>Certificat →</span>
              </div>
            </div>
          </div>

          {/* Live Terminal Stream of Events */}
          <div className="bg-slate-950 text-emerald-400 p-5 rounded-3xl border border-slate-800 font-mono text-xs shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">NISFY EVENT ORCHESTRATOR 4.0 - LIVE CONSOLE</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                LISTENING TO WEBHOOKS (PORT 443 / SSL)
              </span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-500 shrink-0">[{log.time}]</span>
                  <span
                    className={
                      log.type === 'crypto'
                        ? 'text-indigo-400'
                        : log.type === 'success'
                        ? 'text-emerald-300 font-bold'
                        : log.type === 'warn'
                        ? 'text-amber-300'
                        : log.type === 'error'
                        ? 'text-rose-400 font-bold'
                        : 'text-slate-300'
                    }
                  >
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2 : CHATBOT IA ONBOARDING & OCR VALIDATOR                             */}
      {/* ========================================================================= */}
      {activeTab === 'chatbot_ocr' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chatbot Interface */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[520px]">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Assistant IA d'Onboarding Publicitaire NISFY
                    </h3>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                      🟢 En ligne • Qualification, OCR & Recommandation
                    </p>
                  </div>
                </div>

                {/* Preset Vendor Quick Buttons */}
                <span className="text-[10px] text-slate-400">Exemples rapides :</span>
              </div>

              {/* Preset buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                {SAMPLE_AUTONOMOUS_VENDORS.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendChatMessage(`Je représente "${v.name}" (${v.category} à ${v.wilaya}). Budget prévu: ${v.budgetDzd} DZD/mois.`)}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 text-[11px] font-bold text-slate-700 dark:text-slate-300 shrink-0 cursor-pointer transition-all"
                  >
                    🏢 {v.name.split(' ')[0]} ({v.wilaya.split('-')[1]})
                  </button>
                ))}
              </div>

              {/* Messages Scroll Area */}
              <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>

                    {/* Interactive Options if any */}
                    {msg.options && (
                      <div className="flex items-center gap-1.5 flex-wrap mt-2">
                        {msg.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => handleSendChatMessage(opt)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] hover:bg-emerald-100 cursor-pointer transition-all"
                          >
                            ⚡ {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                placeholder="Décrivez votre activité ou posez une question..."
                className="flex-1 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <button
                onClick={() => handleSendChatMessage()}
                className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* OCR Document Verification Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-500" />
              <span>Contrôle OCR Documents & NIF</span>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Registre de Commerce :</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>RC Validé (CNRC Alger)</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Numéro NIF / NIS :</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  001916019384729
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Conformité Éthique :</span>
                <span className="font-bold text-emerald-600">
                  100% Conforme Mariage Halal
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Score de Solvabilité IA :</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400">
                  98/100 (Éligible Auto-Live)
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('smart_contract')}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <FileCode2 className="w-4 h-4" />
              <span>Générer Smart Contract Blockchain →</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3 : SMART CONTRACT SOLIDITY & LEDGER HASHES                           */}
      {/* ========================================================================= */}
      {activeTab === 'smart_contract' && contractData && (
        <div className="space-y-6">
          {/* Metadata Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Adresse Smart Contract</span>
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 truncate">
                  {contractData.contractAddress}
                </span>
                <button
                  onClick={() => handleCopy(contractData.contractAddress, setCopiedAddress)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Hash Légal SHA-256 (11 Articles)</span>
              <p className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
                {contractData.sha256Digest}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Bloc & Réseau</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Bloc #{contractData.blockNumber} • Layer-2 Nisfy
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Clause Art. 7 Impayés</span>
              <p className="font-black text-rose-600 dark:text-rose-400">
                Automatisée par Oracle
              </p>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="font-mono text-xs text-slate-300 ml-2 font-bold">
                  NisfyAdProtocol_{activeAd.id.replace(/-/g, '_')}.sol (Solidity ^0.8.20)
                </span>
              </div>

              <button
                onClick={() => handleCopy(contractData.solidityCode, setCopiedCode)}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copié !' : 'Copier Code Solidity'}</span>
              </button>
            </div>

            <pre className="p-5 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed max-h-[380px]">
              {contractData.solidityCode}
            </pre>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4 : SIMULATEUR WEBHOOKS BARIDIMOB / CIB & COUPURE ART. 7              */}
      {/* ========================================================================= */}
      {activeTab === 'webhooks' && contractData && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span>Simulateur d'Événements Webhook Bancaires (BaridiMob / SATIM CIB)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Déclenchez en direct les événements de paiement ou de défaut d'échéance pour observer la réaction instantanée du smart contract.
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full font-black text-xs ${
                contractData.status === 'ACTIVE_BROADCASTING'
                  ? 'bg-emerald-500 text-slate-950'
                  : contractData.status === 'SUSPENDED_ART7'
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-amber-500 text-slate-950'
              }`}>
                État Actuel : {contractData.status}
              </span>
            </div>

            {/* 3 Interactive Webhook Trigger Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Trigger 1: Payment Success */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <span>🟢 1. Webhook Paiement Reçu</span>
                  </h4>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
                    Simule la notification instantanée de règlement BaridiMob (ex: 18 000 DZD). Débloque la diffusion en direct sous 28 secondes.
                  </p>
                </div>
                <button
                  onClick={handleTriggerWebhookPayment}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer shadow-md flex items-center justify-center gap-1.5 transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Déclencher Webhook BaridiMob</span>
                </button>
              </div>

              {/* Trigger 2: Overdue Suspension */}
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-black text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                    <span>🚨 2. Impayé Échéance (Art. 7)</span>
                  </h4>
                  <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-1">
                    Simule l'expiration de la date d'échéance sans webhook. Le contrat suspend immédiatement la visibilité sur l'ensemble de l'app.
                  </p>
                </div>
                <button
                  onClick={handleTriggerWebhookOverdueSuspension}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs cursor-pointer shadow-md flex items-center justify-center gap-1.5 transition-all"
                >
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Exécuter Coupure API (Art. 7)</span>
                </button>
              </div>

              {/* Trigger 3: Instant Reactivation */}
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-black text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                    <span>⚡ 3. Webhook de Régularisation</span>
                  </h4>
                  <p className="text-[11px] text-indigo-700 dark:text-indigo-400 mt-1">
                    Dès paiement régularisé par l'annonceur, le smart contract réactive instantanément la diffusion en direct sous 3 secondes.
                  </p>
                </div>
                <button
                  onClick={handleTriggerInstantReactivation}
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs cursor-pointer shadow-md flex items-center justify-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réactiver Instantanément</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5 : CERTIFICAT NFT DE PREUVE DE CONTRAT                               */}
      {/* ========================================================================= */}
      {activeTab === 'nft_proof' && nftData && contractData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visual Holographic NFT Card */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white border-2 border-indigo-500/50 shadow-2xl space-y-5 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono font-bold">
                {nftData.standard}
              </span>
              <span className="text-xs font-mono text-amber-400 font-black">
                {nftData.tokenId}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={activeAd.logoImage}
                alt={activeAd.brandName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shrink-0"
              />
              <div>
                <h3 className="text-lg font-black text-white">{activeAd.brandName}</h3>
                <p className="text-xs text-indigo-300 font-medium">Contrat Publicitaire Certifié Blockchain</p>
                <p className="text-[11px] text-slate-400 mt-1">{(activeAd.wilayas && activeAd.wilayas.length > 0) ? activeAd.wilayas.join(', ') : 'Alger'} • {contractData.monthlyFeeDzd.toLocaleString()} DZD/mois</p>
              </div>
            </div>

            {/* Attributes Matrix */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {nftData.attributes.map((attr, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">{attr.trait_type}</p>
                  <p className="font-bold text-white truncate">{attr.value}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[10px] truncate max-w-[200px]">{nftData.metadataUri}</span>
              <span className="text-emerald-400 font-bold">✓ Signature Valide</span>
            </div>
          </div>

          {/* Verification & Export */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-purple-500" />
              <span>Vérification Publique & Horodatage</span>
            </h3>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Ce NFT constitue la preuve juridique infalsifiable d'existence du contrat publicitaire NISFY, opposable et vérifiable publiquement.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Propriétaire :</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
                  {nftData.ownerAddress}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Date d'Émission :</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {new Date(nftData.mintedAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Statut du Verrou Juridique :</span>
                <span className="font-black text-emerald-600">
                  🔒 Immuable & Non Modifiable
                </span>
              </div>
            </div>

            <button
              onClick={() => alert(`Certificat NFT ${nftData.tokenId} téléchargé avec succès !`)}
              className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger le Certificat de Preuve (PDF + NFT)</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6 : IA PERFORMANCE ENGINE & PROPOSITION DE RENOUVELLEMENT             */}
      {/* ========================================================================= */}
      {activeTab === 'ai_performance' && perfReport && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Impressions Ciblées</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {perfReport.totalImpressions.toLocaleString('fr-DZ')}
              </p>
              <p className="text-emerald-600 font-bold text-xs">↑ +38% vs moyenne sectorielle</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Leads WhatsApp Directs</span>
              <p className="text-2xl font-black text-emerald-600">
                {perfReport.totalWhatsappLeads} contacts
              </p>
              <p className="text-slate-500 text-xs">Taux de conversion : {perfReport.conversionRate}</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Remise Fidélité Calculée</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                -{perfReport.aiSuggestedRenewalDiscount}%
              </p>
              <p className="text-slate-500 text-xs">Tarif fidélité reconduction</p>
            </div>
          </div>

          {/* Predictive Renewal Card */}
          <div className="bg-gradient-to-r from-indigo-900 to-purple-950 text-white rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                🌟
              </div>
              <div>
                <h4 className="text-base font-black text-white">
                  Proposition de Renouvellement Automatisée par IA
                </h4>
                <p className="text-xs text-indigo-200">
                  Calcul prédictif de fidélisation pour {activeAd.brandName}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed bg-white/10 p-4 rounded-2xl border border-white/10">
              💡 {perfReport.aiRenewalReason}
            </p>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-amber-300 font-bold">
                Avenant Smart Contract prêt pour la saison des mariages
              </span>
              <button
                onClick={() => alert(`Avenant de renouvellement avec remise fidélité de -15% transmis à ${activeAd.brandName} !`)}
                className="py-2.5 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow-lg hover:scale-105 transition-all"
              >
                Envoyer Offre Renouvellement Auto →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
