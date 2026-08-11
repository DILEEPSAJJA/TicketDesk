import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Email, Lock, Badge } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'EMPLOYEE',
    },
  });

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setServerError('');
      await registerUser(data);
      enqueueSnackbar('Registration successful! Please login with your credentials.', { variant: 'success' });
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Email may already be in use.';
      setServerError(msg);
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
        Create Account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
        Join TicketDesk to manage support tickets efficiently
      </Typography>

      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          margin="dense"
          label="First Name"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person color="action" />
              </InputAdornment>
            ),
          }}
          {...register('firstName', {
            required: 'First name is required',
            minLength: { value: 2, message: 'Minimum 2 characters' },
          })}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />

        <TextField
          fullWidth
          margin="dense"
          label="Last Name"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person color="action" />
              </InputAdornment>
            ),
          }}
          {...register('lastName', {
            required: 'Last name is required',
            minLength: { value: 2, message: 'Minimum 2 characters' },
          })}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />
      </Box>

      <TextField
        fullWidth
        margin="dense"
        label="Email Address"
        autoComplete="email"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email color="action" />
            </InputAdornment>
          ),
        }}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        fullWidth
        margin="dense"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 8, message: 'Password must be at least 8 characters' },
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <Controller
        name="role"
        control={control}
        rules={{ required: 'Role is required' }}
        render={({ field }) => (
          <FormControl fullWidth margin="dense" error={!!errors.role}>
            <InputLabel id="role-select-label">Account Role</InputLabel>
            <Select
              {...field}
              labelId="role-select-label"
              label="Account Role"
              startAdornment={
                <InputAdornment position="start">
                  <Badge color="action" />
                </InputAdornment>
              }
            >
              <MenuItem value="EMPLOYEE">EMPLOYEE (Create & Track Tickets)</MenuItem>
              <MenuItem value="SUPPORT">SUPPORT (Resolve & Manage Tickets)</MenuItem>
              <MenuItem value="ADMIN">ADMIN (Full System Administrator)</MenuItem>
            </Select>
            {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
          </FormControl>
        )}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={submitting}
        sx={{ mt: 3, mb: 2, py: 1.2 }}
      >
        {submitting ? <CircularProgress size={24} color="inherit" /> : 'Register'}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" variant="body2" sx={{ fontWeight: 600 }}>
            Sign In
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
