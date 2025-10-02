import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MyGovernorModule", (m) => {
  
  const sc = m.contract("MyGovernor", [null, null]);

  return { sc };
});
