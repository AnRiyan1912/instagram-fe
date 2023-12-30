import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import AllUsersPage from './messeger';
import { Template } from '../template/template';
import ChatWindow from './chatWindow';

const MessagePage = () => {
  const history = useHistory();
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleMessengerIconClick = () => {
    setShowAllUsers(true);
  };

  return (
    <>
      <Template>
        {/* Your Messenger content here */}
        <div className="messenger-container">
          {showAllUsers ? (
            <AllUsersPage users={usersData} onUserClick={handleUserClick} />
          ) : selectedUser ? (
            <ChatWindow user={selectedUser} />
          ) : (
            ''
          )}
        </div>
      </Template>
    </>
  );
};

export default MessagePage;
