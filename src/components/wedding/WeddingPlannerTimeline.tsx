import React, { useState, useMemo } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  PiggyBank,
  Store,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Plus,
  Trash2,
  DollarSign,
  HeartHandshake,
  ArrowRight,
  Filter,
  Share2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { INITIAL_WEDDING_VENDORS } from '../../data/weddingVendorsData';
import { WeddingVendorCategory } from '../../types';

export interface WeddingTask {
  id: string;
  titleFr: string;
  titleAr: string;
  stage: 'j12' | 'j6' | 'j3' | 'j1' | 'jour_j';
  category: WeddingVendorCategory | 'general';
  estimatedCostDzd: number;
  completed: boolean;
  notes?: string;
  recommendedVendorCategory?: WeddingVendorCategory;
}

const INITIAL_TASKS: WeddingTask[] = [
  // J-12 Mois
  {
    id: 'task_1',
    titleFr: 'Fixer la date de la Fatiha & budget global prévisionnel',
    titleAr: 'تحديد موعد الفاتحة والميزانية التقديرية العامة',
    stage: 'j12',
    category: 'general',
    estimatedCostDzd: 0,
    completed: true,
  },
  {
    id: 'task_2',
    titleFr: 'Réserver la Salle des Fêtes (Haute saison)',
    titleAr: 'حجز قاعة الحفلات (الموسم الصيفي)',
    stage: 'j12',
    category: 'salle_fetes',
    estimatedCostDzd: 380000,
    completed: false,
    recommendedVendorCategory: 'salle_fetes',
  },
  {
    id: 'task_3',
    titleFr: 'Choisir le Traiteur & Menu traditionnel (Chorba, Tajine, Couscous)',
    titleAr: 'اختيار المطعم وقائمة الطعام التقليدية (شربة، طاجين، كسكس)',
    stage: 'j12',
    category: 'traiteur_repas',
    estimatedCostDzd: 290000,
    completed: false,
    recommendedVendorCategory: 'traiteur_repas',
  },

  // J-6 Mois
  {
    id: 'task_4',
    titleFr: 'Sélectionner la Ziana & Tenues traditionnelles (Karakou, Chedda, Caftan)',
    titleAr: 'اختيار الزيانة والأزياء التقليدية (كاراكو، شدة تلمسانية، قفطان)',
    stage: 'j6',
    category: 'neggafa_tenues',
    estimatedCostDzd: 180000,
    completed: false,
    recommendedVendorCategory: 'neggafa_tenues',
  },
  {
    id: 'task_5',
    titleFr: 'Réserver le Photographe & Équipe Vidéo Drone',
    titleAr: 'حجز المصور وفريق تصوير الفيديو بالدرون',
    stage: 'j6',
    category: 'photographe_video',
    estimatedCostDzd: 120000,
    completed: false,
    recommendedVendorCategory: 'photographe_video',
  },
  {
    id: 'task_6',
    titleFr: 'Commander la trousse de la mariée (Choura & Linge de maison)',
    titleAr: 'تحضير شورة العروس ومستلزمات جهاز البيت',
    stage: 'j6',
    category: 'general',
    estimatedCostDzd: 250000,
    completed: false,
  },

  // J-3 Mois
  {
    id: 'task_7',
    titleFr: 'Commander les Gâteaux Algériens (Baklawa, Makroudh, Tcharek, Dziriat)',
    titleAr: 'طلب الحلويات الجزائرية الأصيلة (بقلاوة، مقروط اللوز، تشارك، دزيريات)',
    stage: 'j3',
    category: 'patisserie_gateaux',
    estimatedCostDzd: 110000,
    completed: false,
    recommendedVendorCategory: 'patisserie_gateaux',
  },
  {
    id: 'task_8',
    titleFr: 'Réserver l’orchestre ou la Zorna traditionnelle / DJ Animateur',
    titleAr: 'حجز الفرقة الموسيقية، الزرنة الشعبية أو دي جي الأعراس',
    stage: 'j3',
    category: 'zorna_orchestre',
    estimatedCostDzd: 95000,
    completed: false,
    recommendedVendorCategory: 'zorna_orchestre',
  },
  {
    id: 'task_9',
    titleFr: 'Impression & Distribution des Cartes d’invitation',
    titleAr: 'طباعة وتوزيع بطاقات الدعوة للأهل والأحباب',
    stage: 'j3',
    category: 'general',
    estimatedCostDzd: 35000,
    completed: false,
  },

  // J-1 Mois
  {
    id: 'task_10',
    titleFr: 'Soirée du Henné & Préparation du trousseau',
    titleAr: 'تنظيم سهرة الحنة وتجهيز كواغط العروس',
    stage: 'j1',
    category: 'decoration_fleurs',
    estimatedCostDzd: 60000,
    completed: false,
    recommendedVendorCategory: 'decoration_fleurs',
  },
  {
    id: 'task_11',
    titleFr: 'Achat de la bague de mariage & Coffret bijoux Mahr',
    titleAr: 'شراء خواتم الزفاف وصندوق مجوهرات المهر',
    stage: 'j1',
    category: 'general',
    estimatedCostDzd: 220000,
    completed: false,
  },

  // Jour J
  {
    id: 'task_12',
    titleFr: 'Location Voitures de Marque Cortège & Déroulement de la Fête (Zekri Auto Location)',
    titleAr: 'كراء سيارات الموكب الفاخرة وانطلاق حفل الزفاف المبارك (زكري أوتو)',
    stage: 'jour_j',
    category: 'cortege_vehicules',
    estimatedCostDzd: 35000,
    completed: false,
    recommendedVendorCategory: 'cortege_vehicules',
  },
];

interface WeddingPlannerTimelineProps {
  onNavigateToMarketplace: (vendorCategory?: WeddingVendorCategory) => void;
  onNavigateToFinance: () => void;
}

export function WeddingPlannerTimeline({
  onNavigateToMarketplace,
  onNavigateToFinance,
}: WeddingPlannerTimelineProps) {
  const { isArabic } = useLanguage();
  const [tasks, setTasks] = useState<WeddingTask[]>(INITIAL_TASKS);
  const [selectedStage, setSelectedStage] = useState<'all' | 'j12' | 'j6' | 'j3' | 'j1' | 'jour_j'>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCost, setNewTaskCost] = useState('');
  const [newTaskStage, setNewTaskStage] = useState<'j12' | 'j6' | 'j3' | 'j1' | 'jour_j'>('j6');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: WeddingTask = {
      id: `task_${Date.now()}`,
      titleFr: newTaskTitle,
      titleAr: newTaskTitle,
      stage: newTaskStage,
      category: 'general',
      estimatedCostDzd: parseFloat(newTaskCost) || 0,
      completed: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
    setNewTaskCost('');
    setIsAddingTask(false);
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalBudgetDzd = useMemo(() => {
    return tasks.reduce((acc, t) => acc + (t.estimatedCostDzd || 0), 0);
  }, [tasks]);

  const spentBudgetDzd = useMemo(() => {
    return tasks
      .filter((t) => t.completed)
      .reduce((acc, t) => acc + (t.estimatedCostDzd || 0), 0);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (selectedStage === 'all') return tasks;
    return tasks.filter((t) => t.stage === selectedStage);
  }, [tasks, selectedStage]);

  const stagesList = [
    { id: 'all', labelFr: 'Toutes les étapes', labelAr: 'جميع المراحل', icon: '📋' },
    { id: 'j12', labelFr: 'J - 12 Mois (Lancement)', labelAr: '12 شهر قبل العرس', icon: '🏰' },
    { id: 'j6', labelFr: 'J - 6 Mois (Tenues & Photos)', labelAr: '6 أشهر قبل العرس', icon: '👗' },
    { id: 'j3', labelFr: 'J - 3 Mois (Gâteaux & Zorna)', labelAr: '3 أشهر قبل العرس', icon: '🎂' },
    { id: 'j1', labelFr: 'J - 1 Mois (Henné & Alliances)', labelAr: 'شهر قبل العرس (الحنة)', icon: '🌿' },
    { id: 'jour_j', labelFr: 'Jour J (Le Grand Jour)', labelAr: 'يوم الزفاف المبارك', icon: '💍' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-700 via-rose-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-amber-500/30">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {isArabic ? 'دار ودروج • تنظيم زواج الأصالة' : 'Dar Wa Drouj • Planificateur Mariage'}
              </span>
              <span className="text-xs text-rose-300 font-bold">100% Dz 🇩🇿</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isArabic
                ? 'مخطط الزواج التفاعلي: خطوة بخطوة نحو الفرحة'
                : 'Rétroplanning Mariage : De la Fatiha au Jour J'}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed">
              {isArabic
                ? 'تابع جميع تجهيزات زواجك، احسب مصاريف كل مرحلة، واحجز أفضل مقدمي الخدمات بقاعات وحلويات الجزائر في موعدها.'
                : 'Organisez sereinement chaque étape de vos noces, anticipez les acomptes et réservez vos prestataires locaux au meilleur prix.'}
            </p>
          </div>

          {/* Action to Gemini Finance */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={onNavigateToFinance}
              className="px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <PiggyBank className="w-4 h-4" />
              <span>{isArabic ? 'حساب ميزانية الزواج بالذكاء الاصطناعي' : 'Optimiser Budget avec Gemini IA'}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToMarketplace()}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Store className="w-4 h-4 text-amber-300" />
              <span>{isArabic ? 'دليل قاعات ومقدمي الخدمات' : 'Voir les Prestataires Nisfy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Progress & Budget Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Avancement */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {isArabic ? 'نسبة الجاهزية' : 'Avancement'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{progressPercent}%</span>
              <span className="text-xs text-slate-500">
                ({completedTasks}/{totalTasks} {isArabic ? 'مهمة' : 'tâches'})
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center font-black">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Budget Estimé */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {isArabic ? 'الميزانية التقديرية' : 'Budget Total Estimé'}
            </span>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400">
              {totalBudgetDzd.toLocaleString()} <span className="text-xs">DZD</span>
            </div>
            <p className="text-[10px] text-slate-400">
              ~{(totalBudgetDzd / 240).toFixed(0)} € Diaspora
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center font-black">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Dépensé / Réglé */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {isArabic ? 'المبلغ المحسوم' : 'Acomptes Réglés'}
            </span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {spentBudgetDzd.toLocaleString()} <span className="text-xs">DZD</span>
            </div>
            <p className="text-[10px] text-slate-400">
              {isArabic ? 'المتبقي:' : 'Reste à prévoir:'}{' '}
              {Math.max(0, totalBudgetDzd - spentBudgetDzd).toLocaleString()} DZD
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-[#FF3823] flex items-center justify-center font-black">
            <HeartHandshake className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stage Selector (J-12, J-6, J-3, J-1, Jour J) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {stagesList.map((stage) => {
          const isSelected = selectedStage === stage.id;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setSelectedStage(stage.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{stage.icon}</span>
              <span>{isArabic ? stage.labelAr : stage.labelFr}</span>
            </button>
          );
        })}
      </div>

      {/* Add Task Trigger */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
          {isArabic ? 'قائمة المهام والتحضيرات' : 'Étapes & Préparatifs recommandés'}
        </h3>
        <button
          type="button"
          onClick={() => setIsAddingTask(!isAddingTask)}
          className="text-xs font-bold text-[#FF3823] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isArabic ? 'إضافة مرحلة مخصصة' : 'Ajouter une étape'}</span>
        </button>
      </div>

      {/* Add Task Form */}
      {isAddingTask && (
        <form
          onSubmit={handleAddTask}
          className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                {isArabic ? 'عنوان المهمة أو التجهيز' : 'Intitulé de la tâche'}
              </label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder={isArabic ? 'مثال: حجز فرقة العيساوة، شراء صينيات القهوة...' : 'Ex: Réservation cortège, achat dragées...'}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-[#FF3823]"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                {isArabic ? 'المبلغ التقديري (DZD)' : 'Coût estimé (DZD)'}
              </label>
              <input
                type="number"
                value={newTaskCost}
                onChange={(e) => setNewTaskCost(e.target.value)}
                placeholder="Ex: 45000"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-[#FF3823]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500">
                {isArabic ? 'المرحلة الزمنية:' : 'Échéance :'}
              </span>
              <select
                value={newTaskStage}
                onChange={(e) => setNewTaskStage(e.target.value as any)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              >
                <option value="j12">J - 12 Mois</option>
                <option value="j6">J - 6 Mois</option>
                <option value="j3">J - 3 Mois</option>
                <option value="j1">J - 1 Mois</option>
                <option value="jour_j">Jour J</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddingTask(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                {isArabic ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#FF3823] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#e0301e]"
              >
                {isArabic ? 'حفظ المهمة' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              {isArabic ? 'لا توجد مهام في هذه المرحلة' : 'Aucune tâche dans cette étape.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                task.completed
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 opacity-80'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
              }`}
            >
              {/* Checkbox + Title */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="min-w-0 flex-1 space-y-1">
                  <p
                    className={`text-sm font-bold text-slate-900 dark:text-white leading-snug ${
                      task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                    }`}
                  >
                    {isArabic ? task.titleAr : task.titleFr}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold uppercase">
                      {task.stage === 'j12' && 'J - 12 Mois'}
                      {task.stage === 'j6' && 'J - 6 Mois'}
                      {task.stage === 'j3' && 'J - 3 Mois'}
                      {task.stage === 'j1' && 'J - 1 Mois'}
                      {task.stage === 'jour_j' && 'Jour J'}
                    </span>

                    {task.estimatedCostDzd > 0 && (
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        {task.estimatedCostDzd.toLocaleString()} DZD
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Prestataire Marketplace or Delete */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {task.recommendedVendorCategory && (
                  <button
                    type="button"
                    onClick={() => onNavigateToMarketplace(task.recommendedVendorCategory)}
                    className="px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#FF3823] border border-orange-200 dark:border-orange-900/50 hover:bg-[#FF3823] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'حجز مقدم الخدمة' : 'Trouver un prestataire'}</span>
                    <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cultural Wisdom Card */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center gap-3">
        <span className="text-2xl">🍯</span>
        <div className="text-xs text-amber-900 dark:text-amber-200">
          <p className="font-black mb-0.5">
            {isArabic ? 'مثل جزائري في بركة الزواج:' : 'Sagesse populaire sur le mariage :'}
          </p>
          <p className="italic opacity-90">
            {isArabic
              ? '« زواج ليلة تدبيرو عام.. والنوايا تفرّج المحاين. »'
              : '« Le mariage d’une nuit se prépare durant un an, et la bonne intention (Nia) aplanit toutes les épreuves. »'}
          </p>
        </div>
      </div>
    </div>
  );
}
