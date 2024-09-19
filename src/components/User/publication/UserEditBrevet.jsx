import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserEditBrevet = () => {
    const { id } = useParams(); // Get the brevet ID from the URL
    const [title, setTitle] = useState('');
    const [doi, setDoi] = useState('');
    const [members, setMembers] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]); // Authors already selected
    const [selectedAuthorIds, setSelectedAuthorIds] = useState([]); // IDs of the selected authors
    const [optionalAuthors, setOptionalAuthors] = useState([]); // For storing optional authors
    const [optionalAuthorIds, setOptionalAuthorIds] = useState([]); // IDs of optional authors
    const [error, setError] = useState('');
    const { currentUser, accessToken } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fetch brevet details for editing
    const fetchBrevetDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/brevetUser/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            const brevet = response.data;

            setTitle(brevet.title);
            setDoi(brevet.doi);

            // Split authors and IDs
            const allAuthors = brevet.author.split(', ').filter(author => author.trim() !== '');
            const allAuthorIds = brevet.id_user.split(',').filter(id => id.trim() !== '');

            // Extract main author and optional authors
            const mainAuthor = allAuthors[0];
            const mainAuthorId = allAuthorIds[0];
            const optional = allAuthors.slice(1);
            const optionalIds = allAuthorIds.slice(1);

            // Separate optional authors
            const optionalList = optional.filter((_, i) => optionalIds[i].startsWith('optional_'));
            const optionalListIds = optionalIds.filter(id => id.startsWith('optional_'));
            const normalAuthors = optional.filter((_, i) => !optionalIds[i].startsWith('optional_'));
            const normalIds = optionalIds.filter(id => !id.startsWith('optional_'));

            setSelectedAuthors([mainAuthor, ...normalAuthors]);
            setSelectedAuthorIds([mainAuthorId, ...normalIds]);
            setOptionalAuthors(optionalList);
            setOptionalAuthorIds(optionalListIds);
        } catch (error) {
            console.error('Erreur lors de la récupération du brevet :', error);
            setError('Erreur lors de la récupération du brevet');
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

    useEffect(() => {
        fetchMembers();
        fetchBrevetDetails();
    }, [id, accessToken]);

    const validateDoi = (doi) => {
        const doiPattern = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
        return doiPattern.test(doi);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateDoi(doi)) {
            setError('Format du DOI invalide.');
            toast.error('Format du DOI invalide.');
            return;
        }
    
        // Prepare payload for API request
        const allAuthors = [currentUser.name, ...selectedAuthors, ...optionalAuthors];
        const allAuthorIds = [currentUser.id, ...selectedAuthorIds];
    
        const payload = {
            title,
            author_names: allAuthors, // Names of all authors
            doi,
            id_user: allAuthorIds.join(','), // IDs including optional ones
            current_user_id: currentUser.id, // Include current user ID if needed
            optional_authors: optionalAuthors, // Optional authors if needed for future use
        };
    
        console.log('Payload:', payload); // Verify the data being sent
    
        try {
            await axios.put(`http://localhost:8000/api/brevetUser/${id}`, payload, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
    
            toast.success('Brevet modifié avec succès');
            navigate('/user/UserBrevets');
        } catch (error) {
            console.error('Erreur lors de la mise à jour du brevet :', error.response ? error.response.data : error.message);
            setError('Erreur lors de la mise à jour du brevet');
            toast.error('Erreur lors de la mise à jour du brevet');
        }
    };
    
    const handleAuthorSelection = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const names = selectedOptions.map((option) => option.value);
        const ids = selectedOptions.map((option) => option.getAttribute('data-id'));

        setSelectedAuthors(names);
        setSelectedAuthorIds([currentUser.id, ...ids.filter(id => !id.startsWith('optional_'))]);
    };

    const handleAddOptionalAuthor = () => {
        setOptionalAuthors([...optionalAuthors, '']);
        setOptionalAuthorIds([...optionalAuthorIds, `optional_${optionalAuthors.length + 1}`]);
    };

    const handleOptionalAuthorChange = (index, value) => {
        const newOptionalAuthors = [...optionalAuthors];
        newOptionalAuthors[index] = value;
        setOptionalAuthors(newOptionalAuthors);
    };

    const handleRemoveOptionalAuthor = (index) => {
        const newOptionalAuthors = optionalAuthors.filter((_, i) => i !== index);
        const newOptionalAuthorIds = optionalAuthorIds.filter((_, i) => i !== index);
        setOptionalAuthors(newOptionalAuthors);
        setOptionalAuthorIds(newOptionalAuthorIds);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Modifier le Brevet</h1>
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
                        Ajouter plus d'auteur(s) facultatif(s)
                    </button>
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

export default UserEditBrevet;
