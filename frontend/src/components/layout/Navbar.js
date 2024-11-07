import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Fragment } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Récupérer le token du localStorage
  const firstName = localStorage.getItem('firstname');
  const lastName = localStorage.getItem('lastname');
  const { user, logout } = useAuth(); // Récupérer l'utilisateur et la fonction logout depuis le contexte

  const handleLogout = () => {
    logout(); // Utilisation de la fonction logout du contexte
    navigate('/login');
  };

  console.log(firstName);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-white font-bold">Home</Link>
          <Link to="/order" className="text-white">Menu</Link>
          {token ? (
            <Fragment>
              <Link to="/kitchen" className="text-white">Kitchen</Link>
              <Link to="/delivery" className="text-white">Delivery</Link>
            </Fragment>
            ) : (
             <div></div>
          )}
        </div>
        <div className="text-white">
          {/* Si l'utilisateur est connecté, afficher son prénom et nom */}
          {token ? (
            <div className="flex items-center space-x-4">
              <span>Bienvenue, {firstName} {lastName}</span>
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
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
