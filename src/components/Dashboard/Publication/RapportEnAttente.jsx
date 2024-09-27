import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { BASE_URL, getConfig } from '../../../helpers/config';
import { toast } from 'react-toastify';

const RapportEnAttente = () => {
    const { accessToken, currentUser } = useContext(AuthContext);
    const [rapports, setRapports] = useState([]);

    useEffect(() => {
        const fetchRapports = async () => {
            try {
                // Récupération des rapports en attente
                const response = await axios.get(`${BASE_URL}/reports`, getConfig(accessToken));
                console.log('Rapports récupérés:', response.data); // Pour déboguer

                // Filtrer les rapports en attente qui ne sont pas soumis par l'utilisateur actuel
                const filteredRapports = response.data.filter(rapport => 
                    rapport.status === 'en attente' && rapport.id_user !== currentUser.id
                );

                setRapports(filteredRapports);
            } catch (error) {
                console.error('Erreur lors de la récupération des rapports en attente:', error);
            }
        };
        fetchRapports();
    }, [accessToken, currentUser]);

    const handleAccept = async (id) => {
        try {
            // Appel à l'API pour accepter le rapport
            await axios.post(`${BASE_URL}/reports/accept/${id}`, {}, getConfig(accessToken));
            toast.success('Rapport accepté avec succès!');
            setRapports(rapports.filter(rapport => rapport.id !== id)); // Supprime le rapport de la liste
        } catch (error) {
            console.error('Erreur lors de l\'acceptation du rapport:', error);
            toast.error('Erreur lors de l\'acceptation du rapport');
        }
    };

    const handleReject = async (id) => {
        try {
            // Appel à l'API pour rejeter le rapport
            await axios.post(`${BASE_URL}/reports/reject/${id}`, {}, getConfig(accessToken));
            toast.success('Rapport rejeté avec succès!');
            setRapports(rapports.filter(rapport => rapport.id !== id)); // Supprime le rapport de la liste
        } catch (error) {
            console.error('Erreur lors du rejet du rapport:', error);
            toast.error('Erreur lors du rejet du rapport');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
        <div className="publications-en-attente w-full max-w-3xl p-4 bg-white shadow-lg rounded-lg text-left">
            <h2 className="text-2xl font-bold mb-4 text-gray-800  text-left">Rapports en Attente</h2>
            <ul className="space-y-4">
                {rapports.length > 0 ? (
                    rapports.map(rapport => (
                        <li key={rapport.id} className="border border-gray-300 bg-gray-50 p-4 rounded shadow-sm">
                            <strong className="text-lg text-black">{rapport.title}</strong> proposé par : <span className="text-black">{rapport.author}</span>
                            <span className="block text-black">
                                DOI: <a href={`https://doi.org/${rapport.DOI}`} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">{rapport.DOI}</a>
                            </span>
                            <div className="mt-2 flex space-x-2">
                                <button 
                                    onClick={() => handleAccept(rapport.id)} 
                                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                                >
                                    Accepter
                                </button>
                                <button 
                                    onClick={() => handleReject(rapport.id)} 
                                    className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                                >
                                    Rejeter
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">Aucun rapport en attente.</li>
                )}
            </ul>
        </div>
        </div>

    );
};

export default RapportEnAttente;
