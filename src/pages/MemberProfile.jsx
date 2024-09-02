import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import defaultImage from '../assets/photo.png';
import { FaEnvelope, FaUserGraduate, FaBuilding } from 'react-icons/fa';
import './Ouvrage.css'; // Assurez-vous d'importer le fichier CSS

const MemberProfile = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [ouvrages, setOuvrages] = useState([]);
  const [revues, setRevues] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les informations du membre
        const memberResponse = await axios.get(`http://localhost:8000/api/members/${id}`);
        setMember(memberResponse.data);
        console.log("id_user:", memberResponse.data.user_id);

        // Récupérer les ouvrages associés à l'utilisateur du membre et les ouvrages où il est contributeur
        const ouvragesResponse = await axios.get(`http://localhost:8000/api/ouvrages/user-or-contributor/${memberResponse.data.user_id}`);
        setOuvrages(ouvragesResponse.data);
        console.log("Ouvr:", ouvragesResponse.data);

        // Récupérer les revues associées à l'utilisateur du membre et les revues où il est contributeur
        const revuesResponse = await axios.get(`http://localhost:8000/api/revues/user-or-contributor/${memberResponse.data.user_id}`);
        setRevues(revuesResponse.data);
        console.log("Revues:", revuesResponse.data); // Ajout pour vérifier les données
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setError('Erreur lors de la récupération du profil membre, des ouvrages ou des revues.');
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div style={styles.container}>
      {member ? (
        <>
          <table style={styles.table}>
            <tbody>
              <tr>
                <td style={styles.imageWrapper}>
                  <img
                    src={member.image ? `http://localhost:8000/storage/${member.image}` : defaultImage}
                    alt={member.name}
                    className="profile-image"
                  />
                </td>
              </tr>
              <tr>
                <td style={styles.name}>{member.name}</td>
              </tr>
              <tr>
                <td style={styles.infoContainer}>
                  {member.position && (
                    <div style={styles.infoItem}>
                      <FaUserGraduate style={styles.icon} />
                      <span>{member.position}</span>
                    </div>
                  )}
                  {member.bio && (
                    <div style={styles.infoItem}>
                      <FaBuilding style={styles.icon} />
                      <span>{member.bio}</span>
                    </div>
                  )}
                  {member.email && (
                    <div style={styles.infoItem}>
                      <FaEnvelope style={styles.icon} />
                      <span>{member.email}</span>
                    </div>
                  )}
                  {ouvrages.length > 0 && (
                    <div style={styles.infoItem}>
                      <ul className="ouvrages-list">
                        <h3 style={styles.publicationsTitle}>Ouvrages</h3>
                        <hr style={styles.sectionDivider} />
                        {ouvrages.map(ouvrage => (
                          <li key={ouvrage.id}>
                            <strong>{ouvrage.title || 'Titre non disponible'}.</strong> {ouvrage.author || 'Auteur non disponible'}.
                            <a href={`https://doi.org/${ouvrage.DOI}`} target="_blank" rel="noopener noreferrer" className="doi-link">DOI</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {revues.length > 0 && (
                    <div style={styles.infoItem}>
                      <ul className="revues-list">
                        <h3 style={styles.publicationsTitle}>Revues</h3>
                        <hr style={styles.sectionDivider} />
                        {revues.map(revue => (
                          <li key={revue.id}>
                            <strong>{revue.title || 'Titre non disponible'}.</strong> {revue.author || 'Auteur non disponible'}.
                            <a href={`https://doi.org/${revue.DOI}`} target="_blank" rel="noopener noreferrer" className="doi-link">DOI</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <p>Chargement du profil...</p>
      )}
    </div>
  );
};

const styles = {
  publicationsTitle: {
    marginLeft: '-55px',
  },
  container: {
    padding: '40px',
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  imageWrapper: {
    textAlign: 'center',
    padding: '20px',
  },
  name: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '20px 0',
  },
  infoContainer: {
    textAlign: 'left',
  },
  sectionDivider: {
    border: '2px solid #05a7bd',
    width: '150px',
    marginTop: '5px',
    marginLeft: '-35px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
    color: '#333',
    margin: '10px 0',
  },
  icon: {
    marginRight: '10px',
    color: '#007BFF',
    fontSize: '20px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
};

export default MemberProfile;
