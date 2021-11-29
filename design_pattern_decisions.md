# blockchain-developer-bootcamp-final-project
ConsenSys Blockchain Developer Bootcamp 2021

## Sertifie.me - Design Pattern Decisions

### 1-Access Control Design Patterns

- Restricting access to certain functions using things like `AccessControl`
  - Users can create organizations, and those organizations must run by the owner and/or the admins.

### 2-Inheritance and Interfaces 

- `Organization.sol` is a seperate contract which is deployed each time when a user creates an organization.
  - The need of the seperate contract implementation is for adding more transparent and decentralized features to the organizations in the future.

### 3-Optimizing Gas

-