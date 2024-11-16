// App.tsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
} from '@mui/material';
import WalletIcon from '@mui/icons-material/Wallet';
import { CHAIN_NAMESPACES, IProvider, IAdapter, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";
import RPC from "./ethersRPC"; // Ensure the path is correct
import client_id from "../secret"; // Ensure the path is correct
import { SearchBar } from '../components/SearchBar';
import { HomePage } from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";

import './App.css'; 

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
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

  // State variables for each piece of information
  const [userEmail, setUserEmail] = useState<string>(''); 
  const [accounts, setAccounts] = useState<string>(''); 
  const [balance, setBalance] = useState<string>(''); 
  const [signedMessage, setSignedMessage] = useState<string>(''); 
  const [transactionReceipt, setTransactionReceipt] = useState<string>(''); 

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
      // Clear all info states upon logout
      setUserEmail('');
      setAccounts('');
      setBalance('');
      setSignedMessage('');
      setTransactionReceipt('');
      setIsModalOpen(false); // Close modal on logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Action functions to fetch and set information
  const fetchUserInfo = async () => {
    if (!web3auth) return;
    try {
      const user = await web3auth.getUserInfo();
      // Kullanıcı bilgilerinin yapısına bağlı olarak email alanını çıkarın
      const email = user?.email || "Email bulunamadı";
      setUserEmail(email);
    } catch (error) {
      setUserEmail(`Kullanıcı bilgisi alınamadı: ${String(error)}`);
    }
  };

  const fetchAccounts = async () => {
    if (!provider) {
      setAccounts("Provider not initialized yet");
      return;
    }
    try {
      const address = await RPC.getAccounts(provider);
      setAccounts(address);
    } catch (error) {
      setAccounts(`Error fetching accounts: ${String(error)}`);
    }
  };

  const fetchBalance = async () => {
    if (!provider) {
      setBalance("Provider not initialized yet");
      return;
    }
    try {
      const bal = await RPC.getBalance(provider);
      setBalance(bal);
    } catch (error) {
      setBalance(`Error fetching balance: ${String(error)}`);
    }
  };

  const fetchSignedMessage = async () => {
    if (!provider) {
      setSignedMessage("Provider not initialized yet");
      return;
    }
    try {
      const signedMsg = await RPC.signMessage(provider);
      setSignedMessage(signedMsg);
    } catch (error) {
      setSignedMessage(`Error signing message: ${String(error)}`);
    }
  };

  const fetchTransaction = async () => {
    if (!provider) {
      setTransactionReceipt("Provider not initialized yet");
      return;
    }
    try {
      setTransactionReceipt("Sending Transaction...");
      const txReceipt = await RPC.sendTransaction(provider);
      setTransactionReceipt(JSON.stringify(txReceipt, null, 2));
    } catch (error) {
      setTransactionReceipt(`Error sending transaction: ${String(error)}`);
    }
  };

  // Handle modal open and fetch all info
  const handleOpenModal = async () => {
    setIsModalOpen(true);
    // Fetch all information when modal opens
    await fetchUserInfo();
    await fetchAccounts();
    await fetchBalance();
    await fetchSignedMessage();
    await fetchTransaction();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const loggedInView = (
    <>
      {/* Header with SearchBar and Wallet Icon */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          gap: 2, // Space between SearchBar and Wallet icon
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
        {/* Wallet Icon Button */}
        <IconButton
          onClick={handleOpenModal}
          sx={{
            color: "white",
            backgroundColor: "#f15d2e",
            padding: "10px",
            '&:hover': {
              backgroundColor: "#d14a24",
            },
          }}
        >
          <WalletIcon />
        </IconButton>
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

      {/* Modal for Wallet Information */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <Card>
          <CardHeader
            title={
              <Typography variant="h5" align="center" fontWeight="bold">
                Wallet Information
              </Typography>
            }
          />
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <Typography>Email</Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                <Typography sx={{ flex: 1 }}>{userEmail}</Typography>
                <IconButton onClick={() => copyToClipboard(userEmail)}>
                  <ContentCopyIcon />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography>Account Address</Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                <Typography sx={{ flex: 1 }}>{accounts}</Typography>
                <IconButton onClick={() => copyToClipboard(accounts)}>
                  <ContentCopyIcon />
                </IconButton>
              </Box>
            </Box>
            <Box>
              <Typography>Balance</Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                <Typography sx={{ flex: 1 }}>{balance} ETH</Typography>
              </Box>
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
            <Button
              onClick={logout}
              variant="contained"
              color="error"
              startIcon={<LogoutIcon />}
              className='orangeButton'
            >
              Logout
            </Button>
            <Button
              onClick={handleCloseModal}
              variant="outlined"
              startIcon={<CloseIcon />}
              style={{
                textTransform:'none',
                border: '1px solid #f1572f',
                color:'#f1572f'
              }}
            >
              Close
            </Button>
          </CardActions>
        </Card>
      </Dialog>
    </>
  );

  const unloggedInView = (
    <LoginPage login={login} />
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {loggedIn ? loggedInView : unloggedInView}
    </Box>
  );
}

export default App;
