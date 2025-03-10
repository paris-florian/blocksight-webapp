import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  InputAdornment,
  Box,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { Token } from '../Sidebar/Sidebar';

interface TokenSearchPopupProps {
  open: boolean;
  onClose: () => void;
  onTokenSelect: (token: Token) => void;
  tokens: Token[];
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#1E1E1E',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '480px',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3f51b5',
    },
  },
  '& .MuiInputBase-input': {
    color: 'white',
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '8px',
  margin: '4px 0',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    cursor: 'pointer',
  },
}));

export const TokenSearchPopup: React.FC<TokenSearchPopupProps> = ({
  open,
  onClose,
  onTokenSelect,
  tokens,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTokens, setFilteredTokens] = useState<Token[]>(tokens);

  useEffect(() => {
    const filtered = tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTokens(filtered);
  }, [searchQuery, tokens]);

  const handleTokenClick = (token: Token) => {
    onTokenSelect(token);
    onClose();
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          background: '#1E1E1E',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
            Select a token
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <StyledTextField
          fullWidth
          placeholder="Search by name or ticker..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </InputAdornment>
            ),
          }}
          autoFocus
        />
      </Box>
      <DialogContent sx={{ p: 2, pt: 0 }}>
        <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
          {filteredTokens.map((token) => (
            <StyledListItem key={token.symbol} onClick={() => handleTokenClick(token)}>
              <ListItemAvatar>
                <Avatar src={token.iconUrl} alt={token.symbol}>
                  {token.symbol[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography sx={{ color: 'white' }}>
                    {token.symbol}
                  </Typography>
                }
                secondary={
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {token.name}
                    {token.price && ` • ${token.price}`}
                  </Typography>
                }
              />
            </StyledListItem>
          ))}
        </List>
      </DialogContent>
    </StyledDialog>
  );
};

export default TokenSearchPopup; 