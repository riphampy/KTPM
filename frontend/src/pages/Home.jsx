import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Home() {
  return (
    <Box sx={{
      height: '100vh',
      width: '100%',
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/hero-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar />
      
      <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: 'white' }}>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 800, mb: 2 }}>
          Tránh Phiền Toái & Chờ Đợi.
        </Typography>
        
        <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, mb: 1, maxWidth: '800px' }}>
          Sức khỏe của bạn hôm nay thế nào? Trông có vẻ không được tốt!
        </Typography>
        
        <Typography variant="body1" sx={{ fontWeight: 400, opacity: 0.8, mb: 4, maxWidth: '800px', lineHeight: 1.6 }}>
          Đừng lo lắng. Tìm bác sĩ trực tuyến và Đặt lịch hẹn theo ý muốn với eHospital.<br />
          Chúng tôi cung cấp dịch vụ khám bệnh miễn phí, Hãy đặt lịch hẹn ngay bây giờ.
        </Typography>

        <Button variant="contained" color="primary" size="large" component={Link} to="/login" sx={{ px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}>
          Đặt Lịch Khám
        </Button>
      </Container>
      
      <Box sx={{ width: '100%', textAlign: 'center', pb: 2 }}>
        <Typography variant="body2" sx={{ color: 'white', opacity: 0.7 }}>
          Một giải pháp web bởi Smart Hospital.
        </Typography>
      </Box>
    </Box>
  );
}

export default Home;
