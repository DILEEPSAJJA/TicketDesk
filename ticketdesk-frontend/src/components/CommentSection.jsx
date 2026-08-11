import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Send as SendIcon, ChatBubbleOutline } from '@mui/icons-material';
import { formatDate, getInitials } from '../utils/formatters';

const CommentSection = ({ comments, onAddComment, loading = false }) => {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setSubmitting(true);
      setError('');
      await onAddComment(message.trim());
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <ChatBubbleOutline color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Activity & Comments ({comments.length})
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Comment Input Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write a comment or update on this ticket..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={submitting}
            sx={{ mb: 1.5 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!message.trim() || submitting}
              startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Comments List */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : comments.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 3, fontStyle: 'italic' }}>
            No comments yet. Be the first to leave an update!
          </Typography>
        ) : (
          <Stack spacing={2.5}>
            {comments.map((comment) => (
              <Paper key={comment.id} elevation={0} sx={{ p: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 38, height: 38, fontSize: '0.9rem', fontWeight: 600 }}>
                    {getInitials(comment.createdBy?.firstName, comment.createdBy?.lastName)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {comment.createdBy?.firstName} {comment.createdBy?.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ bgcolor: 'action.selected', px: 1, py: 0.2, borderRadius: 1 }}>
                          {comment.createdBy?.role}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(comment.createdAt)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: 'text.primary' }}>
                      {comment.message}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

// Import Paper component for layout
import { Paper } from '@mui/material';

export default CommentSection;
