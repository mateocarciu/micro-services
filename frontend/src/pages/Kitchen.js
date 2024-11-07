import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KitchenMenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({
    menuItemName: '',
    availabilityStatus: true,
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('/api/items', {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
        },
      });
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const addMenuItem = async () => {
    try {
      const response = await axios.post('/api/items', newItem, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      setMenuItems([...menuItems, response.data]);
      setNewItem({ menuItemName: '', availabilityStatus: true });
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  const deleteMenuItem = async (itemId) => {
    try {
      await axios.delete(`/api/items/${itemId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
        },
      });
      setMenuItems(menuItems.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestion du Menu</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item._id} className="border rounded-lg p-4 shadow">
            <img src="/api/placeholder/400/320" alt={item.menuItemName} className="w-full h-48 object-cover rounded" />
            <h3 className="text-xl font-semibold mt-2">{item.menuItemName}</h3>
            <p className="text-gray-600">Disponibilité: {item.availabilityStatus ? 'Oui' : 'Non'}</p>
            <button
              onClick={() => deleteMenuItem(item._id)}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Ajouter un nouveau plat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="menuItemName" className="block font-medium mb-2">Nom</label>
            <input
              type="text"
              id="menuItemName"
              name="menuItemName"
              className="w-full border rounded-lg p-2"
              value={newItem.menuItemName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="availabilityStatus" className="block font-medium mb-2">Disponibilité</label>
            <select
              id="availabilityStatus"
              name="availabilityStatus"
              className="w-full border rounded-lg p-2"
              value={newItem.availabilityStatus}
              onChange={handleInputChange}
            >
              <option value={true}>Oui</option>
              <option value={false}>Non</option>
            </select>
          </div>
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={addMenuItem}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Ajouter au menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default KitchenMenuPage;