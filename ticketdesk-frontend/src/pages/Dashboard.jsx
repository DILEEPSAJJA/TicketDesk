import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ConfirmationNumber,
  HourglassEmpty,
  Autorenew,
  CheckCircleOutline,
  Add,
  Visibility,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import StatCard from '../components/StatCard';
import StatusChip from '../components/StatusChip';
import PriorityChip from '../components/PriorityChip';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/formatters';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';

const STATUS_PIE_COLORS = ['#29b6f6', '#ffa726', '#66bb6a', '#bdbdbd'];
const PRIORITY_BAR_COLORS = ['#4fc3f7', '#7986cb', '#ffb74d', '#ef5350'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const metrics = await dashboardService.getDashboardMetrics();
      setData(metrics);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Dashboard Analytics..." />;

  const getStatusCount = (statusKey) => {
    if (!data?.ticketsByStatus) return 0;
    const found = data.ticketsByStatus.find((s) => s.status === statusKey);
    return found ? found.count : 0;
  };

  const statusChartData = data?.ticketsByStatus?.map((item) => ({
    name: item.status.replace(/_/g, ' '),
    value: item.count,
  })) || [];

  const priorityChartData = data?.ticketsByPriority?.map((item) => ({
    name: item.priority,
    count: item.count,
  })) || [];

  return (
    <Box>
      {/* Top Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Helpdesk Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time metric summary and support activity breakdown
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/tickets/create')}
          sx={{ px: 2.5, py: 1 }}
        >
          Create New Ticket
        </Button>
      </Box>

      {/* Overview Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tickets"
            value={data?.totalTickets || 0}
            icon={<ConfirmationNumber />}
            color="#6366f1"
            subtitle="All tickets in repository"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Open Tickets"
            value={getStatusCount('OPEN')}
            icon={<HourglassEmpty />}
            color="#0288d1"
            subtitle="Awaiting triage or assignment"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={getStatusCount('IN_PROGRESS')}
            icon={<Autorenew />}
            color="#ed6c02"
            subtitle="Actively being worked on"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Resolved"
            value={getStatusCount('RESOLVED')}
            icon={<CheckCircleOutline />}
            color="#2e7d32"
            subtitle="Successfully completed"
          />
        </Grid>
      </Grid>

      {/* Analytics Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Status Distribution Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 380 }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Tickets by Status
              </Typography>
              <Box sx={{ flexGrow: 1, width: '100%', minHeight: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_PIE_COLORS[index % STATUS_PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Priority Distribution Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 380 }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Tickets by Priority
              </Typography>
              <Box sx={{ flexGrow: 1, width: '100%', minHeight: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" allowDecimals={false} />
                    <RechartsTooltip />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {priorityChartData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={PRIORITY_BAR_COLORS[index % PRIORITY_BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Latest Tickets Table */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recent Support Activity
            </Typography>
            <Button endIcon={<ArrowForward />} onClick={() => navigate('/tickets')}>
              View All Tickets
            </Button>
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created By</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.latestTickets?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      No tickets created yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.latestTickets?.map((ticket) => (
                    <TableRow key={ticket.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>#{ticket.id}</TableCell>
                      <TableCell sx={{ fontWeight: 500, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ticket.title}
                      </TableCell>
                      <TableCell>{ticket.category}</TableCell>
                      <TableCell>
                        <PriorityChip priority={ticket.priority} />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={ticket.status} />
                      </TableCell>
                      <TableCell>
                        {ticket.createdBy?.firstName} {ticket.createdBy?.lastName}
                      </TableCell>
                      <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="View Ticket Details">
                          <IconButton size="small" color="primary" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
