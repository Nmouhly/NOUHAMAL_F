import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';

const AdminUtilisateur = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    fetchUsers();
  }, [accessToken]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error('Les données reçues ne sont pas un tableau');
        setError('Erreur de données');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs', error);
      setError('Erreur lors de la récupération des utilisateurs');
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

  return (
    <div className="container">
      <h1 className="my-4">Gestion des Utilisateurs</h1>
      <Link to="/dashboard/UserCreate" className="btn btn-primary mb-4">Ajouter un Utilisateur</Link>
      {error && <p className="text-danger">{error}</p>}
      <table className="table table-striped table-bordered">
        <thead className="thead-light">
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Email</th>
            <th scope="col">Rôle</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length ? (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role === 1 ? 'Admin' : 'Utilisateur'}</td>
                <td>
                  <Link to={`/dashboard/UserEdit/${user.id}`}  className="btn btn-primary mb-2">
                    Modifier
                  </Link>
                  <button onClick={() => handleDelete(user.id)} className="btn btn-danger mb-2">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">Aucun utilisateur disponible</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUtilisateur;
