import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';

const MemberEdit = () => {
  const { id } = useParams(); // ID of the member to edit
  const [member, setMember] = useState({
    name: '',
    position: '',
    bio: '',
    contact_info: '',
    statut: '', // Added 'statut' field
    team_id: '' // Added 'team_id' field
  });
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  // Load member information when the component loads
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/members/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        setMember(response.data);
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
            'Authorization': `Bearer ${accessToken}`,
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
    try {
      const response = await axios.put(`http://localhost:8000/api/members/${id}`, member, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      toast.success('Member updated successfully');
      navigate('/dashboard/Member'); // Redirect to the member list after updating
    } catch (error) {
      console.error('Error updating member', error);
      setError('Error updating member');
      toast.error('Error updating member');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
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
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={member.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <input
            type="text"
            name="position"
            value={member.position}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={member.bio}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact Information</label>
          <input
            type="text"
            name="contact_info"
            value={member.contact_info}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="statut"
            value={member.statut}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select a status</option>
            <option value="Membre">Membre</option>
            <option value="Ancien">Ancien</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Team</label>
          <select
            name="team_id"
            value={member.team_id}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Update Member
        </button>
      </form>
    </div>
  );
};

export default MemberEdit;
