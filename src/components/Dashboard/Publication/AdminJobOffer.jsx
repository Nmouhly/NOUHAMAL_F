import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const JobOfferAdmin = () => {
    const [jobOffers, setJobOffers] = useState([]);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // State for search bar
    const [selectedOffers, setSelectedOffers] = useState([]); // State for selected offers
    const [expandedDescription, setExpandedDescription] = useState({}); // State for expanded descriptions
    const { accessToken } = useContext(AuthContext);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [offersPerPage] = useState(5); // Change this to the number of offers per page
    const pageCount = Math.ceil(jobOffers.length / offersPerPage); // Set the total page count

    useEffect(() => {
        fetchJobOffers();
    }, [accessToken]);

    const fetchJobOffers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/job-offers', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setJobOffers(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des offres d\'emploi', error);
            setError('Erreur lors de la récupération des offres d\'emploi');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre d\'emploi ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/job-offers/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setJobOffers(jobOffers.filter(jobOffer => jobOffer.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'offre d\'emploi', error);
                setError('Erreur lors de la suppression de l\'offre d\'emploi');
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedOffers.length === 0) {
            alert('Aucune offre sélectionnée.');
            return;
        }
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ces offres d\'emploi ?')) {
            try {
                await Promise.all(selectedOffers.map(id =>
                    axios.delete(`http://localhost:8000/api/job-offers/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    })
                ));
                setJobOffers(jobOffers.filter(jobOffer => !selectedOffers.includes(jobOffer.id)));
                setSelectedOffers([]); // Réinitialiser la sélection après la suppression
            } catch (error) {
                console.error('Erreur lors de la suppression des offres d\'emploi', error);
                setError('Erreur lors de la suppression des offres d\'emploi');
            }
        }
    };

    const handleSelectOffer = (id) => {
        setSelectedOffers(prev => 
            prev.includes(id) ? prev.filter(offerId => offerId !== id) : [...prev, id]
        );
    };

    const truncateText = (text, length) => {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    };

    const formatSalary = (salary) => {
        const numSalary = parseFloat(salary);
        return !isNaN(numSalary) ? numSalary.toFixed(2) : 'N/A';
    };

    const filteredJobOffers = jobOffers.filter(jobOffer =>
        jobOffer.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate the current offers to display
    const indexOfLastOffer = currentPage * offersPerPage;
    const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
    const currentOffers = filteredJobOffers.slice(indexOfFirstOffer, indexOfLastOffer);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const toggleExpandDescription = (id) => {
        setExpandedDescription(prev => ({
            ...prev,
            [id]: !prev[id] // Toggle the expanded state
        }));
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4 font-weight-bold display-4">Gestion des Offres d'Emploi</h1>
            
            {/* Search Bar */}
            <div className="mb-4 d-flex justify-content-end">
                <input
                    type="text"
                    className="form-control w-25"
                    placeholder="Rechercher par titre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <Link to="/dashboard/JobOfferCreate" className="btn btn-primary mb-2">Ajouter une Offre</Link>
            <div className="mb-4">
                <button onClick={handleBulkDelete} className="btn btn-danger mb-2">Supprimer</button>
            </div>
            {error && <p className="alert alert-danger">{error}</p>}
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">
                            <input
                                type="checkbox"
                                checked={selectedOffers.length === currentOffers.length && currentOffers.length > 0}
                                onChange={() => {
                                    if (selectedOffers.length === currentOffers.length) {
                                        setSelectedOffers([]);
                                    } else {
                                        setSelectedOffers(currentOffers.map(jobOffer => jobOffer.id));
                                    }
                                }}
                            />
                        </th>
                        <th scope="col">Titre</th>
                        <th scope="col">Description</th>
                        <th scope="col">Exigences</th>
                        <th scope="col">Lieu</th>
                        <th scope="col">Salaire</th>
                        <th scope="col">Date Limite</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOffers.length ? (
                        currentOffers.map(jobOffer => (
                            <tr key={jobOffer.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedOffers.includes(jobOffer.id)}
                                        onChange={() => handleSelectOffer(jobOffer.id)}
                                    />
                                </td>
                                <td>{jobOffer.title}</td>
                                <td>
                                    {expandedDescription[jobOffer.id] ? jobOffer.description : truncateText(jobOffer.description, 20)}
                                    {jobOffer.description.length > 20 && (
                                        <span 
                                            onClick={() => toggleExpandDescription(jobOffer.id)} 
                                            className="text-primary cursor-pointer ml-1">Lire la suite</span>
                                    )}
                                </td>
                                <td>{truncateText(jobOffer.requirements, 20)}</td>
                                <td>{truncateText(jobOffer.location, 20)}</td>
                                <td>{formatSalary(jobOffer.salary)}</td>
                                <td>{new Date(jobOffer.deadline).toLocaleDateString()}</td>
                                <td>
                                    <div className="d-flex justify-content-between">
                                        <Link to={`/dashboard/JobOfferEdit/${jobOffer.id}`} className="btn btn-primary mb-2">
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                        <button onClick={() => handleDelete(jobOffer.id)} className="btn btn-danger mb-2">
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">Aucune offre d'emploi disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <nav>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                            Précédent
                        </button>
                    </li>
                    {[...Array(pageCount)].map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === pageCount ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                            Suivant
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default JobOfferAdmin;
