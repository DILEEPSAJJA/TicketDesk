export const ROLES = {
  ADMIN: 'ADMIN',
  SUPPORT: 'SUPPORT',
  EMPLOYEE: 'EMPLOYEE',
};

export const STATUSES = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
};

export const PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

export const CATEGORIES = [
  'Hardware',
  'Software',
  'Network',
  'Access',
  'Other',
];

export const STATUS_COLORS = {
  OPEN: { label: 'Open', color: 'info', bg: 'rgba(2, 136, 209, 0.15)', text: '#29b6f6' },
  IN_PROGRESS: { label: 'In Progress', color: 'warning', bg: 'rgba(237, 108, 2, 0.15)', text: '#ffa726' },
  RESOLVED: { label: 'Resolved', color: 'success', bg: 'rgba(46, 125, 50, 0.15)', text: '#66bb6a' },
  CLOSED: { label: 'Closed', color: 'default', bg: 'rgba(158, 158, 158, 0.15)', text: '#bdbdbd' },
};

export const PRIORITY_COLORS = {
  LOW: { label: 'Low', color: 'info', bg: 'rgba(3, 169, 244, 0.12)', text: '#4fc3f7' },
  MEDIUM: { label: 'Medium', color: 'primary', bg: 'rgba(92, 107, 192, 0.15)', text: '#7986cb' },
  HIGH: { label: 'High', color: 'warning', bg: 'rgba(255, 152, 0, 0.15)', text: '#ffb74d' },
  CRITICAL: { label: 'Critical', color: 'error', bg: 'rgba(211, 47, 47, 0.18)', text: '#ef5350' },
};
