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
  const [error, setError] = useState('');

  useEffect(() => {
    // Récupérer les informations du membre
    axios.get(`http://localhost:8000/api/members/${id}`)
      .then(response => {
        setMember(response.data);

        // Récupérer les ouvrages associés à l'utilisateur du membre
        return axios.get(`http://localhost:8000/api/ouvrages/user/${response.data.user_id}`);
      })
      .then(response => {
        setOuvrages(response.data);
      })
      .catch(() => {
        setError('Erreur lors de la récupération du profil membre ou des ouvrages.');
      });
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
                    className="profile-image" // Utilisez la classe CSS définie pour l'image
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
                        <h3 style={styles.publicationsTitle}>Publications</h3>
                        <hr style={styles.sectionDivider} />
                        {ouvrages.map(ouvrage => (
                          <li key={ouvrage.id}>
                            <strong>{ouvrage.title || 'Titre non disponible'}.</strong> {ouvrage.author || 'Auteur non disponible'}.
                            <a href={ouvrage.pdf_link} target="_blank" rel="noopener noreferrer" className="pdf-link">PDF</a>
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
    marginLeft: '-55px', // Ajustez cette valeur selon vos besoins
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
