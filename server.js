// server/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { Player, Food, checkCollision } = require('./game'); // Import Player and checkCollision


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, '../client')));


let players = {}; // Store player data
let food = []; // Array to store food
let foodIdCounter = 0; // Unique ID for each food pellet
const MAX_FOOD = 200; // Maximum food on the screen
const FOOD_RADIUS = 5;  // Size of food pellets
const FOOD_SPAWN_INTERVAL = 500; //Milliseconds

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    // Create a new player
    const player = new Player(
        socket.id,
        Math.random() * 800, // Random initial position
        Math.random() * 600,
        20,  // Initial radius
        '#' + Math.floor(Math.random() * 16777215).toString(16) // Random color
    );
    players[socket.id] = player;

    // Send initial game state to the new player
    socket.emit('init', { players });

    // Inform other players about the new player
    socket.broadcast.emit('newPlayer', player);


    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id); // Notify other clients
    });

    // Handle player movement input
    socket.on('playerInput', (inputData) => {
        const player = players[socket.id];
        if (player) {
            player.target.x = inputData.x;
            player.target.y = inputData.y;
        }
    });
});

// Function to spawn food
function spawnFood() {
    if (food.length < MAX_FOOD) {
        const x = Math.random() * 800; // Assuming canvas width is 800
        const y = Math.random() * 600; // Assuming canvas height is 600
        const newFood = new Food(
            foodIdCounter++,
            x,
            y,
            FOOD_RADIUS,
            '#' + Math.floor(Math.random() * 16777215).toString(16) // Random color
        );
        food.push(newFood);
    }
}

// Spawn food periodically
setInterval(spawnFood, FOOD_SPAWN_INTERVAL);

// Game loop (update and send game state)
setInterval(() => {
    // Update players
    for (const playerId in players) {
        players[playerId].update();
    }

    // Basic collision detection (check every player against every other player)
    for (const id1 in players) {
        for (const id2 in players) {
            if (id1 !== id2) {
                if (checkCollision(players[id1], players[id2])) {
                    // Handle collision (e.g., one player absorbs the other)
                    if (players[id1].radius > players[id2].radius) {
                        players[id1].radius += players[id2].radius * 0.1; // Grow the larger player
                        //Respawn player
                        players[id2].x = Math.random() * 800;
                        players[id2].y = Math.random() * 600;
                        players[id2].radius = 20;

                    }
                }
            }
        }
    }

    // Player-Food collision
    for (const playerId in players) {
        for (let i = food.length - 1; i >= 0; i--) { // Iterate backwards for safe removal
            if (checkCollision(players[playerId], food[i])) {
                players[playerId].radius += food[i].radius * 0.2; // Player grows
                food.splice(i, 1); // Remove the food
            }
        }
    }

    io.emit('gameStateUpdate', { players, food }); // Send BOTH players and food

}, 1000 / 60); // 60 updates per second (adjust as needed)

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});