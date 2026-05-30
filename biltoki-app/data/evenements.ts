export interface Evenement {
  id: string;
  title: string;
  date: string;
  time: string;
  halleId: string;
  halleName: string;
  city: string;
  description: string;
  category: 'concert' | 'tapas' | 'banquet' | 'atelier' | 'marché';
  image?: string;
}

export const EVENEMENTS: Evenement[] = [
  {
    id: 'e1',
    title: 'Nuit des Tapas',
    date: '2026-06-14',
    time: '19:00',
    halleId: '1',
    halleName: 'Halles des 5 Cantons',
    city: 'Anglet',
    description: 'Une soirée dédiée aux tapas du Pays Basque. Ambiance festive garantie au bar Biltoki avec musiciens live.',
    category: 'tapas',
  },
  {
    id: 'e2',
    title: 'Concert Acoustic',
    date: '2026-06-20',
    time: '20:30',
    halleId: '2',
    halleName: 'Halles de Bacalan',
    city: 'Bordeaux',
    description: 'Soirée musicale en acoustique, vins naturels et petits plats à partager.',
    category: 'concert',
  },
  {
    id: 'e3',
    title: 'Grand Banquet d\'Été',
    date: '2026-07-04',
    time: '12:30',
    halleId: '3',
    halleName: 'Halle du Haras',
    city: 'Annecy',
    description: 'Le banquet géant de l\'été ! Tables dressées pour 200 convives, menu surprise du chef.',
    category: 'banquet',
  },
  {
    id: 'e4',
    title: 'Atelier Fromages',
    date: '2026-06-28',
    time: '10:00',
    halleId: '1',
    halleName: 'Halles des 5 Cantons',
    city: 'Anglet',
    description: 'Découvrez les secrets des fromages basques avec notre fromager. Dégustation incluse.',
    category: 'atelier',
  },
  {
    id: 'e5',
    title: 'Marché des Producteurs',
    date: '2026-07-12',
    time: '08:00',
    halleId: '4',
    halleName: 'Halles d\'Issy',
    city: 'Issy-les-Moulineaux',
    description: 'Rencontrez directement les producteurs locaux. Produits frais, circuits courts.',
    category: 'marché',
  },
];
