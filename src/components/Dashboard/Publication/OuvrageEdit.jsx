import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const OuvrageEdit = () => {
  const { id } = useParams(); // ID de l'ouvrage à modifier
  const [ouvrage, setOuvrage] = useState({
    title: '',
    author: '',
    pdf_link: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  // Charger les informations de l'ouvrage au chargement du composant
  useEffect(() => {
    const fetchOuvrage = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/ouvrages/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        setOuvrage(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des informations de l\'ouvrage', error);
        toast.error('Erreur lors du chargement des informations de l\'ouvrage');
      }
    };
    fetchOuvrage();
  }, [id, accessToken]);

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/api/ouvrages/${id}`, ouvrage, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      console.log('Ouvrage mis à jour:', response.data);
      toast.success('Ouvrage mis à jour avec succès');
      navigate('/dashboard/ouvrage'); // Rediriger vers la liste des ouvrages après mise à jour
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        console.error('Erreurs de validation:', validationErrors);
        setError('Erreur de validation : ' + Object.values(validationErrors).flat().join(', '));
      } else {
        console.error('Erreur lors de la mise à jour de l\'ouvrage', error);
        setError('Erreur lors de la mise à jour de l\'ouvrage');
      }
      toast.error('Erreur lors de la mise à jour de l\'ouvrage');
    }
  };
  
  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOuvrage({
      ...ouvrage,
      [name]: value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Modifier l'Ouvrage</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input 
            type="text" 
            name="title" 
            value={ouvrage.title} 
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
            value={ouvrage.author} 
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
            value={ouvrage.pdf_link} 
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

export default OuvrageEdit;
