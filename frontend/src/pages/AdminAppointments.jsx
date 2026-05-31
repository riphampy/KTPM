import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Select, MenuItem } from '@mui/material';
import api from '../utils/api';
import { toast } from 'react-toastify';

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
      toast.error(err.response?.data?.message || 'Lỗi tải danh sách lịch hẹn');
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

  const handlePaymentChange = async (id, newStatus) => {
    try {
      await api.put(`/appointments/${id}/payment-status`, { paymentStatus: newStatus });
      toast.success('Cập nhật thanh toán thành công');
      fetchAppointments();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Lỗi cập nhật thanh toán');
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
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Thanh toán</TableCell>
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
                <TableCell align="center">
                  <Select
                    size="small"
                    value={row.paymentStatus || 'Unpaid'}
                    onChange={(e) => handlePaymentChange(row._id, e.target.value)}
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="Unpaid">Chưa TT</MenuItem>
                    <MenuItem value="Paid">Đã TT</MenuItem>
                    <MenuItem value="Refunded">Đã Hoàn</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {appointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">Chưa có dữ liệu</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AdminAppointments;
