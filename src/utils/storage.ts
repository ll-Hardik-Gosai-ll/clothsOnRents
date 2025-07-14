import { Product, Booking, User } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'clothing_rental_products',
  BOOKINGS: 'clothing_rental_bookings',
  USERS: 'clothing_rental_users',
  CURRENT_USER: 'clothing_rental_current_user'
};

// Products
export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return stored ? JSON.parse(stored) : [];
};

export const saveProduct = (product: Product): void => {
  const products = getProducts();
  const existingIndex = products.findIndex(p => p.id === product.id);
  
  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }
  
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const updateProductStatus = (productId: string, adminStatus: 'available' | 'washing'): void => {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  
  if (product) {
    product.adminStatus = adminStatus;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }
};

// Bookings
export const getBookings = (): Booking[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  return stored ? JSON.parse(stored) : [];
};

export const saveBooking = (booking: Booking): void => {
  const bookings = getBookings();
  const existingIndex = bookings.findIndex(b => b.id === booking.id);
  
  if (existingIndex >= 0) {
    bookings[existingIndex] = booking;
  } else {
    bookings.push(booking);
  }
  
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
};

export const updateBookingStatus = (bookingId: string, status: 'active' | 'completed' | 'cancelled'): void => {
  const bookings = getBookings();
  const booking = bookings.find(b => b.id === bookingId);
  
  if (booking) {
    booking.status = status;
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }
};

// Users
export const getUsers = (): User[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  return stored ? JSON.parse(stored) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return stored ? JSON.parse(stored) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Initialize default admin user
export const initializeDefaultAdmin = (): void => {
  const users = getUsers();
  const adminExists = users.some(u => u.role === 'admin');
  
  if (!adminExists) {
    const defaultAdmin: User = {
      id: 'admin-1',
      email: 'admin@clothingrental.com',
      role: 'admin'
    };
    saveUser(defaultAdmin);
  }
};