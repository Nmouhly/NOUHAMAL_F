import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import defaultImage from '../assets/photo.png';
import { FaEnvelope, FaUserGraduate, FaBuilding } from 'react-icons/fa';

const MemberProfile = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8000/api/members/${id}`)
      .then(response => {
        setMember(response.data);
      })
      .catch(() => {
        setError('Erreur lors de la récupération du profil membre.');
      });
  }, [id]);

  if (error) {
    return <p style={styles.error}>{error}</p>;
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
                    style={styles.profileImage}
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
  profileImage: {
    width: '150px',  // Augmenter la largeur ici
    height: 'auto',
    borderRadius: '50%',
    display: 'block',
    margin: '0 auto', // Center the image horizontally
  },
  name: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '20px 0',
  },
  infoContainer: {
    textAlign: 'left',
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
