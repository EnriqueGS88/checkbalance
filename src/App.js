import './App.css';
import { ethers } from "ethers";
import React, { useState, useEffect } from 'react';
import nftContract from './contracts/Editorial.json';
const NFT_CONTRACT_ADDRESS = '0x74D2707CE861Eb336C2bc779D4Ba92067E469363';
const mumbai_chainId = '80001';
const mumba_hex_chainId = '0x13881';

function App() {

  const [ currentAccount, setCurrentAccount ] = useState("");

  const checkIfWalletIsConnected = async () => {

    // Check if metamask is installed
    const { ethereum } = window;

    if( !ethereum ) {
      console.log( "You need to install Metamask" );
      return;
    } else {
      console.log( "We found Metamask in your browser" );
    }

    // check if user is in the right network
    let chainId = await ethereum.request( { method: 'eth_chainId' } );
    console.log( "Connected to chain ", chainId );

    // const polygonChainId = "0x89";
    const mumbaiChainId = mumba_hex_chainId;
    if ( chainId !== mumbaiChainId ) {
      alert( "Open Metamask and switch network to Mumbai Polygon" );
    }

    // check if we are authorized to access the wallet
    const accounts = await ethereum.request( { method: 'eth_accounts' } );

    // If user has multiple accounts, pick the first one
    if ( accounts.length !== 0 ) {
      const account = accounts[0];
      console.log( "Found an account: ", account );
      setCurrentAccount( account );

      // Setup event listener - for the case where the wallet had been connected before
      // setupEventListener();
    } else {
      console.log( "No authorized account" );
    }

  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if( !ethereum ) {
        alert( "You need to install metamask first");
        return;
      }

      // Method to request access to account
      const accounts = await ethereum.request( { method: 'eth_requestAccounts' } );

      // print out public address after getting authorization
      console.log( "Connected ", accounts[0] );
      setCurrentAccount( accounts[0] );

      // Setup listener - for the user that connects wallet for first time
      // setupEventListener();

    } catch ( error ) {
      console.log( error );
    }

  }

  useEffect( () => {
    checkIfWalletIsConnected();
  }, [] );
  
  // Call balanceOf() function in contract to check NFT balance in connected wallet
  const nftBalance = async () => {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider( ethereum );
      const signer = provider.getSigner();
      const tokenId = '0000000000000000001';

      const connectedContract = new ethers.Contract( NFT_CONTRACT_ADDRESS, nftContract.abi, signer );

      const balance = await connectedContract.balanceOf( currentAccount, tokenId );

      console.log(`Your address ${currentAccount} has ${balance} NFT` );
      
      return balance;

    } catch ( error ) {
      console.log( "This error: ", error );
    }
  }

  // <div>Your balance is: { nftBalance } </div>
  // <button onClick={ nftBalance }>Get Balance</button>

  return (
    <>
      <div>
        { currentAccount === "" ? ( 
          <button onClick={ connectWallet }>Sign In</button>
          ) : ( <button onClick={ nftBalance }>Get Balance</button> )
        }
        </div>
    </>
  );
}

export default App;
