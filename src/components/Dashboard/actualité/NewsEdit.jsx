import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';

const NewsEdit = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);

    // Récupérer les données de l'actualité à modifier
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/news/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const news = response.data;
                setTitle(news.title);
                setContent(news.content);
                setCurrentImage(news.image ? `http://localhost:8000/storage/news_images/${news.image}` : '');
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'actualité:', error.response ? error.response.data : error.message);
                setError('Erreur lors de la récupération de l\'actualité. Veuillez réessayer.');
                toast.error('Erreur lors de la récupération de l\'actualité.');
            }
        };

        fetchNews();
    }, [id, accessToken]);

    // Gérer la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validation côté client
        if (!title.trim() || !content.trim()) {
            toast.error('Veuillez remplir tous les champs requis.');
            return;
        }
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }
    
        try {
            const response = await axios.put(`http://localhost:8000/api/news/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
    
            console.log('Actualité modifiée:', response.data);
            toast.success('Actualité modifiée avec succès');
            navigate('/dashboard/NewsAdmin');
        } catch (error) {
            console.error('Erreur lors de la modification de l\'actualité:', error.response ? error.response.data : error.message);
            setError('Erreur lors de la modification de l\'actualité. Veuillez réessayer.');
            toast.error('Erreur lors de la modification de l\'actualité.');
        }
    };
    

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Modifier l'Actualité</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Titre</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Contenu</label>
                    <textarea 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Image Actuelle</label>
                    {currentImage && (
                        <div>
                            <img 
                                src={currentImage} 
                                alt="Image actuelle" 
                                style={{ width: '100px', height: 'auto', display: 'block' }} 
                            />
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Nouvelle Image</label>
                    <input 
                        type="file" 
                        onChange={(e) => setImage(e.target.files[0])} 
                        accept="image/*" 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Modifier
                </button>
            </form>
        </div>
    );
};

export default NewsEdit;
