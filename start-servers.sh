#!/bin/bash

echo "Starting Personal Finance Tracker+ Servers..."
echo

# Start Node.js server in background
echo "Starting Node.js server..."
cd server && npm start &
NODE_PID=$!

# Wait a bit for Node.js to start
sleep 5

# Start Python API server in background
echo "Starting Python API server..."
cd ../python-api && python app.py &
PYTHON_PID=$!

echo
echo "Both servers are starting..."
echo "Node.js server: http://localhost:5000"
echo "Python API server: http://localhost:5001"
echo
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo "Stopping servers..."
    kill $NODE_PID 2>/dev/null
    kill $PYTHON_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
