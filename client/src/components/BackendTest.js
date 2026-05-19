import React, { useState } from 'react';
import api from '../services/api';

function BackendTest() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testBackend = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/test');
      setResult(response.data);
      console.log('Backend test successful:', response.data);
    } catch (err) {
      setError(err.message);
      console.error('Backend test failed:', err);
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h3>Backend Connection Test</h3>
      <button onClick={testBackend} className="btn btn-primary">
        Test Backend Connection
      </button>
      
      {loading && <p>Testing connection...</p>}
      
      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
          <p>Make sure your backend is running at: {api.defaults.baseURL}</p>
        </div>
      )}
      
      {result && (
        <div className="alert alert-success">
          <strong>Success!</strong> Backend is reachable!
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      
      <p><strong>Current API URL:</strong> {api.defaults.baseURL}</p>
    </div>
  );
}

export default BackendTest;