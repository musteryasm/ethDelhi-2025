// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  CONTRACT_ADDRESS: import.meta.env.VITE_CONTRACT_ADDRESS || '0xd43dc5f84320B34149Be4D0602F862DdD61A45CF',
  CHAIN_ID: import.meta.env.VITE_CHAIN_ID || '0x13fb', // Citrea Testnet (5115 in decimal)
  RPC_URL: import.meta.env.VITE_RPC_URL || 'https://rpc.testnet.citrea.xyz',
};

// API Endpoints
export const API_ENDPOINTS = {
  HEALTH: '/',
  CONTESTS: '/contests',
  CONTEST_BY_ID: (id) => `/contests/${id}`,
  CONTEST_JOIN: (id) => `/contests/${id}/join`,
  CONTEST_JOINED: (id, userAddress) => `/contests/${id}/joined/${userAddress}`,
  CONTEST_CREATE: '/contests/create',
  CONTEST_DISTRIBUTE: '/contests/distribute',
  TEST_CONTRACT: '/test-contract',
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to make API calls with error handling
export const apiCall = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};
