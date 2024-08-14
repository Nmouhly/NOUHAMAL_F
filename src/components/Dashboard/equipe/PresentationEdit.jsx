import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Fonction pour enlever les balises HTML (si nécessaire)
const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

const PresentationEdit = () => {
    const { id } = useParams();
    const [presentation, setPresentation] = useState({
        title: '',
        content: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        const fetchPresentation = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/presentations/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                setPresentation(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement des informations de la présentation', error);
                toast.error('Erreur lors du chargement des informations de la présentation');
            }
        };
        fetchPresentation();
    }, [id, accessToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8000/api/presentations/${id}`, presentation, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                toast.success('Présentation mise à jour avec succès');
                navigate('/dashboard/PresentationAdmin'); // Rediriger vers la liste des présentations
            } else {
                throw new Error('Réponse inattendue du serveur');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la présentation', error.response || error);
            toast.error(`Erreur lors de la mise à jour de la présentation: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleTitleChange = (event, editor) => {
        const data = editor.getData();
        setPresentation({
            ...presentation,
            title: data
        });
    };

    const handleContentChange = (event, editor) => {
        const data = editor.getData();
        setPresentation({
            ...presentation,
            content: data
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Modifier la Présentation</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Titre</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={presentation.title}
                        onChange={handleTitleChange}
                        config={{
                            toolbar: ['bold', 'italic', 'link']
                        }}
                        className="mb-4"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Contenu</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={presentation.content}
                        onChange={handleContentChange}
                        config={{
                            toolbar: [
                                'heading', '|',
                                'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
                                'undo', 'redo'
                            ]
                        }}
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Mettre à jour
                </button>
            </form>
        </div>
    );
};

export default PresentationEdit;
