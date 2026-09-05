import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

// Lazy initialization of Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', server: 'nisfy-backend', time: new Date().toISOString() });
  });

  // 💰 POST /api/finance/analyze-budget - Gemini Powered Spending & Savings Analysis
  app.post('/api/finance/analyze-budget', async (req, res) => {
    try {
      const { profile, expenses, language = 'fr' } = req.body;

      if (!profile || !expenses || !Array.isArray(expenses)) {
        return res.status(400).json({
          error: 'Paramètres invalides. Le profil et la liste des dépenses sont requis.',
        });
      }

      const ai = getGeminiClient();

      if (!ai) {
        // Return simulated high quality analysis if no API key is provided
        return res.json({
          success: true,
          mode: 'simulated',
          message: 'Analyse effectuée en mode local (Clé Gemini en attente de configuration).',
          data: generateSmartLocalAnalysis(profile, expenses, language),
        });
      }

      const totalMonthlyExpenses = expenses.reduce(
        (sum: number, exp: any) => sum + (Number(exp.amount) || 0),
        0
      );

      const promptContext = `
Tu es un expert financier matrimonial et conseiller en économie domestique algérienne pour l'application "Nisfy" (نصفي).
L'application aide les jeunes algériens et la diaspora à préparer leur mariage (Zawaj, Choura, Mahr, Salle des fêtes, Logement) et optimiser leur budget quotidien.

INFORMATIONS DU PROFIL UTILISATEUR :
- Revenu mensuel net : ${profile.monthlyIncome} ${profile.currency}
- Épargne actuelle disponible : ${profile.currentSavings} ${profile.currency}
- Objectif d'épargne ciblé : ${profile.targetSavingsGoal} ${profile.currency} (${profile.goalName})
- Échéance souhaitée : ${profile.targetTimelineMonths} mois
- Wilaya / Localisation : ${profile.wilayaName || 'Algérie'} (${profile.wilayaCode || '16'})
- Projet de vie : ${profile.maritalGoal || 'Préparation Mariage'}
- Dépenses mensuelles totales déclarées : ${totalMonthlyExpenses} ${profile.currency}

DÉTAIL DES DÉPENSES DÉCLARÉES :
${expenses
  .map(
    (e: any, idx: number) =>
      `${idx + 1}. [${e.category}] "${e.title}": ${e.amount} ${e.currency} (Nécessité: ${e.necessity || 'flexible'}, Type: ${e.recurrence || 'monthly'})`
  )
  .join('\n')}

MISSION D'ANALYSE :
1. Évalue la santé financière globale sur une échelle de 0 à 100 et un statut ('Excellent', 'Bon', 'À optimiser', 'Critique').
2. Fournis une synthèse perspicace, chaleureuse, encourageante et ultra-concrète (en français et en arabe/darija) sur les points forts et les fuites financières.
3. Analyse l'adéquation avec la règle 50/30/20 (Besoins 50%, Envies 30%, Épargne 20%) adaptée à la réalité algérienne.
4. Identifie les catégories de dépenses les plus lourdes et donne pour chacune une explication tactique.
5. Génère au minimum 3 à 5 conseils d'épargne personnalisés et réalistes dans le contexte algérien (ex: location vs achat pour le Karakou/Chedda, choix de la saison/jour pour la salle des fêtes, achats groupés pour les gâteaux de mariage Chef Nadjet, courses au marché de gros, micro-épargne BaridiMob/CCP, etc.).
6. Élabore une feuille de route progressive (milestones) en 3 à 4 étapes avec des montants cibles.
7. Fournis un proverbe ou dicton algérien inspirant sur l'argent et la prévoyance.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: promptContext,
        config: {
          systemInstruction:
            'Tu es un conseiller financier expert en budget de mariage et économie des ménages algériens (Dinar algérien DZD et Euros pour la Diaspora). Réponds rigoureusement au format JSON strict demandé.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              healthScore: { type: Type.INTEGER, description: 'Score de santé financière de 0 à 100' },
              healthStatus: { type: Type.STRING, description: 'Statut: Excellent, Bon, À optimiser, Critique' },
              healthStatusAr: { type: Type.STRING, description: 'Statut en arabe' },
              summary: { type: Type.STRING, description: 'Synthèse générale en français' },
              summaryAr: { type: Type.STRING, description: 'Synthèse générale en arabe' },
              totalMonthlyExpenses: { type: Type.NUMBER },
              monthlySavingsRate: { type: Type.NUMBER, description: 'Taux d épargne mensuel actuel en pourcentage' },
              projectedMonthsToGoal: { type: Type.NUMBER, description: 'Mois estimés pour atteindre l objectif' },
              estimatedTotalMonthlySavings: { type: Type.NUMBER, description: 'Montant total économisable par mois' },
              rule50_30_20: {
                type: Type.OBJECT,
                properties: {
                  needsPercentage: { type: Type.NUMBER },
                  wantsPercentage: { type: Type.NUMBER },
                  savingsPercentage: { type: Type.NUMBER },
                  assessment: { type: Type.STRING },
                },
                required: ['needsPercentage', 'wantsPercentage', 'savingsPercentage', 'assessment'],
              },
              topSpendingCategories: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    categoryLabel: { type: Type.STRING },
                    amount: { type: Type.NUMBER },
                    percentage: { type: Type.NUMBER },
                    insight: { type: Type.STRING },
                  },
                  required: ['category', 'categoryLabel', 'amount', 'percentage', 'insight'],
                },
              },
              adviceList: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    titleAr: { type: Type.STRING },
                    category: { type: Type.STRING },
                    description: { type: Type.STRING },
                    descriptionAr: { type: Type.STRING },
                    estimatedMonthlySavings: { type: Type.NUMBER },
                    currency: { type: Type.STRING },
                    impactLevel: { type: Type.STRING, description: 'high, medium, low' },
                    difficulty: { type: Type.STRING, description: 'facile, modéré, exigeant' },
                    culturalContextTip: { type: Type.STRING },
                    culturalContextTipAr: { type: Type.STRING },
                  },
                  required: [
                    'id',
                    'title',
                    'category',
                    'description',
                    'estimatedMonthlySavings',
                    'impactLevel',
                    'difficulty',
                  ],
                },
              },
              smartMilestones: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    titleAr: { type: Type.STRING },
                    targetAmount: { type: Type.NUMBER },
                    deadlineMonths: { type: Type.INTEGER },
                    description: { type: Type.STRING },
                    descriptionAr: { type: Type.STRING },
                  },
                  required: ['stepNumber', 'title', 'targetAmount', 'deadlineMonths', 'description'],
                },
              },
              culturalProverb: {
                type: Type.OBJECT,
                properties: {
                  proverbFr: { type: Type.STRING },
                  proverbAr: { type: Type.STRING },
                  meaningFr: { type: Type.STRING },
                },
                required: ['proverbFr', 'proverbAr', 'meaningFr'],
              },
            },
            required: [
              'healthScore',
              'healthStatus',
              'summary',
              'totalMonthlyExpenses',
              'monthlySavingsRate',
              'projectedMonthsToGoal',
              'estimatedTotalMonthlySavings',
              'rule50_30_20',
              'topSpendingCategories',
              'adviceList',
              'smartMilestones',
              'culturalProverb',
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Réponse vide de Gemini');
      }

      const parsedData = JSON.parse(responseText);
      parsedData.generatedAt = new Date().toISOString();

      res.json({
        success: true,
        mode: 'gemini-live',
        data: parsedData,
      });
    } catch (err: any) {
      console.error('Erreur dans /api/finance/analyze-budget:', err);
      // Graceful fallback to smart local analysis
      const fallback = generateSmartLocalAnalysis(req.body.profile, req.body.expenses, req.body.language || 'fr');
      res.json({
        success: true,
        mode: 'fallback',
        fallbackError: err.message,
        data: fallback,
      });
    }
  });

  // 💬 POST /api/finance/chat-advisor - Interactive Chat with Gemini Financial Advisor
  app.post('/api/finance/chat-advisor', async (req, res) => {
    try {
      const { userQuestion, profile, contextSummary } = req.body;

      if (!userQuestion) {
        return res.status(400).json({ error: 'Question utilisateur manquante.' });
      }

      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          reply: `💡 [Conseil IA Nisfy] : Pour réussir votre projet « ${profile?.goalName || 'Mariage & Épargne'} », la clé est d'anticiper la signature des prestataires (salle, traiteur, photographe) au moins 6 mois à l'avance pour bloquer les tarifs. N'hésitez pas à comparer les prestataires vérifiés directement dans la rubrique Marketplace de Nisfy.`,
        });
      }

      const prompt = `
Tu es le Conseiller Financier & Épargne officiel de l'application Nisfy (نصفي).
L'utilisateur a une question spécifique sur son budget, son mariage ou son épargne :
Question: "${userQuestion}"

Contexte de l'utilisateur :
- Revenu : ${profile?.monthlyIncome || 'N/A'} ${profile?.currency || 'DZD'}
- Épargne actuelle : ${profile?.currentSavings || 'N/A'} ${profile?.currency || 'DZD'}
- Objectif : ${profile?.targetSavingsGoal || 'N/A'} ${profile?.currency || 'DZD'} (${profile?.goalName || 'Mariage'})
- Wilaya : ${profile?.wilayaName || 'Algérie'}
- Résumé financier précédent : ${contextSummary || 'N/A'}

Consignes :
1. Réponds de manière chaleureuse, précise, professionnelle et ancrée dans la réalité algérienne (avec des astuces concrètes).
2. Sois concis (100 à 180 mots), structure ta réponse avec des puces claires.
3. Reste encourageant et respectueux des traditions algériennes (Halal, Zawaj, solidarité familiale).
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Tu es un conseiller financier bienveillant et expert en économie domestique et mariage algérien.',
        },
      });

      res.json({
        reply: response.text || 'Désolé, je n ai pas pu traiter votre demande pour le moment.',
      });
    } catch (err: any) {
      console.error('Erreur dans /api/finance/chat-advisor:', err);
      res.json({
        reply:
          '💡 Pour réduire vos coûts de mariage sans perdre en convivialité, privilégiez un cortège maîtrisé, comparez les packs Ziana sur Nisfy et groupez les commandes d ingrédients chez les grossistes locaux.',
      });
    }
  });

  // Vite Middleware for development vs static for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

// Helper: Smart Local Analysis Generator (Offline / Fallback Resilience)
function generateSmartLocalAnalysis(profile: any, expenses: any[], language: string) {
  const currency = profile.currency || 'DZD';
  const monthlyIncome = Number(profile.monthlyIncome) || 100000;
  const targetGoal = Number(profile.targetSavingsGoal) || 1000000;
  const currentSavings = Number(profile.currentSavings) || 0;
  const targetMonths = Number(profile.targetTimelineMonths) || 12;

  const totalMonthlyExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const remainingMonthly = Math.max(0, monthlyIncome - totalMonthlyExpenses);
  const currentSavingsRate = Math.round((remainingMonthly / (monthlyIncome || 1)) * 100);

  // Health Score Calculation
  let healthScore = 70;
  if (currentSavingsRate >= 30) healthScore += 18;
  else if (currentSavingsRate >= 15) healthScore += 8;
  else healthScore -= 15;

  if (totalMonthlyExpenses > monthlyIncome) healthScore -= 25;
  healthScore = Math.max(20, Math.min(95, healthScore));

  let healthStatus: 'Excellent' | 'Bon' | 'À optimiser' | 'Critique' = 'Bon';
  if (healthScore >= 85) healthStatus = 'Excellent';
  else if (healthScore >= 65) healthStatus = 'Bon';
  else if (healthScore >= 45) healthStatus = 'À optimiser';
  else healthStatus = 'Critique';

  // Group by category
  const categoryTotals: Record<string, number> = {};
  for (const exp of expenses) {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + (Number(exp.amount) || 0);
  }

  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amount]) => ({
      category: cat as any,
      categoryLabel: formatCategoryLabel(cat),
      amount,
      percentage: totalMonthlyExpenses > 0 ? Math.round((amount / totalMonthlyExpenses) * 1000) / 10 : 0,
      insight: `Représente ${Math.round((amount / (totalMonthlyExpenses || 1)) * 100)}% de vos sorties mensuelles.`,
    }));

  const potentialSavings = Math.round(totalMonthlyExpenses * 0.22);
  const optimizedMonthlySavings = remainingMonthly + potentialSavings;
  const projectedMonths =
    optimizedMonthlySavings > 0
      ? Math.max(1, Math.round(((targetGoal - currentSavings) / optimizedMonthlySavings) * 10) / 10)
      : targetMonths;

  return {
    healthScore,
    healthStatus,
    healthStatusAr: healthStatus === 'Excellent' ? 'ممتاز' : healthStatus === 'Bon' ? 'جيد جداً' : 'بحاجة لترشيد',
    summary: `Votre capacité d'épargne actuelle est de ${remainingMonthly.toLocaleString()} ${currency}/mois (${currentSavingsRate}% des revenus). En appliquant les optimisations suggérées sur les postes de loisirs et trousseau, vous pouvez libérer environ ${potentialSavings.toLocaleString()} ${currency} additionnels chaque mois.`,
    summaryAr: `قدرتك الادخارية الحالية تبلغ ${remainingMonthly.toLocaleString()} ${currency} شهرياً. بتطبيق التوصيات المرفقة يمكنك توفير ${potentialSavings.toLocaleString()} ${currency} إضافية شهرياً.`,
    totalMonthlyExpenses,
    monthlySavingsRate: currentSavingsRate,
    projectedMonthsToGoal: projectedMonths,
    estimatedTotalMonthlySavings: potentialSavings,
    rule50_30_20: {
      needsPercentage: Math.round(((totalMonthlyExpenses * 0.6) / (monthlyIncome || 1)) * 100),
      wantsPercentage: Math.round(((totalMonthlyExpenses * 0.4) / (monthlyIncome || 1)) * 100),
      savingsPercentage: currentSavingsRate,
      assessment:
        currentSavingsRate >= 20
          ? 'Votre ratio d épargne respecte parfaitement la règle financière 50/30/20.'
          : 'Votre ratio d épargne est légèrement en-dessous des 20% recommandés. Une réduction ciblée des extras suffira à rééquilibrer.',
    },
    topSpendingCategories: sortedCategories.slice(0, 4),
    adviceList: [
      {
        id: 'adv-loc-tenues',
        title: 'Location de Tenues de Cérémonie vs Achat Neuf',
        titleAr: 'كراء أزياء الأعراس بدل الشراء',
        category: 'clothing_trousseau',
        description:
          'La location des tenues traditionnelles (Karakou, Caftan royal, Chedda) auprès de zianas partenaires Nisfy permet d économiser jusqu à 50% du budget habillement.',
        descriptionAr: 'كراء الأزياء التقليدية يوفر أكثر من نصف ميزانية التجهيز مع الحفاظ على الفخامة.',
        estimatedMonthlySavings: Math.round(currency === 'EUR' ? 150 : 15000),
        currency,
        impactLevel: 'high',
        difficulty: 'facile',
        culturalContextTip: 'Consultez les prestataires de votre wilaya sur la Marketplace Nisfy.',
      },
      {
        id: 'adv-salle-timing',
        title: 'Réservation Salle & Photographe en Période Optimisée',
        titleAr: 'اختيار توقيت ذكي لحجز القاعة والتصوير',
        category: 'wedding_venue',
        description:
          'Opter pour une date en semaine ou hors haute saison estivale (automne/printemps) débloque des remises jusqu à 30% sur la salle des fêtes et l animation musicale.',
        descriptionAr: 'إقامة الحفل في غير أوقات الذروة يمنحك تخفيضات هامة من أصحاب القاعات.',
        estimatedMonthlySavings: Math.round(currency === 'EUR' ? 120 : 12000),
        currency,
        impactLevel: 'high',
        difficulty: 'modéré',
        culturalContextTip: 'Accordez les plannings familiaux pour un jeudi ou un dimanche après-midi.',
      },
      {
        id: 'adv-grossiste-gateaux',
        title: 'Approvisionnement Gros & Recettes Chef Nadjet',
        titleAr: 'اقتناء لوازم الحلويات بالجملة مع وصفات الشيف نجاة',
        category: 'catering_sweets',
        description:
          'Acheter les amandes, miel, boîtes et farines directement chez les grossistes en gros conditionnements réduit le coût des gâteaux traditionnels (Baklawa, Makroud, Tcharek) de 35%.',
        descriptionAr: 'شراء مكسرات ولوازم الحلويات بالجملة يوفر 35% من تكلفة الحلويات التقليدية.',
        estimatedMonthlySavings: Math.round(currency === 'EUR' ? 80 : 8000),
        currency,
        impactLevel: 'medium',
        difficulty: 'facile',
        culturalContextTip: 'Suivez les dosages exacts de Chef Nadjet sur la chaîne Nisfy pour zéro gaspillage.',
      },
    ],
    smartMilestones: [
      {
        stepNumber: 1,
        title: 'Constitution du Fonds de Réserve Initial',
        titleAr: 'تأسيس صندوق الأمان المالي',
        targetAmount: Math.round(targetGoal * 0.2),
        deadlineMonths: 2,
        description: 'Sécuriser le premier palier pour les acomptes des prestataires clés.',
        completed: true,
      },
      {
        stepNumber: 2,
        title: 'Réservation Salle des Fêtes & Contrats Signés',
        titleAr: 'حجز القاعة وتثبيت الاتفاقات',
        targetAmount: Math.round(targetGoal * 0.5),
        deadlineMonths: 5,
        description: 'Bloquer les dates et figer les devis avec garanties Nisfy.',
        completed: false,
      },
      {
        stepNumber: 3,
        title: 'Finalisation Choura, Alliances & Logement',
        titleAr: 'إتمام الشورة وخواتم الزواج وتأثيث السكن',
        targetAmount: Math.round(targetGoal * 0.85),
        deadlineMonths: 8,
        description: 'Derniers achats groupés et installation de l équipement.',
        completed: false,
      },
      {
        stepNumber: 4,
        title: 'Grand Jour & Voyage de Noces en Sérénité',
        titleAr: 'يوم الزفاف وشهر العسل بسلام وأمان',
        targetAmount: targetGoal,
        deadlineMonths: targetMonths,
        description: 'Célébration réussie sans stress ni endettement.',
        completed: false,
      },
    ],
    culturalProverb: {
      proverbFr: '« الصبر مفتاح الفرج، والدرهم المحفوظ سلطان. »',
      proverbAr: '« الصبر مفتاح الفرج، والدرهم المحفوظ سلطان. »',
      meaningFr: '« La patience est la clé du soulagement, et l argent préservé est une force souveraine. »',
    },
    generatedAt: new Date().toISOString(),
  };
}

function formatCategoryLabel(cat: string): string {
  const map: Record<string, string> = {
    wedding_venue: 'Salle des Fêtes & Cortège',
    clothing_trousseau: 'Trousseau (Choura) & Tenues',
    catering_sweets: 'Traiteur & Gâteaux',
    jewelry_mahr: 'Dot (Mahr) & Joaillerie',
    housing_furniture: 'Logement & Mobilier',
    lifestyle_dining: 'Sorties & Cafés',
    travel_honeymoon: 'Voyage de Noces',
    youth_shop: 'Achats Nisfy Shop',
    bills_subscriptions: 'Factures & Transports',
    emergency_other: 'Imprévus & Divers',
  };
  return map[cat] || cat;
}

startServer();

