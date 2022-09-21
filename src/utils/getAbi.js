import fetch from 'node-fetch';
const NFT_CONTRACT = '0x32bcec1ed50e2e52b1ad51e5703eda028b3c2a6aee99ffc90b61092027af24f9';
const MUMBAI_CONTRACT='0x74D2707CE861Eb336C2bc779D4Ba92067E469363';
const offset_contract = '0xFAFcCd01C395e4542BEed819De61f02f5562fAEa';
const testAddress = '0xf99d58e463a2e07e5692127302c20a191861b4d6';
const etherscan_apikey = "WFNEX4S15R9XXQBJ5QVCZK1F2NG8PGMIIK";
const POLYGON_API_KEY='41IS7TJKB323F5IYRJ5PBTJ39USW7GH1TA';

async function getAbi() {
    // const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${testAddress}&apikey=${etherscan_apikey}` ; // Etherscan
    
     // Polygonscan
    const url = 
    `https://api.polygonscan.com/api
     ?module=contract
     &action=getabi
     &address=${offset_contract}
     &apikey=${POLYGON_API_KEY}`;
    ;

    const response = await fetch(url);
    const data = await response.json();
    const abi = data.result;
    console.log(abi);
    return abi;
}

getAbi();