import React, { useEffect, useState } from 'react';
import { getStoresForUser } from '../../api/storeApi';
import { submitRating } from '../../api/ratingApi';
import StarRating from '../../components/common/StarRating';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [savingStoreId, setSavingStoreId] = useState(null);
  const [message, setMessage] = useState('');

  const loadStores = async () => {
    const { data } = await getStoresForUser({ ...search, sortBy, sortOrder: 'ASC' });
    setStores(data.data);
  };

  useEffect(() => {
    loadStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const handleSearchChange = (e) => setSearch({ ...search, [e.target.name]: e.target.value });

  const handleRate = async (storeId, rating) => {
    setSavingStoreId(storeId);
    setMessage('');
    try {
      await submitRating(storeId, rating);
      setMessage('Rating saved.');
      loadStores();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not save rating.');
    } finally {
      setSavingStoreId(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h5" component="h1" fontWeight="bold" color="text.primary" sx={{ mb: 4 }}>
        Stores
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <TextField
          name="name"
          placeholder="Search by name"
          value={search.name}
          onChange={handleSearchChange}
          size="small"
          sx={{ flex: '1 1 200px' }}
        />
        <TextField
          name="address"
          placeholder="Search by address"
          value={search.address}
          onChange={handleSearchChange}
          size="small"
          sx={{ flex: '1 1 200px' }}
        />
        <Button variant="outlined" color="primary" onClick={loadStores}>
          Search
        </Button>
        <TextField
          select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          size="small"
          sx={{ flex: '1 1 200px' }}
        >
          <MenuItem value="name">Sort by name</MenuItem>
          <MenuItem value="rating">Sort by rating</MenuItem>
        </TextField>
      </Box>

      {message && (
        <Alert severity={message === 'Rating saved.' ? 'success' : 'error'} sx={{ mb: 4 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {stores.map((store) => (
          <Grid item xs={12} sm={6} md={4} key={store.id}>
            <Card sx={{ 
              borderRadius: 4, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 6, backgroundColor: 'primary.main', opacity: 0.8 }} />
              <CardContent sx={{ flexGrow: 1, p: 3, pl: 4 }}>
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  {store.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
                  {store.address || 'No address on file'}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 1.5, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>Overall rating</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarRating value={Math.round(store.overallRating || 0)} readOnly size="small" />
                    <Typography variant="body2" color="text.primary" fontWeight="bold">{store.overallRating || 'N/A'}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, border: '1px dashed rgba(0,0,0,0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" color="primary.main" fontWeight={500}>Your rating</Typography>
                  <StarRating
                    value={store.userRating || 0}
                    onChange={(value) => handleRate(store.id, value)}
                  />
                </Box>

                {savingStoreId === store.id && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, justifyContent: 'center' }}>
                    <CircularProgress size={16} />
                    <Typography variant="caption" color="text.secondary">Saving…</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}

        {stores.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              No stores match your search.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default StoresPage;
