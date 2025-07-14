export interface Product {
  id: string;
  name: string;
  code: string;
  dailyPrice: number;
  image: string;
  adminStatus: 'available' | 'washing';
  createdAt: string;
}

export interface Booking {
  id: string;
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fromDate: string;
  toDate: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ProductWithStatus extends Product {
  dynamicStatus: 'available' | 'booked' | 'washing';
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}