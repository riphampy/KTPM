import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <AppBar position="absolute" elevation={0} sx={{ background: 'transparent', zIndex: 10 }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 8 }, py: 1 }}>
        <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'white', fontWeight: 'normal', display: 'flex', alignItems: 'center' }}>
          <b style={{ fontWeight: 800, fontSize: '1.4rem', marginRight: '4px' }}>eHospital.</b>
          <span style={{ fontSize: '0.8rem', letterSpacing: '1px', opacity: 0.9 }}>| THE ECHANNELING PROJECT</span>
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {token ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard" sx={{ color: 'white', fontWeight: 600 }}>QUẢN LÝ</Button>
              <Button color="inherit" onClick={handleLogout} sx={{ color: 'white', fontWeight: 600 }}>ĐĂNG XUẤT</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login" sx={{ color: 'white', fontWeight: 600 }}>ĐĂNG NHẬP</Button>
              <Button color="inherit" component={Link} to="/register" sx={{ color: 'white', fontWeight: 600 }}>ĐĂNG KÝ</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
