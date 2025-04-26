// src/components/users/UserForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isEditMode = !!id;
  
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT'
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (isEditMode) {
      const fetchUserData = async () => {
        try {
          const response = await userService.getUserById(id);
          const userData = response.data;
          // Don't include password in edit mode
          setUser({
            name: userData.name,
            email: userData.email,
            password: '',
            role: userData.role
          });
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user:', error);
          setError('Failed to load user data');
          setLoading(false);
        }
      };
      
      fetchUserData();
    }
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isEditMode) {
        // If password is empty in edit mode, remove it from the request
        const userToUpdate = { ...user };
        if (!userToUpdate.password) {
          delete userToUpdate.password;
        }
        await userService.updateUser(id, userToUpdate);
      } else {
        await userService.createUser(user);
      }
      navigate('/admin/users');
    } catch (error) {
      console.error('Error saving user:', error);
      setError(error.response?.data?.message || 'Failed to save user');
    }
  };
  
  if (!isAdmin) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-700">Access Denied</h2>
        <p className="text-gray-500 mt-2">You don't have permission to view this page.</p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-500">Loading user data...</div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit User' : 'Create New User'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">
            {isEditMode ? 'Password (leave blank to keep current)' : 'Password'}
          </label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required={!isEditMode}
            className="form-input"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Role</label>
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            className="form-input"
          >
            <option value="STUDENT">Student</option>
            <option value="LIBRARIAN">Librarian</option>
          </select>
        </div>
        
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/users')}
            className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditMode ? 'Update User' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;