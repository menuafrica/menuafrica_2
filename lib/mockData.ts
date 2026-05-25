export const mockMenus = [
    {
        id: 'menu-1',
        restaurant_id: 'resto-1',
        name: 'Menu Principal',
        slug: 'principal',
        is_active: true,
        is_default: true,
        template_id: 'default',
        created_at: new Date().toISOString()
    }
];

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

export const mockCategories = [
    { id: 'cat-1', menu_id: 'menu-1', name_fr: 'Entrées' },
    { id: 'cat-2', menu_id: 'menu-1', name_fr: 'Plats' },
    { id: 'cat-3', menu_id: 'menu-1', name_fr: 'Desserts' }
];

export const mockMenuItems = [
    { id: 'item-1', category_id: 'cat-1', name_fr: 'Salade de poulpe', price: 4500, views: 250, likes: 32, description_fr: 'Délicieuse salade de poulpe frais', image_url: '' },
    { id: 'item-2', category_id: 'cat-1', name_fr: 'Pastels au poisson', price: 2500, views: 180, likes: 20, description_fr: 'Beignets croustillants fourrés au poisson épicé', image_url: '' },
    { id: 'item-3', category_id: 'cat-2', name_fr: 'Thieboudienne Poisson', price: 6500, views: 520, likes: 98, description_fr: 'Riz au poisson, le plat national sénégalais', image_url: '' },
    { id: 'item-4', category_id: 'cat-2', name_fr: 'Mafé Viande', price: 5500, views: 410, likes: 65, description_fr: 'Riz blanc accompagné d une sauce onctueuse à base d arachide', image_url: '' },
    { id: 'item-5', category_id: 'cat-3', name_fr: 'Thiakry', price: 2000, views: 150, likes: 18, description_fr: 'Semoule de mil et yaourt sucré aromatisé', image_url: '' },
    { id: 'item-6', category_id: 'cat-3', name_fr: 'Flan au Coco', price: 2500, views: 110, likes: 12, description_fr: 'Flan crémeux parfumé à la noix de coco', image_url: '' }
];
