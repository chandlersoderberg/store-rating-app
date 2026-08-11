import React, { useEffect, useState } from 'react';
import { getOwnerDashboard } from '../../api/ratingApi';
import StarRating from '../../components/common/StarRating';
import Table from '../../components/common/Table';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import StarRateOutlinedIcon from '@mui/icons-material/StarRateOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { alpha } from '@mui/material/styles';

const StatCard = ({ label, value, icon: Icon, color, isRating }) => {
  return (
    <Card
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 4,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        borderLeft: `6px solid ${color}`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 12px 28px rgba(0, 0, 0, 0.1)",
        },
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing={0.5}
          mb={1}
        >
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h3" fontWeight="bold" color="text.primary">
            {value !== undefined ? value : <CircularProgress size={28} sx={{ color }} />}
          </Typography>
          {isRating && value !== undefined && value !== 'N/A' && (
             <StarRating value={Math.round(value)} readOnly />
          )}
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: alpha(color, 0.1),
          p: 2,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon sx={{ color: color, fontSize: 36 }} />
      </Box>
    </Card>
  );
};

const OwnerDashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getOwnerDashboard()
      .then((res) => setDashboard(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load dashboard.'));
  }, []);

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }
  if (!dashboard) return null;

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StarRating value={row.rating} readOnly size="small" />
          <Typography variant="body2" color="text.primary" fontWeight="bold">{row.rating}</Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ minHeight: "80vh", py: 6, backgroundColor: "#f8fafc", mb: 8 }}>
      <Container maxWidth="md">
        <Box mb={6} mt={2}>
          <Typography variant="h4" component="h1" fontWeight="800" color="text.primary" gutterBottom>
            {dashboard.store.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {dashboard.store.address}
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }} alignItems="stretch">
          <Grid item xs={12} sm={6}>
             <StatCard
                label="Average Rating"
                value={dashboard.avgRating ?? 'N/A'}
                icon={StarRateOutlinedIcon}
                color="#f59e0b"
                isRating={true}
              />
          </Grid>
          <Grid item xs={12} sm={6}>
             <StatCard
                label="Total Ratings"
                value={dashboard.totalRatings}
                icon={PeopleAltOutlinedIcon}
                color="#3b82f6"
              />
          </Grid>
        </Grid>

        <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 3 }}>
          Recent Raters
        </Typography>
        <Table columns={columns} rows={dashboard.raters} emptyMessage="No one has rated your store yet." />
      </Container>
    </Box>
  );
};

export default OwnerDashboardPage;
