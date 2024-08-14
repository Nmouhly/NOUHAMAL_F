import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const RevueEdit = () => {
  const { id } = useParams(); // ID de la revue à modifier
  const [revue, setRevue] = useState({
    title: '',
    author: '',
    pdf_link: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  // Charger les informations de la revue au chargement du composant
  useEffect(() => {
    const fetchRevue = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/revues/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        setRevue(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des informations de la revue', error);
        toast.error('Erreur lors du chargement des informations de la revue');
      }
    };
    fetchRevue();
  }, [id, accessToken]);

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification du lien PDF
    if (!isValidUrl(revue.pdf_link)) {
        setError('Le lien PDF n\'est pas valide');
        return;
    }

    try {
      const response = await axios.put(`http://localhost:8000/api/revues/${id}`, revue, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      console.log('Revue mise à jour:', response.data);
      toast.success('Revue mise à jour avec succès');
      navigate('/dashboard/revues'); // Rediriger vers la liste des revues après mise à jour
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        console.error('Erreurs de validation:', validationErrors);
        setError('Erreur de validation : ' + Object.values(validationErrors).flat().join(', '));
      } else {
        console.error('Erreur lors de la mise à jour de la revue', error);
        setError('Erreur lors de la mise à jour de la revue');
      }
      toast.error('Erreur lors de la mise à jour de la revue');
    }
  };
  
  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRevue({
      ...revue,
      [name]: value,
    });
  };

  const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Modifier la Revue</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input 
            type="text" 
            name="title" 
            value={revue.title} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Auteur</label>
          <input 
            type="text" 
            name="author" 
            value={revue.author} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lien PDF</label>
          <input 
            type="url" 
            name="pdf_link" 
            value={revue.pdf_link} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Mettre à jour
        </button>
      </form>
    </div>
  );
};

export default RevueEdit;
