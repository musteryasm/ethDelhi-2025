# Contest API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
- **Admin functions** (create, distribute) use the admin private key from `.env`
- **User functions** (join contest) use MetaMask integration with validation APIs

---

## 📋 API Endpoints

### 1. Health Check
**GET** `/api`

**Response:**
```json
{
  "status": "Backend is running 🚀"
}
```

---

### 2. Create Contest (Admin Only)
**POST** `/api/contests/create`

**Request Body:**
```json
{
  "name": "Pushup Challenge",
  "stakeAmount": "10000000000000000",
  "startTime": 1727482000,
  "endTime": 1727485600,
  "maxParticipants": 10,
  "minParticipants": 5
}
```

**Response:**
```json
{
  "txHash": "0x...",
  "contestId": "0",
  "message": "Contest created with ID: 0"
}
```

---

### 3. Get All Contests
**GET** `/api/contests`

**Response:**
```json
{
  "contests": [
    {
      "id": 0,
      "name": "Pushup Challenge",
      "stakeAmount": "10000000000000000",
      "startTime": "1727482000",
      "endTime": "1727485600",
      "maxParticipants": "10",
      "minParticipants": "5",
      "participants": [],
      "rewardsDistributed": false,
      "participantCount": 0
    }
  ],
  "total": 1,
  "message": "Contests retrieved successfully"
}
```

---

### 4. Get Contest by ID
**GET** `/api/contests/:id`

**Response:**
```json
{
  "contest": {
    "name": "Pushup Challenge",
    "stakeAmount": "10000000000000000",
    "startTime": "1727482000",
    "endTime": "1727485600",
    "maxParticipants": "10",
    "minParticipants": "5",
    "rewardsDistributed": false
  },
  "participants": [],
  "message": "Contest data retrieved successfully"
}
```

---

### 5. Get Contest Statistics
**GET** `/api/contests/:id/stats`

**Response:**
```json
{
  "stats": {
    "contestId": "0",
    "participantCount": 0,
    "maxParticipants": "10",
    "minParticipants": "5",
    "stakeAmount": "10000000000000000",
    "totalStake": "0",
    "isActive": true,
    "hasEnded": false,
    "rewardsDistributed": false,
    "canJoin": true
  },
  "message": "Contest statistics retrieved successfully"
}
```

---

### 6. Check if User Joined Contest
**GET** `/api/contests/:id/joined/:userAddress`

**Response:**
```json
{
  "hasJoined": false,
  "userAddress": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "contestId": "0",
  "message": "User has not joined this contest"
}
```

---

### 7. Pre-Validate Contest Join
**POST** `/api/contests/:id/pre-join`

**Description:** Validates if a user can join a contest before they sign the MetaMask transaction.

**Request Body:**
```json
{
  "userAddress": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
}
```

**Success Response:**
```json
{
  "canJoin": true,
  "message": "User can join this contest",
  "contestInfo": {
    "contestId": "0",
    "name": "Pushup Challenge",
    "stakeAmount": "10000000000000000",
    "participantCount": 3,
    "maxParticipants": "10",
    "startTime": "1727482000",
    "endTime": "1727485600",
    "isActive": true
  },
  "transactionParams": {
    "contractAddress": "0xE5f2A565Ee0Aa9836B4c80a07C8b32aAd7978e22",
    "method": "joinContest",
    "params": [0],
    "value": "10000000000000000",
    "gasLimit": "300000"
  }
}
```

**Error Response:**
```json
{
  "canJoin": false,
  "errors": ["Contest is full", "User has already joined this contest"],
  "contestInfo": {
    "contestId": "0",
    "name": "Pushup Challenge",
    "stakeAmount": "10000000000000000",
    "participantCount": 10,
    "maxParticipants": "10",
    "isActive": false
  }
}
```

---

### 8. Confirm Contest Join
**POST** `/api/contests/:id/confirm-join`

**Description:** Confirms that a user successfully joined a contest after MetaMask transaction.

**Request Body:**
```json
{
  "userAddress": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "txHash": "0xabc123def456..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Join confirmed successfully",
  "txHash": "0xabc123def456...",
  "contestInfo": {
    "contestId": "0",
    "name": "Pushup Challenge",
    "stakeAmount": "10000000000000000",
    "participantCount": 4,
    "maxParticipants": "10"
  },
  "userInfo": {
    "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    "joinedAt": "2024-01-15T10:30:00.000Z",
    "position": 4
  }
}
```

---

### 9. Get MetaMask Integration Guide
**GET** `/api/contests/:id/metamask-integration`

**Description:** Returns complete React/JavaScript code for frontend developers to integrate contest joining.

**Response:**
```json
{
  "contestInfo": {
    "contestId": 0,
    "name": "Pushup Challenge",
    "stakeAmount": "10000000000000000",
    "stakeAmountETH": "0.0100"
  },
  "integration": {
    "reactComponent": "// Complete React component code...",
    "vanillaJS": "// Complete JavaScript code..."
  },
  "apiEndpoints": {
    "preValidate": "POST /api/contests/0/pre-join",
    "confirm": "POST /api/contests/0/confirm-join",
    "checkStatus": "GET /api/contests/0/joined/:userAddress"
  },
  "contractInfo": {
    "address": "0xE5f2A565Ee0Aa9836B4c80a07C8b32aAd7978e22",
    "network": "Sepolia Testnet",
    "chainId": "11155111"
  }
}
```

---

### 10. Get User Contest History
**GET** `/api/users/:address/contests`

**Description:** Returns all contests a user has joined.

**Response:**
```json
{
  "userAddress": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "totalContests": 2,
  "contests": [
    {
      "contestId": 0,
      "name": "Pushup Challenge",
      "stakeAmount": "10000000000000000",
      "status": "active",
      "joinedAt": "N/A"
    },
    {
      "contestId": 1,
      "name": "Running Marathon",
      "stakeAmount": "20000000000000000",
      "status": "completed",
      "joinedAt": "N/A"
    }
  ]
}
```

---

### 11. Batch Process Joins (Admin Only)
**POST** `/api/admin/process-joins`

**Description:** Admin endpoint to batch process pending join transactions.

**Response:**
```json
{
  "message": "Batch processing completed",
  "processed": 3,
  "successful": 2,
  "failed": 1,
  "results": [
    {
      "contestId": 0,
      "userAddress": "0x123...",
      "status": "success",
      "txHash": "0xabc..."
    },
    {
      "contestId": 0,
      "userAddress": "0x456...",
      "status": "failed",
      "error": "Insufficient gas"
    }
  ]
}
```

---

### 12. Distribute Rewards (Admin Only)
**POST** `/api/contests/distribute`

**Request Body:**
```json
{
  "contestId": "0",
  "winner1": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "winner2": "0x8ba1f109551bD432803012645Hac136c",
  "winner3": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
}
```

**Response:**
```json
{
  "txHash": "0x...",
  "message": "Rewards distributed successfully"
}
```

---

## 🔗 MetaMask Integration Guide

### Recommended Join Flow (3-Step Process)

**Step 1: Pre-Validate**
```javascript
// Check if user can join before MetaMask transaction
const preValidation = await fetch('/api/contests/0/pre-join', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userAddress: "0x742d35Cc..." })
});

const result = await preValidation.json();
if (!result.canJoin) {
  alert('Cannot join: ' + result.errors.join(', '));
  return;
}
```

**Step 2: MetaMask Transaction**
```javascript
// User signs transaction with their own wallet
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = new ethers.Contract(
  result.transactionParams.contractAddress,
  [{"inputs":[{"internalType":"uint256","name":"contestId","type":"uint256"}],"name":"joinContest","outputs":[],"stateMutability":"payable","type":"function"}],
  signer
);

const tx = await contract.joinContest(contestId, {
  value: result.transactionParams.value,
  gasLimit: result.transactionParams.gasLimit
});

const receipt = await tx.wait();
```

**Step 3: Confirm Join**
```javascript
// Confirm the transaction with your API
const confirmation = await fetch('/api/contests/0/confirm-join', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    userAddress: userAddress,
    txHash: receipt.hash 
  })
});

const confirmResult = await confirmation.json();
if (confirmResult.success) {
  alert('Successfully joined! You are participant #' + confirmResult.userInfo.position);
}
```

### Get Complete Integration Code
**For React/JavaScript developers:**
```javascript
// Get copy-paste ready code for any contest
const integration = await fetch('/api/contests/0/metamask-integration');
const guide = await integration.json();

console.log(guide.integration.reactComponent);  // Full React component
console.log(guide.integration.vanillaJS);       // Pure JavaScript version
```

### Contract Information
- **Contract Address:** `0xE5f2A565Ee0Aa9836B4c80a07C8b32aAd7978e22`
- **ABI:** Available in `contractABI.json`
- **Network:** Sepolia Testnet (Chain ID: 11155111)

---

## 🎯 Complete Frontend Workflow

### For Regular Users:
1. **Browse Contests:** `GET /api/contests`
2. **View Contest Details:** `GET /api/contests/:id`
3. **Pre-Validate Join:** `POST /api/contests/:id/pre-join`
4. **Connect MetaMask & Join:** User signs blockchain transaction
5. **Confirm Join:** `POST /api/contests/:id/confirm-join`
6. **Check Status:** `GET /api/contests/:id/joined/:userAddress`

### For Admins:
1. **Create Contest:** `POST /api/contests/create`
2. **Monitor Participants:** `GET /api/contests/:id/stats`
3. **Distribute Rewards:** `POST /api/contests/distribute`
4. **Batch Process:** `POST /api/admin/process-joins` (if using custodial approach)

### For Analytics:
1. **User History:** `GET /api/users/:address/contests`
2. **Contest Statistics:** `GET /api/contests/:id/stats`
3. **All Contests:** `GET /api/contests`

---

## 🚀 Integration Benefits

### For Users:
- ✅ **Non-custodial**: Users keep control of their ETH
- ✅ **Familiar UX**: Standard MetaMask flow
- ✅ **Transparent**: Direct blockchain interaction

### For Frontend Developers:
- ✅ **Simple APIs**: Pre-validation and confirmation endpoints
- ✅ **Copy-paste code**: Ready-to-use React components
- ✅ **Error handling**: Built-in validation and error messages
- ✅ **Scalable**: Same flow works for 1 or 100+ contests

### For Platform Owners:
- ✅ **No gas costs**: Users pay their own transaction fees
- ✅ **No custody risk**: No user funds stored on servers
- ✅ **Analytics**: Track joins, confirmations, user behavior
- ✅ **Business logic**: Custom validation and notification flows

---

## 📝 Important Notes

- All amounts are in **wei** (1 ETH = 10^18 wei)
- Timestamps are **Unix timestamps** (seconds since epoch)
- **Pre-validation** prevents failed MetaMask transactions
- **Confirmation** enables analytics and user notifications
- Users need **Sepolia testnet ETH** for gas fees
- Contract acts as **escrow** - holds all stake money until reward distribution
- **Admin functions** (create, distribute) require server-side private key
- **User functions** (join) use user's own MetaMask wallet
