import React from 'react';
import { Button, Box, Typography } from '@mui/material';

interface LoginPageProps {
  login: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ login }) => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h5">Welcome to the Web3Auth Application</Typography>
      <Button variant="contained" color="primary" onClick={login}>
        Login
      </Button>
    </Box>
  );
};

export default LoginPage;
