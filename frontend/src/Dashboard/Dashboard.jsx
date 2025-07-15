import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Side from './Side/Side';
import { logout } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col w-full">
        <Side />
      </div>
    </>
  );
};

export default Dashboard;
