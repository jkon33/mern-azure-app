import React from 'react';

function ItemList({ items, onDelete, isAuthenticated }) {
  if (!items || items.length === 0) {
    return (
      <div className="card">
        <p>No items found. Add your first item!</p>
      </div>
    );
  }

  return (
    <div className="item-list">
      <h2>Items ({items.length})</h2>
      {items.map(item => (
        <div key={item._id} className="card">
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <p><strong>Price:</strong> ${item.price}</p>
          <p><strong>Category:</strong> {item.category}</p>
          <p><small>Created: {new Date(item.createdAt).toLocaleDateString()}</small></p>
          {isAuthenticated && (
            <button 
              onClick={() => onDelete(item._id)} 
              className="btn btn-danger"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default ItemList;