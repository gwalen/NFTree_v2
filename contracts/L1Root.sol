pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import { BaseRoot } from "./BaseRoot.sol";
import { ITreeMinter } from "./ITreeMinter.sol";
import { CrossChainMinter } from "./CrossChainMinter.sol";

// TODO: afrter tests L1Root should not implement ITreeMinter 
contract L1Root is ERC721, BaseRoot, CrossChainMinter {


  //TODO:
  // - udate optimism local docker compose
  // - update libs in contracts to use latest optimism versions
  // - change TS files according to new tutorial
  
  //TODO: contract name mustbe L1Root
  constructor(address _l1messenger) ERC721("L1Root", "RT") CrossChainMinter(_l1messenger) {}  

  string[][]  testArray;
  function testCrossChainMint(address l2Owner) public {
    testArray.push(["root", "node1", "node2"]);
    testArray.push(["node1", "node3"]);

    mintOnExternalChain(l2Owner, testArray);
  }

  function crossChainMint(address l2Owner, uint256 rootId) public {
    string[][] memory exportTree = buildTreeForExportWithHash(rootId);
    mintOnExternalChain(l2Owner, exportTree);
  }

  string public transferedStringData;
  function crossChainStringTransfer(address owner, string memory data) external override {
    // require(0 > 1, "Not implemeted"); 
    transferedStringData = data; 
  }

  function testStringTransfer(address l2Owner, string memory strData) public {
    sendString(l2Owner, strData);
  }

  string[][] public transferedStringArrayData;
  function crossChainStringArrayTransfer(address owner, string[][] memory data) external override {
    transferedStringArrayData = data;
  }

  function getTransferredStringArrayData() public view returns(string[][] memory) {
    return transferedStringArrayData;
  } 
  
  function testStringArrayTransfer(address l2Owner, string[][] memory strArrData) public {
    sendStringArray(l2Owner, strArrData);
  }

  uint256[] public argsForMintNode;
  function getCheckUintArray() public returns(uint256[] memory) {
    // argsForMintNode[0] = 1; // fails with invalid opcode // TODO: read more about arrays to understand why
    argsForMintNode.push(1);   // work
    return argsForMintNode;
  }

}