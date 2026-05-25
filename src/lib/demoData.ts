import { Menu, Category, MenuItem, Restaurant } from './types';

export const DEMO_RESTAURANT: Restaurant = {
  id: 'demo-restaurant-id',
  organization_id: 'demo-org-id',
  name: "Le Bistro d'Abidjan",
  subdomain: 'bistro-abidjan',
  logo_url: 'https://i.postimg.cc/sxMF8qhj/Gemini-Generated-Image-snhf5hsnhf5hsnhf.png',
  primary_color: '#c25e00',
  theme_settings: {
    primaryColor: '#c25e00',
    backgroundColor: '#F8FAFC',
    surfaceColor: '#FFFFFF',
    textColor: '#0f172a',
    borderRadius: '1.5rem',
  },
  address: 'Rue des Jardins, Cocody, Abidjan',
  phone: '+225 07 00 00 00 00',
  email: 'contact@bistro-abidjan.ci',
  hero_image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200',
  facebook: 'bistro.abidjan',
  instagram: 'bistro.abidjan'
};

export const DEMO_MENUS: Menu[] = [
  { id: 'menu-1', restaurant_id: 'demo-restaurant-id', name: 'Carte Principale', slug: 'main', is_active: true, is_default: true },
];

export const DEMO_CATEGORIES: Category[] = [
  { id: 'cat-1', menu_id: 'menu-1', name_fr: 'Entrées', sort_order: 1, is_active: true },
  { id: 'cat-2', menu_id: 'menu-1', name_fr: 'Plats Principaux', sort_order: 2, is_active: true },
  { id: 'cat-3', menu_id: 'menu-1', name_fr: 'Desserts', sort_order: 3, is_active: true },
];

export const DEMO_ITEMS: MenuItem[] = [
  {
    id: 'm1', category_id: 'cat-1', restaurant_id: 'demo-restaurant-id', name_fr: 'Accras de Morue',
    description_fr: 'Beignets croustillants à la morue et aux épices.',
    price: 3500, image_url: 'https://picsum.photos/200', 
    tags: ['Fait Maison'], ingredients: ['Morue', 'Épices', 'Farine'],
    is_popular: true, is_available: true, sort_order: 1
  },
  {
    id: 'm2', category_id: 'cat-2', restaurant_id: 'demo-restaurant-id', name_fr: 'Poulet Yassa',
    description_fr: 'Poulet mariné aux oignons et citron vert.',
    price: 7500, image_url: 'https://picsum.photos/201', 
    tags: ['Signature', 'Sans Gluten'], ingredients: ['Poulet', 'Oignons', 'Citron vert', 'Moutarde'],
    is_popular: true, is_available: true, sort_order: 1
  },
  {
    id: 'm3', category_id: 'cat-2', restaurant_id: 'demo-restaurant-id', name_fr: 'Thieboudienne',
    description_fr: 'Le plat national du Sénégal. Riz au poisson et légumes.',
    price: 6000, image_url: 'https://picsum.photos/202', 
    tags: ['Poisson'], ingredients: ['Riz cassé', 'Mérou', 'Légumes'],
    is_popular: true, is_available: true, sort_order: 2
  },
  {
    id: 'm4', category_id: 'cat-3', restaurant_id: 'demo-restaurant-id', name_fr: 'Thiakry',
    description_fr: 'Dessert au couscous de mil et yaourt.',
    price: 2500, image_url: 'https://picsum.photos/203', 
    tags: ['Sucré'], ingredients: ['Couscous de mil', 'Yaourt', 'Vanille'],
    is_popular: false, is_available: true, sort_order: 1
  }
];
