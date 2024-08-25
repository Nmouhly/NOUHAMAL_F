import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';

const MemberEdit = () => {
  const { id } = useParams(); // ID of the member to edit
  const [member, setMember] = useState({
    position: '',
    bio: '',
    contact_info: '',
    statut: '',
    team_id: '',
  });
  const [customPosition, setCustomPosition] = useState(''); // State for custom position input
  const [showCustomInput, setShowCustomInput] = useState(false); // Control visibility of custom position input
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  // Load member information
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/members/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMember(response.data);
        if (response.data.position === 'Autre') {
          setShowCustomInput(true);
        }
      } catch (error) {
        console.error('Error loading member information', error);
        toast.error('Error loading member information');
      }
    };
    fetchMember();
  }, [id, accessToken]);

  // Load team options
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/equipe', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTeams(response.data);
      } catch (error) {
        console.error('Error loading teams', error);
        setError('Error loading teams.');
        toast.error('Error loading teams.');
      }
    };
    fetchTeams();
  }, [accessToken]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedMember = {
      ...member,
      position: showCustomInput ? customPosition : member.position,
    };
    try {
      await axios.put(`http://localhost:8000/api/members/${id}`, updatedMember, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Member updated successfully');
      navigate('/dashboard/Member');
    } catch (error) {
      console.error('Error updating member', error);
      setError('Error updating member');
      toast.error('Error updating member');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'position') {
      if (value === 'Autre') {
        setShowCustomInput(true);
      } else {
        setShowCustomInput(false);
        setCustomPosition(''); // Reset custom position input when another option is selected
      }
    }
    setMember({
      ...member,
      [name]: value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Member</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="position">Position</label>
          <select
            id="position"
            name="position"
            value={member.position}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select a position</option>
            <option value="Post Doctorant">Post Doctorant</option>
            <option value="Doctorant">Doctorant</option>
            <option value="Professeur des Universités">Professeur des Universités</option>
            <option value="Maître de Conférences">Maître de Conférences</option>
            <option value="Ingénieur de Recherche">Ingénieur de Recherche</option>
            <option value="Assistante de Gestion">Assistante de Gestion</option>
            <option value="ATER (Attaché Temporaire d'Enseignement et de Recherche)">
              ATER (Attaché Temporaire d'Enseignement et de Recherche)
            </option>
            <option value="Maître de Conférences avec HDR (Habilitation à Diriger des Recherches)">
              Maître de Conférences avec HDR (Habilitation à Diriger des Recherches)
            </option>
            <option value="Technicien">Technicien</option>
            <option value="Étudiant">Étudiant</option>
            <option value="Autre">Autre</option>
          </select>
          {showCustomInput && (
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1" htmlFor="customPosition">Custom Position</label>
              <input
                type="text"
                id="customPosition"
                value={customPosition}
                onChange={(e) => setCustomPosition(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={member.bio}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="contact_info">Contact Info</label>
          <input
            type="text"
            id="contact_info"
            name="contact_info"
            value={member.contact_info}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="statut">Status</label>
          <select
            id="statut"
            name="statut"
            value={member.statut}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Membre">Membre</option>
            <option value="Ancien">Ancien</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="team_id">Team</label>
          <select
            id="team_id"
            name="team_id"
            value={member.team_id}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
            Update Member
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberEdit;
