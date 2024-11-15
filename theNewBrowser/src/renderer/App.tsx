import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { HomePage } from '../pages/HomePage';
import { SearchBar } from '../components/SearchBar';

function App() {
  const [url, setUrl] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');
  const [iframeError, setIframeError] = useState(false);
  const [centerUrl, setCenterUrl] = useState('');


  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      formattedUrl = 'https://' + url;
    }
    setIframeUrl(formattedUrl);
    setIframeError(false);
    setCenterUrl(url); 
  };


  const handleCenterUrlChange = (newUrl: string) => {
    setCenterUrl(newUrl);
  };

  const handleCenterSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let formattedUrl = centerUrl;
    if (!/^https?:\/\//i.test(centerUrl)) {
      formattedUrl = 'https://' + centerUrl;
    }
    setIframeUrl(formattedUrl);
    setIframeError(false);
    setUrl(centerUrl); 
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
    
      <SearchBar
        url={url}
        onUrlChange={handleUrlChange}
        onSearch={handleSearch}
      />

     
      <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {iframeUrl ? (
          iframeError ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.100',
                p: 2,
              }}
            >
              <Box>
                <Typography variant="h6" color="error">
                  Bu site iframe içinde görüntülenemiyor.
                </Typography>
                <Typography variant="body1">
                  Lütfen farklı bir site deneyin veya siteyi yeni bir sekmede
                  açın.
                </Typography>
              </Box>
            </Box>
          ) : (
            <iframe
              src={iframeUrl}
              title="Site Gösterimi"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              onLoad={() => setIframeError(false)}
              onError={() => setIframeError(true)}
            ></iframe>
          )
        ) : (
      
          <HomePage
            centerUrl={centerUrl}
            onCenterUrlChange={handleCenterUrlChange}
            onCenterSearch={handleCenterSearch}
          />
        )}
      </Box>
    </Box>
  );
}

export default App;
