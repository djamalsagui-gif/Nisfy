export interface ThematicRoom {
  id: string;
  nameFr: string;
  nameAr: string;
  emoji: string;
  descriptionFr: string;
  descriptionAr: string;
  activeListeners: number;
  speakersCount: number;
  tags: string[];
  bannerGradient: string;
  hostName: string;
  hostAvatar: string;
  isOfficialMod: boolean;
}

export const THEMATIC_ROOMS: ThematicRoom[] = [
  {
    id: 'room_zawaj',
    nameFr: 'Zawaj & Relations',
    nameAr: 'الزواج والعلاقات الجادة',
    emoji: '💍',
    descriptionFr: 'Échanges sérieux sur les valeurs du mariage, vision du foyer, conseils et témoignages respectueux.',
    descriptionAr: 'حوارات جادة حول أسس الزواج السعيد، بناء الأسرة وتبادل التجارب في كنف الاحترام.',
    activeListeners: 48,
    speakersCount: 4,
    tags: ['Zawaj', 'Famille', 'Sérieux', 'Sunnah & Tradition'],
    bannerGradient: 'from-rose-600 via-pink-600 to-amber-600',
    hostName: 'Dr. Anis (El Biar)',
    hostAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    isOfficialMod: true,
  },
  {
    id: 'room_cuisine',
    nameFr: 'Cuisine DZ & Terroir',
    nameAr: 'المطبخ الجزائري والأصالة',
    emoji: '🍲',
    descriptionFr: 'Secrets culinaires des 58 wilayas : Chorba, Rechta, Couscous, Makroud et délices traditionnels.',
    descriptionAr: 'أسرار الطبخ التقليدي عبر 58 ولاية، وصفات الأمهات وأطايب التراث الجزائري العريق.',
    activeListeners: 32,
    speakersCount: 3,
    tags: ['Rechta', 'Couscous', 'Chorba Frik', 'Gâteaux'],
    bannerGradient: 'from-amber-600 via-orange-600 to-red-600',
    hostName: 'Yasmine (Staoueli)',
    hostAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    isOfficialMod: false,
  },
  {
    id: 'room_diaspora',
    nameFr: 'Diaspora & Expatriation (DZ69)',
    nameAr: 'مغتربو الجزائر والشتات 69',
    emoji: '✈️',
    descriptionFr: 'Vivre à l’étranger (France, Canada, Golf, UK), démarches, liens avec le pays et projets de retour.',
    descriptionAr: 'تجارب المغتربين في الخارج، الحفاظ على الهوية، مشاريع الاستثمار والعودة إلى أرض الوطن.',
    activeListeners: 56,
    speakersCount: 5,
    tags: ['Lyon 69', 'Paris', 'Montréal', 'Diaspora DZ', 'Retour au pays'],
    bannerGradient: 'from-indigo-600 via-blue-600 to-cyan-600',
    hostName: 'Mehdi 🦁 (Lyon 69)',
    hostAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    isOfficialMod: true,
  },
  {
    id: 'room_business',
    nameFr: 'Entrepreneuriat & Business',
    nameAr: 'ريادة الأعمال والمشاريع',
    emoji: '💼',
    descriptionFr: 'Opportunités économiques, création d’entreprises en Algérie, tech, e-commerce et networking.',
    descriptionAr: 'فرص الاستثمار، إطلاق الشركات الناشئة، التجارة الإلكترونية وتبادل الخبرات المهنية.',
    activeListeners: 29,
    speakersCount: 3,
    tags: ['Startup', 'Tech DZ', 'Investissement', 'Réseau'],
    bannerGradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    hostName: 'Sofiane (Consultant Finance)',
    hostAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    isOfficialMod: false,
  },
  {
    id: 'room_poetry',
    nameFr: 'Poésie, Chaâbi & Culture DZ',
    nameAr: 'الشعر، الشعبي والتراث',
    emoji: '🪕',
    descriptionFr: 'Slam, poésie Melhoun, histoire des villes millénaires, musique andalouse et contes populaires.',
    descriptionAr: 'الشعر الملحون، روائع الفن الشعبي والأندلسي، وقصص وتاريخ المدن العريقة.',
    activeListeners: 21,
    speakersCount: 2,
    tags: ['Chaâbi', 'Andalou', 'Melhoun', 'Patrimoine'],
    bannerGradient: 'from-purple-600 via-fuchsia-600 to-rose-600',
    hostName: 'Yacine (Constantine)',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    isOfficialMod: false,
  },
  {
    id: 'room_sport',
    nameFr: 'Sport & Bien-être',
    nameAr: 'الرياضة والصحة والعافية',
    emoji: '⚽',
    descriptionFr: 'Actualités des Verts (Equipe Nationale), fitness, randonnées dans les parcs nationaux et santé.',
    descriptionAr: 'متابعة أخبار المنتخب الوطني، نصائح اللياقة البدنية والخرجات الرياضية في الطبيعة.',
    activeListeners: 24,
    speakersCount: 2,
    tags: ['Les Verts', 'Fitness', 'Randonnée Djurdjura', 'Santé'],
    bannerGradient: 'from-green-600 via-emerald-600 to-teal-700',
    hostName: 'Ryad 🌊 (Alger)',
    hostAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    isOfficialMod: false,
  },
];
