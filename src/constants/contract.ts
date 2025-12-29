/**
 * Contract configuration
 * Update these values with your deployed contract address
 */
export const CONTRACT_CONFIG = {
  // Contract address - update this after deployment
  // Format: Just the principal address, without the contract name
  contractAddress: "SP3YGA4JT7289RWGB9SDXTNRCN2FQCRVFSTRRPN4F",
  contractName: "ticketingV2",
  // Network: 'testnet' or 'mainnet'
  network: "mainnet",
};

/**
 * Christmas Presents contract configuration
 * Update these values after deploying the Christmas presents contract
 */
export const CHRISTMAS_PRESENTS_CONFIG = {
  // Contract address - update this after deployment
  contractAddress: "SP3YGA4JT7289RWGB9SDXTNRCN2FQCRVFSTRRPN4F", // TODO: Update with actual contract address
  contractName: "christmas-present",
  // Network: 'testnet' or 'mainnet'
  network: "mainnet",
};

export const getContractIdentifier = () => {
  return `${CONTRACT_CONFIG.contractAddress}.${CONTRACT_CONFIG.contractName}`;
};

export const getChristmasPresentsContractIdentifier = () => {
  return `${CHRISTMAS_PRESENTS_CONFIG.contractAddress}.${CHRISTMAS_PRESENTS_CONFIG.contractName}`;
};
