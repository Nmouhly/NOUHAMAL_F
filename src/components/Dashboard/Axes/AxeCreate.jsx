import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const AxeCreate = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);

    // Fetch teams from API
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/equipe', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setTeams(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des équipes', error);
                setError('Erreur lors de la récupération des équipes.');
                toast.error('Erreur lors de la récupération des équipes.');
            }
        };

        fetchTeams();
    }, [accessToken]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:8000/api/axes', {
                title,
                content,
                team_id: selectedTeam // Envoi de team_id avec les données
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            toast.success('Axe ajouté avec succès');
            navigate('/dashboard/axe'); // Redirige vers la liste des axes
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'axe', error.response || error.message);
            setError('Erreur lors de l\'ajout de l\'axe. Veuillez réessayer.');
            toast.error('Erreur lors de l\'ajout de l\'axe.');
        }
    };

    // Handle back button click
    const handleBack = () => {
        navigate('/dashboard/axe');
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Ajouter un Axe</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
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
                        className="w-full border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
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
                        className="w-full border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Équipe</label>
                    <select
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 bg-white"
                    >
                        <option value="">Sélectionnez une équipe</option>
                        {teams.map(team => (
                            <option key={team.id} value={team.id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2">
                    <button 
                        type="submit" 
                        className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Ajouter
                    </button>
                    <button 
                        type="button" 
                        onClick={handleBack} 
                        className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                    >
                        Retour
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AxeCreate;
