import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <AppBar position="sticky" color="primary" elevation={0} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
      <Toolbar>
        <LocalHospitalIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 700 }}>
          SMART HOSPITAL
        </Typography>
        <Box>
          {!token ? (
            <>
              <Button color="inherit" component={Link} to="/login" sx={{ mr: 1 }}>Đăng nhập</Button>
              <Button variant="contained" color="secondary" component={Link} to="/register" disableElevation>Đăng ký</Button>
            </>
          ) : (
            <>
              <Typography variant="body1" component="span" sx={{ mr: 2 }}>
                Xin chào, <strong>{user.name}</strong>
              </Typography>
              <Button color="inherit" component={Link} to="/dashboard" sx={{ mr: 1 }}>Quản lý</Button>
              <Button variant="outlined" color="inherit" onClick={handleLogout}>Đăng xuất</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
