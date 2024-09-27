import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { BASE_URL, getConfig } from '../../../helpers/config';
import { toast } from 'react-toastify';

const BrevetEnAttente = () => {
    const { accessToken, currentUser } = useContext(AuthContext);
    const [brevets, setBrevets] = useState([]);

    useEffect(() => {
        const fetchBrevets = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/brevets`, getConfig(accessToken));
                console.log('Brevets récupérés:', response.data); // Pour déboguer

                const filteredBrevets = response.data.filter(brevet => 
                    brevet.status === 'en attente' && brevet.id_user !== currentUser.id
                );

                setBrevets(filteredBrevets);
            } catch (error) {
                console.error('Erreur lors de la récupération des brevets en attente:', error);
            }
        };
        fetchBrevets();
    }, [accessToken, currentUser]);

    const handleAccept = async (id) => {
        try {
            await axios.post(`${BASE_URL}/brevets/accept/${id}`, {}, getConfig(accessToken));
            toast.success('Brevet accepté avec succès!');
            setBrevets(brevets.filter(brevet => brevet.id !== id)); // Supprime le brevet de la liste
        } catch (error) {
            console.error('Erreur lors de l\'acceptation du brevet:', error);
            toast.error('Erreur lors de l\'acceptation du brevet');
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`${BASE_URL}/brevets/reject/${id}`, {}, getConfig(accessToken));
            toast.success('Brevet rejeté avec succès!');
            setBrevets(brevets.filter(brevet => brevet.id !== id)); // Supprime le brevet de la liste
        } catch (error) {
            console.error('Erreur lors du rejet du brevet:', error);
            toast.error('Erreur lors du rejet du brevet');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
        <div className="publications-en-attente w-full max-w-3xl p-4 bg-white shadow-lg rounded-lg text-left">            <h2 className="text-2xl font-bold mb-4 text-gray-800">Brevets en Attente</h2>
            <ul className="space-y-4">
                {brevets.length > 0 ? (
                    brevets.map(brevet => (
                        <li key={brevet.id} className="border border-gray-300 bg-gray-50 p-4 rounded shadow-sm">
                            <strong className="text-lg text-black">{brevet.title}</strong> proposé par : <span className="text-black">{brevet.author}</span>
                            <span className="block text-black">
                                DOI: <a href={`https://doi.org/${brevet.doi}`} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">{brevet.doi}</a>
                            </span>
                            <div className="mt-2 flex space-x-2">
                                <button 
                                    onClick={() => handleAccept(brevet.id)} 
                                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                                >
                                    Accepter
                                </button>
                                <button 
                                    onClick={() => handleReject(brevet.id)} 
                                    className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                                >
                                    Rejeter
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">Aucun brevet en attente.</li>
                )}
            </ul>
        </div>
        </div>

    );
};

export default BrevetEnAttente;
