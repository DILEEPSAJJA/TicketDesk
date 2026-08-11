import React, { useState } from 'react';
import { Box, Toolbar, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Navbar */}
      <Navbar onToggleSidebar={handleDrawerToggle} />

      {/* Main Body Row: Sidebar + Content */}
      <Box sx={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
        <Sidebar mobileOpen={mobileOpen} onCloseSidebar={handleDrawerToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            width: { md: `calc(100% - 240px)` },
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
