import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ItemList from './components/ItemList';
import AddItem from './components/AddItem';
import Register from './components/Register';
import Login from './components/Login';
import BackendTest from './components/BackendTest';
import api from './services/api';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  // Fetch data when component mounts
  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 App initializing...');
      
      // First, test if backend is reachable
      await testBackendConnection();
      
      // Check for existing token
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await fetchUser();
      }
      
      // Fetch items
      await fetchItems();
      
      setLoading(false);
    };
    
    initializeApp();
  }, []);

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
      const response = await api.get('/test');
      console.log('✅ Backend connected:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Backend connection failed:', error.message);
      setError(`Cannot connect to backend. Please ensure your backend is running at ${api.defaults.baseURL}`);
      return false;
    }
  };

  const fetchUser = async () => {
    try {
      const response = await api.get('/users/me');
      setUser(response.data.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error fetching user:', err);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const fetchItems = async () => {
    try {
      console.log('Fetching items from:', api.defaults.baseURL);
      const response = await api.get('/items');
      console.log('Items response:', response.data);
      
      // Handle different response structures
      if (response.data.data) {
        setItems(response.data.data);
      } else if (Array.isArray(response.data)) {
        setItems(response.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(`Failed to fetch items: ${err.message}`);
      setItems([]);
    }
  };

  const addItem = async (itemData) => {
    try {
      const response = await api.post('/items', itemData);
      setItems([response.data.data, ...items]);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to add item' 
      };
    }
  };

  const deleteItem = async (id) => {
    try {
      await api.delete(`/items/${id}`);
      setItems(items.filter(item => item._id !== id));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to delete item' 
      };
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const response = await api.post('/users/register', { name, email, password });
      if (response.data.success) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        setIsAuthenticated(true);
        setUser(response.data.user);
        setCurrentPage('home');
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      if (response.data.success) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        setIsAuthenticated(true);
        setUser(response.data.user);
        setCurrentPage('home');
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Login failed' 
      };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('home');
  };

  // Show loading state with more info
  if (loading) {
    return (
      <div className="loading">
        <h2>Loading...</h2>
        <p>Connecting to backend at: {api.defaults.baseURL}</p>
        <p>If this takes too long, check if your backend is running.</p>
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar 
          isAuthenticated={isAuthenticated} 
          user={user} 
          onLogout={handleLogout}
          onNavigate={setCurrentPage}
          currentPage={currentPage}
        />
        <div className="container">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <Routes>
            <Route 
              path="/" 
              element={
                currentPage === 'home' ? (
                  <>
                    <h1>Welcome to MERN on Azure</h1>
                    <p>Your MERN stack application is successfully deployed!</p>
                    <p><strong>Backend API:</strong> {api.defaults.baseURL}</p>
                    
                    {/* Backend Test Component - Helps debug connection issues */}
                    <BackendTest />
                    
                    {isAuthenticated && <AddItem onAdd={addItem} />}
                    <ItemList items={items} onDelete={deleteItem} isAuthenticated={isAuthenticated} />
                  </>
                ) : currentPage === 'register' ? (
                  <Register onRegister={handleRegister} onNavigate={setCurrentPage} />
                ) : currentPage === 'login' ? (
                  <Login onLogin={handleLogin} onNavigate={setCurrentPage} />
                ) : null
              } 
            />
            <Route path="/register" element={<Register onRegister={handleRegister} onNavigate={setCurrentPage} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} onNavigate={setCurrentPage} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;