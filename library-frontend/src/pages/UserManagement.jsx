// src/pages/UserManagement.jsx - Updated
import React, { useState, useEffect } from 'react';
import { getAllUsers, registerUser } from '../services/userService';
import { TextInput, SubmitButton } from '../components/FormComponents';
import UserCard from '../components/UserCard';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      setError('Failed to fetch users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: ''
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Remove confirmPassword before submitting
      const userData = { ...formData };
      delete userData.confirmPassword;

      await registerUser(userData);
      setShowForm(false);
      resetForm();
      await fetchUsers(); // Refresh users list
    } catch (error) {
      setError('Failed to register user. Please try again.');
    }
  };

  return (
    <div className="user-management-page">
      <div className="page-header">
        <h1>🧑‍🎓 User Management</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Register New User
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>Register New User</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter full name"
              required
            />
            <TextInput
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              required
            />
            <TextInput
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              required
              type="password"
            />
            <TextInput
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm password"
              required
              type="password"
            />
            <TextInput
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
            <TextInput
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter address"
            />
            <div className="form-buttons">
              <SubmitButton text="Register User" />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="users-container">
          <h2>Registered Users</h2>
          {users.length === 0 ? (
            <div className="no-users">No users registered yet.</div>
          ) : (
            <div className="users-grid">
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserManagement;