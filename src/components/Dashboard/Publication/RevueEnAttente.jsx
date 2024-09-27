import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { BASE_URL, getConfig } from '../../../helpers/config';
import { toast } from 'react-toastify';

const RevueEnAttente = () => {
    const { accessToken, currentUser } = useContext(AuthContext);
    const [revues, setRevues] = useState([]);

    useEffect(() => {
        const fetchRevues = async () => {
            try {
                // Récupération des revues en attente
                const response = await axios.get(`${BASE_URL}/revues`, getConfig(accessToken));
                console.log('Revues récupérées:', response.data); // Pour déboguer

                // Filtrer les revues en attente qui ne sont pas soumises par l'utilisateur actuel
                const filteredRevues = response.data.filter(revue => 
                    revue.status === 'en attente' && revue.id_user !== currentUser.id
                );

                setRevues(filteredRevues);
            } catch (error) {
                console.error('Erreur lors de la récupération des revues en attente:', error);
            }
        };
        fetchRevues();
    }, [accessToken, currentUser]);

    const handleAccept = async (id) => {
        try {
            // Appel à l'API pour accepter la revue
            await axios.post(`${BASE_URL}/revues/accept/${id}`, {}, getConfig(accessToken));
            toast.success('Revue acceptée avec succès!');
            setRevues(revues.filter(revue => revue.id !== id)); // Supprime la revue de la liste
        } catch (error) {
            console.error('Erreur lors de l\'acceptation de la revue:', error);
            toast.error('Erreur lors de l\'acceptation de la revue');
        }
    };

    const handleReject = async (id) => {
        try {
            // Appel à l'API pour rejeter la revue
            await axios.post(`${BASE_URL}/revues/reject/${id}`, {}, getConfig(accessToken));
            toast.success('Revue rejetée avec succès!');
            setRevues(revues.filter(revue => revue.id !== id)); // Supprime la revue de la liste
        } catch (error) {
            console.error('Erreur lors du rejet de la revue:', error);
            toast.error('Erreur lors du rejet de la revue');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
     <div className="publications-en-attente w-full max-w-3xl p-4 bg-white shadow-lg rounded-lg text-left">

            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-left">Revues en Attente</h2>
            <ul className="space-y-4">
                {revues.length > 0 ? (
                    revues.map(revue => (
                        <li key={revue.id} className="border border-gray-300 bg-gray-50 p-4 rounded shadow-sm">
                            <strong className="text-lg text-black">{revue.title}</strong> proposé par : <span className="text-black">{revue.author}</span>
                            <span className="block text-black">
                                DOI: <a href={`https://doi.org/${revue.DOI}`} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">{revue.DOI}</a>
                            </span>
                            <div className="mt-2 flex space-x-2">
                                <button 
                                    onClick={() => handleAccept(revue.id)} 
                                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                                >
                                    Accepter
                                </button>
                                <button 
                                    onClick={() => handleReject(revue.id)} 
                                    className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                                >
                                    Rejeter
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">Aucune revue en attente.</li>
                )}
            </ul>
        </div>
        </div>

    );
};

export default RevueEnAttente;
