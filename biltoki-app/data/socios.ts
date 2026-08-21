export interface SociosReward {
  id: string;
  title: string;
  points: number;
  description: string;
  icon: 'musical-notes' | 'people' | 'gift' | 'basket' | 'wine';
}

export interface SociosReferrer {
  city: string;
  referents: string;
}

export interface SociosDigitalCard {
  id: string;
  holderName: string;
  phoneMasked: string;
  walletReady: boolean;
  nfcReady: boolean;
  nfcLabel: string;
}

export const SOCIOS_RULES = {
  programName: 'SOCIOS!',
  conversionLabel: '1 euro depense au bar = 1 point',
  iPadLabel: 'Apres chaque passage au bar, saisissez votre numero de telephone sur l\'iPad en caisse.',
  nextTrainingLabel: 'Une formation dediee est prevue la semaine prochaine pour les equipes.',
};

export const SOCIOS_REWARDS: SociosReward[] = [
  {
    id: 'r1',
    title: 'Ta chanson au bar',
    points: 120,
    description: 'Choisissez le prochain son diffuse pendant votre passage.',
    icon: 'musical-notes',
  },
  {
    id: 'r2',
    title: 'Tournee pour vos amis',
    points: 250,
    description: 'Une tournee offerte a partager sur place.',
    icon: 'people',
  },
  {
    id: 'r3',
    title: 'Bon commercant partenaire',
    points: 450,
    description: 'Un bon a utiliser chez un commercant de la halle.',
    icon: 'gift',
  },
  {
    id: 'r4',
    title: 'Pack goodies Biltoki',
    points: 700,
    description: 'Un pack de goodies en edition limitee.',
    icon: 'basket',
  },
];

export const SOCIOS_REFERENTS: SociosReferrer[] = [
  { city: 'Bordeaux', referents: 'Nathanael' },
  { city: 'Annecy', referents: 'Sacha' },
  { city: 'Angers', referents: 'Romane' },
  { city: 'Issy', referents: 'Terrence + Jade' },
  { city: 'Amiens', referents: 'Evaelle' },
  { city: 'Rueil', referents: 'Emma' },
  { city: 'Toulon', referents: 'Maude' },
  { city: 'Beziers', referents: 'Arthur + Luce' },
  { city: 'Anglet', referents: 'Kheira' },
  { city: 'Lille', referents: 'Johann' },
];

export const SOCIOS_ONBOARDING_STEPS = [
  'Passez commande au bar.',
  'Saisissez votre numero de telephone sur l\'iPad a cote de la caisse.',
  'Cumulez automatiquement vos points apres chaque achat.',
  'Debloquez vos avantages au fil de vos passages.',
];

export const SOCIOS_CARD_MOCK: SociosDigitalCard = {
  id: 'SOC-5C-A1-9984',
  holderName: 'MARIE DUPONT',
  phoneMasked: '06 45 22 ** **',
  walletReady: false,
  nfcReady: false,
  nfcLabel: 'Activation NFC en preparation',
};
