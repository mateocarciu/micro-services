import { useState, useEffect } from 'react';

const DeliveryDashboard = () => {
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      status: 'pending',
      address: '123 Rue des Lilas, 75001 Paris',
      customerName: 'John Doe',
      customerPhone: '0612345678'
    },
    {
      id: 2,
      status: 'picked',
      address: '45 Avenue des Champs-Élysées, 75008 Paris',
      customerName: 'Jane Smith',
      customerPhone: '0687654321'
    },
    {
      id: 3,
      status: 'delivered',
      address: '78 Boulevard Saint-Germain, 75006 Paris',
      customerName: 'Robert Martin',
      customerPhone: '0698765432'
    }
  ]);

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