export interface AlgerianProverb {
  id: string;
  arabic: string;
  french: string;
  theme: string;
}

export const ALGERIAN_PROVERBS: AlgerianProverb[] = [
  {
    id: 'prov_1',
    arabic: '« الصبر مفتاح الفرج »',
    french: '« La patience est la clé du soulagement et de la délivrance. »',
    theme: 'Sagesse',
  },
  {
    id: 'prov_2',
    arabic: '« العجلة من الشيطان والتأني من الرحمن »',
    french: '« La précipitation vient du diable, la réflexion posée vient du Tout-Miséricordieux. »',
    theme: 'Mariage & Choix',
  },
  {
    id: 'prov_3',
    arabic: '« اللي يحب القط يحب أولاده »',
    french: '« Qui aime sincèrement une personne accueille avec bienveillance toute sa famille. »',
    theme: 'Amour & Famille',
  },
  {
    id: 'prov_4',
    arabic: '« خيار الناس من نفع الناس »',
    french: '« Les meilleurs parmi les hommes sont les plus bénéfiques à leurs semblables. »',
    theme: 'Générosité',
  },
  {
    id: 'prov_5',
    arabic: '« كل عطلة فيها خير »',
    french: '« Dans chaque retard ou contretemps réside un bienfait caché. »',
    theme: 'Destin (Mektoub)',
  },
  {
    id: 'prov_6',
    arabic: '« يد واحدة ما تصفق »',
    french: '« Une seule main ne peut applaudir : l’union et l’entraide font la force du couple. »',
    theme: 'Harmonie',
  },
  {
    id: 'prov_7',
    arabic: '« الزواج نصف الدين والوفاء تمامه »',
    french: '« Le mariage est la moitié de la foi, et la fidélité en est l’accomplissement. »',
    theme: 'Zawaj',
  },
  {
    id: 'prov_8',
    arabic: '« زين الوجه يروح وزين القلب يدوم »',
    french: '« La beauté du visage s’estompe avec le temps, mais la beauté du cœur demeure éternelle. »',
    theme: 'Authenticité',
  },
];
