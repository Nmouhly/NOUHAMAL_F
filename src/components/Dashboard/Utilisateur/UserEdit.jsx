import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';

const UserEdit = () => {
    const { id } = useParams(); // Récupère l'ID de l'utilisateur à partir des paramètres de l'URL
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState(0); // 0 pour utilisateur normal, 1 pour admin
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);

    // Fonction pour récupérer les données de l'utilisateur
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const user = response.data;
                setName(user.name);
                setEmail(user.email);
                setRole(user.role || 0); // Définit la valeur par défaut de rôle si non défini
            } catch (error) {
                console.error('Erreur lors de la récupération des données de l\'utilisateur', error.response || error.message);
                setError('Erreur lors de la récupération des données de l\'utilisateur. Veuillez réessayer.');
                toast.error('Erreur lors de la récupération des données de l\'utilisateur.');
            }
        };

        fetchUser();
    }, [id, accessToken]);

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`http://localhost:8000/api/users/${id}`, {
                name,
                email,
                role
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            console.log('Utilisateur modifié:', response.data);
            toast.success('Utilisateur modifié avec succès');
            navigate('/dashboard/AdminUtilisateur');
        } catch (error) {
            console.error('Erreur lors de la modification de l\'utilisateur', error.response || error.message);
            setError('Erreur lors de la modification de l\'utilisateur. Veuillez réessayer.');
            toast.error('Erreur lors de la modification de l\'utilisateur.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Modifier l'Utilisateur</h1>
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
                    <label className="block text-sm font-medium mb-1">Rôle</label>
                    <select 
                        value={role} 
                        onChange={(e) => setRole(Number(e.target.value))} 
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value={0}>Utilisateur</option>
                        <option value={1}>Admin</option>
                    </select>
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Modifier
                </button>
            </form>
        </div>
    );
};

export default UserEdit;
