
const ethers = require("hardhat").ethers;

async function main() {
  const BettingFactory = await ethers.getContractFactory("Betting");

 const Betting = await BettingFactory.deploy(); // for normal deploy

  await Betting.deployed();

  console.log(`Betting deployed to: ${Betting.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});