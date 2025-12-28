/**
 * Contract configuration
 * Update these values with your deployed contract address
 */
export const CONTRACT_CONFIG = {
  // Contract address - update this after deployment
  contractAddress: "SP3YGA4JT7289RWGB9SDXTNRCN2FQCRVFSTRRPN4F.ticketing",
  contractName: "ticketing",
  // Network: 'testnet' or 'mainnet'
  network: "testnet" as "testnet" | "mainnet",
};

export const getContractIdentifier = () => {
  return `${CONTRACT_CONFIG.contractAddress}.${CONTRACT_CONFIG.contractName}`;
};

