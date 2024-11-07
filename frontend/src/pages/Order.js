import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerOrderPage = () => {
  const navigate = useNavigate();

  // Données statiques pour l'exemple, à remplacer par l'API
  const menu = [
    {
      id: 1,
      name: 'Hamburger',
      description: 'Steak haché, pain, salade, tomate, oignon',
      price: 9.99,
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 2, 
      name: 'Pizza Margherita',
      description: 'Sauce tomate, mozzarella, basilic',
      price: 12.99,
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 3,
      name: 'Salade César',
      description: 'Salade romaine, poulet grillé, croûtons, parmesan',
      price: 8.99,
      image: 'https://via.placeholder.com/150'
    }
  ];

  const [cart, setCart] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (itemIndex) => {
    const updatedCart = [...cart];
    updatedCart.splice(itemIndex, 1);
    setCart(updatedCart);
  };

  const placeOrder = () => {
    // Préparer les données de la commande
    const order = {
      items: cart,
      specialInstructions: specialInstructions
    };

    // Envoyer la commande à l'API Gateway
    // TODO: Implémenter l'appel à l'API
    console.log('Commande envoyée :', order);

    // Rediriger vers la page de confirmation
    navigate('/order-confirmation');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Commander</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded" />
            <h3 className="text-xl font-semibold mt-2">{item.name}</h3>
            <p className="text-gray-600">{item.description}</p>
            <p className="text-lg font-bold mt-2">{item.price}€</p>
            <button
              onClick={() => addToCart(item)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Ajouter au panier
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Votre Panier</h2>
        {cart.length > 0 ? (
          <div>
            <ul className="space-y-4">
              {cart.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">{item.price}€</p>
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
    </div>
  );
};

export default CustomerOrderPage;