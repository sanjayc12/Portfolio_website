import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'sanjay@123' && password === '1234') {
      localStorage.setItem('isAdminAuthenticated', 'true');
      navigate('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container admin-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form className="admin-form animate-up" onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Admin <span>Login</span></h2>
        
        {error && <p style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
          Login
        </button>
        <button type="button" onClick={() => navigate('/')} className="btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
          Back to Site
        </button>
      </form>
    </div>
  );
}
