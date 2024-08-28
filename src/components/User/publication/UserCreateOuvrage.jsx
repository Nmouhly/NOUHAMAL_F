import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserCreateOuvrage = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [DOI, setDOI] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { currentUser, accessToken } = useContext(AuthContext);

    // Fonction pour récupérer les informations du membre
    const fetchMemberInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/members/user/${currentUser.id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setAuthor(response.data.name); // Définir le nom du membre comme auteur
        } catch (error) {
            console.error('Erreur lors de la récupération des informations du membre:', error);
            setError('Erreur lors de la récupération des informations du membre');
            toast.error('Erreur lors de la récupération des informations du membre');
        }
    };

    // Utiliser useEffect pour récupérer les informations du membre lorsque le composant est monté
    useEffect(() => {
        fetchMemberInfo();
    }, [currentUser.id, accessToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/ouvrages', {
                title,
                author,
                DOI: DOI,
                id_user: currentUser.id,  // Envoi de l'ID utilisateur
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            console.log('Ouvrage ajouté:', response.data);
            toast.success('Ouvrage ajouté avec succès');
            navigate('/user/UserOuvrage');
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'ouvrage:', {
                message: error.message,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                } : 'Aucune réponse disponible',
                config: error.config
            });
            setError('Erreur lors de l\'ajout de l\'ouvrage');
            toast.error('Erreur lors de l\'ajout de l\'ouvrage');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Ajouter un Ouvrage</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Titre</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Auteur</label>
                    <input
                        type="text"
                        value={author}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">DOI</label>
                    <input
                        type="text"
                        value={DOI}
                        onChange={(e) => setDOI(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
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

export default UserCreateOuvrage;
