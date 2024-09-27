import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { useNavigate } from 'react-router-dom';  // Importer useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons';  // Import des icônes
import { ToastContainer, toast } from 'react-toastify'; // Importer les composants de Toast
import 'react-toastify/dist/ReactToastify.css'; // Importer le CSS pour le toast
import './SentMessages.css';

const Inbox = () => {
  const { accessToken, userId } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [receiverEmail, setReceiverEmail] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();  // Utiliser le hook pour rediriger

  // Déplacer fetchMessages en dehors de useEffect
  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/messages/received', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMessages(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages reçus :', error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfileResponse = await axios.get('http://localhost:8000/api/user/profil', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUserRole(userProfileResponse.data.user.role);
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur :', error);
      }
    };

    fetchUserProfile();
    fetchMessages(); // Appeler fetchMessages ici
  }, [accessToken]);

  const handleSendMessage = async () => {
    try {
      const receiverResponse = await axios.post(
        'http://localhost:8000/api/get-user-id',
        { email: receiverEmail },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const receiverId = receiverResponse.data.user_id;
      if (!receiverId) {
        // Si l'email n'existe pas
        toast.error('Email introuvable !'); // Afficher un message d'erreur
        setReceiverEmail(''); // Vider l'input email
        return;
      }

      await axios.post(
        'http://localhost:8000/api/messages',
        {
          sender_id: userId,
          receiver_id: receiverId,
          message: messageContent,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Réinitialiser les champs et mettre à jour la liste des messages
      setReceiverEmail('');
      setMessageContent('');
      fetchMessages(); // Appeler fetchMessages pour mettre à jour les messages
      setIsModalOpen(false); // Fermer le modal après l'envoi
      toast.success('Message envoyé avec succès !'); // Afficher un message de succès

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
    }
  };

  const getFirstSixWords = (message) => {
    return message.split(' ').slice(0, 6).join(' ') + (message.split(' ').length > 6 ? '...' : '');
  };

  const markAsReadOrNotRead = async (id, isRead) => {
    try {
      const url = isRead 
        ? `http://localhost:8000/api/messages/${id}/Notread` 
        : `http://localhost:8000/api/messages/${id}/read`;

      await axios.put(url, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setMessages(prevMessages =>
        prevMessages.map(message =>
          message.id === id ? { ...message, read: !isRead } : message
        )
      );
    } catch (error) {
      console.error(`Erreur lors du marquage du message comme ${isRead ? 'non lu' : 'lu'}:`, error);
    }
  };

  const handleClick = async (message) => {
    if (!message.read) {
      await markAsReadOrNotRead(message.id, false);  // Marque le message comme lu
    }

    // Redirige vers la page des détails du message
    const path = userRole === 1 
      ? `/dashboard/message/${message.id}` 
      : `/user/message/${message.id}`;
    navigate(path);
  };

  return (
    <div>
      <h1>Boîte de Réception</h1>
      
      {/* Bouton Nouveau Message */}
      <button className="new-message-button" onClick={() => setIsModalOpen(true)}>
        Nouveau Message
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="message-modal">
            <button className="close-modal" onClick={() => setIsModalOpen(false)}>
              &times;
            </button>
            <input
              type="email"
              placeholder="Email du destinataire"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              required
              className="message-input"
            />
            <textarea
              placeholder="Votre message"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              required
              className="message-textarea"
            />
            <button onClick={handleSendMessage} className="send-button">
              Envoyer
            </button>
          </div>
        </div>
      )}

      <ul className="inbox-list">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((message) => (
            <li 
              key={message.id} 
              className={`inbox-item ${message.read ? 'read-message' : 'unread-message'}`}
              onClick={() => handleClick(message)}  // Appelle handleClick au clic
            >
              <div className={`star-icon ${message.read ? 'read-star' : 'unread-star'}`}>
                {message.read ? '★' : '☆'}
              </div>
              <div className="message-details">
                <span className="message-sender">
                  <strong>{message.sender.id === userId ? 'Moi' : message.sender.name}</strong>
                </span>
                <span className="message-preview">{getFirstSixWords(message.message)}</span>
                <span className="message-date">{new Date(message.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
              </div>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  markAsReadOrNotRead(message.id, message.read);
                }}
                style={{ cursor: 'pointer', marginLeft: '10px' }}
              >
                <FontAwesomeIcon 
                  icon={message.read ? faEnvelopeOpen : faEnvelope} 
                  className={`mail-icon ${message.read ? 'read-icon' : 'unread-icon'}`} 
                />
                <span className="message-status">
                  {message.read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                </span>
              </span>
            </li>
          ))
        ) : (
          <li>Aucun message trouvé.</li>
        )}
      </ul>

      {/* Container pour les notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
    </div>
  );
};

export default Inbox;
