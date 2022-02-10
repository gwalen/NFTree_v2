/**
 * @type import('hardhat/config').HardhatUserConfig
 */

 import { HardhatUserConfig } from "hardhat/types";

 import "@nomiclabs/hardhat-waffle";
 import "hardhat-typechain";
//  import '@eth-optimism/hardhat-ovm';
 
 const config: HardhatUserConfig = {
     defaultNetwork: "hardhat",
     solidity: {
         compilers: [{ version: "0.7.6", settings: {} }],
       },
     networks: {
       hardhat: {},
       optimism: {
        url: 'http://127.0.0.1:8545',
        accounts: {
          mnemonic: 'test test test test test test test test test test test junk'
        },
        gasPrice: 0
      }
       // rinkeby: {
       //   url: `https://ropsten.infura.io/v3/5e51ff14ecd24a7faf37b5311c4bd61e`,
       //   accounts: [RINKEBY_PRIVATE_KEY],
       // },
     },  
 };
 export default config;
 
 
 
 