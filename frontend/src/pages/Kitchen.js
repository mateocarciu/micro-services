import { useState } from 'react';

const KitchenMenuPage = () => {
  const [menuItems, setMenuItems] = useState([
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
  ]);

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    image: ''
  });

  const handleInputChange = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value
    });
  };

  const addMenuItem = () => {
    setMenuItems([...menuItems, { ...newItem, id: menuItems.length + 1 }]);
    setNewItem({ name: '', description: '', price: 0, image: '' });
  };

  const removeMenuItem = (itemIndex) => {
    const updatedMenu = [...menuItems];
    updatedMenu.splice(itemIndex, 1);
    setMenuItems(updatedMenu);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestion du Menu</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <div key={item.id} className="border rounded-lg p-4 shadow">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded" />
            <h3 className="text-xl font-semibold mt-2">{item.name}</h3>
            <p className="text-gray-600">{item.description}</p>
            <p className="text-lg font-bold mt-2">{item.price}€</p>
            <button
              onClick={() => removeMenuItem(index)}
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
            <label htmlFor="name" className="block font-medium mb-2">Nom</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full border rounded-lg p-2"
              value={newItem.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="description" className="block font-medium mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className="w-full border rounded-lg p-2"
              value={newItem.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div>
            <label htmlFor="price" className="block font-medium mb-2">Prix</label>
            <input
              type="number"
              id="price"
              name="price"
              className="w-full border rounded-lg p-2"
              value={newItem.price}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="image" className="block font-medium mb-2">Image (URL)</label>
            <input
              type="text"
              id="image"
              name="image"
              className="w-full border rounded-lg p-2"
              value={newItem.image}
              onChange={handleInputChange}
            />
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