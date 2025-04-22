// src/components/UserCard.jsx
import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
      <p><strong>Address:</strong> {user.address || 'N/A'}</p>
    </div>
  );
};

export default UserCard;