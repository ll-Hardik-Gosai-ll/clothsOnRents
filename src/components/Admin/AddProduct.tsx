import React, { useState } from 'react';
import { Plus, Upload, Tag, DollarSign, Type, Image } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AddProduct: React.FC = () => {
  const { addProduct } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    dailyPrice: '',
    image: '',
    adminStatus: 'available' as 'available' | 'washing'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sampleImages = [
    'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1661471/pexels-photo-1661471.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.code.trim()) newErrors.code = 'Product code is required';
    if (!formData.dailyPrice) newErrors.dailyPrice = 'Daily price is required';
    if (!formData.image) newErrors.image = 'Product image is required';
    
    const price = parseFloat(formData.dailyPrice);
    if (isNaN(price) || price <= 0) {
      newErrors.dailyPrice = 'Please enter a valid price greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      addProduct({
        name: formData.name.trim(),
        code: formData.code.trim(),
        dailyPrice: parseFloat(formData.dailyPrice),
        image: formData.image,
        adminStatus: formData.adminStatus
      });
      
      // Reset form
      setFormData({
        name: '',
        code: '',
        dailyPrice: '',
        image: '',
        adminStatus: 'available'
      });
      
      setErrors({});
      
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
        <p className="text-gray-600">Add a new clothing item to your rental inventory</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <span className="text-sm text-red-700">{errors.general}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Type className="h-4 w-4 inline mr-1" />
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="h-4 w-4 inline mr-1" />
                Product Code
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.code ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter product code"
              />
              {errors.code && (
                <p className="text-sm text-red-600 mt-1">{errors.code}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Daily Price
              </label>
              <input
                type="number"
                name="dailyPrice"
                value={formData.dailyPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.dailyPrice ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter daily rental price"
              />
              {errors.dailyPrice && (
                <p className="text-sm text-red-600 mt-1">{errors.dailyPrice}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Status
              </label>
              <select
                name="adminStatus"
                value={formData.adminStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="available">Available</option>
                <option value="washing">Sent for Washing</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Image className="h-4 w-4 inline mr-1" />
              Product Image
            </label>
            <div className="space-y-4">
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.image ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter image URL or select from samples below"
              />
              {errors.image && (
                <p className="text-sm text-red-600 mt-1">{errors.image}</p>
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Or select from sample images:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {sampleImages.map((imageUrl, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: imageUrl }))}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                        formData.image === imageUrl 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={imageUrl}
                        alt={`Sample ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {formData.image && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-300">
                <img
                  src={formData.image}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              {isSubmitting ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;