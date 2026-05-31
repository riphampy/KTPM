import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';
import AdminDashboard from './AdminDashboard';
import Sidebar from '../components/Sidebar';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f7f9fd' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
        {user.role === 'doctor' && <DoctorDashboard user={user} activeTab={activeTab} />}
        {user.role === 'patient' && <PatientDashboard user={user} activeTab={activeTab} />}
        {user.role === 'admin' && <AdminDashboard activeTab={activeTab} />}
      </Box>
    </Box>
  );
}

export default Dashboard;
