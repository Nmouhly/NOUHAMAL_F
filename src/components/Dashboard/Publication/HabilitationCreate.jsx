import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const HabilitationCreate = () => {
    const [title, setTitle] = useState('');
    const [doi, setDoi] = useState('');
    const [lieu, setLieu] = useState('');
    const [date, setDate] = useState('');
    const [members, setMembers] = useState([]);
    const [selectedAuthorIds, setSelectedAuthorIds] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/members', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setMembers(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des membres:', error);
                setError('Erreur lors de la récupération des membres');
                toast.error('Erreur lors de la récupération des membres');
            }
        };

        fetchMembers();
    }, [accessToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedAuthorIds.length === 0) {
            setError('Veuillez sélectionner au moins un auteur.');
            toast.error('Veuillez sélectionner au moins un auteur.');
            return;
        }

        try {
            await axios.post('http://localhost:8000/api/habilitations', {
                title,
                doi,
                author: selectedAuthors.join(', '),
                id_user: selectedAuthorIds.join(','),
                lieu,
                date,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            toast.success('Habilitation ajoutée avec succès');
            navigate('/dashboard/habilitation');
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'habilitation:', error);
            setError('Erreur lors de l\'ajout de l\'habilitation');
            toast.error('Erreur lors de l\'ajout de l\'habilitation');
        }
    };

    const handleAuthorSelection = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const names = selectedOptions.map(option => option.textContent);
        const ids = selectedOptions.map(option => option.getAttribute('data-id'));

        setSelectedAuthors(names);
        setSelectedAuthorIds(ids);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Ajouter une Habilitation</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            {selectedAuthors.length > 0 && (
                <div className="mb-4">
                    <strong>Auteurs sélectionnés :</strong> {selectedAuthors.join(', ')}
                </div>
            )}

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
                    <label className="block text-sm font-medium mb-1">Auteur(s)</label>
                    <select
                        multiple
                        onChange={handleAuthorSelection}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        {members.map(member => (
                            <option key={member.id} value={member.name} data-id={member.user_id}>
                                {member.name}
                            </option>
                        ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                        Pour sélectionner plusieurs auteurs, maintenez la touche <strong>Ctrl</strong> (ou <strong>Cmd</strong> sur Mac) enfoncée tout en cliquant sur les noms souhaités.
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">DOI</label>
                    <input
                        type="text"
                        value={doi}
                        onChange={(e) => setDoi(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Lieu</label>
                    <input
                        type="text"
                        value={lieu}
                        onChange={(e) => setLieu(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
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

export default HabilitationCreate;