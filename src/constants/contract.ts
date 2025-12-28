/**
 * Contract configuration
 * Update these values with your deployed contract address
 */
export const CONTRACT_CONFIG = {
  // Contract address - update this after deployment
  contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  contractName: "ticketing",
  // Network: 'testnet' or 'mainnet'
  network: "testnet" as "testnet" | "mainnet",
};

export const getContractIdentifier = () => {
  return `${CONTRACT_CONFIG.contractAddress}.${CONTRACT_CONFIG.contractName}`;
};

