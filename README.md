# blockchain-developer-bootcamp-final-project
ConsenSys Blockchain Developer Bootcamp 2021

## Sertifie.me - Verifiable Credentials For Your Events

- Users can create profiles with their information.
- Organizations can be created by users and can create sub-identities (admins) for validating attendees.
- Organizations can create events.
  - Event data is stored for certifications.
- Attendees can attend events via an application (Inıtially scanning a QR code).
  - Attendees's time is recorded (in and out).
  - At the end of each event, users scan a final QR code to declare their attendance and get their certificate.

## Get Started
If you don't have truffle, install it:\
`$ npm i -g truffle`

If you don't have ganache, download it from https://www.trufflesuite.com/ganache

Create a new Ethereum workspace in Ganache UI (Quickstart Ethereum) and set its port number to `7545`

Add a new network to Metamask (Localhost 7545)

```
Network Name: Localhost 7545

New RPC URL: HTTP://127.0.0.1:7545

Chain ID: 1337

Currency Symbol: ETH
```

Open a terminal in the root folder:\
`$ cd blockchain`

`$ truffle compile`

`$ truffle migrate --network development`

Copy the deployed `Users` contract address and use it as `VUE_APP_USERS_CONTRACT_ADDRESS` variable under `.env`.

Open a new terminal in the root folder:\
`$ cd frontend`

`$ npm install`

`$ npm run serve`

Check the browser console if the contract is deployed and can be used on the frontend.