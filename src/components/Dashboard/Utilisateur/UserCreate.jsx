import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserCreate = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Valeur initiale du rôle
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext); // Récupérer le token du contexte

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convertir le rôle en nombre si nécessaire
      const roleNumber = role === 'Admin' ? 1 : 0;
      console.log(name,email,password,role);
      const response = await axios.post('http://localhost:8000/api/user/register', {
        name,
        email,
        password,
        role: roleNumber, // Inclure le rôle dans la requête
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}` // Inclure le token dans les en-têtes
        },
      });

      console.log('Utilisateur ajouté:', response.data);
      toast.success('Utilisateur ajouté avec succès');
      navigate('/dashboard/Utilisateur'); // Rediriger vers la page d'administration après ajout
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur', error.response?.data || error.message);
      setError('Erreur lors de l\'ajout de l\'utilisateur');
      toast.error('Erreur lors de l\'ajout de l\'utilisateur');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ajouter un Utilisateur</h1>
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
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mot de passe</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rôle</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Sélectionnez un rôle</option>
            <option value="Utilisateur">Utilisateur</option>
            <option value="Admin">Admin</option>
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

export default UserCreate;
