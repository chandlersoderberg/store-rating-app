import React, { useEffect, useState } from 'react';
import { getStores, createStore } from '../../api/adminApi';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import StarRating from '../../components/common/StarRating';
import { validateName, validateAddress, validateEmail } from '../../utils/validators';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

const EMPTY_FORM = { name: '', email: '', address: '', ownerId: '' };

const AdminStoresPage = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const loadStores = async () => {
    const { data } = await getStores({ ...filters, sortBy, sortOrder });
    setStores(data.data);
  };

  useEffect(() => {
    loadStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder]);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSortChange = (key, order) => {
    setSortBy(key);
    setSortOrder(order);
  };

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errors = {
      name: validateName(form.name),
      email: form.email ? validateEmail(form.email) : '',
      address: validateAddress(form.address),
    };
    setFormErrors(errors);
    return Object.values(errors).every((msg) => !msg);
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    try {
      await createStore({ ...form, ownerId: form.ownerId ? Number(form.ownerId) : undefined });
      setIsModalOpen(false);
      setForm(EMPTY_FORM);
      loadStores();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not create store.');
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (row) =>
        row.rating ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StarRating value={Math.round(row.rating)} readOnly size="small" />
            <Typography variant="body2" color="text.secondary">{row.rating}</Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">No ratings yet</Typography>
        ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" component="h1" fontWeight="bold" color="text.primary">
          Stores
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
          Add store
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <TextField
          name="name"
          placeholder="Filter by name"
          value={filters.name}
          onChange={handleFilterChange}
          size="small"
          sx={{ flex: '1 1 200px' }}
        />
        <TextField
          name="email"
          placeholder="Filter by email"
          value={filters.email}
          onChange={handleFilterChange}
          size="small"
          sx={{ flex: '1 1 200px' }}
        />
        <TextField
          name="address"
          placeholder="Filter by address"
          value={filters.address}
          onChange={handleFilterChange}
          size="small"
          sx={{ flex: '1 1 200px' }}
        />
        <Button variant="outlined" color="primary" onClick={loadStores}>
          Apply filters
        </Button>
      </Box>

      <Table
        columns={columns}
        rows={stores}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add new store">
        {serverError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {serverError}
          </Alert>
        )}
        <Box component="form" onSubmit={handleCreateStore}>
          <Stack spacing={3}>
            <TextField
              label="Store name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              error={Boolean(formErrors.name)}
              helperText={formErrors.name}
              fullWidth
            />
            <TextField
              label="Store email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleFormChange}
              error={Boolean(formErrors.email)}
              helperText={formErrors.email}
              fullWidth
            />
            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleFormChange}
              error={Boolean(formErrors.address)}
              helperText={formErrors.address}
              fullWidth
            />
            <TextField
              label="Owner user ID (optional)"
              name="ownerId"
              value={form.ownerId}
              onChange={handleFormChange}
              placeholder="ID of a user with role Store Owner"
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" fullWidth size="large">
              Create store
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
};

export default AdminStoresPage;
