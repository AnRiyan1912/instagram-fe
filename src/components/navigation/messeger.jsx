import React, { useState } from 'react';

const AllUsersPage = ({ users, onUserClick }) => {
  return (
    <div className="user-list">
      {users.map((user) => (
        <div key={user.id} className="user" onClick={() => onUserClick(user)}>
          <div className="user-avatar">{/* Display user avatar here */}</div>
          <div className="user-info">
            <div className="user-username">{user.username}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllUsersPage;
