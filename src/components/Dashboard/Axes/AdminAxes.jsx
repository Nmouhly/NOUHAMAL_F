import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import parse from 'html-react-parser';

const AdminAxes = () => {
  const [axes, setAxes] = useState([]);
  const [error, setError] = useState('');
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    fetchAxes();
  }, [accessToken]);

  const fetchAxes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/axes', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (Array.isArray(response.data)) {
        setAxes(response.data);
      } else {
        console.error('Les données reçues ne sont pas un tableau');
        setError('Erreur de données');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des axes', error);
      setError('Erreur lors de la récupération des axes');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet axe ?')) {
      try {
        await axios.delete(`http://localhost:8000/api/axes/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setAxes(axes.filter(axe => axe.id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'axe', error);
        setError('Erreur lors de la suppression de l\'axe');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Gestion des Axes de Recherche</h1>
      <Link to="/dashboard/AxeCreate" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4">
        Ajouter un Axe
      </Link>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {axes.length ? (
            axes.map(axe => (
              <tr key={axe.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{parse(axe.title)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parse(axe.content)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/dashboard/AxeEdit/${axe.id}`} className="text-blue-600 hover:text-blue-800 mr-4">
                    Modifier
                  </Link>
                  <button onClick={() => handleDelete(axe.id)} className="text-red-600 hover:text-red-800">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4">Aucun axe disponible</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAxes;