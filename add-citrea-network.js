// Script to add Citrea Testnet to MetaMask
// Run this in the browser console on your frontend page

const addCitreaNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x13fb', // 5115 in decimal
          chainName: 'Citrea Testnet',
          nativeCurrency: {
            name: 'Citrea',
            symbol: 'CBTC',
            decimals: 18,
          },
          rpcUrls: ['https://rpc.testnet.citrea.xyz'],
          blockExplorerUrls: ['https://explorer.testnet.citrea.xyz'],
        },
      ],
    });
    console.log('✅ Citrea Testnet added to MetaMask successfully!');
  } catch (error) {
    console.error('❌ Error adding Citrea Testnet:', error);
  }
};

// Switch to Citrea Testnet
const switchToCitreaNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x13fb' }],
    });
    console.log('✅ Switched to Citrea Testnet successfully!');
  } catch (error) {
    if (error.code === 4902) {
      console.log('ℹ️ Citrea Testnet not found, adding it first...');
      await addCitreaNetwork();
    } else {
      console.error('❌ Error switching to Citrea Testnet:', error);
    }
  }
};

// Export functions for use
window.addCitreaNetwork = addCitreaNetwork;
window.switchToCitreaNetwork = switchToCitreaNetwork;

console.log('🔧 Citrea Testnet helper functions loaded!');
console.log('📋 Available functions:');
console.log('  - addCitreaNetwork() - Add Citrea Testnet to MetaMask');
console.log('  - switchToCitreaNetwork() - Switch to Citrea Testnet');
console.log('');
console.log('🚀 Run: switchToCitreaNetwork() to get started!');
