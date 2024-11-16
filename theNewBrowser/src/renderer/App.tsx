// App.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { CHAIN_NAMESPACES, IProvider, IAdapter, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";
import RPC from "./ethersRPC"; // Ensure the path is correct
import client_id from "../secret"; // Ensure the path is correct
import WalletIcon from '@mui/icons-material/Wallet';
import { SearchBar } from '../components/SearchBar';
import { HomePage } from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';

const clientId = client_id;

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
};

function App() {
  const [url, setUrl] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');
  const [iframeError, setIframeError] = useState(false);
  const [centerUrl, setCenterUrl] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3authInstance = new Web3Auth(web3AuthOptions);
        const adapters = await getDefaultExternalAdapters({ options: web3AuthOptions });
        adapters.forEach((adapter: IAdapter<unknown>) => {
          web3authInstance.configureAdapter(adapter);
        });

        await web3authInstance.initModal();
        setWeb3auth(web3authInstance);
        setProvider(web3authInstance.provider);

        if (web3authInstance.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error("Web3Auth initialization error:", error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.error("Web3Auth not initialized");
      return;
    }
    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      if (web3auth.connected) {
        setLoggedIn(true);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    if (!web3auth) {
      console.error("Web3Auth not initialized");
      return;
    }
    try {
      await web3auth.logout();
      setProvider(null);
      setLoggedIn(false);
      uiConsole("Logged out");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Utility function to log messages to the console
  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const getUserInfo = async () => {
    if (!web3auth) return;
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("Provider not initialized yet");
      return;
    }
    const address = await RPC.getAccounts(provider);
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("Provider not initialized yet");
      return;
    }
    const balance = await RPC.getBalance(provider);
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("Provider not initialized yet");
      return;
    }
    const signedMessage = await RPC.signMessage(provider);
    uiConsole(signedMessage);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("Provider not initialized yet");
      return;
    }
    uiConsole("Sending Transaction...");
    const transactionReceipt = await RPC.sendTransaction(provider);
    uiConsole(transactionReceipt);
  };

  const loggedInView = (
    <>
      {/* Header with SearchBar and Logout Button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
       
          width: '100%',
          gap: 2, // Space between SearchBar and Logout button
        }}
      >
        {/* SearchBar Container */}
        <Box sx={{ flexGrow: 1 }}>
          <SearchBar
            url={url}
            onUrlChange={setUrl}
            onSearch={(e) => {
              e.preventDefault();
              let formattedUrl = url;
              if (!/^https?:\/\//i.test(url)) {
                formattedUrl = 'https://' + url;
              }
              setIframeUrl(formattedUrl);
              setIframeError(false);
              setCenterUrl(url);
            }}
          />
        </Box>
        {/* Logout Button */}
        <Button
          variant="contained"
          color="secondary"
          onClick={logout}
          sx={{backgroundColor:"#f15d2e", padding:"10px", minWidth:"20px" }}
        >
          <WalletIcon></WalletIcon>
        </Button>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {iframeUrl ? (
          iframeError ? (
            <Box
              sx={{
                height: '90%',
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
            onCenterUrlChange={setCenterUrl}
            onCenterSearch={(e) => {
              e.preventDefault();
              let formattedUrl = centerUrl;
              if (!/^https?:\/\//i.test(centerUrl)) {
                formattedUrl = 'https://' + centerUrl;
              }
              setIframeUrl(formattedUrl);
              setIframeError(false);
              setUrl(centerUrl);
            }}
          />
        )}
      </Box>

      {/* Console Output */}
      <Box id="console" sx={{ whiteSpace: 'pre-line', padding: 2 }}>
        <Typography variant="body2" component="p"></Typography>
      </Box>

      {/* Action Buttons */}
      <Box className="flex-container" sx={{ display: 'flex', gap: 2, padding: 2 }}>
        <Button onClick={getUserInfo} variant="outlined">
          Get User Info
        </Button>
        <Button onClick={getAccounts} variant="outlined">
          Get Accounts
        </Button>
        <Button onClick={getBalance} variant="outlined">
          Get Balance
        </Button>
        <Button onClick={signMessage} variant="outlined">
          Sign Message
        </Button>
        <Button onClick={sendTransaction} variant="outlined">
          Send Transaction
        </Button>
      </Box>
    </>
  );

  const unloggedInView = (
    <LoginPage login={login} />
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {loggedIn ? loggedInView : unloggedInView}
      <Box id="console" sx={{ whiteSpace: 'pre-line', padding: 2 }}>
        <Typography variant="body2" component="p"></Typography>
      </Box>
    </Box>
  );
}

export default App;
