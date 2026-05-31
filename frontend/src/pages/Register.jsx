import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
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
        name,
        email,
        password,
        role,
        phone,
        dateOfBirth,
        gender,
        address,
        bloodType
      });
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Đăng ký Tài khoản
        </Typography>
        <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Họ và Tên"
            name="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Địa chỉ Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Vai trò</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={role}
              label="Vai trò"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="patient">Bệnh nhân</MenuItem>
              <MenuItem value="doctor">Bác sĩ</MenuItem>
            </Select>
          </FormControl>
          
          <TextField margin="normal" fullWidth label="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <TextField margin="normal" fullWidth label="Ngày sinh" type="date" InputLabelProps={{ shrink: true }} value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
          <FormControl fullWidth margin="normal">
            <InputLabel id="gender-label">Giới tính</InputLabel>
            <Select labelId="gender-label" value={gender} label="Giới tính" onChange={(e) => setGender(e.target.value)}>
              <MenuItem value="Male">Nam</MenuItem>
              <MenuItem value="Female">Nữ</MenuItem>
              <MenuItem value="Other">Khác</MenuItem>
            </Select>
          </FormControl>
          <TextField margin="normal" fullWidth label="Địa chỉ" value={address} onChange={(e) => setAddress(e.target.value)} />
          <TextField margin="normal" fullWidth label="Nhóm máu (VD: O, A, B, AB)" value={bloodType} onChange={(e) => setBloodType(e.target.value)} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Đăng ký
          </Button>
          <Box textAlign="center">
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">
                Đã có tài khoản? Đăng nhập
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;
