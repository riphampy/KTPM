import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, List, ListItem, ListItemText, ListItemButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab, Chip } from '@mui/material';
import api from '../utils/api';

function PatientDashboard({ user, activeTab }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [symptoms, setSymptoms] = useState('');

  useEffect(() => {
    fetchDoctors();
    fetchMyAppointments();
    fetchPrescriptions();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/users/doctors');
      setDoctors(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchMyAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/appointments/my`);
      setAppointments(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/prescriptions/patient/${user.id}`);
      setPrescriptions(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSelectDoctor = async (doctor) => {
    setSelectedDoctor(doctor);
    try {
      const res = await api.get(`/schedules/doctor/${doctor._id}`);
      setSchedules(res.data);
    } catch (err) { console.error(err); }
  };

  const handleBookClick = (schedule) => {
    setSelectedSchedule(schedule);
    setOpenDialog(true);
  };

  const submitBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/appointments', {
        doctorId: selectedDoctor._id,
        scheduleId: selectedSchedule._id,
        date: selectedSchedule.date,
        shift: selectedSchedule.shift,
        symptoms
      });
      alert('Đặt lịch thành công! Vui lòng chờ bác sĩ xác nhận.');
      setOpenDialog(false);
      setSymptoms('');
      fetchMyAppointments();
      handleSelectDoctor(selectedDoctor);
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Pending') return 'warning';
    if (status === 'Confirmed') return 'info';
    if (status === 'Completed') return 'success';
    return 'error';
  };

  const getStatusText = (status) => {
    if (status === 'Pending') return 'Đang chờ duyệt';
    if (status === 'Confirmed') return 'Đã xác nhận';
    if (status === 'Completed') return 'Đã khám xong';
    return 'Đã hủy';
  };

  return (
    <Box>
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">Chọn Bác sĩ</Typography>
              <List>
                {doctors.map(doc => (
                  <ListItem disablePadding key={doc._id}>
                    <ListItemButton selected={selectedDoctor?._id === doc._id} onClick={() => handleSelectDoctor(doc)}>
                      <ListItemText primary={`BS. ${doc.name}`} secondary={doc.email} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            {selectedDoctor ? (
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">Lịch rảnh của BS. {selectedDoctor.name}</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>Vui lòng chọn một ca phù hợp để đặt lịch.</Typography>
                {schedules.length === 0 ? <Typography>Bác sĩ chưa có lịch rảnh nào sắp tới.</Typography> : (
                  <List>
                    {schedules.map(sch => (
                      <ListItem key={sch._id} sx={{ borderBottom: '1px solid #f0f0f0', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', py: 2 }}>
                        <ListItemText 
                          primary={new Date(sch.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} 
                          secondary={`Ca làm việc: ${sch.shift}`} 
                          sx={{ mb: { xs: 2, sm: 0 }, mr: 2 }}
                        />
                        <Button variant="contained" size="small" onClick={() => handleBookClick(sch)} sx={{ whiteSpace: 'nowrap' }}>Đặt lịch ngay</Button>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            ) : (
              <Paper sx={{ p: 4, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" color="textSecondary">👈 Vui lòng chọn một bác sĩ bên danh sách để xem lịch</Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">Lịch hẹn của tôi</Typography>
          <List>
            {appointments.map(app => (
              <ListItem key={app._id} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, mb: 2 }}>
                <ListItemText 
                  primary={<Typography variant="subtitle1" fontWeight="bold">Khám với BS. {app.doctorId?.name}</Typography>}
                  secondary={
                    <React.Fragment>
                      <Typography variant="body2" component="span" display="block">Ngày: {new Date(app.date).toLocaleDateString()} - Ca: {app.shift}</Typography>
                      <Typography variant="body2" component="span" display="block">Triệu chứng: {app.symptoms}</Typography>
                    </React.Fragment>
                  } 
                />
                <Chip label={getStatusText(app.status)} color={getStatusColor(app.status)} variant="outlined" />
              </ListItem>
            ))}
            {appointments.length === 0 && <Typography>Bạn chưa có lịch hẹn nào.</Typography>}
          </List>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">Đơn thuốc & Chẩn đoán</Typography>
          <Grid container spacing={3}>
            {prescriptions.map(pres => (
              <Grid item xs={12} md={6} key={pres._id}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary">Khám ngày {new Date(pres.createdAt).toLocaleDateString()}</Typography>
                  <Typography variant="body2" gutterBottom><strong>Bác sĩ:</strong> {pres.doctorId?.name}</Typography>
                  <Typography variant="body2" gutterBottom><strong>Chẩn đoán:</strong> {pres.diagnosis}</Typography>
                  <Typography variant="body2" gutterBottom><strong>Ghi chú:</strong> {pres.notes}</Typography>
                  
                  <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 'bold' }}>Thuốc được kê:</Typography>
                  <ul>
                    {pres.medications.map((med, idx) => (
                      <li key={idx}><Typography variant="body2">{med.name} - {med.dosage}</Typography></li>
                    ))}
                  </ul>
                </Paper>
              </Grid>
            ))}
            {prescriptions.length === 0 && <Typography sx={{ p: 2 }}>Chưa có đơn thuốc nào.</Typography>}
          </Grid>
        </Paper>
      )}

      {/* Dialog Xác nhận Đặt Lịch */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>Xác nhận Đặt lịch khám</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Bác sĩ: {selectedDoctor?.name}</Typography>
          <Typography variant="body1" gutterBottom>Thời gian: {selectedSchedule && new Date(selectedSchedule.date).toLocaleDateString()} - Ca {selectedSchedule?.shift}</Typography>
          <TextField
            autoFocus
            margin="normal"
            label="Mô tả Triệu chứng bệnh"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
            placeholder="Bạn đang cảm thấy thế nào..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)}>Hủy bỏ</Button>
          <Button onClick={submitBooking} variant="contained" color="primary">Xác nhận Đặt lịch</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PatientDashboard;
