import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import { AuthContext } from '../../context/authContext';

const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

const AdminHomeDescription = () => {
    const [description, setDescription] = useState(null);
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchDescription();
    }, []);

    const fetchDescription = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/home-descriptions', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setDescription(response.data); // On suppose que c'est un objet
        } catch (error) {
            console.error("Erreur lors de la récupération de la description", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette description ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/home-descriptions/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                toast.success('Description supprimée avec succès');
                fetchDescription(); // Rafraîchir la description après suppression
            } catch (error) {
                console.error("Erreur lors de la suppression de la description", error);
                toast.error('Erreur lors de la suppression de la description');
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Gestion de la Description</h1>
            <div className="mb-4">
                <Link to="/dashboard/CreateDescription" className="btn btn-primary">
                    Ajouter une description
                </Link>
            </div>

            {description ? (
                <div className="bg-white shadow-md rounded-lg p-6">
                    
                    {description.content ? (
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2 text-left">Contenu</th>
                                    <th className="border px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border px-4 py-2">
                                        {stripHtmlTags(description.content)}
                                    </td>
                                    <td>
                                        <div className="text-right mt-4">
                                            <Link to={`/dashboard/EditDescription/${description.id}`} className="btn btn-success mr-2">
                                                Modifier
                                            </Link>
                                            <button className="btn btn-danger" onClick={() => handleDelete(description.id)}>
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <p>Aucun contenu disponible.</p>
                    )}
                </div>
            ) : (
                <p>Aucune description de laboratoire disponible.</p>
            )}
        </div>
    );
};

export default AdminHomeDescription;
