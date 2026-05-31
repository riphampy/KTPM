import React from 'react';
import { Box, Typography, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PeopleIcon from '@mui/icons-material/People';

function Sidebar({ activeTab, setActiveTab }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Define role display name
  let roleDisplay = 'Khách';
  if (user.role === 'admin') roleDisplay = 'Quản trị viên';
  if (user.role === 'doctor') roleDisplay = 'Bác sĩ';
  if (user.role === 'patient') roleDisplay = 'Bệnh nhân';

  // Customize menu items based on role
  let menuItems = [];
  
  if (user.role === 'admin') {
    menuItems = [
      { text: 'Trang chủ', icon: <DashboardIcon />, index: 0 },
      { text: 'Bác sĩ', icon: <LocalHospitalIcon />, index: 1 },
      { text: 'Lịch làm việc', icon: <EventAvailableIcon />, index: 2 },
      { text: 'Lịch hẹn', icon: <BookOnlineIcon />, index: 3 },
      { text: 'Bệnh nhân', icon: <PeopleIcon />, index: 4 }
    ];
  } else if (user.role === 'doctor') {
    menuItems = [
      { text: 'Lịch làm việc của tôi', icon: <EventAvailableIcon />, index: 0 },
      { text: 'Chờ duyệt', icon: <BookOnlineIcon />, index: 1 },
      { text: 'Hôm nay khám', icon: <PeopleIcon />, index: 2 },
      { text: 'Lịch sử khám', icon: <DashboardIcon />, index: 3 }
    ];
  } else if (user.role === 'patient') {
    menuItems = [
      { text: 'Đặt Lịch Khám', icon: <EventAvailableIcon />, index: 0 },
      { text: 'Lịch hẹn của tôi', icon: <BookOnlineIcon />, index: 1 },
      { text: 'Hồ sơ & Đơn thuốc', icon: <LocalHospitalIcon />, index: 2 }
    ];
  }

  return (
    <Box sx={{ width: '250px', height: '100vh', borderRight: '1px solid #e0e0e0', bgcolor: '#fff', display: 'flex', flexDirection: 'column', pt: 4 }}>
      {/* Profile Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 3, mb: 3 }}>
        <Avatar sx={{ width: 50, height: 50, bgcolor: '#e0e0e0', color: '#555', mr: 2 }} />
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{user.name || roleDisplay}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>{roleDisplay}</Typography>
        </Box>
      </Box>

      {/* Logout Button */}
      <Box sx={{ px: 3, mb: 4 }}>
        <Button 
          fullWidth 
          variant="contained" 
          disableElevation 
          onClick={handleLogout}
          sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 'bold', textTransform: 'none', '&:hover': { bgcolor: '#bbdefb' } }}
        >
          Đăng xuất
        </Button>
      </Box>

      {/* Menu Items */}
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => {
          const isActive = activeTab === item.index;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                onClick={() => setActiveTab(item.index)}
                sx={{ 
                  borderRadius: '4px',
                  bgcolor: isActive ? '#f5f5f5' : 'transparent',
                  borderLeft: isActive ? '4px solid #0056D2' : '4px solid transparent',
                  pl: isActive ? '12px' : '16px', // adjust padding due to border
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive ? '#0056D2' : '#757575' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#0056D2' : 'text.primary' }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export default Sidebar;
