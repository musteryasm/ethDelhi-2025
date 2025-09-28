import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { API_CONFIG } from '../config/api';
import ABI from '../../contractABI.json';

// Citrea Testnet Configuration
const CITREA_CHAIN_ID = '0x13fb'; // 5115 in decimal (from our test results)
const CITREA_CHAIN_CONFIG = {
  chainId: CITREA_CHAIN_ID,
  chainName: 'Citrea Testnet',
  nativeCurrency: {
    name: 'Citrea',
    symbol: 'CBTC',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.testnet.citrea.xyz'],
  blockExplorerUrls: ['https://explorer.testnet.citrea.xyz'],
};

export const useWeb3 = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== 'undefined' && window.ethereum;
  }, []);

  // Check if connected to correct network
  const checkNetwork = useCallback(async () => {
    if (!window.ethereum) return false;
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const isCorrect = chainId === CITREA_CHAIN_ID;
      setIsCorrectNetwork(isCorrect);
      return isCorrect;
    } catch (error) {
      console.error('Error checking network:', error);
      setIsCorrectNetwork(false);
      return false;
    }
  }, []);

  // Switch to Citrea testnet
  const switchToCitreaNetwork = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      // Try to switch to Citrea testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CITREA_CHAIN_ID }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        // Chain not added to MetaMask, add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [CITREA_CHAIN_CONFIG],
          });
        } catch (addError) {
          throw new Error('Failed to add Citrea testnet to MetaMask');
        }
      } else {
        throw switchError;
      }
    }
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      throw new Error('Please install MetaMask to continue');
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Check and switch network
      const isCorrectNetwork = await checkNetwork();
      if (!isCorrectNetwork) {
        await switchToCitreaNetwork();
        await checkNetwork(); // Verify switch was successful
      }

      // Create provider and contract instance
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();
      const contractInstance = new ethers.Contract(
        API_CONFIG.CONTRACT_ADDRESS,
        ABI,
        signer
      );

      setAccount(accounts[0]);
      setProvider(web3Provider);
      setContract(contractInstance);
      setIsCorrectNetwork(true);

      console.log('✅ Wallet connected:', accounts[0]);
      console.log('✅ Contract instance created');

      return accounts[0];
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [isMetaMaskInstalled, checkNetwork, switchToCitreaNetwork]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setContract(null);
    setProvider(null);
    setIsCorrectNetwork(false);
    setError(null);
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        // Recreate contract instance with new account
        if (provider) {
          provider.getSigner().then(signer => {
            const contractInstance = new ethers.Contract(
              API_CONFIG.CONTRACT_ADDRESS,
              ABI,
              signer
            );
            setContract(contractInstance);
          });
        }
      }
    };

    const handleChainChanged = (chainId) => {
      const isCorrect = chainId === CITREA_CHAIN_ID;
      setIsCorrectNetwork(isCorrect);
      
      if (!isCorrect) {
        setError('Please switch to Citrea testnet');
      } else {
        setError(null);
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [account, provider, disconnectWallet]);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return;

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          const isCorrectNetwork = await checkNetwork();
          if (isCorrectNetwork) {
            const web3Provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await web3Provider.getSigner();
            const contractInstance = new ethers.Contract(
              API_CONFIG.CONTRACT_ADDRESS,
              ABI,
              signer
            );

            setAccount(accounts[0]);
            setProvider(web3Provider);
            setContract(contractInstance);
            setIsCorrectNetwork(true);
          }
        }
      } catch (error) {
        console.error('Error checking existing connection:', error);
      }
    };

    checkConnection();
  }, [isMetaMaskInstalled, checkNetwork]);

  return {
    // State
    account,
    contract,
    provider,
    isConnecting,
    error,
    isCorrectNetwork,
    isMetaMaskInstalled: isMetaMaskInstalled(),
    
    // Actions
    connectWallet,
    disconnectWallet,
    switchToCitreaNetwork,
    checkNetwork,
  };
};
