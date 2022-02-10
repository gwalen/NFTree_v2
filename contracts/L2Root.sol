pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import { BaseRoot } from "./BaseRoot.sol";
import { ITreeMinter } from "./ITreeMinter.sol";
import { CrossChainMinter } from "./CrossChainMinter.sol";

contract L2Root is ERC721, BaseRoot, CrossChainMinter  {

  // TODO: remove _l1Minter from constructor and move to init method that can be called after L1 and L2 root contracts are ready and can be passed to each other
  constructor(address _l2messenger) ERC721("L2Root", "RT") CrossChainMinter(_l2messenger) {}  

  function crossChainMint(address l1Owner, uint256 rootId) public {
    string[][] memory exportTree = buildTreeForExportWithHash(rootId);
    mintOnExternalChain(l1Owner, exportTree);
  }

  // function getArgsForMintNode() public view returns(string[][] memory) {
  string public transferedStringData;
  function crossChainStringTransfer(address owner, string memory data) external override {
    // require(0 > 1, "Not implemeted"); 
    transferedStringData = data; 
  }

  function testStringTransfer(address l1Owner, string memory strData) public {
    sendString(l1Owner, strData);
  }

  string[][] public transferedStringArrayData;
  function crossChainStringArrayTransfer(address owner, string[][] memory data) external override {
    transferedStringArrayData = data;
  } 

  function getTransferredStringArrayData() public view returns(string[][] memory) {
    return transferedStringArrayData;
  }
  
  function testStringArrayTransfer(address l1Owner, string[][] memory strArrData) public {
    sendStringArray(l1Owner, strArrData);
  }

  uint256[] public argsForMintNode;
  function getCheckUintArray() public returns(uint256[] memory) {
    // argsForMintNode[0] = 1; // fails with invalid opcode // TODO: read more about arrays to understand why
    argsForMintNode.push(1);   // work
    return argsForMintNode;
  }


//    function uint2str(
//   uint256 _i
// )
//   internal
//   pure
//   returns (string memory str)
// {
//   if (_i == 0)
//   {
//     return "0";
//   }
//   uint256 j = _i;
//   uint256 length;
//   while (j != 0)
//   {
//     length++;
//     j /= 10;
//   }
//   bytes memory bstr = new bytes(length);
//   uint256 k = length;
//   j = _i;
//   while (j != 0)
//   {
//     bstr[--k] = bytes1(uint8(48 + j % 10));
//     j /= 10;
//   }
//   str = string(bstr);
// }

    

}