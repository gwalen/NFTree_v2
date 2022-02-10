pragma solidity >=0.6.0 <0.8.0;

pragma experimental ABIEncoderV2;

/* Library Imports */
import { CrossDomainEnabled } from "@eth-optimism/contracts/libraries/bridge/CrossDomainEnabled.sol";

import { ITreeMinter } from "./ITreeMinter.sol";

abstract contract CrossChainMinter is CrossDomainEnabled {

  // amount of gas used to finish transaction on other chain (taken from l2->l1 optimism exmaple)
  uint32 internal constant EXTERNAL_CHAIN_GAS = 2000000;

  /********************************
    * External Contract References *
    ********************************/

  address public externalMinter;

  constructor(address _IntenalMessenger) CrossDomainEnabled(_IntenalMessenger) {}

  function initExternalMinter(address _ExternalMinter) public {
    externalMinter = _ExternalMinter;        
  }

  function mintOnExternalChain(address externalChainOwner, string[][] memory tree) internal {
    
    bytes memory data = abi.encodeWithSelector(
      ITreeMinter.mintTree.selector,
      externalChainOwner,
      tree
    );

    // Send calldata to other chain
    sendCrossDomainMessage(
      externalMinter,
      EXTERNAL_CHAIN_GAS,
      data
    );
  }

  function sendString(address externalChainOwner, string memory strData) internal {
    
    bytes memory data = abi.encodeWithSelector(
      ITreeMinter.crossChainStringTransfer.selector,
      externalChainOwner,
      strData
    );

    // Send calldata to other chain
    sendCrossDomainMessage(
      externalMinter,
      EXTERNAL_CHAIN_GAS,
      data
    );
  }

  function sendStringArray(address externalChainOwner, string[][] memory strArrData) internal {
    bytes memory data = abi.encodeWithSelector(
      ITreeMinter.crossChainStringArrayTransfer.selector,
      externalChainOwner,
      strArrData
    );

    // Send calldata to other chain
    sendCrossDomainMessage(
      externalMinter,
      EXTERNAL_CHAIN_GAS,
      data
    );
  }

}



