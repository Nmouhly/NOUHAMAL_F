import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const ProjectsCreate = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [team, setTeam] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [fundingType, setFundingType] = useState('');
    const [status, setStatus] = useState('en_cours'); // New state for status
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = {
            title,
            description,
            team,
            start_date: startDate,
            end_date: endDate,
            funding_type: fundingType,
            status, // Include status in form data
        };

        try {
            const response = await axios.post('http://localhost:8000/api/projects', formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log('Project added:', response.data);
            toast.success('Project added successfully');
            navigate('/dashboard/ProjectsAdmin');
        } catch (error) {
            console.error('Error adding project', error);
            setError('Error adding project');
            toast.error('Error adding project');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Add Project</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Team</label>
                    <input 
                        type="text" 
                        value={team} 
                        onChange={(e) => setTeam(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Funding Type</label>
                    <input 
                        type="text" 
                        value={fundingType} 
                        onChange={(e) => setFundingType(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="en_cours">En Cours</option>
                        <option value="termine">Terminé</option>
                    </select>
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Add
                </button>
            </form>
        </div>
    );
};

export default ProjectsCreate;
