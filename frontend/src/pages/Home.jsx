import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import DescriptionIcon from '@mui/icons-material/Description';

function Home() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        py: { xs: 8, md: 12 },
        textAlign: 'center',
        background: 'linear-gradient(135deg, #00838F 0%, #005662 100%)'
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="700" sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
            Hệ Thống Quản Lý Bệnh Viện Thông Minh
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
            Chăm sóc sức khỏe toàn diện bằng công nghệ số. Đặt lịch khám nhanh chóng, quản lý hồ sơ y tế an toàn và kết nối trực tiếp với các chuyên gia y tế hàng đầu.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Button variant="contained" color="secondary" size="large" component={Link} to="/dashboard" sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: '30px' }}>
                Đặt Lịch Khám
              </Button>
            ) : (
              <>
                <Button variant="contained" color="secondary" size="large" component={Link} to="/login" sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: '30px' }}>
                  Đặt Lịch Ngay
                </Button>
                <Button variant="outlined" color="inherit" size="large" component={Link} to="/login" sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: '30px' }}>
                  Dành cho Bác sĩ
                </Button>
              </>
            )}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold" sx={{ mb: 6 }}>
          Tiện ích Nổi bật
        </Typography>
        <Grid container spacing={4} alignItems="stretch" sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
          <Grid item xs={4}>
            <Paper elevation={2} sx={{ width: '100%', height: '100%', minHeight: '260px', p: 4, textAlign: 'center', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ bgcolor: '#e0f7fa', p: 2, borderRadius: '50%', mb: 2 }}>
                <CalendarMonthIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">Đặt Lịch Khám</Typography>
              <Typography color="text.secondary">Chủ động chọn bác sĩ, chuyên khoa và khung giờ phù hợp nhất với bạn chỉ trong vài cú click.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={2} sx={{ width: '100%', height: '100%', minHeight: '260px', p: 4, textAlign: 'center', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ bgcolor: '#e0f7fa', p: 2, borderRadius: '50%', mb: 2 }}>
                <DescriptionIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">Hồ Sơ Điện Tử</Typography>
              <Typography color="text.secondary">Lưu trữ và theo dõi toàn bộ bệnh án, đơn thuốc, lịch sử khám bệnh một cách an toàn và bảo mật.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={2} sx={{ width: '100%', height: '100%', minHeight: '260px', p: 4, textAlign: 'center', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ bgcolor: '#e0f7fa', p: 2, borderRadius: '50%', mb: 2 }}>
                <VideoCameraFrontIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">Hỗ trợ Liên tục</Typography>
              <Typography color="text.secondary">Luôn sẵn sàng hỗ trợ bệnh nhân thông qua hệ thống thông báo tự động và kết nối từ xa.</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
