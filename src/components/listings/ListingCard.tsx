import { Link } from 'react-router-dom';
import { Star, Shield, MapPin } from 'lucide-react';
import type { Listing } from '../../types';
import { Card } from '../common/Card';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const primaryImage = listing.images?.find(img => img.is_primary) || listing.images?.[0];
  
  // Rank color mapping
  const rankColors: Record<string, string> = {
    'Warrior': 'from-gray-400 to-gray-600',
    'Elite': 'from-green-400 to-green-600',
    'Master': 'from-blue-400 to-blue-600',
    'Grandmaster': 'from-purple-400 to-purple-600',
    'Epic': 'from-orange-400 to-orange-600',
    'Legend': 'from-yellow-400 to-yellow-600',
    'Mythic': 'from-red-400 to-red-600',
  };
  
  return (
    <Link to={`/listing/${listing.id}`}>
      <Card hover className="overflow-hidden h-full">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={primaryImage?.image_url || '/api/placeholder/400/300'} 
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className={`absolute top-2 right-2 bg-gradient-to-r ${rankColors[listing.rank] || 'from-gray-400 to-gray-600'} text-white px-2 py-1 rounded-lg text-sm font-semibold`}>
            {listing.rank}
          </div>
          {listing.status !== 'active' && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg uppercase">{listing.status}</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white line-clamp-1">
            {listing.title}
          </h3>
          
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              {listing.hero_count} Heroes
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              {listing.skin_count} Skins
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-500">
              ${listing.price.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              {listing.seller?.username}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}