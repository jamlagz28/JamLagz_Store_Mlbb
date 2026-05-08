export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  rank: string;
  hero_count: number;
  skin_count: number;
  status: 'active' | 'sold' | 'inactive';
  created_at: string;
  updated_at: string;
  seller?: Profile;
  images?: ListingImage[];
}

export interface ListingImage {
  id: string;
  listing_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

export interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  rank: string;
  hero_count: number;
  skin_count: number;
}

export interface UpdateListingInput extends Partial<CreateListingInput> {
  status?: 'active' | 'sold' | 'inactive';
}