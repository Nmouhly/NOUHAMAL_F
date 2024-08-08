import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../context/authContext';

const NewsDetails = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext); // Accédez au jeton d'accès du contexte

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/news/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}` // Incluez le jeton dans les en-têtes
                    }
                });
                setNews(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'actualité', error);
                setError('Erreur lors de la récupération de l\'actualité');
            }
        };

        fetchNews();
    }, [id, accessToken]); // Ajoutez accessToken comme dépendance

    return (
        <div>
            {error && <p>{error}</p>}
            {news ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {news.image ? (
                        <img 
                            src={`http://localhost:8000/storage/news_images/${news.image}`} 
                            alt={news.title} 
                            style={{ width: '200px', height: 'auto', marginRight: '20px' }} // Ajustez la taille et l'espacement
                        />
                    ) : null} {/* Ne rien afficher si aucune image */}
                    <div>
                        <h1>{news.title}</h1>
                        <p>{news.content}</p>
                    </div>
                </div>
            ) : (
                <p>Chargement...</p>
            )}
        </div>
    );
};

export default NewsDetails;
