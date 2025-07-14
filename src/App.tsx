import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import Header from './components/Layout/Header';
import ProductList from './components/Products/ProductList';
import BookingsList from './components/Admin/BookingsList';
import AddProduct from './components/Admin/AddProduct';
import Login from './components/Admin/Login';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('products');

  const handleLoginSuccess = () => {
    setCurrentView('products');
  };

  const renderCurrentView = () => {
    if (!isAuthenticated && currentView === 'login') {
      return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    switch (currentView) {
      case 'products':
        return <ProductList />;
      case 'bookings':
        return isAuthenticated ? <BookingsList /> : <ProductList />;
      case 'add-product':
        return isAuthenticated ? <AddProduct /> : <ProductList />;
      default:
        return <ProductList />;
    }
  };

  const showHeader = !(currentView === 'login' && !isAuthenticated);

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && (
        <Header 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
      )}
      {renderCurrentView()}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;