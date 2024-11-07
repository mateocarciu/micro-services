import { useState, useEffect } from 'react';

const CustomerOrderPage = () => {
  const [menu, setMenu] = useState([]); // Liste des articles du menu
  const [cart, setCart] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // Message de confirmation

  // Fonction pour récupérer le menu
  const fetchMenu = async () => {
    const token = localStorage.getItem('token'); // Récupérer le token du localStorage

    if (!token) {
      console.log('Token manquant');
      setError('Token manquant');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/menu', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': token // Ajouter le token dans les headers
        }
      });

      if (!response.ok) {
        throw new Error('Erreur de récupération du menu');
      }

      const data = await response.json();
      console.log('Menu récupéré:', data); // Afficher la réponse de l'API dans la console
      setMenu(data); // Mettre à jour le menu avec les données reçues
    } catch (err) {
      console.error('Erreur de requête API:', err);
      setError('Erreur de récupération du menu');
    }
  };

  // Utiliser useEffect pour charger le menu au premier rendu du composant
  useEffect(() => {
    fetchMenu();
  }, []);

  // Ajouter un élément au panier
  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  // Retirer un élément du panier
  const removeFromCart = (itemIndex) => {
    const updatedCart = [...cart];
    updatedCart.splice(itemIndex, 1);
    setCart(updatedCart);
  };

  // Fonction pour créer une nouvelle commande
  const createOrder = async () => {
    const token = localStorage.getItem('token'); // Récupérer le token du localStorage

    if (!token) {
      console.log('Token manquant');
      setError('Token manquant');
      return;
    }

    const userId = localStorage.getItem('userId'); // Récupérer l'ID de l'utilisateur depuis le localStorage

    const order = {
      userId: userId,
      items: cart.map(item => ({
        itemId: item._id, // Utilise l'_id de l'élément
        itemName: item.menuItemName
      })),
      specialInstructions: specialInstructions,
    };

    try {
      const response = await fetch('http://localhost:3000/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token // Ajouter le token dans les headers pour authentification
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la commande');
      }

      const data = await response.json();
      console.log('Commande créée avec succès:', data);
      setSuccessMessage('Votre commande a été validée avec succès !'); // Affichage du message de succès
    } catch (err) {
      console.error('Erreur lors de la création de la commande:', err);
      setError('Erreur lors de la création de la commande');
    }
  };

  // Passer la commande
  const placeOrder = () => {
    createOrder();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Commander</h1>

      {/* Affichage d'une erreur s'il y en a une */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Affichage du menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.length > 0 ? (
          menu.map((item) => (
            <div
              key={item._id}
              className={`border rounded-lg p-4 shadow ${!item.availabilityStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <img 
                src="https://via.placeholder.com/150" 
                alt={item.menuItemName} 
                className="w-full h-48 object-cover rounded" 
              />
              <h3 className="text-xl font-semibold mt-2">{item.menuItemName}</h3>
              <p className="text-gray-600">
                {item.availabilityStatus ? 'Disponible' : 'Indisponible'}
              </p>
              <button
                onClick={() => addToCart(item)}
                className={`mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${!item.availabilityStatus ? 'bg-gray-500 cursor-not-allowed' : ''}`}
                disabled={!item.availabilityStatus} // Désactiver le bouton si le plat est indisponible
              >
                Ajouter au panier
              </button>
            </div>
          ))
        ) : (
          <p>Chargement du menu...</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Votre Panier</h2>
        {cart.length > 0 ? (
          <div>
            <ul className="space-y-4">
              {cart.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{item.menuItemName}</h3>
                  </div>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <label htmlFor="specialInstructions" className="block font-medium mb-2">
                Instructions spéciales:
              </label>
              <textarea
                id="specialInstructions"
                rows="3"
                className="w-full border rounded-lg p-2"
                placeholder="Ajoutez des instructions spéciales pour votre commande..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              ></textarea>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={placeOrder}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Passer la commande
              </button>
            </div>
          </div>
        ) : (
          <p>Votre panier est vide.</p>
        )}
      </div>

      {/* Affichage du message de succès */}
      {successMessage && <div className="text-green-500">{successMessage}</div>}
    </div>
  );
};

export default CustomerOrderPage;
