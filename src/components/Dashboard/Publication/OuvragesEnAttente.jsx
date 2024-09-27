import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { BASE_URL, getConfig } from '../../../helpers/config';
import { toast } from 'react-toastify';

const OuvragesEnAttente = () => {
    const { accessToken, currentUser } = useContext(AuthContext);
    const [ouvrages, setOuvrages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOuvrages = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/ouvrages`, getConfig(accessToken));
                console.log('Ouvrages récupérés:', response.data); // Pour déboguer

                const filteredOuvrages = response.data.filter(ouvrage => 
                    ouvrage.status === 'en attente' && ouvrage.id_user !== currentUser.id
                );

                setOuvrages(filteredOuvrages);
            } catch (error) {
                console.error('Erreur lors de la récupération des ouvrages en attente:', error);
                toast.error('Erreur lors de la récupération des ouvrages.');
            } finally {
                setLoading(false);
            }
        };

        fetchOuvrages();
    }, [accessToken, currentUser.id]); // Add currentUser.id to the dependencies

    const handleAccept = async (id) => {
        try {
            await axios.post(`${BASE_URL}/ouvrages/accept/${id}`, {}, getConfig(accessToken));
            toast.success('Ouvrage accepté avec succès!');
            setOuvrages(ouvrages.filter(ouvrage => ouvrage.id !== id)); // Supprime l'ouvrage de la liste
        } catch (error) {
            console.error('Erreur lors de l\'acceptation de l\'ouvrage:', error);
            toast.error('Erreur lors de l\'acceptation de l\'ouvrage');
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`${BASE_URL}/ouvrages/reject/${id}`, {}, getConfig(accessToken));
            toast.success('Ouvrage rejeté avec succès!');
            setOuvrages(ouvrages.filter(ouvrage => ouvrage.id !== id)); // Supprime l'ouvrage de la liste
        } catch (error) {
            console.error('Erreur lors du rejet de l\'ouvrage:', error);
            toast.error('Erreur lors du rejet de l\'ouvrage');
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
        <div className="publications-en-attente w-full max-w-3xl p-4 bg-white shadow-lg rounded-lg text-left">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-left">Ouvrages en Attente</h2>
            <ul className="space-y-4">
                {ouvrages.length > 0 ? (
                    ouvrages.map(ouvrage => (
                        <li key={ouvrage.id} className="border border-gray-300 bg-gray-50 p-4 rounded shadow-sm">
                            <strong className="text-lg text-black">{ouvrage.title}</strong> proposé par : <span className="text-black">{ouvrage.author}</span>
                            <span className="block text-black">
                                DOI: <a href={`https://doi.org/${ouvrage.DOI}`} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">{ouvrage.DOI}</a>
                            </span>
                            <div className="mt-2 flex space-x-2">
                                <button 
                                    onClick={() => handleAccept(ouvrage.id)} 
                                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                                >
                                    Accepter
                                </button>
                                <button 
                                    onClick={() => handleReject(ouvrage.id)} 
                                    className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                                >
                                    Rejeter
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">Aucun ouvrage en attente.</li>
                )}
            </ul>
        </div>
    </div>
    
    );
};

export default OuvragesEnAttente;
