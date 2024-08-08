import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const MemberEdit = () => {
  const { id } = useParams(); // ID du membre à modifier
  const [member, setMember] = useState({
    name: '',
    position: '',
    bio: '',
    contact_info: '',
    statut: '' // Ajouter le champ 'statut'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  // Charger les informations du membre au chargement du composant
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/members/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        setMember(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des informations du membre', error);
        toast.error('Erreur lors du chargement des informations du membre');
      }
    };
    fetchMember();
  }, [id, accessToken]);

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/api/members/${id}`, member, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      console.log('Membre mis à jour:', response.data);
      toast.success('Membre mis à jour avec succès');
      navigate('/dashboard/Member'); // Rediriger vers la liste des membres après mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour du membre', error);
      setError('Erreur lors de la mise à jour du membre');
      toast.error('Erreur lors de la mise à jour du membre');
    }
  };

  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember({
      ...member,
      [name]: value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Modifier le Membre</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input 
            type="text" 
            name="name" 
            value={member.name} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <input 
            type="text" 
            name="position" 
            value={member.position} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea 
            name="bio" 
            value={member.bio} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Informations de Contact</label>
          <input 
            type="text" 
            name="contact_info" 
            value={member.contact_info} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Statut</label>
          <select 
            name="statut" 
            value={member.statut} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Sélectionner un statut</option>
            <option value="Membre">Membre</option>
            <option value="Ancien">Ancien</option>
          </select>
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

export default MemberEdit;
