# naka-connect-js

# Naka Connect

Naka connect is a simple javascript library that connects apps to Naka Wallet to retrieve user wallet addresses and sign transactions.

# Installation

With Yarn:
```
  yarn add https://github.com/TrustlessComputer/naka-connect-js
  
  const CONNECT_URL = 'https://api.nakachain.xyz';
  const WALLET_URL = 'https://nakachain.xyz/signer';
```

# Connect wallet

### 1. Example code
```javascript
import * as nakaConnect from "naka-connect-js";

const connector = new nakaConnect.DappConnect(CONNECT_URL, WALLET_URL);

try {
  const accounts = await connector.requestAccount({
    target: "popup",
  });
  console.log("accounts", accounts);
} catch (e) {
  // todo handle error
  // Reject | Create transaction error
}
```
### 2. Request
- `target`: window.open type `"_blank" | "_parent" | "_self" | "_top" | "popup"`

### 3. Response
- `accounts`: Wallet's list of available accounts.
    - `address`: The account name.

# Sign Message

### 1. Example code
```javascript
import * as nakaConnect from "naka-connect-js";

const connector = new nakaConnect.DappConnect(CONNECT_URL, WALLET_URL);

try {
  const resp = await connection.requestSignMessage({
      target: "popup",
      signMessage: "Hello world.",
  })
  console.log("sign response", resp);
} catch (e) {
  // todo handle error
  // Reject | Create transaction error
}
```
### 2. Request
- `target`: window.open type `"_blank" | "_parent" | "_self" | "_top" | "popup"`

### 3. Response
- `accounts`: Wallet's list of available accounts.
    - `address`: The account name.
- `signature`: The signature is signed by first `address`.


# Sign Transaction

## Contract Integration

### 1. Define ABI
```javascript
const ABI = [
  {
    "inputs": [
      {
        "internalType": "contract WrappedToken",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "externalAddr",
        "type": "string"
      }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
];
```

### 2: Create calldata
```javascript
import { ethers } from "ethers";

const ContractInterface = new ethers.utils.Interface(ABI);
const encodeAbi = ContractInterface.encodeFunctionData("burn", [
    tokenAddress,
    burnAmount,
    receiver
]);
```
### 3. Request sign transaction
```javascript
import * as nakaConnect from "naka-connect-js";

const connector = new nakaConnect.DappConnect(CONNECT_URL, WALLET_URL);

const toAddress = "0xd07a71011d5eDF06743EBd6AD848FE0C13D2DB2b";

const response = await connector.requestSign({
    target: "popup",
    calldata: encodeAbi,
    to: toAddress,
    value: "",
    functionType: 'Burn',
    functionName: 'burn(address,uint256,string)',
    chainType: 'NAKA',
});

console.log('Sign transaction response: ', response);
```
### 4. Request Payload
- `target`: window.open type `"_blank" | "_parent" | "_self" | "_top" | "popup"`

- `calldata`: calldata for sign and send transaction.

- `to`: destination address.

- `value`: `optional` value NativeToken sending transaction. // 1e18 = 1 BVM

- `chainType`: NAKA | RUNE | EAI | string. // or chainID

### 5. Response Payload
- `hash`: Transaction hash.

- `to`: `optional`destination address.

- `from`: sender address.