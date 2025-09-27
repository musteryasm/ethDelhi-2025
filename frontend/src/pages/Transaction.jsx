import React, { useState } from 'react';
import { 
  useAccount, 
  useConnect, 
  useDisconnect, 
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
  createConfig,
  WagmiProvider,
  http
} from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected } from 'wagmi/connectors';

// Citrea Testnet Configuration
const CONTRACT_ADDRESS = "0x2B25EDB4ed98785cE5cD21e09c42B72910D9fB42";
const CITREA_TESTNET_CHAIN_ID = 5115; // 0x13fb in decimal

const citreaTestnet = {
  id: CITREA_TESTNET_CHAIN_ID,
  name: "Citrea Testnet",
  nativeCurrency: {
    name: "Citrea Bitcoin",
    symbol: "cBTC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.citrea.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Citrea Explorer",
      url: "https://explorer.testnet.citrea.xyz",
    },
  },
};

// Sample ABI - replace with your actual contract ABI
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Wagmi configuration
const config = createConfig({
  chains: [citreaTestnet],
  connectors: [injected()],
  transports: {
    [citreaTestnet.id]: http("https://rpc.testnet.citrea.xyz"),
  },
});

const queryClient = new QueryClient();

// Wallet Connection Component
function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
        <p className="text-green-800 font-medium">Connected: {address}</p>
        <button 
          onClick={() => disconnect()}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
      <p className="text-blue-800 mb-3">Connect your wallet to interact with Citrea Testnet</p>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Connect {connector.name}
        </button>
      ))}
    </div>
  );
}

// Contract Interaction Component
function ContractInteraction() {
  const [tokenId, setTokenId] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [activeFunction, setActiveFunction] = useState('mint');

  const { 
    data: hash,
    error,
    isPending, 
    writeContract 
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    });

  const handleMint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenId) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'mint',
      args: [BigInt(tokenId)],
    });
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'transfer',
      args: [recipient as `0x${string}`, BigInt(amount)],
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Contract Interaction</h2>
      
      {/* Function Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Function
        </label>
        <select 
          value={activeFunction}
          onChange={(e) => setActiveFunction(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="mint">Mint NFT</option>
          <option value="transfer">Transfer</option>
        </select>
      </div>

      {/* Mint Form */}
      {activeFunction === 'mint' && (
        <form onSubmit={handleMint} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Token ID
            </label>
            <input
              type="number"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Enter token ID"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button 
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            {isPending ? 'Confirming...' : 'Mint NFT'}
          </button>
        </form>
      )}

      {/* Transfer Form */}
      {activeFunction === 'transfer' && (
        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button 
            type="submit"
            disabled={isPending}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            {isPending ? 'Confirming...' : 'Transfer'}
          </button>
        </form>
      )}

      {/* Transaction Status */}
      <div className="mt-6 space-y-2">
        {hash && (
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Transaction Hash:</span>
              <br />
              <a 
                href={`https://explorer.testnet.citrea.xyz/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {hash}
              </a>
            </p>
          </div>
        )}
        
        {isConfirming && (
          <div className="p-3 bg-yellow-50 rounded-md">
            <p className="text-yellow-800">Waiting for confirmation...</p>
          </div>
        )}
        
        {isConfirmed && (
          <div className="p-3 bg-green-50 rounded-md">
            <p className="text-green-800 font-medium">Transaction confirmed! ✅</p>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-50 rounded-md">
            <p className="text-red-800">
              <span className="font-medium">Error:</span> 
              {(error as BaseError).shortMessage || error.message}
            </p>
          </div>
        )}
      </div>

      {/* Contract Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium text-gray-800 mb-2">Contract Details</h3>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Address:</span> {CONTRACT_ADDRESS}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Network:</span> Citrea Testnet
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Chain ID:</span> {CITREA_TESTNET_CHAIN_ID}
        </p>
      </div>
    </div>
  );
}

// Main App Component
function AppContent() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Citrea Testnet dApp
        </h1>
        
        <WalletConnection />
        
        {isConnected && <ContractInteraction />}
        
        {!isConnected && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600">
              Please connect your wallet to interact with the smart contract on Citrea Testnet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Root App with Providers
export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
        <AppContent />
      </QueryClientProvider> 
    </WagmiProvider>
  );
}