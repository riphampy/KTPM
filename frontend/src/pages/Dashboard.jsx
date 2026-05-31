import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';
import AdminDashboard from './AdminDashboard';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
      {user.role === 'doctor' && <DoctorDashboard user={user} />}
      {user.role === 'patient' && <PatientDashboard user={user} />}
      {user.role === 'admin' && <AdminDashboard />}
      
    </Container>
  );
}

export default Dashboard;
