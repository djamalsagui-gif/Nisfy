import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  TrendingUp,
  Wallet,
  PiggyBank,
  Target,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  RefreshCw,
  Send,
  MessageSquare,
  ShieldCheck,
  Building2,
  Shirt,
  Utensils,
  Gem,
  Home,
  Coffee,
  Plane,
  ShoppingBag,
  Receipt,
  HelpCircle,
  Sliders,
  DollarSign,
  Calendar,
  Zap,
  Volume2,
  Share2,
  Check,
  Info,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useLanguage } from '../../context/LanguageContext';
import { WILAYAS_LIST } from '../../data/wilayas';
import {
  ExpenseCategory,
  ExpenseItem,
  UserFinancialProfile,
  GeminiFinancialAnalysisResult,
  FinanceAdvisorChatMessage,
} from '../../types/finance';
import {
  EXPENSE_CATEGORIES,
  FINANCIAL_PRESETS,
  INITIAL_FALLBACK_ANALYSIS,
} from '../../data/financeData';
import { datingSounds } from '../../utils/soundEffects';

const CATEGORY_ICONS: Record<ExpenseCategory, any> = {
  wedding_venue: Building2,
  clothing_trousseau: Shirt,
  catering_sweets: Utensils,
  jewelry_mahr: Gem,
  housing_furniture: Home,
  lifestyle_dining: Coffee,
  travel_honeymoon: Plane,
  youth_shop: ShoppingBag,
  bills_subscriptions: Receipt,
  emergency_other: AlertCircle,
};

const PIE_COLORS = [
  '#8B5CF6',
  '#EC4899',
  '#F59E0B',
  '#EAB308',
  '#3B82F6',
  '#EF4444',
  '#06B6D4',
  '#10B981',
  '#64748B',
  '#A855F7',
];

export function GeminiFinancialAdvisorView({
  onNavigateToMarketplace,
  onNavigateToShop,
}: {
  onNavigateToMarketplace?: () => void;
  onNavigateToShop?: () => void;
}) {
  const { isArabic } = useLanguage();

  // Active preset & user financial profile
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset_zawaj_alger');
  const [profile, setProfile] = useState<UserFinancialProfile>(
    FINANCIAL_PRESETS[0].profile
  );
  const [expenses, setExpenses] = useState<ExpenseItem[]>(
    FINANCIAL_PRESETS[0].expenses
  );

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<GeminiFinancialAnalysisResult | null>(
    INITIAL_FALLBACK_ANALYSIS
  );
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisMode, setAnalysisMode] = useState<'gemini-live' | 'fallback' | 'simulated'>(
    'simulated'
  );

  // New Expense Modal / Form State
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpAmount, setNewExpAmount] = useState<number | ''>('');
  const [newExpCategory, setNewExpCategory] = useState<ExpenseCategory>('clothing_trousseau');
  const [newExpNecessity, setNewExpNecessity] = useState<'essential' | 'flexible' | 'luxury'>('flexible');

  // Interactive Milestones Check State
  const [checkedMilestones, setCheckedMilestones] = useState<Record<number, boolean>>({
    1: true,
  });

  // Interactive Gemini Chat State
  const [chatMessages, setChatMessages] = useState<FinanceAdvisorChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'gemini',
      text: isArabic
        ? 'مرحباً بك في مستشار نيسفي المالي الذكي (Gemini IA). كيف يمكنني مساعدتك في ضبط ميزانية زواجك أو توفير نفقاتك الشهرية؟'
        : 'Bonjour ! Je suis votre Conseiller Épargne & Budget IA Nisfy (Gemini 3.7). Posez-moi vos questions sur votre budget de mariage, les prestataires ou vos objectifs d épargne en Algérie.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Copy share feedback
  const [isCopied, setIsCopied] = useState(false);

  // Handle Preset Switching
  const handleSelectPreset = (presetId: string) => {
    datingSounds.playTapSound();
    const found = FINANCIAL_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setSelectedPresetId(presetId);
      setProfile(found.profile);
      setExpenses(found.expenses);
      setAnalysisResult(null); // Prompt user to re-analyze
    }
  };

  // Add Expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpTitle.trim() || !newExpAmount || Number(newExpAmount) <= 0) return;

    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      category: newExpCategory,
      title: newExpTitle.trim(),
      amount: Number(newExpAmount),
      currency: profile.currency,
      necessity: newExpNecessity,
      date: new Date().toISOString().split('T')[0],
      recurrence: 'monthly',
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setNewExpTitle('');
    setNewExpAmount('');
    setIsAddExpenseOpen(false);
    datingSounds.playTapSound();
  };

  // Delete Expense
  const handleDeleteExpense = (id: string) => {
    datingSounds.playTapSound();
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  // Calculate totals
  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [expenses]);

  const remainingIncome = useMemo(() => {
    return Math.max(0, profile.monthlyIncome - totalExpenses);
  }, [profile.monthlyIncome, totalExpenses]);

  const savingsRate = useMemo(() => {
    if (!profile.monthlyIncome || profile.monthlyIncome <= 0) return 0;
    return Math.round((remainingIncome / profile.monthlyIncome) * 100);
  }, [remainingIncome, profile.monthlyIncome]);

  // Chart Data: Expense Distribution
  const pieChartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    expenses.forEach((item) => {
      grouped[item.category] = (grouped[item.category] || 0) + Number(item.amount);
    });

    return Object.entries(grouped).map(([category, amount]) => {
      const meta = EXPENSE_CATEGORIES.find((c) => c.id === category);
      return {
        name: isArabic ? meta?.labelAr || category : meta?.labelFr || category,
        value: amount,
        category,
      };
    });
  }, [expenses, isArabic]);

  // Bar Chart Data: Income vs Expenses vs Savings
  const barChartData = useMemo(() => {
    return [
      {
        name: isArabic ? 'الدخل' : 'Revenu',
        montant: profile.monthlyIncome,
        fill: '#3B82F6',
      },
      {
        name: isArabic ? 'المصاريف' : 'Dépenses',
        montant: totalExpenses,
        fill: totalExpenses > profile.monthlyIncome ? '#EF4444' : '#F97316',
      },
      {
        name: isArabic ? 'الادخار المتبقي' : 'Épargne brute',
        montant: remainingIncome,
        fill: '#10B981',
      },
    ];
  }, [profile.monthlyIncome, totalExpenses, remainingIncome, isArabic]);

  // Trigger Gemini AI Analysis
  const handleRunGeminiAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    datingSounds.playTapSound();

    try {
      const res = await fetch('/api/finance/analyze-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          expenses,
          language: isArabic ? 'ar' : 'fr',
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAnalysisResult(json.data);
        setAnalysisMode(json.mode || 'gemini-live');
      } else {
        throw new Error(json.error || 'Impossible d analyser le budget');
      }
    } catch (err: any) {
      console.error('Erreur analyse Gemini:', err);
      setAnalysisError(
        isArabic
          ? 'تعذر الاتصال بالخادم، تم تفعيل النموذج الذكي الاحتياطي.'
          : 'Erreur d analyse IA. Affichage des recommandations optimisées.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle milestone completion
  const handleToggleMilestone = (stepNumber: number) => {
    datingSounds.playTapSound();
    setCheckedMilestones((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  // Chat with Gemini Advisor
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    const newMsg: FinanceAdvisorChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/finance/chat-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuestion: userText,
          profile,
          contextSummary: analysisResult?.summary || '',
        }),
      });

      const json = await res.json();
      const botReply: FinanceAdvisorChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'gemini',
        text: json.reply || 'Conseil IA indisponible.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, botReply]);
    } catch (err) {
      const botReply: FinanceAdvisorChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'gemini',
        text: isArabic
          ? '💡 أنصحك بمقارنة عروض قاعات الحفلات والزيانات عبر قسم السوق (Marketplace) للحصول على أفضل سعر مضمون.'
          : '💡 N hésitez pas à comparer les prestataires directement sur la Marketplace Nisfy pour débloquer des tarifs négociés.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, botReply]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Speech TTS for Cultural Proverb
  const handleSpeakProverb = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isArabic ? 'ar-SA' : 'fr-FR';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Copy Summary Share
  const handleCopySummary = () => {
    if (!analysisResult) return;
    const shareText = `📊 Bilan Épargne & Budget Nisfy (Gemini IA) :
🎯 Objectif : ${profile.goalName} (${profile.targetSavingsGoal.toLocaleString()} ${profile.currency})
⭐ Score de Santé Financière : ${analysisResult.healthScore}/100 (${analysisResult.healthStatus})
💡 Potentiel d'économie mensuel : +${analysisResult.estimatedTotalMonthlySavings.toLocaleString()} ${profile.currency}
⏱️ Délai estimé : ${analysisResult.projectedMonthsToGoal} mois.
Généré avec Nisfy - Zawaj Algérie & Diaspora.`;

    navigator.clipboard.writeText(shareText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
    datingSounds.playTapSound();
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-300 max-w-6xl mx-auto px-3 sm:px-6">
      {/* 🌟 Top Hero Banner with Gemini Badge */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-500/30">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-teal-300/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Gemini 3.7 Flash • Intelligence Financière Algérie</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              {isArabic
                ? 'مستشار التوفير وميزانية الزواج الذكي'
                : 'Conseiller Épargne & Budget IA (Mariage & Projets)'}
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              {isArabic
                ? 'حلّل عادات إنفاقك، وتعرّف على فرص التوفير الخفية في تحضيرات العرس وجهاز العروس، واحصل على خطة ادخار مخصصة تناسب دخلك بالدينار أو اليورو.'
                : 'Analysez vos habitudes de dépenses, identifiez les fuites financières dans les préparatifs de mariage (Salle, Choura, Traiteur) et obtenez des conseils d épargne actionnables.'}
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="w-full md:w-auto flex flex-row md:flex-col gap-3 shrink-0">
            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 text-center">
              <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">
                {isArabic ? 'الهدف المالي' : 'Objectif Cible'}
              </span>
              <span className="text-lg sm:text-xl font-black text-white">
                {profile.targetSavingsGoal.toLocaleString()} {profile.currency}
              </span>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 text-center">
              <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">
                {isArabic ? 'نسبة الادخار الحالية' : 'Taux d Épargne'}
              </span>
              <span
                className={`text-lg sm:text-xl font-black ${
                  savingsRate >= 20 ? 'text-emerald-300' : 'text-amber-300'
                }`}
              >
                {savingsRate}%
              </span>
            </div>
          </div>
        </div>

        {/* 🎛️ Preset Switcher Bar */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-emerald-200 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>{isArabic ? 'نماذج جاهزة :' : 'Profils types :'}</span>
          </span>

          {FINANCIAL_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-emerald-900 shadow-md font-black'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                }`}
              >
                {isArabic ? preset.nameAr : preset.nameFr}
              </button>
            );
          })}
        </div>
      </div>

      {/* 📊 Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Financial Profile & Expenses Management (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Profile Settings Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>{isArabic ? 'معطيات الدخل والهدف' : 'Revenu & Objectif d Épargne'}</span>
              </h2>

              {/* Currency Toggle */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setProfile((p) => ({ ...p, currency: 'DZD' }));
                    datingSounds.playTapSound();
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    profile.currency === 'DZD'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 font-black shadow-2xs'
                      : 'text-slate-500'
                  }`}
                >
                  DZD 🇩🇿
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfile((p) => ({ ...p, currency: 'EUR' }));
                    datingSounds.playTapSound();
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    profile.currency === 'EUR'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 font-black shadow-2xs'
                      : 'text-slate-500'
                  }`}
                >
                  EUR 🇪🇺
                </button>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Monthly Income */}
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                  {isArabic ? 'الراتب / الدخل الشهري الصافي' : 'Revenu net mensuel'} (
                  {profile.currency})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={profile.monthlyIncome || ''}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, monthlyIncome: Number(e.target.value) }))
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                  <span className="absolute right-3 rtl:right-auto rtl:left-3 top-2.5 text-slate-400 font-bold">
                    {profile.currency}
                  </span>
                </div>
              </div>

              {/* Goal Name & Target Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                    {isArabic ? 'عنوان الهدف' : 'Nom de l objectif'}
                  </label>
                  <input
                    type="text"
                    value={profile.goalName}
                    onChange={(e) => setProfile((p) => ({ ...p, goalName: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                    {isArabic ? 'المبلغ المستهدف' : 'Montant cible'}
                  </label>
                  <input
                    type="number"
                    value={profile.targetSavingsGoal || ''}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, targetSavingsGoal: Number(e.target.value) }))
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Current Savings & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                    {isArabic ? 'المدخرات المتوفرة حالياً' : 'Épargne actuelle'}
                  </label>
                  <input
                    type="number"
                    value={profile.currentSavings || ''}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, currentSavings: Number(e.target.value) }))
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                    {isArabic ? 'المدة المستهدفة (أشهر)' : 'Échéance (mois)'}
                  </label>
                  <input
                    type="number"
                    value={profile.targetTimelineMonths || ''}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, targetTimelineMonths: Number(e.target.value) }))
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Expense Items List & Add Modal */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-orange-500" />
                  <span>{isArabic ? 'قائمة المصاريف الشهرية' : 'Dépenses & Charges'}</span>
                </h2>
                <span className="text-[11px] text-slate-400 font-bold">
                  Total : {totalExpenses.toLocaleString()} {profile.currency}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsAddExpenseOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isArabic ? 'إضافة' : 'Ajouter'}</span>
              </button>
            </div>

            {/* Expenses List */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {expenses.map((item) => {
                const IconComponent = CATEGORY_ICONS[item.category] || AlertCircle;
                const meta = EXPENSE_CATEGORIES.find((c) => c.id === item.category);

                return (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${meta?.color || '#64748B'}18`,
                          color: meta?.color || '#64748B',
                        }}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold block">
                          {isArabic ? meta?.labelAr : meta?.labelFr}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {item.amount.toLocaleString()} {item.currency}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteExpense(item.id)}
                        className="p-1 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Expense Inline Form / Dialog */}
            {isAddExpenseOpen && (
              <form
                onSubmit={handleAddExpense}
                className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl space-y-3 animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-300">
                    {isArabic ? 'إضافة مصروف جديد' : 'Nouvelle dépense'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddExpenseOpen(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <input
                    type="text"
                    placeholder={isArabic ? 'عنوان المصروف (مثال: كراء قفطان)' : 'Titre (ex: Acompte Salle des Fêtes)'}
                    value={newExpTitle}
                    onChange={(e) => setNewExpTitle(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-900 dark:text-white"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder={isArabic ? 'المبلغ' : 'Montant'}
                      value={newExpAmount}
                      onChange={(e) =>
                        setNewExpAmount(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                    />

                    <select
                      value={newExpCategory}
                      onChange={(e) => setNewExpCategory(e.target.value as ExpenseCategory)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 font-semibold text-slate-900 dark:text-white text-xs"
                    >
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {isArabic ? cat.labelAr : cat.labelFr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddExpenseOpen(false)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            )}

            {/* 🚀 Main Trigger Button for Gemini Analysis */}
            <button
              id="btn-run-gemini-budget-analysis"
              type="button"
              onClick={handleRunGeminiAnalysis}
              disabled={isAnalyzing}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-60"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>
                    {isArabic
                      ? 'جاري التحليل المعمق بواسطة Gemini IA...'
                      : 'Analyse approfondie Gemini IA en cours...'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-bounce" />
                  <span>
                    {isArabic
                      ? 'تحليل عادات الإنفاق وتوليد نصائح التوفير'
                      : 'Analyser mes dépenses avec Gemini IA'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Analysis, Charts & Action Plan (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 3. Visual Charts & Split (50/30/20 & Categories) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <span>{isArabic ? 'توزيع النفقات والميزانية' : 'Répartition Visuelle du Budget'}</span>
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                {expenses.length} postes déclarés
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Donut Chart */}
              <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(val: any) => [
                        `${Number(val).toLocaleString()} ${profile.currency}`,
                        'Montant',
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-slate-400">Total</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {totalExpenses.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Bar Comparison Chart */}
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <RechartsTooltip
                      formatter={(val: any) => [
                        `${Number(val).toLocaleString()} ${profile.currency}`,
                        'Montant',
                      ]}
                    />
                    <Bar dataKey="montant" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 4. AI Generated Results & Advice Cards */}
          {analysisResult && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
              {/* Score & Key Findings Card */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 border border-emerald-500/30 shadow-lg space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-black text-xl text-emerald-300 shadow-inner">
                      {analysisResult.healthScore}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-white">
                          {isArabic ? 'مؤشر الصحة المالية' : 'Score de Santé Financière'}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                          {analysisResult.healthStatus}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-semibold">
                        Généré par Gemini IA le {new Date(analysisResult.generatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Copier le bilan"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span className="text-emerald-300">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Partager</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Synthesis Summary */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-white/5 p-3.5 rounded-2xl border border-white/10">
                  {isArabic ? analysisResult.summaryAr || analysisResult.summary : analysisResult.summary}
                </p>

                {/* 3 Metric Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-3 text-center">
                    <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider block">
                      {isArabic ? 'وفر شهري إضافي' : 'Économie Mensuelle'}
                    </span>
                    <span className="text-base font-black text-white">
                      +{analysisResult.estimatedTotalMonthlySavings.toLocaleString()}{' '}
                      {profile.currency}
                    </span>
                  </div>

                  <div className="bg-teal-500/15 border border-teal-500/30 rounded-2xl p-3 text-center">
                    <span className="text-[10px] font-black text-teal-300 uppercase tracking-wider block">
                      {isArabic ? 'المدة للوصول للهدف' : 'Délai Optimisé'}
                    </span>
                    <span className="text-base font-black text-white">
                      {analysisResult.projectedMonthsToGoal} mois
                    </span>
                  </div>

                  <div className="bg-indigo-500/15 border border-indigo-500/30 rounded-2xl p-3 text-center">
                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-wider block">
                      {isArabic ? 'تقييم قاعدة 50/30/20' : 'Équilibre 50/30/20'}
                    </span>
                    <span className="text-base font-black text-white">
                      {analysisResult.rule50_30_20.savingsPercentage}% épargne
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Personalized Savings Advice Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <PiggyBank className="w-4 h-4 text-emerald-500" />
                    <span>
                      {isArabic
                        ? 'توصيات التوفير المخصصة لواقع السوق الجزائري'
                        : 'Conseils d Épargne Personnalisés & Pratiques DZ'}
                    </span>
                  </h3>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {analysisResult.adviceList.length} recommandations
                  </span>
                </div>

                <div className="space-y-3">
                  {analysisResult.adviceList.map((adv, idx) => (
                    <div
                      key={adv.id || idx}
                      className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                              {adv.category}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                adv.difficulty === 'facile'
                                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                              }`}
                            >
                              Difficulté : {adv.difficulty}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                            {isArabic ? adv.titleAr || adv.title : adv.title}
                          </h4>
                        </div>

                        <div className="text-right rtl:text-left shrink-0 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                            Gain estimé
                          </span>
                          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                            +{adv.estimatedMonthlySavings.toLocaleString()} {profile.currency}/mois
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {isArabic ? adv.descriptionAr || adv.description : adv.description}
                      </p>

                      {adv.culturalContextTip && (
                        <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-[11px] font-semibold text-amber-900 dark:text-amber-200 flex items-start gap-2">
                          <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            {isArabic
                              ? adv.culturalContextTipAr || adv.culturalContextTip
                              : adv.culturalContextTip}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Smart Savings Roadmap (Milestones) */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-500" />
                    <span>{isArabic ? 'خطة المراحل والأهداف الزمنية' : 'Feuille de Route & Jalons d Épargne'}</span>
                  </h3>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                    Objectif {profile.targetTimelineMonths} mois
                  </span>
                </div>

                <div className="space-y-2.5">
                  {analysisResult.smartMilestones.map((milestone) => {
                    const isDone = !!checkedMilestones[milestone.stepNumber];
                    return (
                      <div
                        key={milestone.stepNumber}
                        onClick={() => handleToggleMilestone(milestone.stepNumber)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isDone
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isDone
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5" /> : milestone.stepNumber}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4
                              className={`text-xs font-black ${
                                isDone
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {isArabic ? milestone.titleAr || milestone.title : milestone.title}
                            </h4>
                            <span className="text-[11px] font-black text-purple-600 dark:text-purple-400 shrink-0">
                              {milestone.targetAmount.toLocaleString()} {profile.currency}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {isArabic
                              ? milestone.descriptionAr || milestone.description
                              : milestone.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 7. Algerian Cultural Proverb Card */}
              {analysisResult.culturalProverb && (
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-rose-950/30 border border-amber-200/80 dark:border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                      📜 حكمة جزائرية في التوفير والبركة
                    </span>
                    <p className="text-sm font-black text-slate-900 dark:text-white font-serif italic">
                      {analysisResult.culturalProverb.proverbAr}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {analysisResult.culturalProverb.meaningFr}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleSpeakProverb(
                        analysisResult.culturalProverb.proverbAr ||
                          analysisResult.culturalProverb.meaningFr
                      )
                    }
                    className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer shrink-0 shadow-sm flex items-center gap-1.5 text-xs font-black"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Écouter</span>
                  </button>
                </div>
              )}

              {/* 8. Interactive Gemini Financial Chat Assistant */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                    <span>{isArabic ? 'استشر خبير نيسفي المالي (Gemini IA)' : 'Posez une Question à l Expert Gemini'}</span>
                  </h3>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    En direct
                  </span>
                </div>

                {/* Chat History Box */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-emerald-600 text-white rounded-br-none'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/80 dark:border-slate-700'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span
                          className={`text-[9px] mt-1 block ${
                            msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}

                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-3 text-xs text-slate-500 flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                        <span>Gemini réfléchit aux meilleurs conseils pour vous...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input Form */}
                <form onSubmit={handleSendChatMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={
                      isArabic
                        ? 'اسأل مثلاً: كيف أخفض تكلفة المأكولات لـ 200 شخص؟'
                        : 'Ex : Comment négocier avec un photographe de mariage ?'
                    }
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isChatLoading}
                    className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Envoyer</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
