import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

const ROLE_LINKS = {
  ADMIN: [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/stores', label: 'Stores' },
  ],
  NORMAL: [{ to: '/stores', label: 'Stores' }],
  OWNER: [{ to: '/owner', label: 'Dashboard' }],
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 'bold',
          }}
        >
          Store<Box component="span" sx={{ color: 'text.primary' }}>Rating</Box>
        </Typography>

        {user && (
          <Stack direction="row" spacing={4} alignItems="center">
            <Stack direction="row" spacing={2}>
              {ROLE_LINKS[user.role]?.map((link) => (
                <Button
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  color="inherit"
                  sx={{ color: 'text.secondary' }}
                >
                  {link.label}
                </Button>
              ))}
              <Button
                component={RouterLink}
                to="/update-password"
                color="inherit"
                sx={{ color: 'text.secondary' }}
              >
                Change Password
              </Button>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  {user.name}
                </Typography>
              </Stack>
              <Button variant="outlined" color="primary" onClick={handleLogout}>
                Log out
              </Button>
            </Stack>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
