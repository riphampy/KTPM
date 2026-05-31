import React, { useState, useContext } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      login(response.data.token, response.data.user);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F7F9FD' }}>
      <Paper elevation={0} sx={{ p: 6, width: '100%', maxWidth: '450px', borderRadius: '4px', border: '1px solid #ebebeb' }}>
        <Typography component="h1" variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
          Chào mừng trở lại!
        </Typography>
        <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 4 }}>
          Đăng nhập vào tài khoản của bạn
        </Typography>

        <Box component="form" onSubmit={handleLogin}>
          {error && <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}
          
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Email:</Typography>
          <TextField
            fullWidth
            size="small"
            id="email"
            placeholder="Địa chỉ Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{ sx: { bgcolor: '#fafafa', '& fieldset': { borderColor: '#e0e0e0' } } }}
          />

          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Mật khẩu:</Typography>
          <TextField
            fullWidth
            size="small"
            name="password"
            placeholder="Mật khẩu"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 4 }}
            InputProps={{ sx: { bgcolor: '#fafafa', '& fieldset': { borderColor: '#e0e0e0' } } }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disableElevation
            sx={{ py: 1.2, mb: 4, fontWeight: 'bold' }}
          >
            Đăng nhập
          </Button>

          <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
            Bạn chưa có tài khoản?{' '}
            <Link to="/register" style={{ textDecoration: 'none', color: '#000', fontWeight: 'bold' }}>
              Đăng ký ngay
            </Link>
          </Typography>
          
          <Box textAlign="center" mt={2}>
            <Link to="/forgot-password" style={{ textDecoration: 'none', color: '#0056D2', fontSize: '0.875rem' }}>
              Quên mật khẩu?
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
