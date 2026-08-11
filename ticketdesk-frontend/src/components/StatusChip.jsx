import React from 'react';
import { Chip } from '@mui/material';
import { STATUS_COLORS } from '../utils/constants';

const StatusChip = ({ status, size = 'small' }) => {
  const config = STATUS_COLORS[status] || { label: status, color: 'default' };

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

export default StatusChip;
