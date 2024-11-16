import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Public, Wifi, Bolt, Search as SearchIcon } from '@mui/icons-material';
import logo from '/assets/logo.png'; 

interface HomePageProps {
  centerUrl: string;
  onCenterUrlChange: (url: string) => void;
  onCenterSearch: (e: React.FormEvent) => void;
}

export function HomePage({
  centerUrl,
  onCenterUrlChange,
  onCenterSearch,
}: HomePageProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Circular Design */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 500,
          height: 500,
          border: '4px solid #f15d2f',
          borderRadius: '50%',
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <Public
          sx={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 48,
            color: '#f15d2f',
          }}
        />
        <Wifi
          sx={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translate(50%, -50%)',
            fontSize: 48,
            color: '#f15d2f',
          }}
        />
        <Bolt
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translate(-50%, 50%)',
            fontSize: 48,
            color: '#f15d2f',
          }}
        />
        <SearchIcon
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translate(-50%, -50%)',
            fontSize: 48,
            color: '#f15d2f',
          }}
        />
      </Box>

      {/* Content */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '40%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: '#f15d2f', mb: 4 }}
        >
          Welcome to the <br/> New Internet
        </Typography>
        <Box
          component="form"
          onSubmit={onCenterSearch}
          sx={{
            display: 'flex',
            gap: 2,
            mb: 4,
          }}
        >
          <TextField
            fullWidth
            placeholder="Enter URL"
            value={centerUrl}
            onChange={(e) => onCenterUrlChange(e.target.value)}
            sx={{
              flex: 1,
            }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: '#f15d2f',
              '&:hover': { bgcolor: '#d14d1f' },
            }}
          >
            Go
          </Button>
          
        </Box>
       

      </Box>
      <div style={{
           position:"absolute",
           bottom:"0px",
         right:"0px",
            transform: "translate(-50%, -50%)",
           marginTop:"1rem"
      }} ><p style={{
          color:"#a2a2a2",
          fontSize:"2.3rem",
          padding:"0px",
          margin:"0px",
       
          
        }} >Web3 by</p>
        <img
            src={logo}
            alt="Logo"
            style={{
              maxWidth: '150px',
              height: 'auto',
            }}
          /></div>
      
    </>
  );
}
