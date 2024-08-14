import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Ouvrages.css'; // Importer le fichier CSS

const Ouvrages = () => {
    const [ouvrages, setOuvrages] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/ouvrages')
            .then(response => {
                console.log('Données récupérées:', response.data); // Pour vérifier les données
                setOuvrages(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des ouvrages', error);
                setError('Erreur lors de la récupération des ouvrages');
            });
    }, []);

    return (
        <div className="ouvrages-table">
            <h1>Ouvrages</h1>
            {error && <p className="error">{error}</p>}
            {ouvrages.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Titre</th>
                            <th>Auteur</th>
                            <th>PDF</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ouvrages.map(ouvrage => (
                            <tr key={ouvrage.id}>
                                <td>{ouvrage.title || 'Titre non disponible'}</td>
                                <td>{ouvrage.author || 'Auteur non disponible'}</td>
                                <td>
                                    {ouvrage.pdf_link ? (
                                        <a href={ouvrage.pdf_link} target="_blank" rel="noopener noreferrer" className="pdf-link">
                                            Télécharger le PDF
                                        </a>
                                    ) : 'Non disponible'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Aucun ouvrage disponible.</p>
            )}
        </div>
    );
};

export default Ouvrages;
