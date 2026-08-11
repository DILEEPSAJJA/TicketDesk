import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Divider,
  Avatar,
  Paper,
  Stack,
  Tooltip,
} from '@mui/material';
import { ArrowBack, Edit, Delete, Person, Category, AccessTime } from '@mui/icons-material';
import { ticketService } from '../services/ticketService';
import { commentService } from '../services/commentService';
import StatusChip from '../components/StatusChip';
import PriorityChip from '../components/PriorityChip';
import CommentSection from '../components/CommentSection';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, getInitials } from '../utils/formatters';
import { useSnackbar } from 'notistack';
import { useAuth } from '../context/AuthContext';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchTicketAndComments();
  }, [id]);

  const fetchTicketAndComments = async () => {
    try {
      setLoading(true);
      const ticketData = await ticketService.getTicketById(id);
      setTicket(ticketData);

      const commentsData = await commentService.getCommentsByTicketId(id);
      setComments(commentsData);
    } catch (err) {
      console.error('Failed to load ticket details:', err);
      enqueueSnackbar('Failed to load ticket details', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      const updated = await ticketService.updateTicket(id, { status: newStatus });
      setTicket(updated);
      enqueueSnackbar(`Ticket status updated to ${newStatus}`, { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to update status', { variant: 'error' });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddComment = async (message) => {
    const newComment = await commentService.addComment(id, { message });
    setComments((prev) => [...prev, newComment]);
    enqueueSnackbar('Comment added successfully', { variant: 'success' });
  };

  const handleDeleteTicket = async () => {
    if (window.confirm(`Are you sure you want to delete Ticket #${id}?`)) {
      try {
        await ticketService.deleteTicket(id);
        enqueueSnackbar('Ticket deleted successfully', { variant: 'success' });
        navigate('/tickets');
      } catch (err) {
        enqueueSnackbar(err.response?.data?.message || 'Failed to delete ticket', { variant: 'error' });
      }
    }
  };

  if (loading) return <LoadingSpinner message="Loading Ticket Details..." />;
  if (!ticket) return <Typography align="center" sx={{ py: 4 }}>Ticket not found.</Typography>;

  const isAuthor = ticket.createdBy?.id === user?.id;
  const isSupportOrAdmin = user?.role === 'ADMIN' || user?.role === 'SUPPORT';

  return (
    <Box maxWidth="lg" sx={{ mx: 'auto' }}>
      {/* Top Action Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/tickets')}>
          Back to Tickets
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {(isSupportOrAdmin || isAuthor) && (
            <>
              <Button
                variant="outlined"
                color="info"
                startIcon={<Edit />}
                onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
              >
                Edit
              </Button>
              <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleDeleteTicket}>
                Delete
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Main Content */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', bgcolor: 'action.selected', px: 1.5, py: 0.5, borderRadius: 1 }}>
                  TICKET #{ticket.id}
                </Typography>
                <StatusChip status={ticket.status} size="medium" />
                <PriorityChip priority={ticket.priority} size="medium" />
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                {ticket.title}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', color: 'text.primary', lineHeight: 1.7 }}>
                {ticket.description}
              </Typography>
            </CardContent>
          </Card>

          {/* Activity & Comment Timeline */}
          <CommentSection comments={comments} onAddComment={handleAddComment} />
        </Grid>

        {/* Right Details Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Ticket Metadata Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Ticket Info
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Category color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Category
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {ticket.category}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Person color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Created By
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {ticket.createdBy?.firstName} {ticket.createdBy?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({ticket.createdBy?.email})
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AccessTime color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Created At
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatDate(ticket.createdAt)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AccessTime color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Last Updated
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatDate(ticket.updatedAt)}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Quick Status Control Card for Support/Admin */}
          {isSupportOrAdmin && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Change Status
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  Quickly transition ticket workflow state
                </Typography>

                <Stack spacing={1}>
                  <Button
                    variant={ticket.status === 'OPEN' ? 'contained' : 'outlined'}
                    color="info"
                    disabled={updatingStatus || ticket.status === 'OPEN'}
                    onClick={() => handleStatusChange('OPEN')}
                  >
                    Mark as Open
                  </Button>
                  <Button
                    variant={ticket.status === 'IN_PROGRESS' ? 'contained' : 'outlined'}
                    color="warning"
                    disabled={updatingStatus || ticket.status === 'IN_PROGRESS'}
                    onClick={() => handleStatusChange('IN_PROGRESS')}
                  >
                    Mark as In Progress
                  </Button>
                  <Button
                    variant={ticket.status === 'RESOLVED' ? 'contained' : 'outlined'}
                    color="success"
                    disabled={updatingStatus || ticket.status === 'RESOLVED'}
                    onClick={() => handleStatusChange('RESOLVED')}
                  >
                    Mark as Resolved
                  </Button>
                  <Button
                    variant={ticket.status === 'CLOSED' ? 'contained' : 'outlined'}
                    color="inherit"
                    disabled={updatingStatus || ticket.status === 'CLOSED'}
                    onClick={() => handleStatusChange('CLOSED')}
                  >
                    Mark as Closed
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TicketDetails;
