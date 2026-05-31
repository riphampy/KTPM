import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../utils/api';

function AdminSessions() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await api.get('/schedules/all');
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phiên khám này? (Có thể ảnh hưởng nếu đã có bệnh nhân đặt)')) return;
    try {
      await api.delete(`/schedules/${id}`);
      fetchSchedules();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Lỗi khi xóa');
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Quản lý Phiên khám</Typography>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày khám</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ca khám</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Bác sĩ</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{new Date(row.date).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{row.shift}</TableCell>
                <TableCell>{row.doctorId?.name}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: row.isAvailable ? 'green' : 'red', fontWeight: 'bold' }}>
                    {row.isAvailable ? 'Đang trống' : 'Đã được đặt'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton color="error" onClick={() => handleDelete(row._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {schedules.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">Chưa có dữ liệu</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AdminSessions;
