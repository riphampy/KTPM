import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, TextField, Button, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import TimelineIcon from '@mui/icons-material/Timeline';
import api from '../utils/api';

function AdminDashboard({ activeTab }) {
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, totalAppointments: 0, todaySessions: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/reports/stats');
      if (res.data) {
        setStats({
          totalDoctors: res.data.totalDoctors || 0,
          totalPatients: res.data.totalPatients || 0,
          totalAppointments: res.data.completedAppointments || 0,
          todaySessions: 0 // Mocking today sessions
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const statusCards = [
    { title: 'Bác sĩ', count: stats.totalDoctors, icon: <LocalHospitalIcon color="primary" /> },
    { title: 'Bệnh nhân', count: stats.totalPatients, icon: <PeopleIcon color="primary" /> },
    { title: 'Lịch mới', count: stats.totalAppointments, icon: <BookOnlineIcon color="primary" /> },
    { title: 'Phiên khám h.nay', count: stats.todaySessions, icon: <TimelineIcon color="primary" /> },
  ];

  if (activeTab !== 0) {
    return <Typography sx={{ mt: 5 }} align="center">Nội dung tab {activeTab} đang được xây dựng. Vui lòng chọn Trang chủ.</Typography>;
  }

  return (
    <Box sx={{ width: '100%', px: 2 }}>
      {/* Topbar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
        <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, maxWidth: '600px' }}>
          <TextField 
            fullWidth 
            size="small" 
            placeholder="Tìm kiếm tên Bác sĩ hoặc Email"
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
              sx: { bgcolor: '#fff' }
            }}
          />
          <Button variant="contained" disableElevation sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 'bold', minWidth: '100px' }}>
            Tìm kiếm
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">Ngày hôm nay</Typography>
            <Typography variant="body1" fontWeight="bold">{new Date().toISOString().split('T')[0]}</Typography>
          </Box>
          <Paper elevation={0} sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <CalendarTodayIcon />
          </Paper>
        </Box>
      </Box>

      {/* Status Section */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Trạng thái</Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {statusCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h4" color="primary" fontWeight="bold">{card.count}</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight="bold">{card.title}</Typography>
              </Box>
              <Box sx={{ bgcolor: '#f5f5f5', p: 1.5, borderRadius: 1 }}>
                {card.icon}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Upcoming Sections */}
      <Grid container spacing={4}>
        {/* Appointments */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" color="primary" fontWeight="bold" align="center" gutterBottom>
            Lịch hẹn sắp tới cho đến Thứ Sáu tuần sau
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Truy cập nhanh Lịch hẹn sắp tới trong 7 ngày.<br/>
            Chi tiết có trong phần @Lịch hẹn.
          </Typography>
          
          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', borderBottom: '2px solid #0056D2', p: 2 }}>
              <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 'bold' }} align="center">Mã lịch hẹn</Typography>
              <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 'bold' }} align="center">Tên bệnh nhân</Typography>
              <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 'bold' }} align="center">Bác sĩ</Typography>
              <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 'bold' }} align="center">Phiên khám</Typography>
            </Box>
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
              <img src="/empty-state.png" alt="Empty state" style={{ height: '120px' }} />
            </Box>
            <Button fullWidth variant="contained" color="primary" disableElevation sx={{ borderRadius: 0, py: 1.5, fontWeight: 'bold' }}>
              Xem tất cả Lịch hẹn
            </Button>
          </Paper>
        </Grid>

        {/* Sessions */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" color="primary" fontWeight="bold" align="center" gutterBottom>
            Phiên khám sắp tới cho đến Thứ Sáu tuần sau
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Truy cập nhanh Phiên khám đã được lên lịch trong 7 ngày.<br/>
            Thêm, Xóa và nhiều tính năng khác trong phần @Lịch làm việc.
          </Typography>
          
          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', borderBottom: '2px solid #0056D2', p: 2 }}>
              <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 'bold' }} align="center">Tiêu đề phiên</Typography>
              <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 'bold' }} align="center">Bác sĩ</Typography>
              <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 'bold' }} align="center">Ngày & Giờ</Typography>
            </Box>
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
              <img src="/empty-state.png" alt="Empty state" style={{ height: '120px' }} />
            </Box>
            <Button fullWidth variant="contained" color="primary" disableElevation sx={{ borderRadius: 0, py: 1.5, fontWeight: 'bold' }}>
              Xem tất cả Phiên khám
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
