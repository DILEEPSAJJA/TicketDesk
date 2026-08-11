import React from 'react';
import { Chip } from '@mui/material';
import { PRIORITY_COLORS } from '../utils/constants';

const PriorityChip = ({ priority, size = 'small' }) => {
  const config = PRIORITY_COLORS[priority] || { label: priority, color: 'default' };

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      sx={{
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.text}33`,
      }}
    />
  );
};

export default PriorityChip;
