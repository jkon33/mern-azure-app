import React from 'react';

function Navbar({ isAuthenticated, user, onLogout, onNavigate, currentPage }) {
  return (
    <nav className="navbar">
      <div className="container">
        <button onClick={() => onNavigate('home')} className="logo" style={{ background: 'none', border: 'none', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer' }}>
          MERN on Azure
        </button>
        <div className="nav-links">
          <button onClick={() => onNavigate('home')} className={currentPage === 'home' ? 'active' : ''} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            Home
          </button>
          
          {isAuthenticated ? (
            <>
              <span>Welcome, {user?.name}!</span>
              <button onClick={onLogout} className="btn btn-danger">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => onNavigate('login')} className="btn btn-primary">Login</button>
              <button onClick={() => onNavigate('register')} className="btn btn-success">Register</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;