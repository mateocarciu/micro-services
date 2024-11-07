import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-white font-bold">Home</Link>
          <Link to="/order" className="text-white">Order</Link>
          <Link to="/kitchen" className="text-white">Kitchen</Link>
          <Link to="/delivery" className="text-white">Delivery</Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="text-white">Dashboard</Link>
              <Link to="/profile" className="text-white">Profile</Link>
            </>
          )}
        </div>
        <div>
          {isAuthenticated ? (
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;