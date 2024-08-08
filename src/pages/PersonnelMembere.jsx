import './Membre.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Assurez-vous d'importer axios

const PersonnelMember = () => {
    const [members, setMembers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/members')
            .then(response => {
                console.log('Données récupérées:', response.data); // Vérifiez les données récupérées
                // Filtrer les membres pour ne garder que ceux avec le statut "actuel"
                const filteredMembers = response.data.filter(member => member.statut === 'actuel');
                console.log('Membres filtrés (actuels):', filteredMembers); // Vérifiez les membres filtrés
                setMembers(filteredMembers);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des membres', error);
                setError('Erreur lors de la récupération des membres');
            });
    }, []);

    return (
        <div className="members-table">
            <h1>Membres actuels de l'équipe L2IS</h1>
            {error && <p className="error">{error}</p>}
            {members.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Position</th>
                            <th>Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(member => (
                            <tr key={member.id}>
                                <td>{member.name || 'Nom non disponible'}</td>
                                <td>{member.position || 'Position non disponible'}</td>
                                <td>{member.contact_info || 'Non disponible'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Aucun membre actuel disponible.</p>
            )}
        </div>
    );
};

export default PersonnelMember;
