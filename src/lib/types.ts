export type Role = 'owner' | 'super_admin';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  billing_plan: 'starter' | 'pro' | 'enterprise';
}

export interface OrganizationMember {
  organization_id: string;
  user_id: string;
  role: Role;
}

export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  organization: Organization;
  restaurant: Restaurant;
}

export interface Restaurant {
  id: string;
  organization_id: string;
  name: string;
  subdomain: string;
  logo_url: string;
  primary_color: string;
  theme_settings: Record<string, any>;
  address: string;
  phone: string;
  email: string;
  hero_image_url: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  whatsapp?: string;
}

export interface Menu {
  id: string;
  restaurant_id: string;
  name: string;
  slug: string;
  is_default: boolean;
  is_active: boolean;
}

export interface Category {
  id: string;
  menu_id: string;
  name_fr: string;
  name_en?: string;
  sort_order: number;
  is_active: boolean;
}

export interface MenuItem {
  id: string;
  category_id: string;
  restaurant_id: string;
  name_fr: string;
  name_en?: string;
  description_fr: string;
  description_en?: string;
  price: number;
  image_url: string;
  tags: string[];
  ingredients: string[];
  is_popular: boolean;
  sort_order: number;
  is_available: boolean;
}
