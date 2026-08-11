import React, { useState } from 'react';
import { changePasswordRequest } from '../api/authApi';
import { validatePassword } from '../utils/validators';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const UpdatePasswordPage = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const passwordError = validatePassword(form.newPassword);
    if (passwordError) return setError(passwordError);

    setIsSubmitting(true);
    try {
      await changePasswordRequest(form);
      setSuccess('Password updated successfully.');
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" component="h1" gutterBottom fontWeight="bold" color="text.primary" sx={{ mb: 3 }}>
            Change password
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Current password"
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="New password"
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                required
                fullWidth
                helperText="8-16 chars, 1 uppercase, 1 special"
              />
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating…' : 'Update password'}
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UpdatePasswordPage;
