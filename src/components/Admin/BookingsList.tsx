import React, { useState } from 'react';
import { Calendar, User, Phone, Mail, Tag, Search, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/dateUtils';

const BookingsList: React.FC = () => {
  const { bookings, products, getProductById, updateBooking, updateProduct } = useApp();
  const [filters, setFilters] = useState({
    productCode: '',
    productName: '',
    customerName: ''
  });

  const filteredBookings = bookings.filter(booking => {
    const product = getProductById(booking.productId);
    const matchesProductCode = !filters.productCode || 
      product?.code.toLowerCase().includes(filters.productCode.toLowerCase());
    const matchesProductName = !filters.productName || 
      product?.name.toLowerCase().includes(filters.productName.toLowerCase());
    const matchesCustomerName = !filters.customerName || 
      booking.customerName.toLowerCase().includes(filters.customerName.toLowerCase());
    
    return matchesProductCode && matchesProductName && matchesCustomerName;
  });

  const handleStatusChange = (bookingId: string, newStatus: 'active' | 'completed' | 'cancelled') => {
    updateBooking(bookingId, newStatus);
  };

  const handleProductStatusChange = (productId: string, newStatus: 'available' | 'washing') => {
    updateProduct(productId, newStatus);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
        <p className="text-gray-600">Manage all customer bookings and product statuses</p>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Tag className="h-4 w-4 inline mr-1" />
              Product Code
            </label>
            <input
              type="text"
              value={filters.productCode}
              onChange={(e) => setFilters(prev => ({ ...prev, productCode: e.target.value }))}
              placeholder="Search by product code..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Search className="h-4 w-4 inline mr-1" />
              Product Name
            </label>
            <input
              type="text"
              value={filters.productName}
              onChange={(e) => setFilters(prev => ({ ...prev, productName: e.target.value }))}
              placeholder="Search by product name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="h-4 w-4 inline mr-1" />
              Customer Name
            </label>
            <input
              type="text"
              value={filters.customerName}
              onChange={(e) => setFilters(prev => ({ ...prev, customerName: e.target.value }))}
              placeholder="Search by customer name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map(booking => {
                const product = getProductById(booking.productId);
                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product?.name || 'Unknown Product'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Code: {product?.code || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center text-sm text-gray-900">
                          <User className="h-4 w-4 mr-1" />
                          {booking.customerName}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 mr-1" />
                          {booking.customerEmail}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-1" />
                          {booking.customerPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(booking.fromDate)} - {formatDate(booking.toDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-y-2">
                      <div className="flex space-x-2">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value as any)}
                          className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      
                      {product && (
                        <div className="flex space-x-2">
                          <select
                            value={product.adminStatus}
                            onChange={(e) => handleProductStatusChange(product.id, e.target.value as any)}
                            className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="available">Available</option>
                            <option value="washing">Sent for Washing</option>
                          </select>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No bookings found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsList;