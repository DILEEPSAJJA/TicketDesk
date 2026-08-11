import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { ticketService } from '../services/ticketService';
import { CATEGORIES, PRIORITIES, STATUSES } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSnackbar } from 'notistack';

const EditTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const ticket = await ticketService.getTicketById(id);
      reset({
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
      });
    } catch (err) {
      console.error('Failed to load ticket for edit:', err);
      enqueueSnackbar('Failed to load ticket for editing', { variant: 'error' });
      navigate('/tickets');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setServerError('');
      await ticketService.updateTicket(id, data);
      enqueueSnackbar(`Ticket #${id} updated successfully!`, { variant: 'success' });
      navigate(`/tickets/${id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update ticket';
      setServerError(msg);
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading ticket details..." />;

  return (
    <Box maxWidth="md" sx={{ mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(`/tickets/${id}`)} sx={{ mb: 1 }}>
          Cancel & Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Edit Ticket #{id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Update ticket attributes and status
        </Typography>
      </Box>

      {serverError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {serverError}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ticket Title"
                  {...register('title', {
                    required: 'Title is required',
                    minLength: { value: 3, message: 'Title must be at least 3 characters' },
                  })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              </Grid>

              {/* Category */}
              <Grid item xs={12} sm={4}>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.category}>
                      <InputLabel id="category-label">Category</InputLabel>
                      <Select {...field} labelId="category-label" label="Category">
                        {CATEGORIES.map((cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.category && <FormHelperText>{errors.category.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Priority */}
              <Grid item xs={12} sm={4}>
                <Controller
                  name="priority"
                  control={control}
                  rules={{ required: 'Priority is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.priority}>
                      <InputLabel id="priority-label">Priority</InputLabel>
                      <Select {...field} labelId="priority-label" label="Priority">
                        {Object.keys(PRIORITIES).map((p) => (
                          <MenuItem key={p} value={p}>
                            {p}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.priority && <FormHelperText>{errors.priority.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={4}>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: 'Status is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.status}>
                      <InputLabel id="status-label">Status</InputLabel>
                      <Select {...field} labelId="status-label" label="Status">
                        {Object.keys(STATUSES).map((s) => (
                          <MenuItem key={s} value={s}>
                            {s.replace(/_/g, ' ')}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Detailed Description"
                  {...register('description', {
                    required: 'Description is required',
                  })}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button variant="outlined" color="inherit" onClick={() => navigate(`/tickets/${id}`)} disabled={submitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                  disabled={submitting}
                  sx={{ px: 4 }}
                >
                  {submitting ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditTicket;
