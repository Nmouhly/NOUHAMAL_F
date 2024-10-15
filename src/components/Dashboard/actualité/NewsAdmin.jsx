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

// Fonction pour tronquer le texte
const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Fonction pour tronquer le titre
const truncateTitle = (title, maxLength) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
};

const NewsAdmin = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);
    const [expanded, setExpanded] = useState(null); // État pour gérer les éléments développés
    const [expandedTitle, setExpandedTitle] = useState(null); // État pour gérer le titre développé

    useEffect(() => {
        fetchNews();
    }, [accessToken]);

    const fetchNews = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/news', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (Array.isArray(response.data)) {
                setNewsItems(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau', response.data);
                setError('Erreur de données : Les données reçues ne sont pas un tableau');
            }
        } catch (error) {
            const errorMessage = error.response 
                ? (error.response.data.message || 'Erreur inconnue du serveur') + ' - Code: ' + error.response.status
                : error.message || 'Erreur inconnue';
            console.error('Erreur lors de la récupération des actualités', errorMessage);
            setError('Erreur lors de la récupération des actualités : ' + errorMessage);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/news/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setNewsItems(newsItems.filter(news => news.id !== id));
                toast.success('Actualité supprimée avec succès');
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'actualité', error);
                toast.error('Erreur lors de la suppression de l\'actualité');
            }
        }
    };

    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    const toggleExpandTitle = (id) => {
        setExpandedTitle(expandedTitle === id ? null : id);
    };

    return (
        <div className="container">
            <h1 className="my-4">Gestion des Actualités</h1>
            <Link to="/dashboard/NewsCreate" className="btn btn-primary mb-4">Ajouter une Actualité</Link>
            {error && <p className="text-danger">{error}</p>}
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="thead-light">
                        <tr>
                            <th>Titre</th>
                            <th>Contenu</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newsItems.length ? (
                            newsItems.map(news => (
                                <tr key={news.id}>
                                    <td>
                                        {news.title}
                                    </td>
                                    <td>
                                        {expanded === news.id ? 
                                            stripHtmlTags(news.content) 
                                            : truncateText(stripHtmlTags(news.content), 50)}
                                        <button onClick={() => toggleExpand(news.id)} className="btn btn-link">
                                            {expanded === news.id ? 'Réduire' : 'Lire plus'}
                                        </button>
                                    </td>
                                    <td>
                                        {news.image ? (
                                            <img
                                                src={`http://localhost:8000/storage/${news.image}`}
                                                alt={news.title}
                                                style={{ width: '100px', height: 'auto' }}
                                            />
                                        ) : (
                                            'Pas d\'image'
                                        )}
                                    </td>
                                    <td>
                                        <Link to={`/dashboard/NewsEdit/${news.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                        <button onClick={() => handleDelete(news.id)} className="btn btn-danger mb-2">Supprimer</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">Aucune actualité disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NewsAdmin;
