import { UserProfile } from '../types';

export interface CompatibilityFactor {
  labelFr: string;
  labelAr: string;
  score: number;
  icon?: string;
}

export interface CompatibilityResult {
  score: number; // 0 - 100%
  matchingFactors: CompatibilityFactor[];
  verdictFr: string;
  verdictAr: string;
}

export function calculateCompatibilityScore(
  userA: UserProfile,
  userB: UserProfile
): CompatibilityResult {
  let points = 0;
  const factors: CompatibilityFactor[] = [];

  // 1. Life Project & Marriage Intentions (+25pts)
  if (userA.marriageTimeline && userB.marriageTimeline) {
    if (userA.marriageTimeline === userB.marriageTimeline) {
      points += 25;
      factors.push({
        labelFr: `Projet de vie & délai mariage identiques (${userA.marriageTimeline})`,
        labelAr: `مشروع حياة وتوقيت زواج متطابق`,
        score: 25,
        icon: '💍',
      });
    } else {
      points += 15;
      factors.push({
        labelFr: `Vision du mariage compatible`,
        labelAr: `رؤية متوافقة للزواج`,
        score: 15,
        icon: '💍',
      });
    }
  } else {
    points += 15;
  }

  // 2. Wilaya & Geographic Proximity (+25pts)
  if (userA.wilayaCode && userB.wilayaCode) {
    if (userA.wilayaCode === userB.wilayaCode) {
      points += 25;
      factors.push({
        labelFr: `Même wilaya de résidence (${userA.wilayaCode})`,
        labelAr: `نفس ولاية الإقامة (${userA.wilayaCode})`,
        score: 25,
        icon: '📍',
      });
    } else {
      // Different wilaya but willing to relocate
      if (userA.relocation === 'possible' || userB.relocation === 'possible') {
        points += 15;
        factors.push({
          labelFr: `Ouvert(e) au déménagement / mobilité`,
          labelAr: `استعداد للانتقال وتغيير السكن`,
          score: 15,
          icon: '✈️',
        });
      } else {
        points += 10;
      }
    }
  }

  // 3. Shared Interests & Lifestyle Values (+6pts each, max 24pts)
  const commonInterests = (userA.interests || []).filter((interest) =>
    (userB.interests || []).some(
      (bInterest) => bInterest.toLowerCase() === interest.toLowerCase()
    )
  );

  if (commonInterests.length > 0) {
    const interestPoints = Math.min(commonInterests.length * 6, 24);
    points += interestPoints;
    factors.push({
      labelFr: `${commonInterests.length} centres d'intérêt & valeurs partagés`,
      labelAr: `${commonInterests.length} اهتمامات وقيم مشتركة`,
      score: interestPoints,
      icon: '✨',
    });
  }

  // 4. Marital Status & Family Vision (+15pts)
  if (userA.maritalStatus && userB.maritalStatus) {
    if (userA.maritalStatus === userB.maritalStatus) {
      points += 15;
      factors.push({
        labelFr: `Situation familiale harmonieuse`,
        labelAr: `تناغم في الحالة العائلية`,
        score: 15,
        icon: '🤝',
      });
    } else {
      points += 8;
    }
  } else {
    points += 10;
  }

  // 5. Verification & Trust Score Bonus (+10pts)
  if (userB.verified || userB.hasBlueBadge || userB.marriageVerified) {
    points += 10;
    factors.push({
      labelFr: `Profil vérifié et certifié sérieux`,
      labelAr: `حساب موثق وجاد`,
      score: 10,
      icon: '🛡️',
    });
  }

  // Base balance baseline
  const calculatedScore = Math.min(Math.max(points + 20, 55), 98);

  let verdictFr = 'Bonne affinité potentielle';
  let verdictAr = 'توافق جيد محتمل';

  if (calculatedScore >= 88) {
    verdictFr = 'Harmonie exceptionnelle ! 💍✨';
    verdictAr = 'انسجام استثنائي ! 💍✨';
  } else if (calculatedScore >= 75) {
    verdictFr = 'Forte compatibilité de valeurs';
    verdictAr = 'توافق عالٍ في القيم والرؤية';
  }

  return {
    score: calculatedScore,
    matchingFactors: factors,
    verdictFr,
    verdictAr,
  };
}

