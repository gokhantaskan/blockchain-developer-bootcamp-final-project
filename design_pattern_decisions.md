# blockchain-developer-bootcamp-final-project
ConsenSys Blockchain Developer Bootcamp 2021

## Sertifie.me - Design Pattern Decisions

### 1-Access Control Design Patterns

- Restricting access to certain functions using things like `Ownable`
- 
### 2-Inheritance and Interfaces 

- Importing and extending contracts and/or using contract interfaces

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