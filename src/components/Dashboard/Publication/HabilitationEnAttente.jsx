import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { BASE_URL, getConfig } from '../../../helpers/config';
import { toast } from 'react-toastify';

const HabilitationEnAttente = () => {
    const { accessToken, currentUser } = useContext(AuthContext);
    const [habilitations, setHabilitations] = useState([]);

    useEffect(() => {
        const fetchHabilitations = async () => {
            try {
                // Récupération des habilitations en attente
                const response = await axios.get(`${BASE_URL}/habilitationnAdmin`, getConfig(accessToken));
                console.log('Habilitations récupérées:', response.data); // Pour déboguer

                // Filtrer les habilitations en attente qui ne sont pas soumises par l'utilisateur actuel
                const filteredHabilitations = response.data.filter(habilitation => 
                    habilitation.status === 'en attente' && habilitation.id_user !== currentUser.id
                );

                setHabilitations(filteredHabilitations);
            } catch (error) {
                console.error('Erreur lors de la récupération des habilitations en attente:', error);
            }
        };
        fetchHabilitations();
    }, [accessToken, currentUser]);

    const handleAccept = async (id) => {
        try {
            // Appel à l'API pour accepter l'habilitation
            await axios.post(`${BASE_URL}/habilitations/accept/${id}`, {}, getConfig(accessToken));
            toast.success('Habilitation acceptée avec succès!');
            setHabilitations(habilitations.filter(habilitation => habilitation.id !== id)); // Supprime l'habilitation de la liste
        } catch (error) {
            console.error('Erreur lors de l\'acceptation de l\'habilitation:', error);
            toast.error('Erreur lors de l\'acceptation de l\'habilitation');
        }
    };

    const handleReject = async (id) => {
        try {
            // Appel à l'API pour rejeter l'habilitation
            await axios.post(`${BASE_URL}/habilitations/reject/${id}`, {}, getConfig(accessToken));
            toast.success('Habilitation rejetée avec succès!');
            setHabilitations(habilitations.filter(habilitation => habilitation.id !== id)); // Supprime l'habilitation de la liste
        } catch (error) {
            console.error('Erreur lors du rejet de l\'habilitation:', error);
            toast.error('Erreur lors du rejet de l\'habilitation');
        }
    };

    return (
<div className="flex justify-center items-center min-h-screen">
<div className="publications-en-attente w-full max-w-3xl p-4 bg-white shadow-lg rounded-lg text-left">            <h2 className="text-2xl font-bold mb-4 text-gray-800">Habilitations en Attente</h2>
            <ul className="space-y-4">
                {habilitations.length > 0 ? (
                    habilitations.map(habilitation => (
                        <li key={habilitation.id} className="border border-gray-300 bg-gray-50 p-4 rounded shadow-sm">
                            <strong className="text-lg text-black">{habilitation.title}</strong> proposé par : <span className="text-black">{habilitation.author}</span>
                            <span className="block text-black">Date: {habilitation.date}</span>
                            <span className="block text-black">Lieu: {habilitation.lieu}</span>
                            <span className="block text-black">
                                DOI: <a href={`https://doi.org/${habilitation.doi}`} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">{habilitation.doi}</a>
                            </span>
                            <div className="mt-2 flex space-x-2">
                                <button 
                                    onClick={() => handleAccept(habilitation.id)} 
                                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                                >
                                    Accepter
                                </button>
                                <button 
                                    onClick={() => handleReject(habilitation.id)} 
                                    className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                                >
                                    Rejeter
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">Aucune habilitation en attente.</li>
                )}
            </ul>
        </div>
                </div>

    );
};

export default HabilitationEnAttente;
