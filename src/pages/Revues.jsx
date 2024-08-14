import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Revues.css'; // Importer le fichier CSS

const Revues = () => {
    const [revues, setRevues] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/revues')
            .then(response => {
                console.log('Données récupérées:', response.data); // Pour vérifier les données
                setRevues(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des revues', error);
                setError('Erreur lors de la récupération des revues');
            });
    }, []);

    return (
        <div className="revues-table">
            <h1>Revues</h1>
            {error && <p className="error">{error}</p>}
            {revues.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Titre</th>
                            <th>Auteur</th>
                            <th>PDF</th>
                        </tr>
                    </thead>
                    <tbody>
                        {revues.map(revue => (
                            <tr key={revue.id}>
                                <td>{revue.title || 'Titre non disponible'}</td>
                                <td>{revue.author || 'Auteur non disponible'}</td>
                                <td>
                                    {revue.pdf_link ? (
                                        <a href={revue.pdf_link} target="_blank" rel="noopener noreferrer" className="pdf-link">
                                            Télécharger le PDF
                                        </a>
                                    ) : 'Non disponible'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Aucune revue disponible.</p>
            )}
        </div>
    );
};

export default Revues;
