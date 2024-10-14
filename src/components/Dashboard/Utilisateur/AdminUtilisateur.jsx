import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';

const AdminUtilisateur = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState('');
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    fetchUsers();
  }, [accessToken]);

  const fetchUsers = async () => {
    try {
      console.log('Access Token:', accessToken); // Debugging token
      const response = await axios.get('http://localhost:8000/api/users', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      console.log('Users:', response.data); // Debugging response
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error('Les données reçues ne sont pas un tableau');
        setError('Erreur de données');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs', error);
      setError(error.response?.data?.message || 'Erreur lors de la récupération des utilisateurs');
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await axios.delete(`http://localhost:8000/api/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur', error);
        setError('Erreur lors de la suppression de l\'utilisateur');
      }
    }
  };
  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter(id => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  const handleChangeStatus = async (newStatus) => {
    try {
      console.log('Selected Users:', selectedUsers); // Debugging selected users
      await Promise.all(selectedUsers.map(userId =>
        axios.put(`http://localhost:8000/api/users/${userId}/status`, { Etat: newStatus }, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
      ));
      toast.success('Statut mis à jour avec succès');
      setSelectedUsers([]); // Reset selected users
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut des utilisateurs', error);
      setError(error.response?.data?.message || 'Erreur lors de la mise à jour du statut des utilisateurs');
    }
  };

  return (
    <div>
      <h1>Gestion des Utilisateurs</h1>
      <Link to="/dashboard/UserCreate" className="btn btn-primary mb-4">Ajouter un Utilisateur</Link>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <button onClick={() => handleChangeStatus('approuve')} className="btn btn-success mr-2">Approuver</button>
        <button onClick={() => handleChangeStatus('non approuve')} className="btn btn-danger">Désapprouver</button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setSelectedUsers(isChecked ? users.map(user => user.id) : []);
                }}
                checked={selectedUsers.length === users.length}
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">État</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length ? (
            users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role === 1 ? 'Admin' : 'Utilisateur'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.Etat}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/dashboard/UserEdit/${user.id}`} className="btn btn-primary mb-2">Modifier</Link>
                  <button onClick={() => handleDelete(user.id)} className="btn btn-danger mb-2">Supprimer</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">Aucun utilisateur disponible</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUtilisateur;
