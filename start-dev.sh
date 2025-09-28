#!/bin/bash

# Set environment variables for backend
export RPC_URL=https://rpc.testnet.citrea.xyz
export ADMIN_PRIVATE_KEY=a75a5b53418ed8cca181fb838f37e807466322879891d9e201b2b45fdfbdc231
export CONTRACT_ADDRESS=0xd43dc5f84320B34149Be4D0602F862DdD61A45CF
export PORT=3001

# Set environment variables for frontend
export VITE_API_BASE_URL=http://localhost:3001/api
export VITE_CONTRACT_ADDRESS=0xd43dc5f84320B34149Be4D0602F862DdD61A45CF
export VITE_CHAIN_ID=0x1a1
export VITE_RPC_URL=https://rpc.testnet.citrea.xyz
export VITE_DEBUG=true

echo "🚀 Starting development servers..."
echo "📡 Backend will run on: http://localhost:3001"
echo "🌐 Frontend will run on: http://localhost:5173"
echo "🔗 Contract: $CONTRACT_ADDRESS"
echo "🌍 Network: Citrea Testnet"
echo ""

# Start backend server in background
echo "Starting backend server..."
cd frontend && node server.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "Starting frontend server..."
cd frontend && npm run dev &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

echo ""
echo "✅ Both servers are running!"
echo "🌐 Frontend: http://localhost:5173"
echo "📡 Backend API: http://localhost:3001/api"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait
