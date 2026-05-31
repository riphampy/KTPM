import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, TextField, Button, InputAdornment, Tabs, Tab } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import api from '../utils/api';
import AdminDoctors from './AdminDoctors';
import AdminSessions from './AdminSessions';
import AdminAppointments from './AdminAppointments';
import AdminPatients from './AdminPatients';

function AdminDashboard({ activeTab, setActiveTab }) {
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, totalAppointments: 0, todaySessions: 0, totalRevenue: 0 });
  const [upcomingAppts, setUpcomingAppts] = useState([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [dashboardTab, setDashboardTab] = useState(0);

  useEffect(() => {
    if (activeTab === 0) {
      fetchStats();
      fetchUpcoming();
    }
  }, [activeTab]);

  const fetchUpcoming = async () => {
    try {
      const [appRes, schRes] = await Promise.all([
        api.get('/appointments/all'),
        api.get('/schedules/all')
      ]);
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Start of today
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);

      const apps = appRes.data
        .filter(a => new Date(a.date) >= now && new Date(a.date) <= nextWeek && a.status !== 'Cancelled')
        .slice(0, 5);
      const schs = schRes.data
        .filter(s => new Date(s.date) >= now && new Date(s.date) <= nextWeek)
        .slice(0, 5);
      
      setUpcomingAppts(apps);
      setUpcomingSchedules(schs);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/reports/stats');
      if (res.data) {
        setStats({
          totalDoctors: res.data.totalDoctors || 0,
          totalPatients: res.data.totalPatients || 0,
          totalAppointments: res.data.completedAppointments || 0,
          todaySessions: 0, // Mocking today sessions
          totalRevenue: res.data.totalRevenue || 0
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
    { title: 'Doanh thu', count: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue || 0), icon: <AccountBalanceWalletIcon color="primary" /> },
  ];

  if (activeTab === 1) return <Box sx={{ width: '100%', px: 2 }}><AdminDoctors /></Box>;
  if (activeTab === 2) return <Box sx={{ width: '100%', px: 2 }}><AdminSessions /></Box>;
  if (activeTab === 3) return <Box sx={{ width: '100%', px: 2 }}><AdminAppointments /></Box>;
  if (activeTab === 4) return <Box sx={{ width: '100%', px: 2 }}><AdminPatients /></Box>;


  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 3 }, width: '100%' }}>
      {/* Topbar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
        <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, mr: 4 }}>
          <TextField 
            fullWidth 
            size="small" 
            placeholder="Tìm kiếm tên Bác sĩ, Bệnh nhân hoặc Email..."
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#9e9e9e', ml: 1 }} /></InputAdornment>,
              sx: { 
                bgcolor: '#fff', 
                borderRadius: '50px', 
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                '& fieldset': { border: 'none' }
              }
            }}
          />
          <Button variant="contained" disableElevation sx={{ borderRadius: '50px', textTransform: 'none', px: 4, fontWeight: 'bold', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: '40px', flexShrink: 0, whiteSpace: 'nowrap' }}>
            Tìm kiếm
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
        {statusCards.map((card, idx) => (
          <Card key={idx} elevation={0} sx={{ flex: '1 1 0', minWidth: '160px', p: 2, border: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" color="primary" fontWeight="bold">{card.count}</Typography>
              <Typography variant="body2" color="text.secondary" fontWeight="bold">{card.title}</Typography>
            </Box>
            <Box sx={{ bgcolor: '#f5f5f5', p: 1.5, borderRadius: 1 }}>
              {card.icon}
            </Box>
          </Card>
        ))}
      </Box>

      {/* Upcoming Sections */}
      <Box sx={{ mt: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={dashboardTab} onChange={(e, newValue) => setDashboardTab(newValue)} textColor="primary" indicatorColor="primary">
            <Tab label="Lịch hẹn sắp tới" sx={{ fontWeight: 'bold', fontSize: '15px', textTransform: 'none' }} />
            <Tab label="Phiên khám sắp tới" sx={{ fontWeight: 'bold', fontSize: '15px', textTransform: 'none' }} />
          </Tabs>
        </Box>

        {/* Appointments Tab */}
        {dashboardTab === 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Truy cập nhanh Lịch hẹn sắp tới trong 7 ngày. Chi tiết có trong phần @Lịch hẹn.
            </Typography>
            
            <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', borderBottom: '2px solid #0056D2', p: 2, bgcolor: '#f5f9ff' }}>
                <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 'bold' }} align="center">Mã lịch hẹn</Typography>
                <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 'bold' }} align="center">Tên bệnh nhân</Typography>
                <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 'bold' }} align="center">Bác sĩ</Typography>
                <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 'bold' }} align="center">Phiên khám</Typography>
              </Box>
              {upcomingAppts.length === 0 ? (
                <Box sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/empty-state.png" alt="Empty state" style={{ height: '120px' }} />
                </Box>
              ) : (
                <Box>
                  {upcomingAppts.map(app => (
                    <Box key={app._id} sx={{ display: 'flex', borderBottom: '1px solid #eee', p: 2 }}>
                      <Typography variant="body2" sx={{ flex: 1 }} align="center">#{app._id.substring(app._id.length - 6).toUpperCase()}</Typography>
                      <Typography variant="body2" sx={{ flex: 1 }} align="center">{app.patientId?.name || 'N/A'}</Typography>
                      <Typography variant="body2" sx={{ flex: 1 }} align="center">{app.doctorId?.name || 'N/A'}</Typography>
                      <Typography variant="body2" sx={{ flex: 1 }} align="center">{new Date(app.date).toLocaleDateString('vi-VN')} {app.shift}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
              <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderTop: '1px solid #eee' }}>
                <Button fullWidth variant="contained" color="primary" disableElevation sx={{ borderRadius: 1.5, py: 1.2, fontWeight: 'bold' }} onClick={() => setActiveTab && setActiveTab(3)}>
                  Xem tất cả Lịch hẹn
                </Button>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Sessions Tab */}
        {dashboardTab === 1 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Truy cập nhanh Phiên khám đã được lên lịch trong 7 ngày. Thêm, Xóa và nhiều tính năng khác trong phần @Lịch làm việc.
            </Typography>
            
            <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', borderBottom: '2px solid #0056D2', p: 2, bgcolor: '#f5f9ff' }}>
                <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 'bold' }} align="center">Tiêu đề phiên</Typography>
                <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 'bold' }} align="center">Bác sĩ</Typography>
                <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 'bold' }} align="center">Ngày & Giờ</Typography>
              </Box>
              {upcomingSchedules.length === 0 ? (
                <Box sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/empty-state.png" alt="Empty state" style={{ height: '120px' }} />
                </Box>
              ) : (
                <Box>
                  {upcomingSchedules.map(sch => (
                    <Box key={sch._id} sx={{ display: 'flex', borderBottom: '1px solid #eee', p: 2 }}>
                      <Typography variant="body2" sx={{ flex: 1 }} align="center">Phiên khám {sch.shift}</Typography>
                      <Typography variant="body2" sx={{ flex: 1 }} align="center">{sch.doctorId?.name || 'N/A'}</Typography>
                      <Typography variant="body2" sx={{ flex: 1 }} align="center">{new Date(sch.date).toLocaleDateString('vi-VN')} {sch.shift}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
              <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderTop: '1px solid #eee' }}>
                <Button fullWidth variant="contained" color="primary" disableElevation sx={{ borderRadius: 1.5, py: 1.2, fontWeight: 'bold' }} onClick={() => setActiveTab && setActiveTab(2)}>
                  Xem tất cả Phiên khám
                </Button>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default AdminDashboard;
