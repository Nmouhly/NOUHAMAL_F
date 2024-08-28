import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const OuvrageCreate = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [DOI, setDOI] = useState('');
    const [idUser, setIdUser] = useState('');
    const [members, setMembers] = useState([]); // Pour stocker les membres
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        // Requête pour récupérer les membres ayant le statut "Membre"
        const fetchMembers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/members', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                setMembers(response.data.filter(member => member.statut === 'Membre'));
            } catch (error) {
                console.error('Erreur lors de la récupération des membres:', error);
            }
        };

        fetchMembers();
    }, [accessToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            title,
            author,
            DOI: DOI,
            id_user: idUser
        };

        try {
            const response = await axios.post('http://localhost:8000/api/ouvrages', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            console.log('Ouvrage ajouté:', response.data);
            toast.success('Ouvrage ajouté avec succès');
            navigate('/dashboard/ouvrage');
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

    const handleMemberChange = (e) => {
        const selectedMember = members.find(member => member.email === e.target.value);
        if (selectedMember) {
            setAuthor(selectedMember.name);
            setIdUser(selectedMember.user_id);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Ajouter un Ouvrage</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                    <label className="block text-sm font-medium mb-1">Email du Membre</label>
                    <select
                        value={members.email}
                        onChange={handleMemberChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">Sélectionner un email</option>
                        {members.map((member) => (
                            <option key={member.id} value={member.email}>
                                {member.email}
                            </option>
                        ))}
                    </select>
                </div>
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
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                        readOnly // Rendre le champ en lecture seule
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

export default OuvrageCreate;
