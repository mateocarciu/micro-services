// import { useState, useEffect } from 'react';
// import { userService } from '../services/api.config';
// import LoadingSpinner from '../components/common/LoadingSpinner';

// const Dashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await userService.getUsers();
//         setUsers(response.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   if (loading) return <LoadingSpinner />;
//   if (error) return <div className="text-red-500">Error: {error}</div>;

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
//       <table className="table-auto w-full border-collapse">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="px-4 py-2">ID</th>
//             <th className="px-4 py-2">Name</th>
//             <th className="px-4 py-2">Email</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id} className="border-b">
//               <td className="px-4 py-2">{user.id}</td>
//               <td className="px-4 py-2">{user.name}</td>
//               <td className="px-4 py-2">{user.email}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Dashboard;
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">Bienvenue dans notre application de restaurant !</h1>
      <p className="text-lg mb-8">
        Découvrez nos fonctionnalités pour gérer vos commandes de manière fluide.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="border rounded-lg p-4 shadow">
          <h2 className="text-2xl font-bold mb-4">Interface Client</h2>
          <p className="mb-4">
            Les clients peuvent parcourir le menu, sélectionner des plats et passer des commandes.
          </p>
          <Link
            to="/order"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Accéder à la commande
          </Link>
        </div>

        <div className="border rounded-lg p-4 shadow">
          <h2 className="text-2xl font-bold mb-4">Tableau de Bord Cuisine</h2>
          <p className="mb-4">
            La cuisine peut voir les commandes entrantes et mettre à jour le statut des plats.
          </p>
          <Link
            to="/kitchen"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Accéder au tableau de bord
          </Link>
        </div>

        <div className="border rounded-lg p-4 shadow">
          <h2 className="text-2xl font-bold mb-4">Interface Livreur</h2>
          <p className="mb-4">
            Les livreurs peuvent voir les commandes à livrer et mettre à jour le statut des livraisons.
          </p>
          <Link
            to="/delivery"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Accéder à l'interface
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;