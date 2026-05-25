export interface ThemeSettings {
  primaryColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
  borderRadius?: string;
  fontHeading?: string;
  fontBody?: string;
  buttonStyle?: string;
  inputStyle?: string;
  layoutMode?: string;
  columnLayout?: string;
}

export interface Menu {
  id: string;
  restaurant_id: string;
  name: string;
  slug: string;
  is_active: boolean;
  is_default: boolean;
  template_id?: string;
  created_at?: string;
  visual_config?: any;
}
