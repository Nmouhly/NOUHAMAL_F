import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';

// Fonction pour enlever les balises HTML
const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

const PresentationAdmin = () => {
    const [presentations, setPresentations] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchPresentations();
    }, [accessToken]);

    const fetchPresentations = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/presentations', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (Array.isArray(response.data)) {
                setPresentations(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau', response.data);
                setError('Erreur de données : Les données reçues ne sont pas un tableau');
            }
        } catch (error) {
            const errorMessage = error.response 
                ? (error.response.data.message || 'Erreur inconnue du serveur') + ' - Code: ' + error.response.status
                : error.message || 'Erreur inconnue';
            console.error('Erreur lors de la récupération des présentations', errorMessage);
            setError('Erreur lors de la récupération des présentations : ' + errorMessage);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette présentation ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/presentations/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setPresentations(presentations.filter(presentation => presentation.id !== id));
                toast.success('Présentation supprimée avec succès');
            } catch (error) {
                console.error('Erreur lors de la suppression de la présentation', error);
                toast.error('Erreur lors de la suppression de la présentation');
            }
        }
    };

    return (
        <div>
            <h1>Gestion de la Présentation de l’Équipe</h1>
            <Link to="/dashboard/PresentationCreate" className="btn btn-primary mb-4">Ajouter une Présentation</Link>
            {error && <p className="text-red-500">{error}</p>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contenu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {presentations.length ? (
                        presentations.map(presentation => (
                            <tr key={presentation.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{stripHtmlTags(presentation.title)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{stripHtmlTags(presentation.content)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/dashboard/PresentationEdit/${presentation.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                    <button onClick={() => handleDelete(presentation.id)} className="btn btn-danger mb-2">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center py-4">Aucune présentation disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PresentationAdmin;
