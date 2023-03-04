import './App.css';
import { ethers } from "ethers";
import React, { useState, useEffect } from 'react';
// import nftContract from './contracts/Editorial.json';
import nftContract from './contracts/EditorialBookStandard.json';
// const NFT_CONTRACT_ADDRESS = '0x74D2707CE861Eb336C2bc779D4Ba92067E469363';

const CONTRACT_ADDRESS_STANDARD = '0x54521635D4dEd541998750bc45e68C07c42A53E9';
const CONTRACT_ADDRESS_PREMIUM = '0x315cD7C85207994ad4E84963619aa8507C858102';

const mumbai_chainId = '80001';
const mumba_hex_chainId = '0x13881';

function App() {

  const [ currentAccount, setCurrentAccount ] = useState("");
  const [ standardBalance, setStandardBalance ] = useState( "" );
  const [ premiumBalance, setPremiumBalance ] = useState( "" );

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

      let decimals = 0;

      const connectedContract = new ethers.Contract( CONTRACT_ADDRESS_PREMIUM, nftContract.abi, signer );

      const balance = await connectedContract.balanceOf( currentAccount );
      const stringBalance = ethers.BigNumber.from( balance._hex ).toString();
      const formatedBalance = ethers.utils.formatUnits( stringBalance, decimals );
      
      console.log( formatedBalance );

      console.log(`Your address ${currentAccount} has ${balance} NFT` );

      setStandardBalance( formatedBalance );
      
      return balance;

    } catch ( error ) {
      console.log( "This error: ", error );
    }
  }

  return (
    <>
      <div>
        { currentAccount === "" ? ( 
          <button onClick={ connectWallet }>Sign In</button>
          ) : ( <button onClick={ nftBalance }>Get Balance</button> )
        }
      </div>

      <div>
        {
           standardBalance === "" ? ("") : ( 
           <div> You have { standardBalance } Standard NFTs </div>
           )
        }
      </div>

      <div>
        {
           premiumBalance === "" ? ("") : ( 
           <div> You have { premiumBalance } Premium NFTs </div>
           )
        }
      </div>


    </>
  );
}

export default App;
