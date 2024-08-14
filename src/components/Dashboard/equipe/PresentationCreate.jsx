import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const PresentationCreate = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await axios.post('http://localhost:8000/api/presentations', {
                title,
                content
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            toast.success('Présentation ajoutée avec succès');
            navigate('/dashboard/PresentationCreate'); // Redirige vers la liste des présentations
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la présentation', error.response || error.message);
            setError('Erreur lors de l\'ajout de la présentation. Veuillez réessayer.');
            toast.error('Erreur lors de l\'ajout de la présentation.');
        }
    };

    const handleBack = () => {
        navigate('/dashboard/presentation');
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Ajouter une Présentation</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Titre</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={title}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setTitle(data);
                        }}
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
                        data={content}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setContent(data);
                        }}
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
                    Ajouter
                </button>
                <button 
                    type="button" 
                    onClick={handleBack} 
                    className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-2"
                >
                    Retour
                </button>
            </form>
        </div>
    );
};

export default PresentationCreate;
