import { create } from 'zustand';

interface ListingState {
  listings: any[];
  userListings: any[];
  currentListing: any | null;
  isLoading: boolean;
  fetchListings: () => Promise<void>;
  fetchUserListings: (userId: string) => Promise<void>;
  fetchListingById: (id: string) => Promise<void>;
  createListing: (data: any, userId: string, images: File[]) => Promise<void>;
  updateListing: (id: string, data: any) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
}

export const useListingStore = create<ListingState>((set) => ({
  listings: [],
  userListings: [],
  currentListing: null,
  isLoading: false,
  fetchListings: async () => {
    set({ isLoading: false });
  },
  fetchUserListings: async (userId) => {
    set({ isLoading: false });
  },
  fetchListingById: async (id) => {
    set({ isLoading: false });
  },
  createListing: async (data, userId, images) => {
    console.log('Creating listing:', data);
  },
  updateListing: async (id, data) => {
    console.log('Updating listing:', id, data);
  },
  deleteListing: async (id) => {
    console.log('Deleting listing:', id);
  },
}));
