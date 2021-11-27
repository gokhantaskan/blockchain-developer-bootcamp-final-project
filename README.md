# blockchain-developer-bootcamp-final-project
ConsenSys Blockchain Developer Bootcamp 2021

## Sertifie.me - Verifiable Credentials For Your Events

https://sertifieme.netlify.app

- ✅ Users can create profiles with their information.
  - ✅ Later on, users can update their e-mail/phone number, delete, and re-create their profile.
  - ✅ Users can not take any national ID, e-mail, and phone if they are already taken by another user.
- ✅ Organizations can be created by users and can create sub-identities (admins) for validating attendees.
- ❎ Organizations can create events.
- ❎ Attendees can attend events via an application (Inıtially scanning a QR code).
  - ❎ Attendees's time is recorded (in and out).
  - ❎ At the end of each event, users scan a final QR code to declare their attendance and get their certificate.

## Get Started
If you don't have Truffle, install it:\
`$ npm i -g truffle`

If you don't have Ganache, download it from https://www.trufflesuite.com/ganache

Create a new Ethereum workspace in Ganache UI (Quickstart Ethereum) and set its port number to `7545`

Add a new network to Metamask (Localhost 7545)

```
Network Name: Localhost 7545

New RPC URL: HTTP://127.0.0.1:7545

Chain ID: 1337

Currency Symbol: ETH
```

Open Ganache and then open a terminal in the root folder:\
`$ cd blockchain`

`$ npm install`

`$ npm run migrate`

Copy the deployed `Users` contract address, create a `.env` file under `frontend` folder and set the address as `VUE_APP_USERS_CONTRACT_ADDRESS` variable.

After that, open `blockchain/build/contracts` folder and copy `abi` in `Users.json` and `Organization.json` file. Paste it inside `frontend/abi/Users.json` and `frontend/abi/Organization.json`.
```
/// Example
{
  "abi": [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "addr",
          "type": "address"
        },
        ...
      ]
    }
  ]
}
```

---

Open a new terminal in the root folder:\
`$ cd frontend`

`$ npm install`

`$ npm run serve`

Now, you can start using it!