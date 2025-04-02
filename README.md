# WebsocketMultiplayerGame
Agar.io Type Multiplayer Game using JavaScript, node.js and websockets

# Local Setup
### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

1. First clone this repo
```bash
git clone https://github.com/Victor2266/WebsocketMultiplayerGame.git
```
2. navigate the terminal to the base directory
```bash
cd WebsocketMultiplayerGame
```
4. Install the dependencies listed in the project's package.json file
```bash
npm install
```
6. Type the following command to run the server
```bash
node server/server.js
# or just
npm start
```

3. Open internet brower to http://localhost:3000/ to play the game
4. Open Multiple windows to see multiplayer realtime connectivity


# Visit The Deployed Site Here:
https://websocketmultiplayergame.onrender.com/

# Abstract:
Agar.io Implementation: Development of a real-time multi-player gaming system that is highly scalable and optimized in a distributed architecture. In this development process, the key challenges that come into focus are those of real-time synchronization, network latency handling, load balancing, and fault tolerance. Agar.io is a game that demands smooth and continuous updates of player movements, collision detection, and leaderboard updating.

Our solution will be based on distributed server architecture, which efficiently manages several instances of a game across multiple server nodes. We will implement a load-balancing mechanism that will assign players to different servers. To handle network latency, we will implement client-side prediction and interpolation techniques to create a seamless, responsive gaming experience. 

The project will be deployed on a cloud-based infrastructure to allow automatic scaling based on the demands of traffic to ensure that the game remains responsive even under high concurrent user loads.

# Problem Statement:
Real-time multiplayer needs networking and server management to go right to guarantee smoothness; centralized servers come with their plethora of issues:
High Latency & Lag: Updates are delayed to players due to network latency.
Overload of Servers: Too many players requesting requests simultaneously overwhelms a single server, thereby driving down the server's performance level.
Synchronization Problems: This is whenever various updates concerning the position, collision, or interaction between the players who are in motion become conflicting or inconsistent due to the delayed updates from inadequately distributed systems.

# Proposed Solution:
In the project, we try to solve these challenges with a distributed system of game servers, the server will handle the actively playing users while communicating and maintaining the game states using efficient messaging techniques and strategies for load balancing.
- Game State Synchronization: UDP-based communication with failover to TCP ensures real-time updates with minimum latency.
- Load Balancing: A master server will balance the number of players across game servers depending on real-time traffic and server performance.
- Client-Side Prediction: The frontend will have movement prediction algorithms to compensate for minor network delays in order to make the user experience smooth.
- Cloud Scalability: The system will utilize auto-scaling cloud services that can dynamically change server capacity with respect to the number of concurrent users.

# Objectives:
The following are the key objectives of the project:
- Develop a Distributed Server Architecture:
- Implementation of the backend system with real-time interaction among players and game logic on separate servers.
- Provision for load balancing and fault tolerance mechanisms efficiently.
- Optimize Real-Time Synchronization:
- A low-latency messaging protocol is to be used for client-server communication.
- Prediction and movement, interpolation to reduce perceived network latency.

# Scalability and Load Management:
- Cloud-based deployment should include auto-scaling depending on the number of active players.
- Ensure High Availability and Fault Tolerance:
- Regularly monitor server health and ensure performance optimization dynamically.

# Enhance Client-Side Performance:
- Design a lightweight, responsive game UI for smooth user interactions.
- Use efficient data handling to reduce unnecessary bandwidth consumption.

## Description
This is a real-time multiplayer game similar to Agar.io where players control circular avatars, collect food to grow larger, and compete with other players. The game features:

- Real-time multiplayer gameplay
- WebSocket communication via Socket.IO
- Smooth client-side prediction and server reconciliation
- Player growth mechanics and collision detection
- Dynamic food spawning

## Game Mechanics
- Move your player by moving your mouse
- Collect small food dots to grow larger
- Larger players can absorb smaller ones
- When absorbed, players respawn at a smaller size

## Technology Stack
- **Frontend**: HTML5 Canvas, JavaScript
- **Backend**: Node.js, Express
- **Real-time Communication**: Socket.IO
- **Deployment**: Render

## Deployment on Render

### Prerequisites
- GitHub account
- Render account (sign up at [render.com](https://render.com))

### Deployment Steps

1. **Prepare Your Repository**
   - Ensure your code is pushed to your GitHub repository
   - Verify that your `package.json` has the correct start script:
   ```json
   "scripts": {
     "start": "node server/server.js"
   }
   ```

2. **Sign Up and Sign In to Render**
   - Create an account on [render.com](https://render.com) if you don't have one
   - Sign in to your Render account

3. **Create a New Web Service**
   - Click the "New +" button in the dashboard
   - Select "Web Service"

4. **Connect Your Repository**
   - Connect your GitHub account if not already connected
   - Find and select your repository (WebsocketMultiplayerGame)

5. **Configure the Web Service**
   - Name: "agar-io-multiplayer" (or any name you prefer)
   - Environment: Node
   - Region: Choose the closest to your users
   - Branch: main (or your primary branch)
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free tier

6. **Deploy Your Application**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - This process takes a few minutes

7. **Access Your Deployed Game**
   - Once deployment is complete, Render will provide a URL (e.g., `https://your-app-name.onrender.com`)
   - Share this URL with friends to play together

### Monitoring and Debugging on Render
- View logs by selecting your service and clicking the "Logs" tab
- Monitor performance in the "Metrics" tab
- Set up alerts in the "Events" tab

## Game Architecture

### Server-Side Components
- `server.js`: Main server setup, WebSocket handling, game loop
- `game.js`: Game logic, player and food classes, collision detection

### Client-Side Components
- `index.html`: Game HTML structure
- `app.js`: Client-side game logic, rendering, and input handling
- `style.css`: Game styling

## Acknowledgments
- Inspired by the original [Agar.io](https://agar.io/) game
- Built with [Socket.IO](https://socket.io/)
- Deployed on [Render](https://render.com)
