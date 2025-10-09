import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MyTokenModule", (m) => {
  // Deploy the MyToken contract
  // This contract will mint 1 million tokens to the deployer address
  // No constructor parameters are needed as they are hardcoded in the contract
  const myToken = m.contract("MyToken");

  // Optional: If you want to immediately mint additional tokens after deployment,
  // you can add the following line (uncomment and modify as needed):
  // m.call(myToken, "mint", ["0xRecipientAddressHere", "1000000000000000000000"]); // Mint 1000 tokens to a specific address

  // Optional: If you want to immediately burn tokens from the deployer
  // m.call(myToken, "burn", ["1000000000000000000"]); // Burn 1 token from deployer

  return { myToken };
});