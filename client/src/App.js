import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ItemList from './components/ItemList';
import AddItem from './components/AddItem';
import Register from './components/Register';
import Login from './components/Login';
import api from './services/api';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    }
    fetchItems();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/users/me');
      setUser(response.data.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error fetching user:', err);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await api.get('/items');
      setItems(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch items');
      console.error('Error:', err);
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
        // If your backend returns a token
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

  if (loading) {
    return <div className="loading">Loading...</div>;
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