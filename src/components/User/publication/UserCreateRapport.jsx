



import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserCreateBrevet = () => {
    const [title, setTitle] = useState('');
    const [DOI, setDOI] = useState('');
    const [members, setMembers] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [selectedAuthorIds, setSelectedAuthorIds] = useState([]);
    const [optionalAuthors, setOptionalAuthors] = useState(['']); // Auteurs facultatifs
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { currentUser, accessToken } = useContext(AuthContext);

    // Récupérer les membres pour les auteurs
    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/members', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setMembers(response.data.filter(member => member.name !== currentUser.name));
        } catch (error) {
            console.error('Erreur lors de la récupération des membres :', error);
            setError('Erreur lors de la récupération des membres');
            toast.error('Erreur lors de la récupération des membres');
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [accessToken]);

    useEffect(() => {
        setSelectedAuthors([currentUser.name]);
        setSelectedAuthorIds([currentUser.id]);
    }, [currentUser]);

    const validateDoi = (doi) => {
        const doiPattern = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
        return doiPattern.test(doi);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedAuthorIds.length === 0) {
            setError('Veuillez sélectionner au moins un auteur.');
            toast.error('Veuillez sélectionner au moins un auteur.');
            return;
        }

        if (!validateDoi(DOI)) { // Utiliser 'doi' ici
            setError('Format du DOI invalide.');
            toast.error('Format du DOI invalide.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/reports', {
                title,
                author: [currentUser.name, ...selectedAuthors, ...optionalAuthors].join(', '),
                DOI, // Utiliser 'doi' ici
                id_user: [...selectedAuthorIds, ...optionalAuthors.map((_, i) => `optional_${i}`)].join(','),
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });
        
            console.log('rapport ajouté :', response.data);
            toast.success('rapport ajouté avec succès');
            navigate('/user/UserRapport');
        } catch (error) {
            console.error('Erreur lors de l\'ajout du rapport :', error.response ? error.response.data : error.message);
            setError('Erreur lors de l\'ajout du rapport');
            toast.error('Erreur lors de l\'ajout du rapport');
        }
    };

    const handleAuthorSelection = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const names = selectedOptions.map(option => option.value);
        const ids = selectedOptions.map(option => option.getAttribute('data-id'));

        setSelectedAuthors(names);
        setSelectedAuthorIds([currentUser.id, ...ids]);
    };

    const handleAddOptionalAuthor = () => {
        setOptionalAuthors([...optionalAuthors, '']); // Ajouter un nouveau champ pour l'auteur facultatif
    };

    const handleOptionalAuthorChange = (index, value) => {
        const newOptionalAuthors = [...optionalAuthors];
        newOptionalAuthors[index] = value;
        setOptionalAuthors(newOptionalAuthors);
    };

    const handleRemoveOptionalAuthor = (index) => {
        const newOptionalAuthors = optionalAuthors.filter((_, i) => i !== index);
        setOptionalAuthors(newOptionalAuthors);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Ajouter un Rapport</h1>
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
                    <label className="block text-sm font-medium mb-1">Auteur(s)</label>
                    <select
                        multiple
                        value={selectedAuthors}
                        onChange={handleAuthorSelection}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        {members.map(member => (
                            <option key={member.id} value={member.name} data-id={member.id}>
                                {member.name}
                            </option>
                        ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                        Pour sélectionner plusieurs auteurs, maintenez la touche <strong>Ctrl</strong> (ou <strong>Cmd</strong> sur Mac) enfoncée en cliquant sur les noms souhaités.
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Auteur(s) facultatif(s)</label>
                    <div className="space-y-2">
                        {optionalAuthors.map((author, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input
                                    type="text"
                                    value={author}
                                    onChange={(e) => handleOptionalAuthorChange(index, e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveOptionalAuthor(index)}
                                    className="ml-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                >
                                    &minus;
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            onClick={handleAddOptionalAuthor}
                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            Ajouter plus d'auteur(s) facultatif(s)
                        </button>
                    </div>
                </div>
               
                <div>
                    <label className="block text-sm font-medium mb-1">DOI</label>
                    <input
                        type="text"
                        value={DOI}
                        onChange={(e) => setDOI(e.target.value)}
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

export default UserCreateBrevet;























































/*import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserCreateRapport = () => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [DOI, setDOI] = useState('');
    const [members, setMembers] = useState([]); // Liste des membres
    const [selectedAuthors, setSelectedAuthors] = useState([]); // Auteurs sélectionnés
    const [selectedAuthorIds, setSelectedAuthorIds] = useState([]); // IDs des membres sélectionnés
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { currentUser, accessToken } = useContext(AuthContext);

    // Fonction pour récupérer les informations des membres
    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/members', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setMembers(response.data.filter(member => member.name !== currentUser.name)); // Exclure le currentUser
        } catch (error) {
            console.error('Erreur lors de la récupération des membres:', error);
            setError('Erreur lors de la récupération des membres');
            toast.error('Erreur lors de la récupération des membres');
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [accessToken]);

    useEffect(() => {
        // Ajouter le currentUser comme auteur par défaut
        setSelectedAuthors([currentUser.name]);
        setSelectedAuthorIds([currentUser.id]); // Ajouter l'ID de l'utilisateur courant
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérifier que l'utilisateur a sélectionné des auteurs
        if (selectedAuthorIds.length === 0) {
            setError('Veuillez sélectionner au moins un auteur.');
            toast.error('Veuillez sélectionner au moins un auteur.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/reports', {
                title,
                summary,
                DOI,
                author: [currentUser.name, ...selectedAuthors].join(', '), // Ajouter le currentUser à la liste des auteurs
                id_user: selectedAuthorIds.join(','),  // Convertir le tableau en chaîne
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            console.log('Rapport ajouté:', response.data);
            toast.success('Rapport ajouté avec succès');
            navigate('/user/UserRapport');
        } catch (error) {
            console.error('Erreur lors de l\'ajout du rapport:', {
                message: error.message,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                } : 'Aucune réponse disponible',
                config: error.config
            });
            setError('Erreur lors de l\'ajout du rapport');
            toast.error('Erreur lors de l\'ajout du rapport');
        }
    };

    const handleAuthorSelection = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const names = selectedOptions.map(option => option.value);
        const ids = selectedOptions.map(option => option.getAttribute('data-id'));

        setSelectedAuthors(names);
        setSelectedAuthorIds([currentUser.id, ...ids]); // Ajouter l'ID de l'utilisateur courant avec les IDs des autres membres sélectionnés
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Ajouter un Rapport</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            {selectedAuthorIds.length > 0 && (
                <div className="mb-4">
                    <strong>IDs des auteurs sélectionnés :</strong> {selectedAuthorIds.join(', ')}
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
                    <label className="block text-sm font-medium mb-1">Résumé</label>
                    <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Auteur(s)</label>
                    <select
                        multiple
                        value={selectedAuthors}
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
                        value={DOI}
                        onChange={(e) => setDOI(e.target.value)}
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
export default UserCreateRapport;*/
