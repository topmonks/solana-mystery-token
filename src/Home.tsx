import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import confetti from "canvas-confetti";
import * as anchor from "@project-serum/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";
import {
  AnchorWallet,
  useAnchorWallet,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import { AlertState } from "./utils";
import { SolendAction, SolendMarket } from "@solendprotocol/solend-sdk";
import { Jupiter, RouteInfo, TOKEN_LIST_URL } from "@jup-ag/core";
import { PlayButton } from "./PlayButton";
import { TextField } from "@mui/material";
import MysteryBox from "./MysteryBox";

const treasure = {
  address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  decimals: 6,
  code: "USDC",
};

let setPrecision = function (value: number, digits: number) {
  return Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits);
};

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
  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%),
    0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%);
  box-sizing: border-box;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
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
  background-color: #4e44ce;
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

    a:hover,
    a:active {
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
  box-shadow: 5px 5px 40px 5px rgba(0, 0, 0, 0.5);
`;

export const RefuseTokenLink = styled.a`
  display: block !important;
  margin: 20px auto !important;
  color: var(--disabled) !important;
  font-size: 1em !important;
  text-decoration: underline;
  cursor: pointer !important;
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
  network: string;
}

const Home = (props: HomeProps) => {
  const [balance, setBalance] = useState<number>();
  const [response, setResponse] = useState("");
  const [mysteryValue, setMysteryValue] = useState(getMysteryProfit());
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [boxState, setBoxState] = useState("");
  const [amount, setAmount] = useState("");
  const [openCube, setOpenCube] = useState(() => {});

  const wallet = useAnchorWallet();
  const { publicKey, sendTransaction } = useWallet();

  function setExistingSolendTreasureDeposit(amount: number) {
    localStorage.setItem(
      "depositedBeforeCreate",
      (amount * 1000000).toString()
    );
    console.log(localStorage.getItem("depositedBeforeCreate"));
  }

  function getExistingSolendTreasureDeposit() {
    const value = localStorage.getItem("depositedBeforeCreate");
    return value
      ? setPrecision(parseFloat(value) / 1000000, treasure.decimals)
      : 0;
  }

  function setMysteryLockedValue(value: number) {
    localStorage.setItem("mysteryLockedValue", (value * 1000000).toString());
    console.log(localStorage.getItem("mysteryLockedValue"));
  }

  function getMysteryLockedValue() {
    const value = localStorage.getItem("mysteryLockedValue");
    return value
      ? setPrecision(parseFloat(value) / 1000000, treasure.decimals)
      : 0;
  }

  function setMysteryProfit(amount: number) {
    localStorage.setItem("mysteryProfit", (amount * 1000000).toString());
  }

  function getMysteryProfit() {
    const profit = localStorage.getItem("mysteryProfit");
    return profit
      ? setPrecision(parseFloat(profit) / 1000000, treasure.decimals)
      : 0;
  }

  async function getSolendTreasureDeposit() {
    console.log("start get existing solend deposit");
    const market = await SolendMarket.initialize(props.connection);
    await market.loadReserves();
    if (publicKey) {
      const obligation = await market.fetchObligationByWallet(publicKey);
      //USDC
      const isDeposited = obligation?.deposits.find(
        (reserve) => reserve.mintAddress === treasure.address
      );
      if (isDeposited) {
        console.log(isDeposited.amount.toString());
        return setPrecision(
          parseFloat(isDeposited.amount.toString()) / 1000000,
          treasure.decimals
        );
      }
    }
    console.log("end");
    return 0;
  }

  async function depositToSolend(amount: number) {
    console.log("start solend deposit");

    const solendAction = await SolendAction.buildDepositTxns(
      props.connection,
      (amount * 1000000).toString(),
      treasure.code,
      publicKey as PublicKey,
      "production"
    );
    console.log("end");
    setMysteryLockedValue(amount);
    return await solendAction.sendTransactions(sendTransaction);
  }

  async function withdrawFromSolend(amount: number) {
    console.log("start solend withdraw");
    console.log(setPrecision(amount * 1000000, 0).toString());

    const solendAction = await SolendAction.buildWithdrawTxns(
      props.connection,
      setPrecision(amount * 1000000, 0).toString(),
      treasure.code,
      publicKey as PublicKey,
      "production"
    );
    const result = await solendAction.sendTransactions(sendTransaction);
    if (result) {
      console.log(result);
      console.log("end");
    }
    return result;
  }

  async function claimMysteryReward() {
    const profitAmount = getMysteryProfit();
    console.log("Going to claim mystery for " + profitAmount.toString());
    const jupiter = await Jupiter.load({
      connection: props.connection,
      cluster: "mainnet-beta",
      user: publicKey as PublicKey,
    });

    const routes = await jupiter.computeRoutes({
      inputMint: new PublicKey(treasure.address),
      outputMint: new PublicKey("HBB111SCo9jkCejsZfz8Ec8nH7T6THF8KEKSnvwT6XK6"),
      inputAmount: profitAmount * 1000000,
      slippage: 1,
      forceFetch: true,
    });
    console.log(routes);
    // Prepare execute exchange
    const { transactions } = await jupiter.exchange({
      route: routes!.routesInfos[0],
    });
    const { setupTransaction, swapTransaction, cleanupTransaction } =
      transactions;
    const txid = await sendTransaction(swapTransaction, props.connection);
    await props.connection.confirmTransaction(txid, "processed");
    console.log(`https://solscan.io/tx/${txid}`);
    return txid;
  }

  async function createMystery() {
    const existingDeposit = await getSolendTreasureDeposit();
    setExistingSolendTreasureDeposit(existingDeposit);
    const txnDeposit = await depositToSolend(parseFloat(amount));
    if (txnDeposit) {
      console.log(txnDeposit);
      changeBoxState("created");
    }
  }

  async function calculateMysteryProfit() {
    const mysteryLockedValue = getMysteryLockedValue();
    console.log("mysteryLockedValue: " + mysteryLockedValue);
    const actualTreasureDeposit = await getSolendTreasureDeposit();
    console.log("actualTreasureDeposit: " + actualTreasureDeposit);
    if (actualTreasureDeposit > 0) {
      const existingTreasureDeposit = getExistingSolendTreasureDeposit();
      console.log("existingTreasureDeposit: " + existingTreasureDeposit);
      const mysteryProfit = setPrecision(
        actualTreasureDeposit - existingTreasureDeposit - mysteryLockedValue,
        treasure.decimals
      );
      console.log("mysteryProfit: " + mysteryProfit);
      setMysteryProfit(mysteryProfit);
      setMysteryValue(mysteryProfit);
      return { mysteryProfit, mysteryLockedValue };
    } else {
      return { mysteryProfit: 0, mysteryLockedValue };
    }
  }

  async function openMystery() {
    const data = await calculateMysteryProfit();
    const valueToWithdraw = data.mysteryProfit + data.mysteryLockedValue;
    await withdrawFromSolend(valueToWithdraw);
    changeBoxState("opened");
  }

  function throwConfetti(): void {
    confetti({
      particleCount: 400,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  const resetBox = () => {
    localStorage.removeItem("isBox");
    localStorage.removeItem("depositedBeforeCreate");
    localStorage.removeItem("mysteryLockedValue");
    localStorage.removeItem("mysteryProfit");
    localStorage.removeItem("awardToken");
    setBoxState("");
  };

  const changeBoxState = (state: string) => {
    localStorage.setItem("isBox", state);
    setBoxState(state);
  };

  async function getWalletTreasureBalance(wallet: any) {
    const tokenAccounts = await props.connection.getParsedTokenAccountsByOwner(
      wallet.publicKey,
      { mint: new PublicKey(treasure.address) }
    );
    console.log("USDC account");
    console.log(tokenAccounts);
    if (tokenAccounts?.value.length > 0) {
      const tokenAmount =
        tokenAccounts?.value[0].account.data.parsed.info.tokenAmount;
      console.log(tokenAmount);
      return tokenAmount.uiAmount;
    }
  }

  function destroyMysteryToken() {
    resetBox();
  }

  function getMyBox() {
    const defaultBox = {
      address: wallet?.publicKey?.toString(),
      state: null,
      depositedBeforeCreate: null,
      mysteryLockedValue: null,
      mysteryProfit: null,
      awardToken: null,
    };
    const boxes = localStorage.getItem("boxes");
    if (boxes === null) {
      localStorage.setItem("boxes", JSON.stringify([defaultBox]));
      return defaultBox;
    } else {
      const boxesJson = JSON.parse(boxes);
      const myBox = boxesJson.find(
        (x: { address: string }) => x.address === wallet?.publicKey.toString()
      );
      if (myBox) {
        return myBox;
      } else {
        //Add box for new address
        boxesJson.push(defaultBox);
        localStorage.setItem("boxes", JSON.stringify(boxesJson));
        return defaultBox;
      }
    }
  }

  const ref: { current: AnchorWallet | undefined } = useRef();

  useEffect(() => {
    if (wallet?.publicKey.toString() !== ref?.current?.publicKey.toString()) {
      if (wallet) {
        (async () => {
          const uiAmount = await getWalletTreasureBalance(wallet);
          setBalance(uiAmount);
          const myBox = getMyBox();

          if (myBox.state === "created") {
            //show starts of actual box
            console.log("Our mystery box...");
            await calculateMysteryProfit();
          } else if (myBox.state === "opened") {
            //show starts of actual box
            console.log("Claim from mystery box...");
          } else {
            //UI to crate new mystery box
            console.log("No mystery box, create one!");
          }
        })();
      }
      ref.current = wallet;
    }
  }, [wallet, props.connection]);

  useEffect(() => {
    (async () => {
      console.log("Let's go update balance!");
      if (wallet) {
        const uiAmount = await getWalletTreasureBalance(wallet);
        setBalance(uiAmount);
      }
    })();
  }, [boxState]);

  return (
    <main>
      <MainContainer>
        <WalletContainer>
          <Logo>
            <a
              href="http://localhost:3000/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img alt="" src="logo.png" />
            </a>
          </Logo>
          <Menu />
          <Wallet>
            {wallet ? (
              <WalletAmount>
                {(balance || 0).toLocaleString()} USDC
                <ConnectButton />
              </WalletAmount>
            ) : (
              <ConnectButton>Connect Wallet</ConnectButton>
            )}
          </Wallet>
        </WalletContainer>
        <br />
        <MysteryContainer>
          <DesContainer>
            <MysteryBox boxState={boxState} setOpenCube={setOpenCube} />
            {boxState === "created" && (
              <p style={{ color: "#fe9110" }}>
                Mystery value: {mysteryValue} USDC
              </p>
            )}
            {boxState === "" && (
              <TextField
                style={{ width: "300px", margin: "auto" }}
                id="outlined-basic"
                label="Amount"
                variant="outlined"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            )}
            <PlayButtonContainer>
              {!wallet ? (
                <ConnectButton>Connect Wallet</ConnectButton>
              ) : (
                <div>
                  <PlayButton
                    createMystery={async () => {
                      console.log("Creating...");
                      // await createMystery();
                      changeBoxState("created");
                    }}
                    openMystery={async () => {
                      console.log("Opening...");
                      // await openMystery();
                      changeBoxState("opened");
                    }}
                    claimMystery={async () => {
                      console.log("Claiming...");
                      // const claimResult = await claimMysteryReward();
                      // if (claimResult) {
                      resetBox();
                      // }
                    }}
                    boxState={boxState}
                    mysteryValue={mysteryValue}
                  />
                  {boxState === "opened" && (
                    <RefuseTokenLink
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want destroy Mystery token?"
                          )
                        ) {
                          destroyMysteryToken();
                        }
                      }}
                    >
                      Destroy MYSTERY TOKEN and keep profit {mysteryValue} USDC
                    </RefuseTokenLink>
                  )}
                </div>
              )}
            </PlayButtonContainer>
          </DesContainer>
        </MysteryContainer>
      </MainContainer>
      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </main>
  );
};

export default Home;
