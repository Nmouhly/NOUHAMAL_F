import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Reports.css'; // Importer le fichier CSS
import Patents from './Patents';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/reports')
            .then(response => {
                console.log('Données récupérées:', response.data); // Pour vérifier les données
                setReports(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des rapports', error);
                setError('Erreur lors de la récupération des rapports');
            });
    }, []);

    return (
        <div className="reports-page">
            <h1>Rapports</h1>
            {error && <p className="error">{error}</p>}

            <div className="reports-container">
                {reports.length > 0 ? (
                    reports.map(report => (
                        <div className="report-card" key={report.id}>
                            <h3>{report.title || 'Titre non disponible'}</h3>
                            <p><strong>Auteur:</strong> {report.author || 'Auteur non disponible'}</p>
                           
                            <p><strong>DOI:</strong> {report.DOI ? (
                                <a href={`https://doi.org/${report.DOI}`} target="_blank" rel="noopener noreferrer" className="doi-link">
                                    DOI
                                </a>
                            ) : (
                                <span>DOI non disponible</span>
                            )}</p>
                            
                        </div>
                    ))
                ) : (
                    <p>Aucun rapport disponible.</p>
                )}
            </div>
            <Patents />
        </div>
    );
};

export default Reports;
