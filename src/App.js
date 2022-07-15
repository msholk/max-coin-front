import React from 'react';
import { useState, useEffect } from "react";


import { Tokenomics } from "./components/Tokenomics";
import { TokenInfo } from './components/TokeInfo'
import { OwnersInfo } from './components/OwnersInfo'
import { TokenTransfer } from './components/TokenTransfer'

import { checkIfWalletIsConnected } from './utils/wallet'
import _ from 'lodash'
function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [inputValue, setInputValue] = useState({
    walletAddress: "0xc80d900de370d9A059E2b27f9b89e7e419B5020A",
    transferAmount: "10",
    burnAmount: "",
    mintAmount: "",
  });
  const [accountsConnected, setAccountsConnected] = useState(0);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [balance, setBalance] = useState(0);
  const [tokenTotalSupply, setTokenTotalSupply] = useState(0);
  const [isTokenOwner, setIsTokenOwner] = useState(false);
  const [tokenOwnerAddress, setTokenOwnerAddress] = useState(null);
  const [yourWalletAddress, setYourWalletAddress] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState("");
  const [eventsLog, setEventsLog] = useState([]);
  const stObj = {
    setTokenName, setTokenSymbol, setTokenTotalSupply, setIsTokenOwner, setTokenOwnerAddress,
    setYourWalletAddress, setIsWalletConnected,
    setError, setAccountsConnected, isWalletConnected, accountsConnected, setBalance,
    eventsLog
  }
  const evLog = eventsLog || []




  const handleInputChange = (event) => {
    setInputValue((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  const registerEvent = (ev) => {
    evLog.push(ev)
    setEventsLog(_.cloneDeep(evLog))
  }
  useEffect(() => {
    checkIfWalletIsConnected({ ...stObj, registerEvent: registerEvent });
  }, []);

  let block = busy && (
    < div className="mw-50p alert alert-danger" data-mdb-color="danger" >
      {busy}
    </div >
  )
  if (!block) {
    block = (
      <>
        <TokenTransfer {...{
          handleInputChange,
          tokenSymbol,
          inputValue,
          setError,
          accountsConnected,
          setBusy
        }} />
        {isTokenOwner && (
          <Tokenomics
            {...{
              handleInputChange,
              tokenSymbol,
              inputValue,
              setBusy,
              ...stObj
            }}
          />
        )}
      </>
    )
  }
  return (
    <main>
      <h2 className="h1 fw-bold">Max Coin</h2>
      <section className="px-10 pt-1 pb-10">
        {error && (
          <div className="mw-50p alert alert-danger" data-mdb-color="danger">
            {error}
          </div>)}
        <TokenInfo {...{
          tokenName,
          tokenSymbol,
          tokenTotalSupply,
          isWalletConnected
        }} />
        <OwnersInfo {...{
          tokenOwnerAddress,
          yourWalletAddress,
          accountsConnected,
          isWalletConnected,
          tokenSymbol,
          balance
        }} />
        {block}
      </section>
    </main>
  );
}

export default App;
