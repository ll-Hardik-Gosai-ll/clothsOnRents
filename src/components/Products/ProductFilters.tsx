import React from 'react';
import { Calendar, Search, Tag } from 'lucide-react';

interface ProductFiltersProps {
  filteredDate: string;
  onDateChange: (date: string) => void;
  nameFilter: string;
  onNameFilterChange: (name: string) => void;
  codeFilter: string;
  onCodeFilterChange: (code: string) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filteredDate,
  onDateChange,
  nameFilter,
  onNameFilterChange,
  codeFilter,
  onCodeFilterChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            Check Availability for Date
          </label>
          <input
            type="date"
            value={filteredDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Search className="h-4 w-4 inline mr-1" />
            Product Name
          </label>
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => onNameFilterChange(e.target.value)}
            placeholder="Search by product name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="h-4 w-4 inline mr-1" />
            Product Code
          </label>
          <input
            type="text"
            value={codeFilter}
            onChange={(e) => onCodeFilterChange(e.target.value)}
            placeholder="Search by product code..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;