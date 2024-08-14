import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const OuvrageCreate = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [pdfLink, setPdfLink] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('pdf_link', pdfLink);

        try {
            const response = await axios.post('http://localhost:8000/api/ouvrages', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            console.log('Ouvrage ajouté:', response.data);
            toast.success('Ouvrage ajouté avec succès');
            navigate('/dashboard/ouvrage');
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'ouvrage:', {
                message: error.message,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                } : 'Aucune réponse disponible',
                config: error.config
            });
            setError('Erreur lors de l\'ajout de l\'ouvrage');
            toast.error('Erreur lors de l\'ajout de l\'ouvrage');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Ajouter un Ouvrage</h1>
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
                    <label className="block text-sm font-medium mb-1">Auteur</label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Lien PDF</label>
                    <input
                        type="url"
                        value={pdfLink}
                        onChange={(e) => setPdfLink(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Ajouter
                </button>
            </form>
        </div>
    );
};

export default OuvrageCreate;
