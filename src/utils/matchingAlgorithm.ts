import { UserProfile } from '../types';

export interface CompatibilityResult {
  score: number; // 0 - 100%
  matchingFactors: {
    labelFr: string;
    labelAr: string;
    score: number;
  }[];
  verdictFr: string;
  verdictAr: string;
}

export function calculateCompatibilityScore(
  userA: UserProfile,
  userB: UserProfile
): CompatibilityResult {
  let score = 0; // Start at 0 and add up
  const factors: { labelFr: string; labelAr: string; score: number }[] = [];

  // 1. Wilaya Compatibility (+30pts)
  if (userA.wilayaCode && userB.wilayaCode && userA.wilayaCode === userB.wilayaCode) {
    score += 30;
    factors.push({
      labelFr: `Même Wilaya (${userA.wilayaCode})`,
      labelAr: `نفس الولاية (${userA.wilayaCode})`,
      score: 30,
    });
  }

  // 2. Shared Interests (+10pts each)
  const commonInterests = (userA.interests || []).filter((interest) =>
    (userB.interests || []).some(
      (bInterest) => bInterest.toLowerCase() === interest.toLowerCase()
    )
  );

  if (commonInterests.length > 0) {
    const interestPoints = commonInterests.length * 10;
    score += interestPoints;
    factors.push({
      labelFr: `${commonInterests.length} centres d’intérêt en commun`,
      labelAr: `${commonInterests.length} اهتمامات مشتركة`,
      score: interestPoints,
    });
  }

  // 3. Marital Status (+5pts)
  if (userA.maritalStatus && userB.maritalStatus && userA.maritalStatus === userB.maritalStatus) {
    score += 5;
    factors.push({
      labelFr: `Même statut marital (${userA.maritalStatus})`,
      labelAr: `نفس الحالة الاجتماعية`,
      score: 5,
    });
  }

  // Add a base baseline if the score is too low, but keep it realistic. 
  // Nisfy wants to show high percentages usually, let's just add 40 as a baseline so they don't get 0%.
  score += 40;

  // Cap score between 0 and 99%
  const finalScore = Math.min(Math.max(score, 45), 99);

  let verdictFr = 'Bonne affinité potentielle !';
  let verdictAr = 'توافق جيد محتمل !';

  if (finalScore >= 85) {
    verdictFr = 'Harmonie exceptionnelle ! 💍✨';
    verdictAr = 'انسجام استثنائي ! 💍✨';
  } else if (finalScore >= 70) {
    verdictFr = 'Forte compatibilité.';
    verdictAr = 'توافق عالٍ جداً.';
  }

  return {
    score: finalScore,
    matchingFactors: factors,
    verdictFr,
    verdictAr,
  };
}
