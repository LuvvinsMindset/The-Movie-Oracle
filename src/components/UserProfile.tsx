import React from 'react';
import { useUser } from '@/context/UserContext';

const UserProfile = () => {
  const { user } = useUser();

  return <div>{user ? `Email: ${user}` : 'Not logged in'}</div>;
};

export default UserProfile;
