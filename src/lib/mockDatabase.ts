import { dbInstance } from "./virtual_db";
import { Category, Menu, MenuItem, Restaurant, UserProfile } from "./types";

// MockDatabase serves as a delegation layer to dbInstance (virtual_db) to enforce a single source of truth!
class MockDatabase {
  public setSession(userId: string) {
    const user = dbInstance.users.find(u => u.id === userId);
    if (user) {
      dbInstance.currentUser = user;
    }
  }

  public getSession() {
    return dbInstance.currentUser?.id || null;
  }

  // --- RPC SIMULATION ---

  /**
   * Simule la création du compte complet : Org + Member + Restaurant + Menu 
   */
  public async createRestaurantAccount(name: string, slug: string, email: string, phone?: string) {
    // Latence artificielle
    await new Promise(r => setTimeout(r, 400));
    const result = dbInstance.signup(name, slug, email, "password123", phone);
    return { status: "success", organization_id: result.org.id, restaurant_id: result.resto.id };
  }

  /**
   * Simule la récupération atomique du profil complet
   */
  public async getFullUserProfile(): Promise<UserProfile | null> {
    await new Promise(r => setTimeout(r, 100));
    const profile = dbInstance.getProfile();
    if (!profile) return null;
    return {
      id: dbInstance.currentUser?.id || "user_chef_id",
      email: dbInstance.currentUser?.email || "chef@lateranga.sn",
      role: profile.role,
      organization: profile.organization,
      restaurant: profile.restaurant
    } as any;
  }

  // --- CRUD RESTAURANT (PUBLIC API) ---

  public async getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
    await new Promise(r => setTimeout(r, 100));
    return (dbInstance.restaurants.find(r => r.subdomain.toLowerCase() === slug.toLowerCase()) as any) || null;
  }

  public async getMenusByRestaurant(restaurantId: string): Promise<Menu[]> {
    await new Promise(r => setTimeout(r, 100));
    return dbInstance.menus.filter(m => m.restaurant_id === restaurantId && m.is_active) as any;
  }

  public async getCategoriesByMenu(menuId: string): Promise<Category[]> {
    await new Promise(r => setTimeout(r, 100));
    return dbInstance.categories
      .filter(c => c.menu_id === menuId && c.is_active)
      .sort((a, b) => a.sort_order - b.sort_order) as any;
  }

  public async getMenuItemsByCategories(categoryIds: string[]): Promise<MenuItem[]> {
    await new Promise(r => setTimeout(r, 100));
    return dbInstance.items
      .filter(i => categoryIds.includes(i.category_id) && i.is_available)
      .sort((a, b) => a.sort_order - b.sort_order) as any;
  }

  public async getMenuItemById(itemId: string): Promise<MenuItem | null> {
    await new Promise(r => setTimeout(r, 100));
    return (dbInstance.items.find(i => i.id === itemId) as any) || null;
  }

  // --- BUILDER CRUD ---

  public async addCategory(cat: Omit<Category, 'id'>): Promise<Category> {
    await new Promise(r => setTimeout(r, 200));
    const newCat = {
      ...cat,
      id: `cat_${Math.random().toString(36).substr(2, 9)}`,
      name_en: cat.name_en || '',
      description_fr: '',
      created_at: new Date().toISOString()
    };
    dbInstance.categories = [...dbInstance.categories, newCat as any];
    return newCat as any;
  }

  public async addItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    await new Promise(r => setTimeout(r, 200));
    const newItem = {
      ...item,
      id: `item_${Math.random().toString(36).substr(2, 9)}`,
      name_en: item.name_en || '',
      description_en: item.description_en || '',
      image_url: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      tags: item.tags || [],
      ingredients: item.ingredients || [],
      created_at: new Date().toISOString()
    };
    dbInstance.items = [...dbInstance.items, newItem as any];
    return newItem as any;
  }

  public async updateItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    await new Promise(r => setTimeout(r, 200));
    const idx = dbInstance.items.findIndex(i => i.id === id);
    if (idx === -1) throw new Error("Item not found");
    dbInstance.items[idx] = { ...dbInstance.items[idx], ...updates } as any;
    dbInstance.items = [...dbInstance.items];
    return dbInstance.items[idx] as any;
  }

  // --- ADMIN RESET ---
  public clearMockData() {
    localStorage.removeItem("mock_db");
    localStorage.removeItem("vdb_organizations");
    localStorage.removeItem("vdb_restaurants");
    localStorage.removeItem("vdb_members");
    localStorage.removeItem("vdb_menus");
    localStorage.removeItem("vdb_categories");
    localStorage.removeItem("vdb_items");
    localStorage.removeItem("vdb_current_user");
    localStorage.removeItem("vdb_users");
    dbInstance.currentUser = null;
  }
}

export const mockDb = new MockDatabase();
