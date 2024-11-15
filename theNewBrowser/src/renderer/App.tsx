import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

import { IProvider, SafeEventEmitterProvider } from '@web3auth/base';
import { SearchBar } from '../components/SearchBar';
import { HomePage } from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';

function App() {
  const [url, setUrl] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');
  const [iframeError, setIframeError] = useState(false);
  const [centerUrl, setCenterUrl] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [provider, setProvider] = useState<IProvider | null>(null);

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
      {loggedIn ? (
        <>
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
                      This site cannot be displayed in an iframe.
                    </Typography>
                    <Typography variant="body1">
                      Please try a different site or open it in a new tab.
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <iframe
                  src={iframeUrl}
                  title="Site Display"
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
        </>
      ) : (
        <LoginPage loggedIn={loggedIn} setLoggedIn={setLoggedIn} provider={provider} setProvider={setProvider} />
      )}
    </Box>
  );
}

export default App;
