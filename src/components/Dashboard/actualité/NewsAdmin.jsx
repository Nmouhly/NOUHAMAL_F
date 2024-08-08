import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const NewsAdmin = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchNewsItems();
    }, [accessToken]);

    const fetchNewsItems = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/news', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setNewsItems(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des actualités', error);
            setError('Erreur lors de la récupération des actualités');
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
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'actualité', error);
                setError('Erreur lors de la suppression de l\'actualité');
            }
        }
    };

    const renderTitle = (title) => {
        return title.split('').map((char, index) => (
            <span key={index} style={letterStyle(index)}>{char}</span>
        ));
    };

    // Style du conteneur du titre
    const titleContainerStyle = {
        display: 'flex',
        justifyContent: 'center', // Centre horizontalement
        alignItems: 'center', // Centre verticalement si besoin
        margin: '2rem 0', // Ajoute une marge autour du titre
    };

    // Style du titre
    const titleStyle = {
        display: 'flex',
        gap: '0.2rem',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    };

    // Style des lettres avec animation
    const letterStyle = (index) => ({
        display: 'inline-block',
        opacity: 0,
        transform: 'translateY(-100%)',
        animation: `slideIn 0.6s ease forwards ${index * 0.1}s`,
    });

    // Animation keyframes
    const animationStyle = `
        @keyframes slideIn {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;

    // Style du tableau
    const tableStyle = {
        maxWidth: '100%',
        overflowX: 'auto',
    };

    // Style des cellules du tableau
    const cellStyle = {
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    };

    return (
        <div>
            <style>{animationStyle}</style> {/* Injecte les keyframes */}
            <div style={titleContainerStyle}>
                <h1 style={titleStyle}>{renderTitle('Actualités')}</h1>
            </div>
            <Link to="/dashboard/NewsCreate" className="btn btn-primary mb-4">Ajouter une Actualité</Link>
            {error && <p className="text-red-500">{error}</p>}
            <div style={tableStyle}>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={cellStyle}>Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={cellStyle}>Titre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={cellStyle}>Contenu</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={cellStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {newsItems.length ? (
                            newsItems.map(news => (
                                <tr key={news.id}>
                                    <td className="px-6 py-4 whitespace-nowrap" style={cellStyle}>
                                        {news.image ? (
                                            <img 
                                                src={`http://localhost:8000/storage/news_images/${news.image}`} 
                                                alt={news.title} 
                                                style={{ width: '100px', height: 'auto' }} 
                                            />
                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap" style={cellStyle}>{news.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap" style={cellStyle}>{news.content}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link to={`/dashboard/NewsEdit/${news.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                        <button onClick={() => handleDelete(news.id)} className="btn btn-primary mb-2">Supprimer</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4">Aucune actualité disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NewsAdmin;
