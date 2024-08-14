// src/components/admin/AxeEdit.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const AxeEdit = () => {
  const { id } = useParams(); // ID de l'axe à modifier
  const [axe, setAxe] = useState({
    title: '',
    content: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  // Charger les informations de l'axe au chargement du composant
  useEffect(() => {
    const fetchAxe = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/axes/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        setAxe(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des informations de l\'axe', error);
        toast.error('Erreur lors du chargement des informations de l\'axe');
      }
    };
    fetchAxe();
  }, [id, accessToken]);

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/api/axes/${id}`, axe, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      console.log('Axe mis à jour:', response.data);
      toast.success('Axe mis à jour avec succès');
      navigate('/dashboard/Axe'); // Rediriger vers la liste des axes après mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'axe', error);
      setError('Erreur lors de la mise à jour de l\'axe');
      toast.error('Erreur lors de la mise à jour de l\'axe');
    }
  };

  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAxe({
      ...axe,
      [name]: value,
    });
  };

  // Fonction pour gérer le retour à la liste des axes
  const handleBack = () => {
    navigate('/dashboard/Axe');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Modifier l'Axe</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input 
            type="text" 
            name="title" 
            value={axe.title} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contenu</label>
          <textarea 
            name="content" 
            value={axe.content} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Mettre à jour
        </button>
        <button 
          type="button" 
          onClick={handleBack} 
          className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-2"
        >
          Retour
        </button>
      </form>
    </div>
  );
};

export default AxeEdit;
