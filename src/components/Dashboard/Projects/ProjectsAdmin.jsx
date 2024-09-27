import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const ProjectsAdmin = () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchProjects();
    }, [accessToken]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/projects', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setProjects(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des projets', error);
            setError('Erreur lors de la récupération des projets');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/projects/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setProjects(projects.filter(project => project.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression du projet', error);
                setError('Erreur lors de la suppression du projet');
            }
        }
    };

    return (
        <div>
            <h1>Gérer les Projets</h1>
            <Link to="/dashboard/ProjectsCreate" className="btn btn-primary mb-4">Ajouter un Projet</Link>
            {error && <p className="text-red-500">{error}</p>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Équipe</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de début</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de fin</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type de financement</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {projects.length ? (
                        projects.map(project => (
                            <tr key={project.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{project.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{project.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{project.team}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{project.start_date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{project.end_date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{project.funding_type}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{project.status}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/dashboard/ProjectsEdit/${project.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                    <button onClick={() => handleDelete(project.id)} className="btn btn-primary mb-2">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center py-4">Aucun projet disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectsAdmin;
