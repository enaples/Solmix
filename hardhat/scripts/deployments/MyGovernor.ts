import { ethers } from "hardhat";

async function main() {
    const scFactory = await ethers.getContractFactory("MyGovernor");
    const newSC = await scFactory.deploy();
    await newSC.deployed();

    console.log("New smart contract deployed at address:", newSC.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});