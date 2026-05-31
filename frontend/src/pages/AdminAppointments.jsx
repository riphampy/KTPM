import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import api from '../utils/api';

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments/all');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Pending': return <Chip label="Chờ duyệt" color="warning" size="small" />;
      case 'Confirmed': return <Chip label="Đã xác nhận" color="primary" size="small" />;
      case 'Completed': return <Chip label="Hoàn thành" color="success" size="small" />;
      case 'Cancelled': return <Chip label="Đã hủy" color="error" size="small" />;
      default: return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Quản lý Lịch hẹn</Typography>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Bệnh nhân</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Bác sĩ</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày khám</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ca khám</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Triệu chứng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.patientId?.name}</TableCell>
                <TableCell>{row.doctorId?.name}</TableCell>
                <TableCell>{new Date(row.date).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{row.shift}</TableCell>
                <TableCell>{row.symptoms}</TableCell>
                <TableCell align="center">{getStatusChip(row.status)}</TableCell>
              </TableRow>
            ))}
            {appointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">Chưa có dữ liệu</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AdminAppointments;
