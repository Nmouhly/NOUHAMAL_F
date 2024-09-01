import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import axios from 'axios';

function EditUser() {
    const { currentUser } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        position: '',
        team_id: '',
        bio: '',
        contact_info: '',
        image: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/members/user/${id}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleSaveClick = async () => {
        try {
            await axios.put(`http://localhost:8000/api/user/${currentUser.id}`, {
                name: userData.name,
                email: userData.email,
            });

            await axios.put(`http://localhost:8000/api/member/${userData.id}`, {
                position: userData.position,
                bio: userData.bio,
                contact_info: userData.contact_info,
                user_id: currentUser.id,
                image: userData.image,
            });

            alert('User information updated successfully.');
            navigate('/user/UserInfo');
        } catch (error) {
            console.error('Erreur lors de la mise à jour des données:', error);
            alert('An error occurred while updating user information.');
        }
    };

    return (
        <div style={styles.container}>
            {loading ? (
                <p style={styles.loadingText}>Loading user information...</p>
            ) : (
                <div style={styles.userInfo}>
                    <h2>Edit User Information</h2>
                    <div style={styles.userDetailContainer}>
                        <strong style={styles.label}>Name</strong>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.userDetailContainer}>
                        <strong style={styles.label}>Email</strong>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.userDetailContainer}>
                        <strong style={styles.label}>Position</strong>
                        <input
                            type="text"
                            name="position"
                            value={userData.position}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.userDetailContainer}>
                        <strong style={styles.label}>Team ID</strong>
                        <input
                            type="text"
                            name="team_id"
                            value={userData.team_id}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.userDetailContainer}>
                        <strong style={styles.label}>Bio</strong>
                        <textarea
                            name="bio"
                            value={userData.bio}
                            onChange={handleInputChange}
                            style={styles.textarea}
                        />
                    </div>
                    <div style={styles.userDetailContainer}>
                        <strong style={styles.label}>Contact Info</strong>
                        <input
                            type="text"
                            name="contact_info"
                            value={userData.contact_info}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                    </div>
                    <button onClick={handleSaveClick} style={styles.saveButton}>
                        Save
                    </button>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        margin: 'auto',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
    },
    userInfo: {
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    userDetailContainer: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid #eee',
    },
    label: {
        flex: '1',
        textAlign: 'right',
        marginRight: '12px',
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        flex: '3',
        padding: '8px',
        fontSize: '16px',
        color: '#555',
        border: '1px solid #ccc',
        borderRadius: '4px',
        margin: 0,
    },
    textarea: {
        flex: '3',
        padding: '8px',
        fontSize: '16px',
        color: '#555',
        border: '1px solid #ccc',
        borderRadius: '4px',
        margin: 0,
        height: '80px',
    },
    saveButton: {
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#28a745',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    loadingText: {
        fontSize: '18px',
        color: '#888',
    },
};

export default EditUser;
