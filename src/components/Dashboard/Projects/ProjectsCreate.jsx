import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserCreate = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(0); // 0 for user, 1 for admin
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name,
            email,
            password,
            role,
        };

        try {
            const response = await axios.post('http://localhost:8000/api/users', formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log('User created:', response.data);
            toast.success('User created successfully');
            navigate('/dashboard/UsersAdmin');
        } catch (error) {
            console.error('Error creating user', error);
            setError('Error creating user');
            toast.error('Error creating user');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Add User</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select 
                        value={role} 
                        onChange={(e) => setRole(parseInt(e.target.value, 10))} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value={0}>User</option>
                        <option value={1}>Admin</option>
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

export default UserCreate;
