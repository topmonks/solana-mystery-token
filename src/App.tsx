import React from "react";

import { createTheme, ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolflareWebWallet,
  getSolletWallet,
  getSolletExtensionWallet,
  getSolongWallet,
  getLedgerWallet,
  getSafePalWallet,
} from "@solana/wallet-adapter-wallets";

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import "./App.css";
import Home from "./Home";
import { amber, deepOrange, grey } from "@mui/material/colors";

require("@solana/wallet-adapter-react-ui/styles.css");

const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;
const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost);

const txTimeout = 30000; // milliseconds (confirm this works for your project)

const getDesignTokens = () => {
  return createTheme({
    palette: {
      mode: "dark",
      primary: {
        ...amber,
        ...{
          main: amber[300],
        },
      },
      ...{
        background: {
          default: deepOrange[900],
          paper: deepOrange[900],
        },
      },
      text: {
        ...{
          primary: "#fe9110",
          secondary: grey[500],
        },
      },
    },
  });
};

const App = () => {
  // Custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), []);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSlopeWallet(),
      getSolflareWallet(),
      getSolflareWebWallet(),
      getSolletWallet({ network }),
      getSolletExtensionWallet({ network }),
      getSolongWallet(),
      getLedgerWallet(),
      getSafePalWallet(),
    ],
    []
  );

  const darkModeTheme = createTheme(getDesignTokens());

  return (
    <ThemeProvider theme={darkModeTheme}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={true}>
          <WalletModalProvider>
            <Home
              connection={connection}
              txTimeout={txTimeout}
              rpcHost={rpcHost}
              network={network}
            />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
};

export default App;
