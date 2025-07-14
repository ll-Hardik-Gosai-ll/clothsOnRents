import React, { useState } from 'react';
import { Calendar, DollarSign, Tag, Package } from 'lucide-react';
import { ProductWithStatus } from '../../types';
import BookingModal from './BookingModal';

interface ProductCardProps {
  product: ProductWithStatus;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'booked':
        return 'bg-red-100 text-red-800';
      case 'washing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return '✅';
      case 'booked':
        return '❌';
      case 'washing':
        return '🧺';
      default:
        return '❓';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'booked':
        return 'Booked';
      case 'washing':
        return 'Sent for Washing';
      default:
        return 'Unknown';
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.dynamicStatus)}`}>
              {getStatusIcon(product.dynamicStatus)} {getStatusText(product.dynamicStatus)}
            </span>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Tag className="h-4 w-4 mr-2" />
              <span>{product.code}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="h-4 w-4 mr-2" />
              <span className="font-medium">${product.dailyPrice}/day</span>
            </div>
          </div>
          
          <button
            onClick={() => setShowBookingModal(true)}
            disabled={product.dynamicStatus !== 'available'}
            className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              product.dynamicStatus === 'available'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {product.dynamicStatus === 'available' ? 'Book Now' : 'Not Available'}
          </button>
        </div>
      </div>
      
      {showBookingModal && (
        <BookingModal
          product={product}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </>
  );
};

export default ProductCard;