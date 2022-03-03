import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import confetti from "canvas-confetti";
import * as anchor from "@project-serum/anchor";
import {PublicKey} from "@solana/web3.js";
import {AnchorWallet, useAnchorWallet, useWallet} from "@solana/wallet-adapter-react";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import {Snackbar} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {AlertState} from './utils';
import {SolendAction, SolendMarket} from "@solendprotocol/solend-sdk";
import {PlayButton} from "./PlayButton";

const treasureSymbol = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

const WalletContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const WalletAmount = styled.div`
  color: black;
  width: auto;
  padding: 5px 5px 5px 16px;
  min-width: 48px;
  min-height: auto;
  border-radius: 22px;
  background-color: white;
  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%);
  box-sizing: border-box;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  font-weight: 500;
  line-height: 1.75;
  text-transform: uppercase;
  border: 0;
  margin: 0;
  display: inline-flex;
  outline: 0;
  position: relative;
  align-items: center;
  user-select: none;
  vertical-align: middle;
  justify-content: flex-start;
  gap: 10px;
`;

const Wallet = styled.ul`
  flex: 0 0 auto;
  margin: 0;
  padding: 0;
`;

const ConnectButton = styled(WalletMultiButton)`
  border-radius: 18px !important;
  padding: 6px 16px;
  background-color: #4E44CE;
  margin: 0 auto;
`;

const Logo = styled.div`
  flex: 0 0 auto;

  img {
    height: 60px;
  }
`;
const Menu = styled.ul`
  list-style: none;
  display: inline-flex;
  flex: 1 0 auto;

  li {
    margin: 0 12px;

    a {
      color: var(--main-text-color);
      list-style-image: none;
      list-style-position: outside;
      list-style-type: none;
      outline: none;
      text-decoration: none;
      text-size-adjust: 100%;
      touch-action: manipulation;
      transition: color 0.3s;
      padding-bottom: 15px;

      img {
        max-height: 26px;
      }
    }

    a:hover, a:active {
      color: rgb(131, 146, 161);
      border-bottom: 4px solid var(--title-text-color);
    }

  }
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 4%;
  margin-left: 4%;
  text-align: center;
  justify-content: center;
`;

const MysteryContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
`;

const DesContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  gap: 20px;
`;

const Image = styled.img`
  height: 400px;
  width: auto;
  border-radius: 7px;
  box-shadow: 5px 5px 40px 5px rgba(0,0,0,0.5);
`;


const PlayButtonContainer = styled.div`
  button.MuiButton-contained:not(.MuiButton-containedPrimary).Mui-disabled {
    color: #464646;
  }

  button.MuiButton-contained:not(.MuiButton-containedPrimary):hover,
  button.MuiButton-contained:not(.MuiButton-containedPrimary):focus {
    -webkit-animation: pulse 1s;
    animation: pulse 1s;
    box-shadow: 0 0 0 2em rgba(255, 255, 255, 0);
  }

  @-webkit-keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 #ef8f6e;
    }
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 #ef8f6e;
    }
  }
`;

export interface HomeProps {
    connection: anchor.web3.Connection;
    txTimeout: number;
    rpcHost: string;
}

const Home = (props: HomeProps) => {
    const [balance, setBalance] = useState<number>();
    const [response, setResponse] = useState("");
    const [alertState, setAlertState] = useState<AlertState>({
        open: false,
        message: "",
        severity: undefined,
    });

    const wallet = useAnchorWallet();
    const { publicKey, sendTransaction } = useWallet();

    async function solend() {
        console.log("start");
        const market = await SolendMarket.initialize(
            props.connection
        );
        await market.loadReserves();

        if (publicKey) {
            const obligation = await market.fetchObligationByWallet(publicKey);
            //USDC
            const isDeposited = obligation?.deposits.find( reserve => reserve.mintAddress === treasureSymbol);
            if(isDeposited){
                console.log(parseFloat(isDeposited.amount.toString())/1000000);
            }
        }

        const solendAction = await SolendAction.buildDepositTxns(
            props.connection,
            "1000000",
            "USDC",
            publicKey as PublicKey,
            "production"
        );
        const resultsDeposit = await solendAction.sendTransactions(sendTransaction);
        console.log(resultsDeposit);
        console.log("end");
    }

    function throwConfetti(): void {
        confetti({
            particleCount: 400,
            spread: 70,
            origin: {y: 0.6},
        });
    }

    /*
                            "tokenAmount": {
                                "amount": "8503319",
                                "decimals": 6,
                                "uiAmount": 8.503319,
                                "uiAmountString": "8.503319"
                            }
  */

    const ref: { current: AnchorWallet | undefined } = useRef();

    useEffect(() => {
            if (wallet?.publicKey.toString() !== ref?.current?.publicKey.toString()) {
                if (wallet) {
                    (async () => {
                        const tokenAccounts = await props.connection.getParsedTokenAccountsByOwner(wallet.publicKey, { mint: new PublicKey(treasureSymbol) });
                        console.log("USDC account");
                        console.log(tokenAccounts);
                        if(tokenAccounts?.value.length > 0) {
                            const tokenAmount = tokenAccounts?.value[0].account.data.parsed.info.tokenAmount;
                            console.log(tokenAmount);
                            setBalance(tokenAmount.uiAmount);
                        }
                    })();
                }
                ref.current = wallet;
            }
    }, [wallet, props.connection]);

    return (
        <main>
            <MainContainer>
                <WalletContainer>
                    <Logo><a href="http://localhost:3000/" target="_blank" rel="noopener noreferrer"><img alt=""
                                                                                                          src="logo.png"/></a></Logo>
                    <Menu />
                    <Wallet>
                        {wallet ?
                            <WalletAmount>{(balance || 0).toLocaleString()} USDC<ConnectButton/></WalletAmount> :
                            <ConnectButton>Connect Wallet</ConnectButton>}
                    </Wallet>
                </WalletContainer>
                <br/>
                <MysteryContainer>
                    <DesContainer>
                        <p>
                            It's <time dateTime={response}>{response}</time>
                        </p>
                        <button onClick={solend}>Click me</button>
                        <PlayButtonContainer>
                            {!wallet ? (
                                <ConnectButton>Connect Wallet</ConnectButton>
                            ) : (
                                    <PlayButton
                                        depositTokens={async () => {}}
                                        withdrawTokens={async () => {}}
                                        isLoading={false}
                                        isDeposited={false}
                                        isOpened={false}
                                    />
                                )
                            }
                        </PlayButtonContainer>
                    </DesContainer>
                </MysteryContainer>
            </MainContainer>
            <Snackbar
                open={alertState.open}
                autoHideDuration={6000}
                onClose={() => setAlertState({...alertState, open: false})}
            >
                <Alert
                    onClose={() => setAlertState({...alertState, open: false})}
                    severity={alertState.severity}
                >
                    {alertState.message}
                </Alert>
            </Snackbar>
        </main>
    );
};

export default Home;
