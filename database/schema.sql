-- 🦁 MENU AFRICA - SCHEMA GOLDEN STANDARD (V2)
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- ==========================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. NETTOYAGE (Pour éviter les conflits si on relance le script)
DROP FUNCTION IF EXISTS public.create_restaurant_account(text, text, text, text);
DROP FUNCTION IF EXISTS public.get_full_user_profile();
-- Attention: Les tables ne sont pas supprimées automatiquement pour éviter la perte de données.

-- 3. TABLES PRINCIPALES

-- Organisations (Entité de facturation)
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  billing_plan TEXT DEFAULT 'starter',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Membres de l'organisation (Qui a accès ?)
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- Lien vers auth.users
  role TEXT DEFAULT 'owner',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Restaurants (L'établissement physique)
CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  hero_image_url TEXT,
  primary_color TEXT DEFAULT '#c25e00',
  theme_settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menus (La carte)
CREATE TABLE IF NOT EXISTS public.menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  visual_config JSONB DEFAULT '{}'::jsonb,
  template_id TEXT DEFAULT 'modern-feast',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(restaurant_id, slug)
);

-- Catégories (Entrées, Plats...)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_id UUID NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
  name_fr TEXT NOT NULL,
  name_en TEXT,
  description_fr TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plats (Items)
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name_fr TEXT NOT NULL,
  name_en TEXT,
  description_fr TEXT,
  description_en TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  is_vegetarian BOOLEAN DEFAULT false,
  is_spicy BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  variants JSONB DEFAULT '[]'::jsonb,
  allergens TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INDEX DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_members_user_search ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_org_lookup ON public.restaurants(organization_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_url_lookup ON public.restaurants(subdomain);
CREATE INDEX IF NOT EXISTS idx_menus_restaurant_id ON public.menus(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_categories_menu_id ON public.categories(menu_id);
CREATE INDEX IF NOT EXISTS idx_items_category_id ON public.menu_items(category_id);

-- 5. ACTIVATION RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- 6. POLITIQUES
CREATE POLICY "Public read organizations" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "Members manage organizations" ON public.organizations FOR ALL USING (id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()));

CREATE POLICY "View own memberships" ON public.organization_members FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Public read restaurants" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Members manage restaurants" ON public.restaurants FOR ALL USING (organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()));

CREATE POLICY "Public read menus" ON public.menus FOR SELECT USING (is_active = true);
CREATE POLICY "Members manage menus" ON public.menus FOR ALL USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid())));

CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Members manage categories" ON public.categories FOR ALL USING (menu_id IN (SELECT id FROM public.menus WHERE restaurant_id IN (SELECT id FROM public.restaurants WHERE organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()))));

CREATE POLICY "Public read items" ON public.menu_items FOR SELECT USING (is_available = true);
CREATE POLICY "Members manage items" ON public.menu_items FOR ALL USING (category_id IN (SELECT id FROM public.categories WHERE menu_id IN (SELECT id FROM public.menus WHERE restaurant_id IN (SELECT id FROM public.restaurants WHERE organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid())))));

-- 7. RPC
CREATE OR REPLACE FUNCTION public.create_restaurant_account(p_restaurant_name TEXT, p_slug TEXT, p_email TEXT, p_phone TEXT DEFAULT NULL) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_user_id UUID; v_org_id UUID; v_resto_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN RAISE EXCEPTION 'Non authentifié'; END IF;
    INSERT INTO public.organizations (name, slug) VALUES (p_restaurant_name, p_slug) RETURNING id INTO v_org_id;
    INSERT INTO public.organization_members (organization_id, user_id, role) VALUES (v_org_id, v_user_id, 'owner');
    INSERT INTO public.restaurants (organization_id, name, subdomain, email, phone) VALUES (v_org_id, p_restaurant_name, p_slug, p_email, p_phone) RETURNING id INTO v_resto_id;
    INSERT INTO public.menus (restaurant_id, name, slug, is_default) VALUES (v_resto_id, 'La Carte', 'carte', true);
    RETURN jsonb_build_object('status', 'success', 'org_id', v_org_id, 'resto_id', v_resto_id);
EXCEPTION
    WHEN unique_violation THEN RAISE EXCEPTION 'Ce nom est déjà pris.';
    WHEN OTHERS THEN RAISE EXCEPTION 'Erreur création : %', SQLERRM;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_full_user_profile() RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_user_id UUID; v_result JSONB;
BEGIN
    v_user_id := auth.uid();
    SELECT jsonb_build_object('role', m.role, 'organization', jsonb_build_object('id', o.id, 'name', o.name, 'slug', o.slug, 'billing_plan', o.billing_plan), 'restaurant', (SELECT jsonb_build_object('id', r.id, 'name', r.name, 'subdomain', r.subdomain, 'logo_url', r.logo_url, 'primary_color', r.primary_color, 'theme_settings', r.theme_settings, 'address', r.address, 'phone', r.phone, 'email', r.email, 'hero_image_url', r.hero_image_url) FROM public.restaurants r WHERE r.organization_id = o.id LIMIT 1)) INTO v_result FROM public.organization_members m JOIN public.organizations o ON o.id = m.organization_id WHERE m.user_id = v_user_id LIMIT 1;
    RETURN v_result;
END;
$$;
