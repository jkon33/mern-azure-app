import React, { useState } from 'react';

function AddItem({ onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'other'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { name, description, price, category } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await onAdd(formData);
    
    if (result.success) {
      setSuccess('Item added successfully!');
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'other'
      });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="card">
      <h2>Add New Item</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
            placeholder="Enter item name"
          />
        </div>
        
        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={description}
            onChange={onChange}
            required
            rows="3"
            placeholder="Enter item description"
          />
        </div>
        
        <div className="form-group">
          <label>Price *</label>
          <input
            type="number"
            name="price"
            value={price}
            onChange={onChange}
            required
            step="0.01"
            min="0"
            placeholder="0.00"
          />
        </div>
        
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={category} onChange={onChange}>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Item'}
        </button>
      </form>
    </div>
  );
}

export default AddItem;