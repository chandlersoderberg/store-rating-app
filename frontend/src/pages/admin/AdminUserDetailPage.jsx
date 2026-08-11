import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { getUserDetail } from '../../api/adminApi';
import StarRating from '../../components/common/StarRating';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

const AdminUserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getUserDetail(id)
      .then((res) => setUser(res.data.data))
      .catch(() => setError('Could not load user details.'));
  }, [id]);

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }
  if (!user) return null;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Link component={RouterLink} to="/admin/users" color="primary" sx={{ mb: 3, display: 'inline-block' }}>
        &larr; Back to users
      </Link>

      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" fontWeight="bold" color="text.primary" sx={{ mb: 4 }}>
            {user.name}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography color="text.secondary" variant="body2">Email</Typography>
              <Typography color="text.primary" variant="body2">{user.email}</Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography color="text.secondary" variant="body2">Address</Typography>
              <Typography color="text.primary" variant="body2">{user.address || '—'}</Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography color="text.secondary" variant="body2">Role</Typography>
              <Typography color="text.primary" variant="body2">{user.role}</Typography>
            </Box>
            {user.role === 'OWNER' && (
              <>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography color="text.secondary" variant="body2">Store rating</Typography>
                  <Box>
                    {user.rating ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StarRating value={Math.round(user.rating)} readOnly size="small" />
                        <Typography color="text.secondary" variant="body2">{user.rating}</Typography>
                      </Box>
                    ) : (
                      <Typography color="text.primary" variant="body2">—</Typography>
                    )}
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminUserDetailPage;
