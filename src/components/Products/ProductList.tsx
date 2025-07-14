import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';

const ProductList: React.FC = () => {
  const { products, filteredDate, setFilteredDate } = useApp();
  const [nameFilter, setNameFilter] = useState('');
  const [codeFilter, setCodeFilter] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesName = product.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesCode = product.code.toLowerCase().includes(codeFilter.toLowerCase());
    return matchesName && matchesCode;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Clothing Rental</h1>
        <p className="text-gray-600">Browse and book our premium clothing collection</p>
      </div>
      
      <ProductFilters
        filteredDate={filteredDate}
        onDateChange={setFilteredDate}
        nameFilter={nameFilter}
        onNameFilterChange={setNameFilter}
        codeFilter={codeFilter}
        onCodeFilterChange={setCodeFilter}
      />
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;