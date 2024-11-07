import { useState, useEffect } from 'react';
import axios from 'axios';

const DeliveryDashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les commandes depuis l'API
  const fetchOrders = async () => {
    const token = localStorage.getItem('token'); // Récupérer le token pour authentification

    if (!token) {
      console.log('Token manquant');
      setError('Token manquant');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/api/order', {
        headers: {
          'token': token // Ajouter le token dans l'entête
        }
      });
      setDeliveries(response.data); // Mettre à jour l'état avec les commandes récupérées
    } catch (err) {
      console.error('Erreur lors de la récupération des commandes:', err);
      setError('Erreur lors de la récupération des commandes');
    }
  };

  // Utiliser useEffect pour charger les commandes au premier rendu du composant
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fonction pour mettre à jour le statut de la livraison
  const updateDeliveryStatus = (deliveryId, newStatus) => {
    const updatedDeliveries = deliveries.map(delivery => {
      if (delivery.id === deliveryId) {
        return { ...delivery, status: newStatus };
      }
      return delivery;
    });
    setDeliveries(updatedDeliveries);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord - Livraisons</h1>

      {/* Affichage d'une erreur s'il y en a une */}
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="border rounded-lg p-4 shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Livraison #{delivery.id}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  delivery.status === 'pending'
                    ? 'bg-yellow-200 text-yellow-800'
                    : delivery.status === 'picked'
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-green-200 text-green-800'
                }`}
              >
                {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
              </span>
            </div>

            <div className="mb-4">
              <p className="font-medium">Adresse de livraison:</p>
              <p>{delivery.address}</p>
            </div>
            <div className="mb-4">
              <p className="font-medium">Client:</p>
              <p>{delivery.customerName}</p>
              <p>{delivery.customerPhone}</p>
            </div>

            {/* Affichage des articles de la commande */}
            <div className="mb-4">
              <p className="font-medium">Articles de la commande:</p>
              {delivery.items && delivery.items.length > 0 ? (
                <ul>
                  {delivery.items.map((item, index) => (
                    <li key={index}>{item.itemName}</li> // Affichage du nom de l'article
                  ))}
                </ul>
              ) : (
                <p>Aucun article dans cette commande.</p>
              )}
            </div>

            <div className="mt-4 space-x-2">
              {delivery.status === 'pending' && (
                <button
                  onClick={() => updateDeliveryStatus(delivery.id, 'picked')}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Prise en charge
                </button>
              )}
              {delivery.status === 'picked' && (
                <button
                  onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Livraison effectuée
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
