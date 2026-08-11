import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Divider,
  Chip,
  Paper,
  Stack,
} from '@mui/material';
import { Person, Email, Badge, CalendarToday, Security } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { formatDate, getInitials } from '../utils/formatters';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  const roleDescriptions = {
    ADMIN: 'Full system administrator privileges. Can manage all tickets, users, settings, and view all organization analytics.',
    SUPPORT: 'IT Support Agent privileges. Can view and update ticket statuses, respond to employee comments, and resolve helpdesk requests.',
    EMPLOYEE: 'Standard Employee privileges. Can submit new support tickets, track ticket status, and comment on owned tickets.',
  };

  return (
    <Box maxWidth="md" sx={{ mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        User Profile
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your user account credentials and view access privileges
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={5}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 100,
                  height: 100,
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  mb: 2,
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                }}
              >
                {getInitials(user.firstName, user.lastName)}
              </Avatar>

              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {user.firstName} {user.lastName}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {user.email}
              </Typography>

              <Chip
                label={user.role}
                color={user.role === 'ADMIN' ? 'error' : user.role === 'SUPPORT' ? 'warning' : 'primary'}
                sx={{ fontWeight: 700, px: 2, py: 0.5, fontSize: '0.875rem' }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Details & Role Info Card */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Account Details
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Person color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {user.firstName} {user.lastName}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Email color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Badge color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Assigned Role
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {user.role}
                    </Typography>
                  </Box>
                </Box>

                {user.createdAt && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CalendarToday color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Member Since
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formatDate(user.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Stack>

              <Paper elevation={0} sx={{ mt: 4, p: 2.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: 2, border: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Security color="info" fontSize="small" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Role Capabilities ({user.role})
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {roleDescriptions[user.role] || 'Standard user access.'}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
