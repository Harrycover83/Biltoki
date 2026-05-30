export interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
}

export const ARTICLES: Article[] = [
  {
    id: 'a1',
    title: "L'art de vivre basque s'exporte",
    excerpt: "Biltoki continue son développement en France, portant les valeurs du Pays Basque au-delà des Pyrénées.",
    date: '2026-05-20',
    category: 'Actualité',
    readTime: '3 min',
  },
  {
    id: 'a2',
    title: 'Nos producteurs à l\'honneur',
    excerpt: "Cette semaine, on vous présente Jean-Baptiste, éleveur de piment d'Espelette depuis 20 ans.",
    date: '2026-05-15',
    category: 'Producteurs',
    readTime: '5 min',
  },
  {
    id: 'a3',
    title: 'La recette du mois : pintxos maison',
    excerpt: "Le chef de la halle d'Anglet vous livre sa recette de pintxos traditionnels pour épater vos invités.",
    date: '2026-05-10',
    category: 'Recettes',
    readTime: '4 min',
  },
  {
    id: 'a4',
    title: 'Saison estivale : le programme',
    excerpt: "Concerts, banquets, ateliers... Découvrez tout ce qui vous attend dans les halles cet été !",
    date: '2026-05-05',
    category: 'Événements',
    readTime: '2 min',
  },
];
