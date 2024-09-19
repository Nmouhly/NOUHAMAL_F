import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserEditRevue = () => {
    const { id } = useParams(); // Get the revue ID from the URL
    const [title, setTitle] = useState('');
    const [DOI, setDOI] = useState('');
    const [members, setMembers] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]); // Authors already selected
    const [selectedAuthorIds, setSelectedAuthorIds] = useState([]); // IDs of the selected authors
    const [optionalAuthors, setOptionalAuthors] = useState([]); // For storing optional authors
    const [error, setError] = useState('');
    const [revue, setRevue] = useState(null); // Added to store revue details
    const { currentUser, accessToken } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fetch revue details for editing
    useEffect(() => {
        fetchMembers();
        fetchRevueDetails();
    }, [id, accessToken]);
    
    // Fetch revue details for editing
    const fetchRevueDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/revueUser/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            const revueData = response.data;
    
            console.log('Données de la revue:', revueData); // Assurez-vous que les données sont correctes
    
            setTitle(revueData.title);
            setDOI(revueData.doi);
    
            // Assurez-vous que les données sont bien formatées
            setSelectedAuthors(revueData.authors_with_ids || []);
            setSelectedAuthorIds(revueData.author_ids || []);
            setOptionalAuthors(revueData.authors_without_ids || []);
            setRevue(revueData); // Store revue details in state
        } catch (error) {
            console.error('Erreur lors de la récupération de la revue :', error);
            setError('Erreur lors de la récupération de la revue');
        }
    };
    
    // Fetch members to display in the authors list
    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/members', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setMembers(response.data.filter((member) => member.name !== currentUser.name));
        } catch (error) {
            console.error('Erreur lors de la récupération des membres :', error);
            setError('Erreur lors de la récupération des membres');
        }
    };

    const validateDoi = (doi) => {
        const doiPattern = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
        return doiPattern.test(doi);
    };

    // Function to check if DOI exists
    const checkDoiExists = async (doi, excludedDoi) => {
        try {
            const response = await axios.post('http://localhost:8000/api/checkDOIExists', { doi }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            return response.data.exists && doi !== excludedDoi;
        } catch (error) {
            console.error('Erreur lors de la vérification du DOI :', error);
            setError('Erreur lors de la vérification du DOI');
            return false;
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateDoi(DOI)) {
            setError('Format du DOI invalide.');
            toast.error('Format du DOI invalide.');
            return;
        }
    
        // Vérifiez le DOI uniquement si le DOI a changé
        const doiExists = revue && DOI !== revue.doi && await checkDoiExists(DOI, revue.doi);
    
        if (doiExists) {
            setError('Le DOI existe déjà.');
            toast.error('Le DOI existe déjà.');
            return;
        }
    
        // Préparer les auteurs
        const filteredSelectedAuthors = selectedAuthors.filter((author) => author !== currentUser.name);
        const allAuthors = [currentUser.name, ...filteredSelectedAuthors, ...optionalAuthors];
        
        // Préparer les IDs des auteurs
        const filteredSelectedAuthorIds = selectedAuthorIds.filter((id) => id !== currentUser.id);
        const allAuthorIds = [...filteredSelectedAuthorIds]; // Utiliser uniquement les IDs existants
    
        const payload = {
            title,
            author_names: allAuthors,
            DOI,
            id_user: allAuthorIds.join(','), // Assurez-vous que les IDs sont corrects
            current_user_id: currentUser.id,
            optional_authors: optionalAuthors,
        };
    
        try {
            await axios.put(`http://localhost:8000/api/revueUser/${id}`, payload, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
    
            toast.success('Revue modifiée avec succès');
            navigate('/user/UserRevues');
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la revue :', error.response ? error.response.data : error.message);
            setError('Erreur lors de la mise à jour de la revue');
            toast.error('Erreur lors de la mise à jour de la revue');
        }
    };
    
    
    const handleAuthorSelection = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const names = selectedOptions.map((option) => option.value);
        const ids = selectedOptions.map((option) => option.getAttribute('data-id'));

        // Avoid adding the current user multiple times
        const filteredNames = names.filter((name) => name !== currentUser.name);
        const filteredIds = ids.filter((id) => !id.startsWith('optional_'));

        setSelectedAuthors(filteredNames);
        setSelectedAuthorIds([currentUser.id, ...filteredIds]);
    };

    const handleAddOptionalAuthor = () => {
        setOptionalAuthors([...optionalAuthors, '']);
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
            <h1 className="text-2xl font-bold mb-4">Modifier la Revue</h1>
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
                        {members.map((member) => (
                            <option key={member.id} value={member.name} data-id={member.id}>
                                {member.name}
                            </option>
                        ))}
                    </select>
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
                    <button
                        type="button"
                        onClick={handleAddOptionalAuthor}
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Ajouter un auteur facultatif
                    </button>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">DOI</label>
                    <input
                        type="text"
                        value={DOI}
                        onChange={(e) => setDOI(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                    Enregistrer
                </button>
            </form>
        </div>
    );
};

export default UserEditRevue;





 