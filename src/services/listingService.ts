import { supabase } from './supabase';
import type { Listing, CreateListingInput, UpdateListingInput } from '../types';

export const listingService = {
  async getListings(filters?: { 
    rank?: string; 
    minPrice?: number; 
    maxPrice?: number;
    search?: string;
  }) {
    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          seller:profiles(*),
          images:listing_images(*)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters?.rank && filters.rank !== 'All') {
        query = query.eq('rank', filters.rank);
      }
      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters?.search && filters.search.trim()) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Listing[];
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
  },

  async getUserListings(userId: string) {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          seller:profiles(*),
          images:listing_images(*)
        `)
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Listing[];
    } catch (error) {
      console.error('Error fetching user listings:', error);
      throw error;
    }
  },

  async getListingById(id: string) {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          seller:profiles(*),
          images:listing_images(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Listing;
    } catch (error) {
      console.error('Error fetching listing by id:', error);
      throw error;
    }
  },

  async createListing(listing: CreateListingInput, sellerId: string) {
    try {
      const { data, error } = await supabase
        .from('listings')
        .insert([{ 
          ...listing, 
          seller_id: sellerId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  },

  async updateListing(id: string, updates: UpdateListingInput) {
    try {
      const { data, error } = await supabase
        .from('listings')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  },

  async deleteListing(id: string) {
    try {
      // First delete all images from storage
      const { data: listing } = await supabase
        .from('listings')
        .select('id')
        .eq('id', id)
        .single();
      
      if (listing) {
        // Delete images from storage bucket
        const { data: images } = await supabase
          .from('listing_images')
          .select('image_url')
          .eq('listing_id', id);
        
        if (images && images.length > 0) {
          for (const image of images) {
            const filePath = image.image_url.split('/').pop();
            if (filePath) {
              await supabase.storage
                .from('listing-images')
                .remove([filePath]);
            }
          }
        }
      }
      
      // Delete listing (cascading will delete image records)
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  },

  async uploadImages(listingId: string, files: File[]) {
    try {
      const uploadedUrls = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${listingId}/${Date.now()}_${i}.${fileExt}`;
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('listing-images')
          .getPublicUrl(fileName);

        // Save to database
        const { error: dbError } = await supabase
          .from('listing_images')
          .insert([{
            listing_id: listingId,
            image_url: publicUrl,
            is_primary: i === 0,
            created_at: new Date().toISOString()
          }]);

        if (dbError) throw dbError;
        
        uploadedUrls.push(publicUrl);
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  },

  async deleteImage(imageId: string) {
    try {
      // Get image URL first
      const { data: image, error: fetchError } = await supabase
        .from('listing_images')
        .select('image_url')
        .eq('id', imageId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      if (image?.image_url) {
        const filePath = image.image_url.split('/').pop();
        if (filePath) {
          await supabase.storage
            .from('listing-images')
            .remove([filePath]);
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('listing_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  async updateListingStatus(id: string, status: 'active' | 'sold' | 'inactive') {
    try {
      const { data, error } = await supabase
        .from('listings')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating listing status:', error);
      throw error;
    }
  },

  // Additional helper function
  async searchListings(searchTerm: string) {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          seller:profiles(*),
          images:listing_images(*)
        `)
        .eq('status', 'active')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Listing[];
    } catch (error) {
      console.error('Error searching listings:', error);
      throw error;
    }
  }
};