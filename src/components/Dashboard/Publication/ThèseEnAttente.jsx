import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { BASE_URL, getConfig } from '../../../helpers/config';
import { toast } from 'react-toastify';

const TheseEnAttente = () => {
    const { accessToken, currentUser } = useContext(AuthContext);
    const [theses, setTheses] = useState([]);

    useEffect(() => {
        const fetchTheses = async () => {
            try {
                // Récupération des thèses en attente
                const response = await axios.get(`${BASE_URL}/thesesAdmin`, getConfig(accessToken));
                console.log('Thèses récupérées:', response.data); // Pour déboguer

                // Filtrer les thèses en attente qui ne sont pas soumises par l'utilisateur actuel
                const filteredTheses = response.data.filter(these => 
                    these.status === 'en attente' && these.id_user !== currentUser.id
                );

                setTheses(filteredTheses);
            } catch (error) {
                console.error('Erreur lors de la récupération des thèses en attente:', error);
            }
        };
        fetchTheses();
    }, [accessToken, currentUser]);

    const handleAccept = async (id) => {
        try {
            // Appel à l'API pour accepter la thèse
            await axios.post(`${BASE_URL}/theses/accept/${id}`, {}, getConfig(accessToken));
            toast.success('Thèse acceptée avec succès!');
            setTheses(theses.filter(these => these.id !== id)); // Supprime la thèse de la liste
        } catch (error) {
            console.error('Erreur lors de l\'acceptation de la thèse:', error);
            toast.error('Erreur lors de l\'acceptation de la thèse');
        }
    };

    const handleReject = async (id) => {
        try {
            // Appel à l'API pour rejeter la thèse
            await axios.post(`${BASE_URL}/theses/reject/${id}`, {}, getConfig(accessToken));
            toast.success('Thèse rejetée avec succès!');
            setTheses(theses.filter(these => these.id !== id)); // Supprime la thèse de la liste
        } catch (error) {
            console.error('Erreur lors du rejet de la thèse:', error);
            toast.error('Erreur lors du rejet de la thèse');
        }
    };

    return (
<div className="flex justify-center items-center min-h-screen">
<div className="publications-en-attente w-full max-w-3xl p-4 bg-white shadow-lg rounded-lg text-left">            <h2 className="text-2xl font-bold mb-4 text-gray-800">Thèses en Attente</h2>
            <ul className="space-y-4">
                {theses.length > 0 ? (
                    theses.map(these => (
                        <li key={these.id} className="border border-gray-300 bg-gray-50 p-4 rounded shadow-sm">
                            <strong className="text-lg text-black">{these.title}</strong> proposé par : <span className="text-black">{these.author}</span>
                            <span className="block text-black">Date: {these.date}</span>
                            <span className="block text-black">Lieu: {these.lieu}</span>
                            <span className="block text-black">
                                DOI: <a href={`https://doi.org/${these.doi}`} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">{these.doi}</a>
                            </span>
                            <div className="mt-2 flex space-x-2">
                                <button 
                                    onClick={() => handleAccept(these.id)} 
                                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                                >
                                    Accepter
                                </button>
                                <button 
                                    onClick={() => handleReject(these.id)} 
                                    className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                                >
                                    Rejeter
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">Aucune thèse en attente.</li>
                )}
            </ul>
        </div>
        </div>

    );
};

export default TheseEnAttente;
