'use client'

import { useState } from 'react'
import { Box, Button, Card, CardContent, CardHeader, CardActions, Typography, CircularProgress } from '@mui/material'
import { Icon } from '@mui/material'

interface LoginPageProps {
  login: () => void;
}

export default function Component({ login }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLogin = async () => {
    setIsLoading(true)
    await login()
    setIsLoading(false)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 4,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%',  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)' }}>
        <CardHeader
          sx={{
            textAlign: 'center',
            p: 3,
          }}
          title={
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Welcome Back
              </Typography>
            </Box>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
              Sign in to your Web3Auth account
            </Typography>
          }
        />
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Access your decentralized identity and manage your digital assets securely.
          </Typography>
          <Button
          style={{
            backgroundColor:'#f15d2e',
            textTransform:'none'
          }}
            variant="contained"
            fullWidth
            onClick={handleLogin}
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
          >
            {isLoading ? 'Signing In...' : 'Sign In with Web3Auth'}
          </Button>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
        </CardActions>
      </Card>
    </Box>
  )
}
