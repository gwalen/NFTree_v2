const ethers = require('ethers')
const Watcher = require('@eth-optimism/core-utils').Watcher
const { predeploys, getContractInterface } = require('@eth-optimism/contracts')

// import {L1Root } from "../typechain/L1Root"
// import {L2Root } from "../typechain/L2Root"

// I. function to build contract factory
const factory = (name) => {
  const artifact = require(`../artifacts/contracts/${name}.sol/${name}.json`)
  return new ethers.ContractFactory(artifact.abi, artifact.bytecode)
}
const factoryL1Root = factory('L1Root');

// II. simple reference to contract
const l2RootArtifact = require(`../artifacts/contracts/L2Root.sol/L2Root.json`)
const factoryL2Root = new ethers.ContractFactory(l2RootArtifact.abi, l2RootArtifact.bytecode)
// const factory__L1_ERC20Gateway = getContractFactory('OVM_L1ERC20Gateway')

async function main() {
  // Set up our RPC provider connections.
  const l1RpcProvider = new ethers.providers.JsonRpcProvider('http://localhost:9545')
  const l2RpcProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545')

  // Set up our wallets (using a default private key with 10k ETH allocated to it).
  // Need two wallets objects, one for interacting with L1 and one for interacting with L2.
  // Both will use the same private key.
  const key = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
  const l1Wallet = new ethers.Wallet(key, l1RpcProvider)
  const l2Wallet = new ethers.Wallet(key, l2RpcProvider)

  const l2Messenger = new ethers.Contract(
    predeploys.L2CrossDomainMessenger,
    getContractInterface('L2CrossDomainMessenger'),
    l2RpcProvider
  )

  const l1Messenger = new ethers.Contract(
    await l2Messenger.l1CrossDomainMessenger(),
    getContractInterface('L1CrossDomainMessenger'),
    l1RpcProvider
  )

  const l1MessengerAddress = l1Messenger.address
  // L2 messenger address is always the same. '0x4200000000000000000000000000000000000007'
  const l2MessengerAddress = l2Messenger.address

  // Tool that helps watches and waits for messages to be relayed between L1 and L2.
  const watcher = new Watcher({
    l1: {
      provider: l1RpcProvider,
      messengerAddress: l1MessengerAddress
    },
    l2: {
      provider: l2RpcProvider,
      messengerAddress: l2MessengerAddress
    }
  })

  console.log("Deploy L2Root");
  const l2Root = await factoryL2Root.connect(l2Wallet).deploy(
    l2MessengerAddress
  );
  await l2Root.deployTransaction.wait();
  console.log(`   L2Root deployed @ ${l2Root.address}`)

  console.log("Deploy L1Root");
  const l1Root = await factoryL1Root.connect(l1Wallet).deploy(
    l1MessengerAddress
  );
  await l1Root.deployTransaction.wait();
  console.log(`   L1Root deployed @ ${l1Root.address}`)

  console.log("Init L1 and L2 root addresses");
  const txL2Init = await l2Root.initExternalMinter(l1Root.address);
  await txL2Init.wait();
  const txL1Init = await l1Root.initExternalMinter(l2Root.address);
  await txL1Init.wait();

  await l1Root.deployTransaction.wait();


  console.log("Create tree on L1");
  const hashRoot = "root1";
  const hashNodeOne = "node1";
  const hashNodeTwo = "node2";
  const hashNodeThree = "node3";
  const hashNodeFour = "node4";

  // const treeAsArray: string[][] = [ //TODO - update config to user TS, error here is cos of pure js ?
  const treeAsArray = [
    [hashRoot, hashNodeOne, hashNodeTwo],
    [hashNodeOne, hashNodeThree],
    [hashNodeThree, hashNodeFour]
  ];

  const txMintTree = await l1Root.mintTree(l1Wallet.address, treeAsArray);
  await txMintTree.wait();  

  console.log("Call mint from L1 -> L2");
  const rootId = await l1Root.getNodeIdForHash(hashRoot);
  const txMint = await l1Root.crossChainMint(l2Wallet.address, rootId, 
    // { gasPrice: 0  }
  );
  await txMint.wait();

  // console.log("Call test mint from L1 -> L2");
  // const txMint = await l1Root.testCrossChainMint(l2Wallet.address);
  // await txMint.wait();

  // console.log("Call string transfer from L1 -> L2");
  // const txMint = await l1Root.testStringTransfer(l2Wallet.address, "gw");
  // await txMint.wait();

  // console.log("Call string array transfer from L1 -> L2");
  // const txMint = await l1Root.testStringArrayTransfer(l2Wallet.address, treeAsArray);
  // await txMint.wait();

  // Wait for the message to be relayed to L2
  console.log("Waiting for message to be relayed to L2...")
  const [ msgHash1 ] = await watcher.getMessageHashesFromL1Tx(txMint.hash)
  await watcher.getL2TransactionReceipt(msgHash1)

  // console.log("Check if L2 string transfer for successful");
  // const stringSent = await l2Root.getTransferredStringData();
  // console.log("Transferred string = ", stringSent);

  // const argsToMint = await l2Root.getArgsForMintNode();
  // console.log("Args to mint array = ", argsToMint);
  
  console.log("Check if L2 string array transfer for successful");
  const stringArraySent = await l2Root.getTransferredStringArrayData();
  console.log("Transferred string = ", stringArraySent);

  // OLD
  // console.log("Check if L2 was successfully called")
  // const wasMintTreeCalled = await l2Root.wasMintTreeCalled();
  // console.log("Was L2 called = ", wasMintTreeCalled.toNumber());

  console.log("Check minted tree")
  const recreatedTreeAsHashes = await l2Root.buildTreeForExportWithHash(rootId);
  console.log("recreated tree as hashes: ", recreatedTreeAsHashes);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  });


