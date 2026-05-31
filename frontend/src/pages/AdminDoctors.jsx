import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../utils/api';

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', email: '', password: '', role: 'doctor' });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/users/doctors');
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchDoctors();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi xóa');
    }
  };

  const handleAdd = async () => {
    try {
      await api.post('/users', newDoctor);
      setOpen(false);
      setNewDoctor({ name: '', email: '', password: '', role: 'doctor' });
      fetchDoctors();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi thêm');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Quản lý Bác sĩ</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Thêm Bác sĩ</Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Họ và tên</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Vai trò</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>Bác sĩ</TableCell>
                <TableCell align="center">
                  <IconButton color="error" onClick={() => handleDelete(row._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {doctors.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">Chưa có dữ liệu</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Thêm Bác sĩ mới</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Họ và tên" fullWidth value={newDoctor.name} onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} />
          <TextField margin="dense" label="Email" type="email" fullWidth value={newDoctor.email} onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })} />
          <TextField margin="dense" label="Mật khẩu (mặc định: 123456)" type="password" fullWidth value={newDoctor.password} onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button onClick={handleAdd} variant="contained">Thêm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminDoctors;
