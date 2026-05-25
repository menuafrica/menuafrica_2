/**
 * Menu Africa - Virtual & Fictive Client-Side Database Engine
 * This mimics all Supabase interactions, auth states, table queries, insert/update/delete operations,
 * and handles base64 image uploads. Preserves data using localStorage.
 */

export interface Organization {
  id: string;
  name: string;
  slug: string;
  billing_plan: string;
  created_at: string;
}

export interface Restaurant {
  id: string;
  organization_id: string;
  name: string;
  subdomain: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo_url: string;
  hero_image_url: string;
  primary_color: string;
  theme_settings: Record<string, any>;
  created_at: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  whatsapp?: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export interface Menu {
  id: string;
  restaurant_id: string;
  name: string;
  slug: string;
  is_active: boolean;
  is_default: boolean;
  visual_config: Record<string, any>;
  draft_content?: Record<string, any>;
  published_content?: Record<string, any>;
  template_id: string;
  created_at: string;
}

export interface Category {
  id: string;
  menu_id: string;
  name_fr: string;
  name_en: string;
  description_fr: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name_fr: string;
  name_en: string;
  description_fr: string;
  description_en: string;
  price: number;
  image_url: string;
  is_vegetarian: boolean;
  is_spicy: boolean;
  is_popular: boolean;
  is_available: boolean;
  sort_order: number;
  views: number;
  likes: number;
  created_at: string;
  currency?: string;
  layout_style?: string;
  tags?: string[];
  orders?: number;
  variants?: Array<any>;
  allergens?: string[];
  restaurant_id?: string;
  video_url?: string;
  audio_url?: string;
  long_description?: string;
  ingredients?: string[];
}

export interface ChatSession {
  id: string;
  user_id?: string;
  visitor_id: string;
  page_url: string;
  user_agent: string;
  restaurant_id?: string;
  created_at: string;
  metadata: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'bot';
  content: string;
  message_type: 'text' | 'options' | 'action';
  metadata: Record<string, any>;
  created_at: string;
}

export interface MediaLibraryItem {
  id: string;
  restaurant_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  created_at: string;
}

export interface QRCode {
  id: string;
  restaurant_id: string;
  download_url: string;
  design_settings: Record<string, any>;
}

export interface AnalyticsEvent {
  id: string;
  restaurant_id: string;
  event_type: 'scan' | 'view_dish' | 'ai_chat';
  payload: Record<string, any>;
  created_at: string;
}

// Default Seed Data
export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  created_at: string;
}

const DEFAULT_USERS: User[] = [
  {
    id: "user_chef_id",
    email: "chef@lateranga.sn",
    name: "Chef Teranga",
    password: "password123",
    created_at: new Date().toISOString()
  },
  {
    id: "user_escale_id",
    email: "escale@lescale.com",
    name: "L'Escale Dakar",
    password: "escale123",
    created_at: new Date().toISOString()
  }
];

const DEFAULT_ORGANIZATIONS: Organization[] = [
  {
    id: "org_la_teranga",
    name: "La Teranga Premium",
    slug: "la-teranga",
    billing_plan: "pro",
    created_at: new Date().toISOString()
  },
  {
    id: "org_escale",
    name: "L'Escale Restaurant",
    slug: "lescale",
    billing_plan: "starter",
    created_at: new Date().toISOString()
  }
];

const DEFAULT_RESTAURANTS: Restaurant[] = [
  {
    id: "resto_la_teranga",
    organization_id: "org_la_teranga",
    name: "La Teranga Premium",
    subdomain: "la-teranga",
    description: "Le temple de la cuisine ouest-africaine haut de gamme en plein cœur de Dakar.",
    address: "Plateau, Rue Carnot Prolongée, Dakar, Sénégal",
    phone: "+221 33 821 44 55",
    email: "contact@lateranga.sn",
    logo_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop",
    hero_image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
    primary_color: "#D97706",
    theme_settings: { font: "Outfit", density: "comfortable" },
    created_at: new Date().toISOString(),
    facebook: "https://facebook.com/lateranga",
    instagram: "https://instagram.com/lateranga",
    whatsapp: "+221775556677"
  },
  {
    id: "resto_escale",
    organization_id: "org_escale",
    name: "L'Escale Restaurant",
    subdomain: "lescale",
    description: "Cuisine fusion moderne au bord de la mer.",
    address: "Corniche Ouest, Dakar, Sénégal",
    phone: "+221 33 864 12 12",
    email: "escale@lescale.com",
    logo_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=200&auto=format&fit=crop",
    hero_image_url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
    primary_color: "#10B981",
    theme_settings: { font: "Inter", density: "compact" },
    created_at: new Date().toISOString(),
    facebook: "",
    instagram: "",
    whatsapp: "+221773456789"
  }
];

const DEFAULT_MEMBERS: OrganizationMember[] = [
  {
    id: "mem_owner",
    organization_id: "org_la_teranga",
    user_id: "user_chef_id",
    role: "owner",
    joined_at: new Date().toISOString()
  },
  {
    id: "mem_owner_escale",
    organization_id: "org_escale",
    user_id: "user_escale_id",
    role: "owner",
    joined_at: new Date().toISOString()
  }
];

const DEFAULT_MENUS: Menu[] = [
  {
    id: "menu_principal",
    restaurant_id: "resto_la_teranga",
    name: "Menu Saveurs d'Afrique",
    slug: "main",
    is_active: true,
    is_default: true,
    visual_config: { layout: "modern" },
    template_id: "modern-feast",
    created_at: new Date().toISOString()
  },
  {
    id: "menu_escale",
    restaurant_id: "resto_escale",
    name: "Carte Délices de l'Escale",
    slug: "main",
    is_active: true,
    is_default: true,
    visual_config: { layout: "grid" },
    template_id: "minimal-grid",
    created_at: new Date().toISOString()
  }
];

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat_entrees",
    menu_id: "menu_principal",
    name_fr: "Entrées Chaudes & Froides",
    name_en: "Starters & Appetizers",
    description_fr: "Pour commencer l'expérience sous de bons auspices.",
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: "cat_plats",
    menu_id: "menu_principal",
    name_fr: "Plats Traditionnels Teranga",
    name_en: "Signature Main Courses",
    description_fr: "Nos plats signatures cuisinés avec patience et passion.",
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: "cat_boissons",
    menu_id: "menu_principal",
    name_fr: "Boissons Maison",
    name_en: "House Drinks & Juices",
    description_fr: "Infusions glacées traditionnelles.",
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: "cat_escale_mains",
    menu_id: "menu_escale",
    name_fr: "Spécialités de la Mer",
    name_en: "Seafood signature",
    description_fr: "Poissons frais et fruits de mer grillés du jour.",
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString()
  }
];

const DEFAULT_ITEMS: MenuItem[] = [
  {
    id: "item_pastels",
    category_id: "cat_entrees",
    name_fr: "Pastels Traditionnels au Poisson",
    name_en: "Fish Pastels",
    description_fr: "Beignets croustillants farcis au poisson épicé, servis avec une sauce tomate pimentée maison.",
    description_en: "Crispy African empanadas stuffed with spiced minced fish, served with a tomato onion dip.",
    price: 3500,
    image_url: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=400&auto=format&fit=crop",
    is_vegetarian: false,
    is_spicy: true,
    is_popular: true,
    is_available: true,
    sort_order: 1,
    views: 450,
    likes: 120,
    created_at: new Date().toISOString(),
    currency: "XOF",
    restaurant_id: "resto_la_teranga",
    tags: ["Entrée", "Poisson"]
  },
  {
    id: "item_thieb",
    category_id: "cat_plats",
    name_fr: "Thiéboudienne Royal au Mérou",
    name_en: "Royal Thieboudien",
    description_fr: "Riz cassé deux fois cuit dans un bouillon parfumé, servi avec du mérou frais, légumes du marché traditionnels et notre touche secrète de yet.",
    description_en: "Double-broken red rice slow cooked in rich fish stock, served with premium grouper vegetable stew.",
    price: 7500,
    image_url: "https://images.unsplash.com/photo-1604423043492-4130279f7271?q=80&w=400&auto=format&fit=crop",
    is_vegetarian: false,
    is_spicy: false,
    is_popular: true,
    is_available: true,
    sort_order: 1,
    views: 1200,
    likes: 380,
    created_at: new Date().toISOString(),
    currency: "XOF",
    restaurant_id: "resto_la_teranga",
    tags: ["Plat", "Poisson", "Premium"]
  },
  {
    id: "item_yassa",
    category_id: "cat_plats",
    name_fr: "Yassa Poulet Premium",
    name_en: "Premium Chicken Yassa",
    description_fr: "Poulet jaune fermier mariné au citron vert et moutarde de Dijon rampante, mijoté dans une marmite d'oignons caramélisés.",
    description_en: "Marinated farmhouse chicken slow-braised with plenty of lemon, mustard, and sweet caramelized onions.",
    price: 6000,
    image_url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f33?q=80&w=400&auto=format&fit=crop",
    is_vegetarian: false,
    is_spicy: true,
    is_popular: false,
    is_available: true,
    sort_order: 2,
    views: 890,
    likes: 240,
    created_at: new Date().toISOString(),
    currency: "XOF",
    restaurant_id: "resto_la_teranga",
    tags: ["Plat", "Poulet"]
  },
  {
    id: "item_bissap",
    category_id: "cat_boissons",
    name_fr: "Bissap Impérial",
    name_en: "Imperial Bissap Juice",
    description_fr: "Jus de fleurs d'hibiscus rouge bio infusé à la menthe fraîche et une touche florale de fleur d'oranger.",
    description_en: "Organic red hibiscus flowers juice chilled with fresh mint and delicate orange blossom essence.",
    price: 1500,
    image_url: "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=400&auto=format&fit=crop",
    is_vegetarian: true,
    is_spicy: false,
    is_popular: true,
    is_available: true,
    sort_order: 1,
    views: 620,
    likes: 195,
    created_at: new Date().toISOString(),
    currency: "XOF",
    restaurant_id: "resto_la_teranga",
    tags: ["Boisson", "Frais", "Bio"]
  },
  {
    id: "item_brochettes_lotte",
    category_id: "cat_escale_mains",
    name_fr: "Brochettes de Lotte à l'ail des ours",
    name_en: "Monkfish Skewers",
    description_fr: "Morceaux de lotte fondants marinés à l'ail des ours et piment doux de gironde, grillés au feu de bois.",
    description_en: "Wood-fire grilled monkfish with wild garlic marinade.",
    price: 8500,
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400",
    is_vegetarian: false,
    is_spicy: false,
    is_popular: true,
    is_available: true,
    sort_order: 1,
    views: 310,
    likes: 92,
    created_at: new Date().toISOString(),
    currency: "XOF",
    restaurant_id: "resto_escale",
    tags: ["Plat", "Poisson"]
  }
];

class VirtualDB {
  private getStorage<T>(key: string, defaultValue: T[]): T[] {
    const data = localStorage.getItem(`vdb_${key}`);
    if (!data) {
      localStorage.setItem(`vdb_${key}`, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(data);
  }

  private setStorage<T>(key: string, value: T[]): void {
    localStorage.setItem(`vdb_${key}`, JSON.stringify(value));
  }

  // collections
  get organizations(): Organization[] { return this.getStorage('organizations', DEFAULT_ORGANIZATIONS); }
  set organizations(v) { this.setStorage('organizations', v); }

  get restaurants(): Restaurant[] { return this.getStorage('restaurants', DEFAULT_RESTAURANTS); }
  set restaurants(v) { this.setStorage('restaurants', v); }

  get members(): OrganizationMember[] { return this.getStorage('members', DEFAULT_MEMBERS); }
  set members(v) { this.setStorage('members', v); }

  get menus(): Menu[] { return this.getStorage('menus', DEFAULT_MENUS); }
  set menus(v) { this.setStorage('menus', v); }

  get categories(): Category[] { return this.getStorage('categories', DEFAULT_CATEGORIES); }
  set categories(v) { this.setStorage('categories', v); }

  get items(): MenuItem[] { return this.getStorage('items', DEFAULT_ITEMS); }
  set items(v) { this.setStorage('items', v); }

  get chatSessions(): ChatSession[] { return this.getStorage('chatSessions', []); }
  set chatSessions(v) { this.setStorage('chatSessions', v); }

  get chatMessages(): ChatMessage[] { return this.getStorage('chatMessages', []); }
  set chatMessages(v) { this.setStorage('chatMessages', v); }

  get mediaLibrary(): MediaLibraryItem[] { return this.getStorage('mediaLibrary', []); }
  set mediaLibrary(v) { this.setStorage('mediaLibrary', v); }

  get qrCodes(): QRCode[] { return this.getStorage('qrCodes', []); }
  set qrCodes(v) { this.setStorage('qrCodes', v); }

  get analyticsEvents(): AnalyticsEvent[] { return this.getStorage('analyticsEvents', []); }
  set analyticsEvents(v) { this.setStorage('analyticsEvents', v); }

  get users(): User[] { return this.getStorage('users', DEFAULT_USERS); }
  set users(v) { this.setStorage('users', v); }

  get currentUser(): any {
    const u = localStorage.getItem('vdb_current_user');
    if (u === 'none') return null;
    return u ? JSON.parse(u) : DEFAULT_USERS[0]; // Fallback to Chef Teranga
  }

  set currentUser(user: any) {
    if (user === null) {
      localStorage.setItem('vdb_current_user', 'none');
    } else {
      localStorage.setItem('vdb_current_user', JSON.stringify(user));
    }
  }

  // --- Auth & Profile RPC simulator ---
  login(email: string, password?: string): any {
    const found = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      if (password && found.password && found.password !== password) {
        throw new Error("Mot de passe incorrect.");
      }
      this.currentUser = found;
      return found;
    }
    
    // Auto-create matching user if not exists to facilitate smooth demo testing
    const valPassword = password || "password123";
    const name = email.split('@')[0];
    const user: User = { 
      id: `user_${Math.random().toString(36).substr(2, 9)}`, 
      email, 
      name: name.charAt(0).toUpperCase() + name.slice(1),
      password: valPassword,
      created_at: new Date().toISOString()
    };
    this.users = [...this.users, user];
    this.currentUser = user;
    return user;
  }

  signup(restaurantName: string, slug: string, email: string, password?: string, phone?: string): any {
    if (this.restaurants.some(r => r.subdomain.toLowerCase() === slug.toLowerCase())) {
      throw new Error("Ce sous-domaine/slug de restaurant est déjà pris.");
    }

    const valPassword = password || "password123";
    const user: User = { 
      id: `user_${Math.random().toString(36).substr(2, 9)}`, 
      email, 
      name: restaurantName,
      password: valPassword,
      created_at: new Date().toISOString()
    };
    this.users = [...this.users, user];
    this.currentUser = user;

    // Create organization
    const org: Organization = {
      id: `org_${slug}`,
      name: restaurantName,
      slug,
      billing_plan: 'starter',
      created_at: new Date().toISOString()
    };
    this.organizations = [...this.organizations, org];

    // Create member
    const member: OrganizationMember = {
      id: `mem_${Math.random().toString(36).substr(2, 9)}`,
      organization_id: org.id,
      user_id: user.id,
      role: 'owner',
      joined_at: new Date().toISOString()
    };
    this.members = [...this.members, member];

    // Create restaurant
    const resto: Restaurant = {
      id: `resto_${slug}`,
      organization_id: org.id,
      name: restaurantName,
      subdomain: slug,
      description: `Bienvenue chez ${restaurantName} !`,
      address: '',
      phone: phone || '',
      email,
      logo_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200",
      hero_image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200",
      primary_color: "#D97706",
      theme_settings: { font: "Inter", density: "comfortable" },
      created_at: new Date().toISOString()
    };
    this.restaurants = [...this.restaurants, resto];

    // Create default menu
    const menu: Menu = {
      id: `menu_${Math.random().toString(36).substr(2, 9)}`,
      restaurant_id: resto.id,
      name: 'Menu Principal',
      slug: 'main',
      is_active: true,
      is_default: true,
      visual_config: {},
      template_id: 'modern-feast',
      created_at: new Date().toISOString()
    };
    this.menus = [...this.menus, menu];

    return { user, org, resto, status: 'success' };
  }

  getProfile(): any {
    const user = this.currentUser;
    if (!user) return null;

    const member = this.members.find(m => m.user_id === user.id);
    if (!member) {
      // If none found (e.g., direct user without registration yet), connect to the first org
      return {
        role: 'owner',
        organization: this.organizations[0],
        restaurant: this.restaurants[0]
      };
    }

    const org = this.organizations.find(o => o.id === member.organization_id) || this.organizations[0];
    const restaurant = this.restaurants.find(r => r.organization_id === org.id) || this.restaurants[0];

    return {
      role: member.role,
      organization: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        billing_plan: org.billing_plan
      },
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        subdomain: restaurant.subdomain,
        logo_url: restaurant.logo_url,
        primary_color: restaurant.primary_color,
        theme_settings: restaurant.theme_settings,
        address: restaurant.address,
        phone: restaurant.phone,
        email: restaurant.email,
        hero_image_url: restaurant.hero_image_url,
        facebook: restaurant.facebook,
        instagram: restaurant.instagram,
        tiktok: restaurant.tiktok,
        whatsapp: restaurant.whatsapp
      }
    };
  }

  // Generic Mock Storage File Upload Simulator
  uploadFile(base64: string): string {
    return base64; // Return the base64 string directly
  }
}

export const dbInstance = new VirtualDB();
