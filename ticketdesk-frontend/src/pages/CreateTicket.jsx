import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
import { CATEGORIES, PRIORITIES } from '../utils/constants';
import { useSnackbar } from 'notistack';

const CreateTicket = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: 'Software',
      priority: 'MEDIUM',
    },
  });

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setServerError('');
      const created = await ticketService.createTicket(data);
      enqueueSnackbar(`Ticket #${created.id} submitted successfully!`, { variant: 'success' });
      navigate(`/tickets/${created.id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit ticket';
      setServerError(msg);
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box maxWidth="md" sx={{ mx: 'auto' }}>
      {/* Top Header */}
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/tickets')} sx={{ mb: 1 }}>
          Back to Tickets
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Create Support Ticket
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Submit a new request to the IT Support desk
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
                  placeholder="e.g. Cannot access VPN or Laptop overheating"
                  {...register('title', {
                    required: 'Title is required',
                    minLength: { value: 3, message: 'Title must be at least 3 characters' },
                    maxLength: { value: 150, message: 'Title cannot exceed 150 characters' },
                  })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              </Grid>

              {/* Category */}
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <Controller
                  name="priority"
                  control={control}
                  rules={{ required: 'Priority is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.priority}>
                      <InputLabel id="priority-label">Priority Level</InputLabel>
                      <Select {...field} labelId="priority-label" label="Priority Level">
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

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Detailed Description"
                  placeholder="Describe the issue, error messages, or steps to reproduce..."
                  {...register('description', {
                    required: 'Description is required',
                    minLength: { value: 5, message: 'Description must be at least 5 characters' },
                  })}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button variant="outlined" color="inherit" onClick={() => navigate('/tickets')} disabled={submitting}>
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
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateTicket;
