import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Booking, ProductWithStatus } from '../types';
import { getProducts, getBookings, saveProduct, saveBooking, updateProductStatus, updateBookingStatus } from '../utils/storage';
import { isDateInRange, hasBookingConflict } from '../utils/dateUtils';

interface AppContextType {
  products: ProductWithStatus[];
  bookings: Booking[];
  filteredDate: string;
  setFilteredDate: (date: string) => void;
  refreshData: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (productId: string, adminStatus: 'available' | 'washing') => void;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<boolean>;
  updateBooking: (bookingId: string, status: 'active' | 'completed' | 'cancelled') => void;
  getProductById: (id: string) => Product | undefined;
  getBookingsByProduct: (productId: string) => Booking[];
  checkBookingConflict: (productId: string, fromDate: string, toDate: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<ProductWithStatus[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredDate, setFilteredDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const refreshData = () => {
    const rawProducts = getProducts();
    const rawBookings = getBookings();
    
    // Calculate dynamic status for each product based on filtered date
    const productsWithStatus: ProductWithStatus[] = rawProducts.map(product => {
      let dynamicStatus: 'available' | 'booked' | 'washing' = 'available';
      
      // Check if admin marked it as washing
      if (product.adminStatus === 'washing') {
        dynamicStatus = 'washing';
      } else {
        // Check if it's booked on the filtered date
        const isBooked = rawBookings.some(booking => 
          booking.productId === product.id &&
          booking.status === 'active' &&
          isDateInRange(filteredDate, booking.fromDate, booking.toDate)
        );
        
        if (isBooked) {
          dynamicStatus = 'booked';
        }
      }
      
      return {
        ...product,
        dynamicStatus
      };
    });
    
    setProducts(productsWithStatus);
    setBookings(rawBookings);
  };

  useEffect(() => {
    refreshData();
  }, [filteredDate]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `product-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    saveProduct(newProduct);
    refreshData();
  };

  const updateProduct = (productId: string, adminStatus: 'available' | 'washing') => {
    updateProductStatus(productId, adminStatus);
    refreshData();
  };

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<boolean> => {
    // Check for conflicts
    const productBookings = bookings.filter(b => b.productId === bookingData.productId);
    const hasConflict = hasBookingConflict(bookingData.fromDate, bookingData.toDate, productBookings);
    
    if (hasConflict) {
      return false;
    }
    
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    saveBooking(newBooking);
    refreshData();
    return true;
  };

  const updateBooking = (bookingId: string, status: 'active' | 'completed' | 'cancelled') => {
    updateBookingStatus(bookingId, status);
    refreshData();
  };

  const getProductById = (id: string): Product | undefined => {
    return getProducts().find(p => p.id === id);
  };

  const getBookingsByProduct = (productId: string): Booking[] => {
    return bookings.filter(b => b.productId === productId);
  };

  const checkBookingConflict = (productId: string, fromDate: string, toDate: string): boolean => {
    const productBookings = bookings.filter(b => b.productId === productId);
    return hasBookingConflict(fromDate, toDate, productBookings);
  };

  return (
    <AppContext.Provider value={{
      products,
      bookings,
      filteredDate,
      setFilteredDate,
      refreshData,
      addProduct,
      updateProduct,
      addBooking,
      updateBooking,
      getProductById,
      getBookingsByProduct,
      checkBookingConflict
    }}>
      {children}
    </AppContext.Provider>
  );
};