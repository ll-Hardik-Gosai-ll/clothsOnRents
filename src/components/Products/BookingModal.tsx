import React, { useState } from 'react';
import { X, Calendar, User, Mail, Phone, AlertCircle } from 'lucide-react';
import { ProductWithStatus } from '../../types';
import { useApp } from '../../context/AppContext';

interface BookingModalProps {
  product: ProductWithStatus;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ product, onClose }) => {
  const { addBooking, checkBookingConflict } = useApp();
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fromDate) newErrors.fromDate = 'From date is required';
    if (!formData.toDate) newErrors.toDate = 'To date is required';
    if (!formData.customerName) newErrors.customerName = 'Customer name is required';
    if (!formData.customerEmail) newErrors.customerEmail = 'Email is required';
    if (!formData.customerPhone) newErrors.customerPhone = 'Phone is required';
    
    if (formData.fromDate && formData.toDate) {
      const fromDate = new Date(formData.fromDate);
      const toDate = new Date(formData.toDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (fromDate < today) {
        newErrors.fromDate = 'From date cannot be in the past';
      }
      
      if (toDate < fromDate) {
        newErrors.toDate = 'To date must be after from date';
      }
      
      if (formData.fromDate && formData.toDate && !newErrors.fromDate && !newErrors.toDate) {
        const hasConflict = checkBookingConflict(product.id, formData.fromDate, formData.toDate);
        if (hasConflict) {
          newErrors.general = 'This product is already booked for the selected dates';
        }
      }
    }
    
    if (formData.customerEmail && !/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await addBooking({
        productId: product.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        status: 'active'
      });
      
      if (success) {
        onClose();
      } else {
        setErrors({ general: 'Booking failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Book Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Product Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
            <p className="text-sm text-gray-600">Code: {product.code}</p>
            <p className="text-sm text-gray-600">Daily Rate: ${product.dailyPrice}</p>
          </div>
          
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-sm text-red-700">{errors.general}</span>
            </div>
          )}
          
          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="h-4 w-4 inline mr-1" />
                From Date
              </label>
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.fromDate ? 'border-red-300' : 'border-gray-300'
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.fromDate && (
                <p className="text-sm text-red-600 mt-1">{errors.fromDate}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="h-4 w-4 inline mr-1" />
                To Date
              </label>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.toDate ? 'border-red-300' : 'border-gray-300'
                }`}
                min={formData.fromDate || new Date().toISOString().split('T')[0]}
              />
              {errors.toDate && (
                <p className="text-sm text-red-600 mt-1">{errors.toDate}</p>
              )}
            </div>
          </div>
          
          {/* Customer Information */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="h-4 w-4 inline mr-1" />
                Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.customerName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter customer name"
              />
              {errors.customerName && (
                <p className="text-sm text-red-600 mt-1">{errors.customerName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="h-4 w-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.customerEmail ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
              />
              {errors.customerEmail && (
                <p className="text-sm text-red-600 mt-1">{errors.customerEmail}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="h-4 w-4 inline mr-1" />
                Phone
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.customerPhone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter phone number"
              />
              {errors.customerPhone && (
                <p className="text-sm text-red-600 mt-1">{errors.customerPhone}</p>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {isSubmitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;