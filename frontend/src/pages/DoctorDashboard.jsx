import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, TextField, MenuItem, Select, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab } from '@mui/material';
import api from '../utils/api';

function DoctorDashboard({ user, activeTab }) {
  const [date, setDate] = useState('');
  const [shift, setShift] = useState('Morning');
  const [schedules, setSchedules] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState('');
  const [notes, setNotes] = useState('');
  const [fee, setFee] = useState(150000);
  const [sharedRecords, setSharedRecords] = useState([]);
  const [openRecordsDialog, setOpenRecordsDialog] = useState(false);

  const fetchSchedules = async () => {
    try {
      const res = await api.get(`/schedules/doctor/${user.id}`);
      setSchedules(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/appointments/my`);
      setAppointments(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchSchedules();
    fetchAppointments();
  }, [user.id]);

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post('/schedules', { date, shift });
      alert('Thêm lịch làm việc thành công');
      fetchSchedules();
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/appointments/${appId}/status`, { status: newStatus });
      fetchAppointments();
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handlePrescribe = (app) => {
    setSelectedAppt(app);
    setOpenDialog(true);
  };

  const handleViewRecords = async (patient) => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/records/${patient._id}`);
      setSharedRecords(res.data);
      setOpenRecordsDialog(true);
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const submitPrescription = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/prescriptions', {
        appointmentId: selectedAppt._id,
        diagnosis,
        medications: [{ name: medications, dosage: 'Theo chỉ định', duration: '7 ngày', instructions: '' }],
        notes,
        fee
      });
      alert('Kê đơn thành công!');
      setOpenDialog(false);
      setDiagnosis(''); setMedications(''); setNotes(''); setFee(150000);
      fetchAppointments(); // refresh
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const pendingAppts = appointments.filter(a => a.status === 'Pending');
  const confirmedAppts = appointments.filter(a => a.status === 'Confirmed');
  const historyAppts = appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Box className="edoc-header">
        <Typography variant="h4" fontWeight="bold">Bảng điều khiển Bác sĩ</Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.8 }}>Xin chào bác sĩ {user.name || ''}, chúc bạn một ngày làm việc hiệu quả!</Typography>
      </Box>

      {/* Tab 0: Lịch làm việc */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">Đăng ký lịch rảnh</Typography>
              <form onSubmit={handleAddSchedule}>
                <TextField fullWidth type="date" margin="normal" value={date} onChange={(e) => setDate(e.target.value)} required />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Ca làm việc</InputLabel>
                  <Select value={shift} onChange={(e) => setShift(e.target.value)} label="Ca làm việc">
                    <MenuItem value="Morning">Sáng (07:30 - 11:30)</MenuItem>
                    <MenuItem value="Afternoon">Chiều (13:30 - 17:30)</MenuItem>
                    <MenuItem value="Evening">Tối (18:00 - 21:00)</MenuItem>
                  </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Thêm lịch</Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">Lịch rảnh hiện tại</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ngày</TableCell>
                      <TableCell>Ca làm việc</TableCell>
                      <TableCell>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schedules.map(s => (
                      <TableRow key={s._id}>
                        <TableCell>{new Date(s.date).toLocaleDateString()}</TableCell>
                        <TableCell>{s.shift}</TableCell>
                        <TableCell>
                          <Typography color={s.isAvailable ? 'primary' : 'error'} variant="body2" fontWeight="bold">
                            {s.isAvailable ? 'Còn trống' : 'Đã kín'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    {schedules.length === 0 && <TableRow><TableCell colSpan={3}>Chưa có lịch rảnh</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Tab 1: Chờ duyệt */}
      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">Lịch hẹn chờ xác nhận</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bệnh nhân</TableCell>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Ca</TableCell>
                  <TableCell>Triệu chứng</TableCell>
                  <TableCell align="right">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingAppts.map(app => (
                  <TableRow key={app._id}>
                    <TableCell>{app.patientId?.name}</TableCell>
                    <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
                    <TableCell>{app.shift}</TableCell>
                    <TableCell>{app.symptoms}</TableCell>
                    <TableCell align="right">
                      <Button className="btn-soft" size="small" variant="contained" sx={{ mr: 1 }} onClick={() => handleStatusChange(app._id, 'Confirmed')}>Nhận khám</Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => handleStatusChange(app._id, 'Cancelled')}>Hủy bỏ</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {pendingAppts.length === 0 && <TableRow><TableCell colSpan={5} align="center">Không có lịch chờ duyệt.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Tab 2: Hôm nay khám */}
      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">Bệnh nhân cần khám</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bệnh nhân</TableCell>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Ca</TableCell>
                  <TableCell>Triệu chứng</TableCell>
                  <TableCell align="right">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {confirmedAppts.map(app => (
                  <TableRow key={app._id}>
                    <TableCell fontWeight="bold">{app.patientId?.name}</TableCell>
                    <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
                    <TableCell>{app.shift}</TableCell>
                    <TableCell>{app.symptoms}</TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" color="info" sx={{ mr: 1 }} onClick={() => handleViewRecords(app.patientId)}>Xem Hồ Sơ</Button>
                      <Button className="btn-soft" size="small" variant="contained" onClick={() => handlePrescribe(app)}>Khám & Kê đơn</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {confirmedAppts.length === 0 && <TableRow><TableCell colSpan={5} align="center">Không có ca khám nào đã xác nhận.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Tab 3: Lịch sử */}
      {activeTab === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">Lịch sử khám bệnh</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bệnh nhân</TableCell>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Ca</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyAppts.map(app => (
                  <TableRow key={app._id}>
                    <TableCell>{app.patientId?.name}</TableCell>
                    <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
                    <TableCell>{app.shift}</TableCell>
                    <TableCell>
                      <Typography color={app.status === 'Completed' ? 'green' : 'error'} fontWeight="bold" variant="body2">
                        {app.status === 'Completed' ? 'Đã hoàn thành' : 'Đã hủy'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
                {historyAppts.length === 0 && <TableRow><TableCell colSpan={4} align="center">Chưa có lịch sử.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Dialog Kê Đơn */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>Kê đơn cho {selectedAppt?.patientId?.name}</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField margin="dense" label="Chẩn đoán bệnh" fullWidth value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
          <TextField margin="dense" label="Thuốc (Tên thuốc - Liều lượng)" fullWidth value={medications} onChange={e => setMedications(e.target.value)} />
          <TextField margin="dense" label="Ghi chú thêm" fullWidth multiline rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
          <TextField margin="dense" label="Phí khám bệnh (VNĐ)" type="number" fullWidth value={fee} onChange={e => setFee(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={submitPrescription} variant="contained" color="primary">Hoàn tất Khám & Lưu đơn</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Hồ sơ dùng chung */}
      <Dialog open={openRecordsDialog} onClose={() => setOpenRecordsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: 'info.main', color: 'white' }}>Hồ sơ sức khỏe liên khoa</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {sharedRecords.length === 0 ? (
            <Typography>Bệnh nhân chưa có lịch sử khám bệnh nào.</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Ngày khám</TableCell>
                    <TableCell>Khoa</TableCell>
                    <TableCell>Bác sĩ</TableCell>
                    <TableCell>Chẩn đoán</TableCell>
                    <TableCell>Đơn thuốc</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sharedRecords.map(record => (
                    <TableRow key={record._id}>
                      <TableCell>{new Date(record.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{record.doctorId?.departmentId?.name || 'Chưa rõ'}</TableCell>
                      <TableCell>{record.doctorId?.name}</TableCell>
                      <TableCell>{record.diagnosis}</TableCell>
                      <TableCell>{record.medications?.map(m => m.name).join(', ')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenRecordsDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DoctorDashboard;
