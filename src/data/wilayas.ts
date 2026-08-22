export interface WilayaItem {
  code: string;
  name: string;
  arabicName: string;
  region: 'centre' | 'est' | 'ouest' | 'sud' | 'diaspora';
  flag: string;
  isDiaspora?: boolean;
}

export const WILAYAS_69: WilayaItem[] = [
  // Les 58 Wilayas Nationales d'Algérie
  { code: '01', name: 'Adrar', arabicName: 'أدرار', region: 'sud', flag: '🇩🇿' },
  { code: '02', name: 'Chlef', arabicName: 'الشلف', region: 'ouest', flag: '🇩🇿' },
  { code: '03', name: 'Laghouat', arabicName: 'الأغواط', region: 'sud', flag: '🇩🇿' },
  { code: '04', name: 'Oum El Bouaghi', arabicName: 'أم البواقي', region: 'est', flag: '🇩🇿' },
  { code: '05', name: 'Batna', arabicName: 'باتنة', region: 'est', flag: '🇩🇿' },
  { code: '06', name: 'Béjaïa', arabicName: 'بجاية', region: 'centre', flag: '🇩🇿' },
  { code: '07', name: 'Biskra', arabicName: 'بسكرة', region: 'sud', flag: '🇩🇿' },
  { code: '08', name: 'Béchar', arabicName: 'بشار', region: 'sud', flag: '🇩🇿' },
  { code: '09', name: 'Blida', arabicName: 'البليدة', region: 'centre', flag: '🇩🇿' },
  { code: '10', name: 'Bouira', arabicName: 'البويرة', region: 'centre', flag: '🇩🇿' },
  { code: '11', name: 'Tamanrasset', arabicName: 'تمنراست', region: 'sud', flag: '🇩🇿' },
  { code: '12', name: 'Tébessa', arabicName: 'تبسة', region: 'est', flag: '🇩🇿' },
  { code: '13', name: 'Tlemcen', arabicName: 'تلمسان', region: 'ouest', flag: '🇩🇿' },
  { code: '14', name: 'Tiaret', arabicName: 'تيارت', region: 'ouest', flag: '🇩🇿' },
  { code: '15', name: 'Tizi Ouzou', arabicName: 'تيزي وزو', region: 'centre', flag: '🇩🇿' },
  { code: '16', name: 'Alger', arabicName: 'الجزائر العاصمة', region: 'centre', flag: '🇩🇿' },
  { code: '17', name: 'Djelfa', arabicName: 'الجلفة', region: 'sud', flag: '🇩🇿' },
  { code: '18', name: 'Jijel', arabicName: 'جيجل', region: 'est', flag: '🇩🇿' },
  { code: '19', name: 'Sétif', arabicName: 'سطيف', region: 'est', flag: '🇩🇿' },
  { code: '20', name: 'Saïda', arabicName: 'سعيدة', region: 'ouest', flag: '🇩🇿' },
  { code: '21', name: 'Skikda', arabicName: 'سكيكدة', region: 'est', flag: '🇩🇿' },
  { code: '22', name: 'Sidi Bel Abbès', arabicName: 'سيدي بلعباس', region: 'ouest', flag: '🇩🇿' },
  { code: '23', name: 'Annaba', arabicName: 'عنابة', region: 'est', flag: '🇩🇿' },
  { code: '24', name: 'Guelma', arabicName: 'قالمة', region: 'est', flag: '🇩🇿' },
  { code: '25', name: 'Constantine', arabicName: 'قسنطينة', region: 'est', flag: '🇩🇿' },
  { code: '26', name: 'Médéa', arabicName: 'المدية', region: 'centre', flag: '🇩🇿' },
  { code: '27', name: 'Mostaganem', arabicName: 'مستغانم', region: 'ouest', flag: '🇩🇿' },
  { code: '28', name: "M'Sila", arabicName: 'المسيلة', region: 'centre', flag: '🇩🇿' },
  { code: '29', name: 'Mascara', arabicName: 'معسكر', region: 'ouest', flag: '🇩🇿' },
  { code: '30', name: 'Ouargla', arabicName: 'ورقلة', region: 'sud', flag: '🇩🇿' },
  { code: '31', name: 'Oran', arabicName: 'وهران', region: 'ouest', flag: '🇩🇿' },
  { code: '32', name: 'El Bayadh', arabicName: 'البيض', region: 'sud', flag: '🇩🇿' },
  { code: '33', name: 'Illizi', arabicName: 'إيليزي', region: 'sud', flag: '🇩🇿' },
  { code: '34', name: 'Bordj Bou Arreridj', arabicName: 'برج بوعريريج', region: 'est', flag: '🇩🇿' },
  { code: '35', name: 'Boumerdès', arabicName: 'بومرداس', region: 'centre', flag: '🇩🇿' },
  { code: '36', name: 'El Tarf', arabicName: 'الطارف', region: 'est', flag: '🇩🇿' },
  { code: '37', name: 'Tindouf', arabicName: 'تندوف', region: 'sud', flag: '🇩🇿' },
  { code: '38', name: 'Tissemsilt', arabicName: 'تيسمسيلت', region: 'ouest', flag: '🇩🇿' },
  { code: '39', name: 'El Oued', arabicName: 'الوادي', region: 'sud', flag: '🇩🇿' },
  { code: '40', name: 'Khenchela', arabicName: 'خنشلة', region: 'est', flag: '🇩🇿' },
  { code: '41', name: 'Souk Ahras', arabicName: 'سوق أهراس', region: 'est', flag: '🇩🇿' },
  { code: '42', name: 'Tipaza', arabicName: 'تيبازة', region: 'centre', flag: '🇩🇿' },
  { code: '43', name: 'Mila', arabicName: 'ميلة', region: 'est', flag: '🇩🇿' },
  { code: '44', name: 'Aïn Defla', arabicName: 'عين الدفلى', region: 'centre', flag: '🇩🇿' },
  { code: '45', name: 'Naâma', arabicName: 'النعامة', region: 'sud', flag: '🇩🇿' },
  { code: '46', name: 'Aïn Témouchent', arabicName: 'عين تموشنت', region: 'ouest', flag: '🇩🇿' },
  { code: '47', name: 'Ghardaïa', arabicName: 'غرداية', region: 'sud', flag: '🇩🇿' },
  { code: '48', name: 'Relizane', arabicName: 'غليزان', region: 'ouest', flag: '🇩🇿' },
  { code: '49', name: 'Timimoun', arabicName: 'تيميمون', region: 'sud', flag: '🇩🇿' },
  { code: '50', name: 'Bordj Badji Mokhtar', arabicName: 'برج باجي مختار', region: 'sud', flag: '🇩🇿' },
  { code: '51', name: 'Ouled Djellal', arabicName: 'أولاد جلال', region: 'sud', flag: '🇩🇿' },
  { code: '52', name: 'Béni Abbès', arabicName: 'بني عباس', region: 'sud', flag: '🇩🇿' },
  { code: '53', name: 'In Salah', arabicName: 'عين صالح', region: 'sud', flag: '🇩🇿' },
  { code: '54', name: 'In Guezzam', arabicName: 'عين قزام', region: 'sud', flag: '🇩🇿' },
  { code: '55', name: 'Touggourt', arabicName: 'تقرت', region: 'sud', flag: '🇩🇿' },
  { code: '56', name: 'Djanet', arabicName: 'جانت', region: 'sud', flag: '🇩🇿' },
  { code: '57', name: "El M'Ghair", arabicName: 'المغير', region: 'sud', flag: '🇩🇿' },
  { code: '58', name: 'El Meniaa', arabicName: 'المنيعة', region: 'sud', flag: '🇩🇿' },

  // Les 11 Wilayas de la Diaspora Algérienne (DZ69)
  { code: '59', name: 'France - Île-de-France / Paris', arabicName: 'فرنسا - باريس', region: 'diaspora', flag: '🇫🇷', isDiaspora: true },
  { code: '60', name: 'France - Nord / Lille', arabicName: 'فرنسا - ليل والشمال', region: 'diaspora', flag: '🇫🇷', isDiaspora: true },
  { code: '61', name: 'France - Grand Est / Strasbourg', arabicName: 'فرنسا - ستراسبورغ', region: 'diaspora', flag: '🇫🇷', isDiaspora: true },
  { code: '62', name: 'France - Ouest / Nantes - Rennes', arabicName: 'فرنسا - الغرب', region: 'diaspora', flag: '🇫🇷', isDiaspora: true },
  { code: '63', name: 'France - Sud-Ouest / Toulouse - Bordeaux', arabicName: 'فرنسا - تولوز وبوردو', region: 'diaspora', flag: '🇫🇷', isDiaspora: true },
  { code: '64', name: 'France - PACA / Marseille - Nice', arabicName: 'فرنسا - مرسيليا والجنوب', region: 'diaspora', flag: '🇫🇷', isDiaspora: true },
  { code: '65', name: 'Canada / Montréal - Québec', arabicName: 'كندا - مونتريال وكيبيك', region: 'diaspora', flag: '🇨🇦', isDiaspora: true },
  { code: '66', name: 'Belgique & Europe / Bruxelles', arabicName: 'بلجيكا وأوروبا', region: 'diaspora', flag: '🇧🇪', isDiaspora: true },
  { code: '67', name: 'Royaume-Uni / Londres', arabicName: 'بريطانيا - لندن', region: 'diaspora', flag: '🇬🇧', isDiaspora: true },
  { code: '68', name: 'Émirats & Golfe / Dubaï', arabicName: 'الإمارات والخليج', region: 'diaspora', flag: '🇦🇪', isDiaspora: true },
  { code: '69', name: 'France - Rhône-Alpes / Lyon 69', arabicName: 'الولاية 69 - ليون ورون ألب', region: 'diaspora', flag: '🇫🇷', isDiaspora: true },
];

export const WILAYAS_LIST = WILAYAS_69;

export const getWilayaLabel = (codeOrName: string): string => {
  const match = WILAYAS_69.find(
    (w) => w.code === codeOrName || w.name.toLowerCase() === codeOrName.toLowerCase()
  );
  if (match) {
    return `${match.code} - ${match.name} (${match.arabicName})`;
  }
  return codeOrName;
};
