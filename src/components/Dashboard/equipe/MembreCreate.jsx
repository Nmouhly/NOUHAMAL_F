import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const MembreCreate = () => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [teamId, setTeamId] = useState('');
  const [statut, setStatut] = useState('');
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/equipe', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setTeams(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des équipes:', error);
        toast.error('Erreur lors de la récupération des équipes');
      }
    };

    fetchTeams();
  }, [accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('position', position);
    formData.append('contact_info', contactInfo);
    formData.append('team_id', teamId);
    formData.append('statut', statut);

    try {
      const response = await axios.post('http://localhost:8000/api/members', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`
        },
      });

      console.log('Membre ajouté:', response.data);
      toast.success('Membre ajouté avec succès');
      navigate('/dashboard/Member');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du membre:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        } : 'Aucune réponse disponible',
        config: error.config
      });
      setError('Erreur lors de l\'ajout du membre');
      toast.error('Erreur lors de l\'ajout du membre');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ajouter un Membre</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <input 
            type="text" 
            value={position} 
            onChange={(e) => setPosition(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact</label>
          <input 
            type="text" 
            value={contactInfo} 
            onChange={(e) => setContactInfo(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Équipe</label>
          <select 
            value={teamId} 
            onChange={(e) => setTeamId(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Sélectionner une équipe</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Statut</label>
          <select 
            value={statut} 
            onChange={(e) => setStatut(e.target.value)} 
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
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default MembreCreate;
