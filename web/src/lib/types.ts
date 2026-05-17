export type SiteConfig = {
  brand_name: string;
  slogan_main: string;
  slogan_sub: string;
  intro_md: string;
  principle_md: string;
  footer_quote: string;
  cta_phone: string;
  kaiti_enabled: boolean;
};

export type Banner = {
  id: number;
  position: string;
  image_key?: string;
  image_url?: string;
  headline: string;
  subline: string;
  cta_text?: string;
  cta_link?: string;
  sort_order: number;
  is_active: boolean;
};

export type Price = {
  store_price: number;
  member_price: number;
  platinum_price: number;
  diamond_price: number;
  taste_price: number;
};

export type Step = {
  id: number;
  idx: number;
  title: string;
  minutes: number;
  description: string;
};

export type Pkg = {
  id: number;
  kind: "course5" | "ten1" | "quarter" | "half" | "addon";
  label: string;
  price: number;
  times: number;
  gift_count: number;
  options_text?: string;
  sort_order: number;
};

export type Service = {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  summary: string;
  time_min: number;
  cover_image_key?: string;
  cover_image_url?: string;
  sort_order: number;
  is_active: boolean;
  price?: Price | null;
  principle_md?: string;
  value_md?: string;
  products_md?: string;
  gallery?: string[];
  gallery_urls?: string[];
  steps?: Step[];
  packages?: Pkg[];
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
  icon_key?: string;
  hero_image_url?: string;
  accent_color?: string;
  tagline?: string;
  services: Service[];
};

export type Tier = {
  id: number;
  name: string;
  slug: string;
  fee: number;
  discount_text: string;
  benefits_md: string;
  accent_color: string;
  icon_key?: string;
  sort_order: number;
};

export type Store = {
  id: number;
  name: string;
  slug: string;
  is_flagship: boolean;
  address: string;
  phone: string;
  hours: string;
  intro_md: string;
  image_url?: string;
  gallery_urls?: string[];
  map_url?: string;
};
