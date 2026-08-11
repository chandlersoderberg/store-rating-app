import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/adminApi";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import StarRateOutlinedIcon from "@mui/icons-material/StarRateOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { alpha } from "@mui/material/styles";

const StatCard = ({ label, value, icon: Icon, color }) => {
  return (
    <Card
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 3,
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
        <Typography variant="h3" fontWeight="bold" color="text.primary">
          {value !== undefined ? (
            value
          ) : (
            <CircularProgress size={28} sx={{ color }} />
          )}
        </Typography>
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

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data.data))
      .catch(() => setError("Could not load dashboard stats."));
  }, []);

  return (
    <Box sx={{ minHeight: "80vh", py: 6, backgroundColor: "#f8fafc", mb: 8 }}>
      <Container maxWidth="lg">
        <Box mb={8} mt={4}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="800"
            color="text.primary"
            gutterBottom
          >
            Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Here's an overview of the platform's current status and activity.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4} alignItems="stretch" mt={5}>
          <Grid item xs={12} md={4}>
            <StatCard
              label="Total Users"
              value={stats?.totalUsers}
              icon={PeopleAltOutlinedIcon}
              color="#3b82f6"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              label="Total Stores"
              value={stats?.totalStores}
              icon={StorefrontOutlinedIcon}
              color="#10b981"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              label="Total Ratings"
              value={stats?.totalRatings}
              icon={StarRateOutlinedIcon}
              color="#f59e0b"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboardPage;
