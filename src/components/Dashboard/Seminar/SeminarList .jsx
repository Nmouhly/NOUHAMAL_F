import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const SeminarList = () => {
    const [seminars, setSeminars] = useState([]); // État pour stocker la liste des séminaires
    const [error, setError] = useState(''); // État pour gérer les erreurs
    const [searchTerm, setSearchTerm] = useState(''); // État pour gérer le terme de recherche
    const [currentPage, setCurrentPage] = useState(1); // État pour gérer la page actuelle
    const [seminarsPerPage] = useState(5); // Nombre de séminaires par page
    const [selectedSeminars, setSelectedSeminars] = useState([]); // État pour les séminaires sélectionnés
    const { accessToken } = useContext(AuthContext); // Récupération du jeton d'accès depuis le contexte d'authentification

    useEffect(() => {
        fetchSeminars(); // Appel à la fonction pour récupérer les séminaires lors du chargement du composant
    }, [accessToken]);

    const fetchSeminars = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/seminars', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setSeminars(response.data); // Mise à jour de l'état avec les données récupérées
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des séminaires', error);
            setError('Erreur lors de la récupération des séminaires');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce séminaire ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/seminars/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setSeminars(seminars.filter(seminar => seminar.id !== id)); // Filtrer le séminaire supprimé
            } catch (error) {
                console.error('Erreur lors de la suppression du séminaire', error);
                setError('Erreur lors de la suppression du séminaire');
            }
        }
    };

    const handleMassDelete = async () => {
        if (selectedSeminars.length === 0) {
            alert('Veuillez sélectionner au moins un séminaire à supprimer.');
            return;
        }

        if (window.confirm('Êtes-vous sûr de vouloir supprimer les séminaires sélectionnés ?')) {
            try {
                await Promise.all(selectedSeminars.map(id => 
                    axios.delete(`http://localhost:8000/api/seminars/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    })
                ));
                setSeminars(seminars.filter(seminar => !selectedSeminars.includes(seminar.id))); // Filtrer les séminaires supprimés
                setSelectedSeminars([]); // Réinitialiser la sélection
            } catch (error) {
                console.error('Erreur lors de la suppression des séminaires', error);
                setError('Erreur lors de la suppression des séminaires');
            }
        }
    };

    // Gérer la recherche des séminaires
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Réinitialiser à la première page lors de la recherche
    };

    // Pagination : calculer les séminaires à afficher
    const indexOfLastSeminar = currentPage * seminarsPerPage;
    const indexOfFirstSeminar = indexOfLastSeminar - seminarsPerPage;
    const filteredSeminars = seminars.filter(seminar =>
        seminar.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentSeminars = filteredSeminars.slice(indexOfFirstSeminar, indexOfLastSeminar); // Appliquer le filtre et la pagination

    const totalPages = Math.ceil(filteredSeminars.length / seminarsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // Mettre à jour la page actuelle
    };

    // Gérer la sélection des séminaires
    const handleSelectChange = (id) => {
        if (selectedSeminars.includes(id)) {
            setSelectedSeminars(selectedSeminars.filter(s => s !== id)); // Retirer de la sélection
        } else {
            setSelectedSeminars([...selectedSeminars, id]); // Ajouter à la sélection
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4 font-weight-bold display-4">Gestion des Séminaires</h1>
            <div className="mb-4 d-flex justify-content-end">

            <input
                type="text"
                placeholder="Rechercher par titre"
                value={searchTerm}
                onChange={handleSearchChange}
                className="form-control w-25"
            />
            </div>
                        <Link to="/dashboard/SeminarForm" className="btn btn-primary mb-4">Ajouter un Séminaire</Link>

            <div className="mb-4">

            <button onClick={handleMassDelete} className="btn btn-danger mb-4">Supprimer </button>
            </div>
            {error && <p className="text-danger">{error}</p>} {/* Afficher les erreurs s'il y en a */}

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedSeminars(filteredSeminars.map(seminar => seminar.id)); // Sélectionner tous
                                        } else {
                                            setSelectedSeminars([]); // Désélectionner tous
                                        }
                                    }}
                                    checked={selectedSeminars.length === filteredSeminars.length && filteredSeminars.length > 0}
                                />
                            </th>
                            <th>Titre</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Heure de Début</th>
                            <th>Heure de Fin</th>
                            <th>Lieu</th>
                            <th>Intervenant</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSeminars.length ? (
                            currentSeminars.map(seminar => (
                                <tr key={seminar.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedSeminars.includes(seminar.id)}
                                            onChange={() => handleSelectChange(seminar.id)}
                                        />
                                    </td>
                                    <td>{seminar.title}</td>
                                    <td>{seminar.description.length > 100 
                                        ? `${seminar.description.substring(0, 100)}...` 
                                        : seminar.description}
                                    </td>
                                    <td>{seminar.date}</td>
                                    <td>{seminar.start_time}</td>
                                    <td>{seminar.end_time}</td>
                                    <td>{seminar.location}</td>
                                    <td>{seminar.speaker}</td>
                                    <td>{seminar.status}</td>
                                    <td>
                                       
                                        <div className="d-flex justify-content-between">
                                        <Link to={`/dashboard/SeminarDetails/${seminar.id}`}  className="btn btn-primary mb-2">
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                        <button onClick={() => handleDelete(seminar.id)}  className="btn btn-danger mb-2">
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="text-center">Aucun séminaire disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <nav>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Précédent</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button onClick={() => handlePageChange(index + 1)} className="page-link">{index + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Suivant</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default SeminarList;
