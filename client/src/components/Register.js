import React, { useState } from 'react';

function Register({ onRegister, onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    const result = await onRegister(name, email, password);
    
    if (result.success) {
      onNavigate('home');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Create an Account</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
            placeholder="Enter your name"
          />
        </div>
        
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
          <label>Password * (min 6 characters)</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            minLength="6"
            placeholder="Enter your password"
          />
        </div>
        
        <div className="form-group">
          <label>Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            required
            placeholder="Confirm your password"
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account?{' '}
        <button onClick={() => onNavigate('login')} className="btn btn-link" style={{ padding: 0 }}>
          Login here
        </button>
      </p>
    </div>
  );
}

export default Register;