import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Select, MenuItem, FormControl, Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Male');
  const [address, setAddress] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name, email, password, role, phone, dateOfBirth, gender, address, bloodType
      });
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký');
    }
  };

  const InputLabelUI = ({ children }) => (
    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>{children}</Typography>
  );

  const inputStyles = { mb: 3, bgcolor: '#fafafa', '& fieldset': { borderColor: '#e0e0e0' } };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F7F9FD', py: 4 }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, width: '100%', maxWidth: '600px', borderRadius: '4px', border: '1px solid #ebebeb' }}>
        <Typography component="h1" variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
          Bắt đầu ngay
        </Typography>
        <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 4 }}>
          Thêm thông tin cá nhân của bạn để tiếp tục
        </Typography>

        <Box component="form" onSubmit={handleRegister}>
          {error && <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <InputLabelUI>Họ và tên:</InputLabelUI>
              <TextField fullWidth size="small" placeholder="Tên" required value={name} onChange={(e) => setName(e.target.value)} sx={inputStyles} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabelUI>Địa chỉ Email:</InputLabelUI>
              <TextField fullWidth size="small" placeholder="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} sx={inputStyles} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <InputLabelUI>Mật khẩu:</InputLabelUI>
              <TextField fullWidth size="small" placeholder="Mật khẩu" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} sx={inputStyles} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabelUI>Vai trò:</InputLabelUI>
              <FormControl fullWidth size="small" sx={inputStyles}>
                <Select value={role} onChange={(e) => setRole(e.target.value)}>
                  <MenuItem value="patient">Bệnh nhân</MenuItem>
                  <MenuItem value="doctor">Bác sĩ</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabelUI>Số điện thoại:</InputLabelUI>
              <TextField fullWidth size="small" placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} sx={inputStyles} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabelUI>Ngày sinh:</InputLabelUI>
              <TextField fullWidth size="small" type="date" InputLabelProps={{ shrink: true }} value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} sx={inputStyles} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabelUI>Giới tính:</InputLabelUI>
              <FormControl fullWidth size="small" sx={inputStyles}>
                <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <MenuItem value="Male">Nam</MenuItem>
                  <MenuItem value="Female">Nữ</MenuItem>
                  <MenuItem value="Other">Khác</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabelUI>Nhóm máu:</InputLabelUI>
              <TextField fullWidth size="small" placeholder="VD: O, A, B, AB" value={bloodType} onChange={(e) => setBloodType(e.target.value)} sx={inputStyles} />
            </Grid>
            
            <Grid item xs={12}>
              <InputLabelUI>Địa chỉ:</InputLabelUI>
              <TextField fullWidth size="small" placeholder="Địa chỉ" value={address} onChange={(e) => setAddress(e.target.value)} sx={inputStyles} />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disableElevation
            sx={{ py: 1.2, mt: 1, mb: 3, fontWeight: 'bold' }}
          >
            Đăng ký
          </Button>

          <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ textDecoration: 'none', color: '#000', fontWeight: 'bold' }}>
              Đăng nhập
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default Register;
