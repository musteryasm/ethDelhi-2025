import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ABI = JSON.parse(readFileSync(join(__dirname, 'frontend/contractABI.json'), 'utf8'));

// Test configuration
const RPC_URL = 'https://rpc.testnet.citrea.xyz';
const CONTRACT_ADDRESS = '0xd43dc5f84320B34149Be4D0602F862DdD61A45CF';

async function testIntegration() {
  console.log('🧪 Testing Citrea Testnet Integration...\n');

  try {
    // 1. Test RPC connection
    console.log('1️⃣ Testing RPC connection...');
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const network = await provider.getNetwork();
    console.log(`✅ Connected to network: ${network.name} (Chain ID: ${network.chainId})`);

    // 2. Test contract connection
    console.log('\n2️⃣ Testing contract connection...');
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    const contestCount = await contract.contestCount();
    console.log(`✅ Contract connected! Contest count: ${contestCount}`);

    // 3. Test contract balance
    console.log('\n3️⃣ Testing contract balance...');
    const balance = await contract.getContractBalance();
    console.log(`✅ Contract balance: ${ethers.formatEther(balance)} CBTC`);

    // 4. Test getting contests
    console.log('\n4️⃣ Testing contest retrieval...');
    const contestCountNum = Number(contestCount);
    if (contestCountNum > 0) {
      for (let i = 0; i < Math.min(contestCountNum, 3); i++) {
        try {
          const contest = await contract.getContest(i);
          console.log(`✅ Contest ${i}: ${contest[0]} (Stake: ${ethers.formatEther(contest[1])} CBTC)`);
        } catch (error) {
          console.log(`⚠️ Contest ${i}: Error - ${error.message}`);
        }
      }
    } else {
      console.log('ℹ️ No contests found on contract');
    }

    // 5. Test API endpoints
    console.log('\n5️⃣ Testing API endpoints...');
    try {
      const response = await fetch('http://localhost:3001/api');
      const data = await response.json();
      console.log(`✅ API Health: ${data.status}`);
    } catch (error) {
      console.log(`⚠️ API not running: ${error.message}`);
      console.log('💡 Start the backend server with: cd frontend && node server.js');
    }

    console.log('\n🎉 Integration test completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start backend: cd frontend && node server.js');
    console.log('2. Start frontend: cd frontend && npm run dev');
    console.log('3. Open http://localhost:5173 in your browser');
    console.log('4. Connect MetaMask to Citrea testnet');
    console.log('5. Test wallet connection and contest joining');

  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if Citrea testnet is accessible');
    console.log('2. Verify contract address is correct');
    console.log('3. Ensure RPC URL is working');
    console.log('4. Check if contract is deployed on Citrea testnet');
  }
}

// Run the test
testIntegration();
