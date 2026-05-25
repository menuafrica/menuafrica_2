export const DEMO_USER_PROFILE = {
  role: 'owner',
  organization: {
    id: 'org-demo',
    name: 'Demo Organization',
    slug: 'demo-org',
    billing_plan: 'pro',
    created_at: new Date().toISOString(),
  },
  restaurant: {
    id: 'resto-demo',
    organization_id: 'org-demo',
    name: 'Le Grand Restaurant',
    subdomain: 'legrandrestaurant',
    description: 'Une belle description',
    address: '123 Fake Street',
    phone: '+123456789',
    email: 'contact@legrandrestaurant.com',
    logo_url: '',
    hero_image_url: '',
    primary_color: '#000000',
    created_at: new Date().toISOString(),
  }
};

export const DEMO_MENUS = [
  {
      id: 'demo-1',
      restaurant_id: 'resto-demo',
      name: 'Le Grand Menu (Demo)',
      slug: 'le-grand-menu',
      is_active: true,
      is_default: true,
      template_id: 'default',
      created_at: new Date().toISOString()
  }
];

export const DEMO_CATEGORIES = [
    { id: 'cat-demo-1', menu_id: 'demo-1', name_fr: 'Entrées' },
    { id: 'cat-demo-2', menu_id: 'demo-1', name_fr: 'Plats' },
    { id: 'cat-demo-3', menu_id: 'demo-1', name_fr: 'Desserts' }
];

export const DEMO_ITEMS = [
    { id: 'item-demo-1', category_id: 'cat-demo-1', name_fr: 'Salade de poulpe', price: 4500, views: 250, likes: 32, description_fr: 'Délicieuse salade de poulpe frais', image_url: '' },
    { id: 'item-demo-2', category_id: 'cat-demo-1', name_fr: 'Pastels au poisson', price: 2500, views: 180, likes: 20, description_fr: 'Beignets croustillants fourrés au poisson épicé', image_url: '' },
    { id: 'item-demo-3', category_id: 'cat-demo-2', name_fr: 'Thieboudienne Poisson', price: 6500, views: 520, likes: 98, description_fr: 'Riz au poisson, le plat national sénégalais', image_url: '' },
    { id: 'item-demo-4', category_id: 'cat-demo-2', name_fr: 'Mafé Viande', price: 5500, views: 410, likes: 65, description_fr: 'Riz blanc accompagné d une sauce onctueuse à base d arachide', image_url: '' },
    { id: 'item-demo-5', category_id: 'cat-demo-3', name_fr: 'Thiakry', price: 2000, views: 150, likes: 18, description_fr: 'Semoule de mil et yaourt sucré aromatisé', image_url: '' },
    { id: 'item-demo-6', category_id: 'cat-demo-3', name_fr: 'Flan au Coco', price: 2500, views: 110, likes: 12, description_fr: 'Flan crémeux parfumé à la noix de coco', image_url: '' }
];
