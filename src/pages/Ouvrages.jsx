import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Ouvrage.css'; // Importer le fichier CSS

const Ouvrages = () => {
    const [ouvrages, setOuvrages] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/ouvrages')
            .then(response => {
                setOuvrages(response.data);
            })
            .catch(error => {
                setError('Erreur lors de la récupération des ouvrages');
            });
    }, []);

    return (
        <div className="ouvrages-list">
            <h1>Ouvrages</h1>
            {error && <p className="error">{error}</p>}
            {ouvrages.length > 0 ? (
                <ul>
                    {ouvrages.map(ouvrage => (
                        <li key={ouvrage.id}>
                            <strong>{ouvrage.title || 'Titre non disponible'}.</strong> {ouvrage.author || 'Auteur non disponible'}.
                            <a href={ouvrage.pdf_link} target="_blank" rel="noopener noreferrer" className="pdf-link">PDF</a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucun ouvrage disponible.</p>
            )}
        </div>
    );
};

export default Ouvrages;
