import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getUsers, createUser } from '../../api/adminApi';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import { validateName, validateEmail, validateAddress, validatePassword } from '../../utils/validators';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';

const EMPTY_FORM = { name: '', email: '', address: '', password: '', role: 'NORMAL' };

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const loadUsers = async () => {
    const { data } = await getUsers({ ...filters, sortBy, sortOrder });
    setUsers(data.data);
  };

  useEffect(() => {
    loadUsers();
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
      email: validateEmail(form.email),
      address: validateAddress(form.address),
      password: validatePassword(form.password),
    };
    setFormErrors(errors);
    return Object.values(errors).every((msg) => !msg);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    try {
      await createUser(form);
      setIsModalOpen(false);
      setForm(EMPTY_FORM);
      loadUsers();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not create user.');
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <Link component={RouterLink} to={`/admin/users/${row.id}`} color="primary" fontWeight="medium">
          View
        </Link>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" component="h1" fontWeight="bold" color="text.primary">
          Users
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
          Add user
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
        <TextField
          select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
          size="small"
          sx={{ flex: '1 1 200px' }}
        >
          <MenuItem value="">All roles</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
          <MenuItem value="NORMAL">Normal</MenuItem>
          <MenuItem value="OWNER">Store Owner</MenuItem>
        </TextField>
        <Button variant="outlined" color="primary" onClick={loadUsers}>
          Apply filters
        </Button>
      </Box>

      <Table
        columns={columns}
        rows={users}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add new user">
        {serverError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {serverError}
          </Alert>
        )}
        <Box component="form" onSubmit={handleCreateUser}>
          <Stack spacing={3}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              error={Boolean(formErrors.name)}
              helperText={formErrors.name}
              fullWidth
            />
            <TextField
              label="Email"
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
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleFormChange}
              error={Boolean(formErrors.password)}
              helperText={formErrors.password}
              fullWidth
            />
            <TextField
              select
              label="Role"
              name="role"
              value={form.role}
              onChange={handleFormChange}
              fullWidth
            >
              <MenuItem value="NORMAL">Normal user</MenuItem>
              <MenuItem value="ADMIN">System administrator</MenuItem>
              <MenuItem value="OWNER">Store owner</MenuItem>
            </TextField>
            <Button type="submit" variant="contained" color="primary" fullWidth size="large">
              Create user
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
};

export default AdminUsersPage;
