# NFTree
Plan is to build a tree-like data structure composed of ERC-721 NFTs. An NFTree can have 1 root and many elements having an address of it's parent. We want to do simple UI allowing to define NFTree and mint it on L2 and then burn while sending to L1, Optimism way
..
.


-> get all dependencies
yarn install
-> compile contracts and generate typechain artifacts
yarn compile
-> run test case 
yarn test
-> run test with local blockchain
yarn ts-node ./scripts/testCrossCheckComsL1toL2.ts

TODO: does not work the other way freezes on "Waiting for message to be relayed to L1..."
yarn ts-node ./scripts/testCrossCheckComsL2toL1.ts

