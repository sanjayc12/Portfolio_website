import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="bg-glow"></div>
      <div className="bg-glow-2"></div>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
      </Routes>
      
      <footer className="footer section" id="contact">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Sanjay. Built with passion and modern web technologies.</p>
        </div>
      </footer>
    </Router>
  );
}

export default App;
