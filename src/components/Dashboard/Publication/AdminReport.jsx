import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const ReportAdmin = () => {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchReports();
    }, [accessToken]);

    const fetchReports = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/reports', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setReports(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des rapports', error);
            setError('Erreur lors de la récupération des rapports');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/reports/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setReports(reports.filter(report => report.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression du rapport', error);
                setError('Erreur lors de la suppression du rapport');
            }
        }
    };

    return (
        <div>
            <h1>Gestion des Rapports</h1>
            <Link to="/dashboard/ReportCreat" className="btn btn-primary mb-4">Ajouter un Rapport</Link>
            {error && <p className="text-red-500">{error}</p>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Résumé</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lien PDF</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {reports.length ? (
                        reports.map(report => (
                            <tr key={report.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{report.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{report.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{report.summary || 'Pas de résumé'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {report.pdf_link ? (
                                        <a href={report.pdf_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                            Voir le PDF
                                        </a>
                                    ) : (
                                        'Pas de lien'
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/dashboard/ReportEdit/${report.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                    <button onClick={() => handleDelete(report.id)} className="btn btn-danger mb-2">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-4">Aucun rapport disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ReportAdmin;
