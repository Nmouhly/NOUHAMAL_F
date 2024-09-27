import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const AdminThese = () => {
    const [theses, setTheses] = useState([]);
    const [error, setError] = useState('');
    const { accessToken, currentUser } = useContext(AuthContext); // Add currentUser here

    useEffect(() => {
        if (accessToken && currentUser) {
            fetchTheses();
        }
    }, [accessToken, currentUser]);

    const fetchTheses = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/theseAdmin`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setTheses(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des thèses', error);
            setError('Erreur lors de la récupération des thèses');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette thèse ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/theses/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setTheses(theses.filter(these => these.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression de la thèse', error);
                setError('Erreur lors de la suppression de la thèse');
            }
        }
    };

    return (
        <div>
            <h1>Gestion des Thèses</h1>
            <Link to="/dashboard/TheseCreate" className="btn btn-primary mb-4">Ajouter une Thèse</Link>
            {error && <p className="text-red-500">{error}</p>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOI</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th> {/* Nouvelle colonne pour la date */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu</th> {/* Nouvelle colonne pour le lieu */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {theses.length ? (
                        theses.map(these => (
                            <tr key={these.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{these.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{these.author}</td>
                                <td>
    {these.doi ? (  // Use 'these.doi' if the field is lowercase
        <a
            href={`https://doi.org/${these.doi}`}  // Update field name here as well
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
                const isValidDOI = these.doi.startsWith('10.');  // Update DOI validation
                if (!isValidDOI) {
                    e.preventDefault();
                    alert('Le DOI fourni semble invalide ou non trouvé. Vous pouvez essayer le lien PDF si disponible.');
                }
            }}
        >
            {these.doi}
        </a>
    ) : (
        'Pas de DOI disponible'
    )}
</td>

                                <td className="px-6 py-4 whitespace-nowrap">{these.date || 'Pas de date disponible'}</td> {/* Affiche la date ou un message */}
                                <td className="px-6 py-4 whitespace-nowrap">{these.lieu || 'Pas de lieu disponible'}</td> {/* Affiche le lieu ou un message */}
                                <td className="px-6 py-4 whitespace-nowrap">{these.status}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/dashboard/TheseEdit/${these.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                    <button onClick={() => handleDelete(these.id)} className="btn btn-danger mb-2">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-4">Aucune thèse disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminThese;
