import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';
import { Link, useNavigate } from 'react-router-dom';

const UserBrevet = () => {
    const [brevets, setBrevets] = useState([]);
    const [error, setError] = useState('');
    const { accessToken, currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fonction pour récupérer la liste des brevets
    const fetchBrevets = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/brevets/user-or-contributor/${currentUser.id}`, { 
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setBrevets(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des brevets:', error);
            setError('Erreur lors de la récupération des brevets');
            toast.error('Erreur lors de la récupération des brevets');
        }
    };

    // Fonction pour supprimer un brevet
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/brevets/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            toast.success('Brevet supprimé avec succès');
            fetchBrevets(); // Recharger la liste des brevets
        } catch (error) {
            console.error('Erreur lors de la suppression du brevet:', error);
            toast.error('Erreur lors de la suppression du brevet');
        }
    };

    useEffect(() => {
        fetchBrevets();
    }, [accessToken]);

    const handleEdit = (id) => {
        navigate(`/user/UserEditBrevet/${id}`);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des Brevets</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mb-4">
                <Link to="/user/UserCreateBrevet" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Ajouter un Brevet
                </Link>
            </div>

            <table className="w-full border border-gray-300">
                <thead>
                    <tr>
                        <th className="p-2 border-b">Titre</th>
                        <th className="p-2 border-b">Auteur(s)</th>
                        <th className="p-2 border-b">DOI</th>
                        <th className="p-2 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {brevets.length > 0 ? (
                        brevets.map(brevet => (
                            <tr key={brevet.id}>
                                <td className="p-2 border-b">{brevet.title}</td>
                                <td className="p-2 border-b">{brevet.author}</td>
                                <td className="p-2 border-b">{brevet.doi}</td>
                                <td className="p-2 border-b flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(brevet.id)}
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(brevet.id)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="p-2 border-b text-center">Aucun brevet trouvé</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserBrevet;
