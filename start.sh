#!/bin/bash

echo "🚀 Starting Puritec PWA Setup..."

# Install Server Deps
echo "📦 Installing Server Dependencies..."
cd server
npm install
cd ..

# Install Client Deps
echo "📦 Installing Client Dependencies..."
cd client
npm install
cd ..

# Start Server
echo "🟢 Starting Backend Server on port 3000..."
cd server
PORT=3000 node index.js > ../server.log 2>&1 &
SERVER_PID=$!
cd ..

# Start Client
echo "🟢 Starting Frontend Client on port 5173..."
cd client
# Using 'dev' instead of preview for Codespaces/Development feel, 
# but binding to 0.0.0.0 is crucial for cloud environments.
npm run dev -- --host 0.0.0.0 --port 5173 > ../client.log 2>&1 &
CLIENT_PID=$!
cd ..

echo "✅ App is running!"
echo "   - Backend: http://localhost:3000"
echo "   - Frontend: http://localhost:5173"
echo ""
echo "📝 Logs are being written to server.log and client.log"
echo "Press CTRL+C to stop."

# Wait
wait $SERVER_PID $CLIENT_PID
