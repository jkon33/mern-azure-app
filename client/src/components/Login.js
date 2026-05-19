import React, { useState } from 'react';

function Login({ onLogin, onNavigate }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await onLogin(email, password);
    
    if (result.success) {
      onNavigate('home');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Login to Your Account</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            placeholder="Enter your email"
          />
        </div>
        
        <div className="form-group">
          <label>Password *</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            placeholder="Enter your password"
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Don't have an account?{' '}
        <button onClick={() => onNavigate('register')} className="btn btn-link" style={{ padding: 0 }}>
          Register here
        </button>
      </p>
    </div>
  );
}

export default Login;