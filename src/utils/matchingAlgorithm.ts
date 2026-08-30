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
        labelFr: `Même calendrier de mariage (${userA.marriageTimeline.replace('-', ' ')})`,
        labelAr: `توقيت زواج متطابق تماماً`,
        score: 25,
        icon: '💍',
      });
    } else {
      points += 15;
      factors.push({
        labelFr: `Vision du projet de vie compatible`,
        labelAr: `رؤية متوافقة لمشروع الزواج`,
        score: 15,
        icon: '💍',
      });
    }
  } else {
    points += 15;
  }

  // 2. Wilaya & Geographic Proximity / Diaspora (+25pts)
  if (userA.wilayaCode && userB.wilayaCode) {
    if (userA.wilayaCode === userB.wilayaCode) {
      points += 25;
      factors.push({
        labelFr: `Même Wilaya de résidence (${userA.wilayaCode})`,
        labelAr: `نفس ولاية الإقامة (${userA.wilayaCode})`,
        score: 25,
        icon: '📍',
      });
    } else {
      // Both in diaspora or relocation friendly
      const isADiaspora = parseInt(userA.wilayaCode) >= 59;
      const isBDiaspora = parseInt(userB.wilayaCode) >= 59;

      if (isADiaspora && isBDiaspora) {
        points += 20;
        factors.push({
          labelFr: `Communauté Diaspora algérienne partagée 🌍`,
          labelAr: `أبناء الجالية الجزائرية بالخارج 🌍`,
          score: 20,
          icon: '🌍',
        });
      } else if (userA.relocation === 'possible' || userB.relocation === 'possible' || userA.relocation === 'ouvert_a_tout' || userB.relocation === 'ouvert_a_tout') {
        points += 16;
        factors.push({
          labelFr: `Ouvert(e) à la mobilité / déménagement`,
          labelAr: `مرونة واستعداد للتنقل وتغيير السكن`,
          score: 16,
          icon: '✈️',
        });
      } else {
        points += 10;
      }
    }
  }

  // 3. Cultural & Family Roots Affinities (+15pts)
  if (userA.familyOrigin && userB.familyOrigin) {
    if (userA.familyOrigin.toLowerCase() === userB.familyOrigin.toLowerCase()) {
      points += 15;
      factors.push({
        labelFr: `Mêmes racines culturelles & traditions (${userA.familyOrigin})`,
        labelAr: `نفس الأصول والعادات والتقاليد (${userA.familyOrigin})`,
        score: 15,
        icon: '🇩🇿',
      });
    } else {
      points += 10;
      factors.push({
        labelFr: `Ouverture culturelle inter-wilayas`,
        labelAr: `انفتاح وتنوع ثقافي جزائري متكامل`,
        score: 10,
        icon: '🤝',
      });
    }
  }

  // 4. Religious Practice & Values Alignment (+15pts)
  if (userA.religiousPractice && userB.religiousPractice) {
    if (userA.religiousPractice === userB.religiousPractice) {
      points += 15;
      factors.push({
        labelFr: `Harmonie sur la pratique religieuse et spirituelle`,
        labelAr: `تطابق في الالتزام والقيم الروحية`,
        score: 15,
        icon: '🤲',
      });
    } else {
      points += 8;
    }
  }

  // 5. Shared Interests & Lifestyle Values (+6pts each, max 24pts)
  const commonInterests = (userA.interests || []).filter((interest) =>
    (userB.interests || []).some(
      (bInterest) => bInterest.toLowerCase() === interest.toLowerCase()
    )
  );

  if (commonInterests.length > 0) {
    const interestPoints = Math.min(commonInterests.length * 6, 24);
    points += interestPoints;
    factors.push({
      labelFr: `${commonInterests.length} centres d'intérêt & passions en commun`,
      labelAr: `${commonInterests.length} اهتمامات وهوايات مشتركة`,
      score: interestPoints,
      icon: '✨',
    });
  }

  // 6. Marital Status & Family Vision (+15pts)
  if (userA.maritalStatus && userB.maritalStatus) {
    if (userA.maritalStatus === userB.maritalStatus) {
      points += 15;
      factors.push({
        labelFr: `Situation familiale en pleine cohérence`,
        labelAr: `انسجام في الوضع العائلي والشخصي`,
        score: 15,
        icon: '👨‍👩‍👧',
      });
    } else {
      points += 8;
    }
  } else {
    points += 10;
  }

  // 7. Verification & Seriousness Badge (+10pts)
  if (userB.marriageVerified || userB.hasBlueBadge || userB.verified) {
    points += 10;
    factors.push({
      labelFr: `Profil certifié avec badge Zawaj & vérification`,
      labelAr: `حساب موثق ومؤكد للزواج الجاد`,
      score: 10,
      icon: '🛡️',
    });
  }

  // Base balance baseline (minimum 60%, max 99%)
  const calculatedScore = Math.min(Math.max(points + 18, 62), 99);

  let verdictFr = 'Excellente affinité matrimoniale';
  let verdictAr = 'توافق ممتاز للزواج وبناء أسرة';

  if (calculatedScore >= 90) {
    verdictFr = 'Harmonie parfaite & coup de cœur potentiel ! 🌸💍';
    verdictAr = 'انسجام تام وتوافق مثالي للزواج ! 🌸💍';
  } else if (calculatedScore >= 80) {
    verdictFr = 'Très forte compatibilité de valeurs & projet de vie';
    verdictAr = 'توافق عالٍ جداً في المبادئ ومشروع المستقبل';
  }

  return {
    score: calculatedScore,
    matchingFactors: factors,
    verdictFr,
    verdictAr,
  };
}

