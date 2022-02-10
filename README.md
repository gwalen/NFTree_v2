# NFTree
Send tree like graph structure that could represent evolution of NFT.


### -> get all dependencies
`yarn install`
### -> compile contracts and generate typechain artifacts
`yarn compile`
### -> run test case 
`yarn test`
### -> run test with local blockchain
`yarn ts-node ./scripts/testCrossCheckComsL1toL2.ts`

TODO: does not work the other way freezes on "Waiting for message to be relayed to L1..." - also happens in Optimism tutorial (not my error)

Issue reported on [github](https://github.com/ethereum-optimism/optimism-tutorial/issues/84)

`yarn ts-node ./scripts/testCrossCheckComsL2toL1.ts`

