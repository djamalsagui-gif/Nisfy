export type ExpenseCategory =
  | 'wedding_venue'
  | 'clothing_trousseau'
  | 'catering_sweets'
  | 'jewelry_mahr'
  | 'housing_furniture'
  | 'lifestyle_dining'
  | 'travel_honeymoon'
  | 'youth_shop'
  | 'bills_subscriptions'
  | 'emergency_other';

export interface ExpenseItem {
  id: string;
  category: ExpenseCategory;
  title: string;
  titleAr?: string;
  amount: number;
  currency: 'DZD' | 'EUR';
  necessity: 'essential' | 'flexible' | 'luxury';
  date: string;
  recurrence: 'monthly' | 'one_time';
  notes?: string;
}

export interface UserFinancialProfile {
  monthlyIncome: number;
  currency: 'DZD' | 'EUR';
  currentSavings: number;
  targetSavingsGoal: number;
  goalName: string;
  targetTimelineMonths: number;
  wilayaCode?: string;
  wilayaName?: string;
  maritalGoal?: 'mariage_proche' | 'fiancailles' | 'projet_logement' | 'etudiant_actif' | 'diaspora';
}

export interface GeminiSavingsAdvice {
  id: string;
  title: string;
  titleAr?: string;
  category: string;
  description: string;
  descriptionAr?: string;
  estimatedMonthlySavings: number;
  currency: 'DZD' | 'EUR';
  impactLevel: 'high' | 'medium' | 'low';
  difficulty: 'facile' | 'modéré' | 'exigeant';
  culturalContextTip?: string;
  culturalContextTipAr?: string;
}

export interface SmartSavingMilestone {
  stepNumber: number;
  title: string;
  titleAr?: string;
  targetAmount: number;
  deadlineMonths: number;
  description: string;
  descriptionAr?: string;
  completed?: boolean;
}

export interface GeminiFinancialAnalysisResult {
  healthScore: number; // 0 - 100
  healthStatus: 'Excellent' | 'Bon' | 'À optimiser' | 'Critique';
  healthStatusAr?: string;
  summary: string;
  summaryAr?: string;
  totalMonthlyExpenses: number;
  monthlySavingsRate: number; // percentage (e.g. 25%)
  projectedMonthsToGoal: number;
  estimatedTotalMonthlySavings: number;
  rule50_30_20: {
    needsPercentage: number; // target ~50%
    wantsPercentage: number; // target ~30%
    savingsPercentage: number; // target ~20%
    assessment: string;
  };
  topSpendingCategories: {
    category: ExpenseCategory;
    categoryLabel: string;
    amount: number;
    percentage: number;
    insight: string;
  }[];
  adviceList: GeminiSavingsAdvice[];
  smartMilestones: SmartSavingMilestone[];
  culturalProverb: {
    proverbFr: string;
    proverbAr: string;
    meaningFr: string;
  };
  generatedAt: string;
}

export interface FinanceAdvisorChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
}
