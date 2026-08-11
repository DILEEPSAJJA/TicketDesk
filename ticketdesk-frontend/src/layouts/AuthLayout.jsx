import React from 'react';
import { Box, Container, Card, Typography } from '@mui/material';
import { ConfirmationNumber } from '@mui/icons-material';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 50% 30%, #1e1b4b 0%, #0b0f19 70%)'
            : 'radial-gradient(circle at 50% 30%, #e0e7ff 0%, #f8fafc 70%)',
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <ConfirmationNumber sx={{ fontSize: 42, color: 'primary.main' }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                letterSpacing: '-1px',
                background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TicketDesk
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" align="center">
            Enterprise IT Helpdesk & Support Portal
          </Typography>
        </Box>

        <Card
          sx={{
            p: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Outlet />
        </Card>
      </Container>
    </Box>
  );
};

export default AuthLayout;
