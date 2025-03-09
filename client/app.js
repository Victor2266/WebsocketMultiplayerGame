// client/app.js
const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.createElement('div'); // Create score display element

canvas.width = 800;  // Set canvas dimensions
canvas.height = 600;

// Add and style the score display
scoreDisplay.id = 'scoreDisplay';
scoreDisplay.style.position = 'relative';
scoreDisplay.style.textAlign = 'right';
scoreDisplay.style.padding = '5px';
scoreDisplay.style.fontFamily = 'Arial, sans-serif';
scoreDisplay.style.fontWeight = 'bold';
scoreDisplay.style.fontSize = '18px';
scoreDisplay.innerHTML = 'Score: 0';

// Insert the score display after the canvas
canvas.parentNode.insertBefore(scoreDisplay, canvas.nextSibling);

let players = {}; // Store player data received from the server
let food = []; // Array to store food
let myPlayerId = null;

socket.on('connect', () => {
  console.log('Connected to server');
  myPlayerId = socket.id;  // Get the client's player ID
});

socket.on('init', (data) => {
  players = data.players;
  updateScoreDisplay(); // Update score when initialized
});

socket.on('newPlayer', (player) => {
  players[player.id] = player;
});

socket.on('playerDisconnected', (playerId) => {
  delete players[playerId];
});

socket.on('gameStateUpdate', (data) => {
  // Update other players
  for (let id in data.players) {
    if (id !== myPlayerId) {
      players[id] = data.players[id];
    }
    else {
      players[id].radius = data.players[id].radius; // Update our player's radius with server value
    }
  }

  // Update food
  food = data.food;

  // Client-side prediction: Update *our* player's position locally *before*
  // receiving the server update.  This makes movement feel smoother.
  const myPlayer = players[myPlayerId];
  if (myPlayer) {
    // Update our local copy of the player based on the *last known* input.
    const dx = myPlayer.target.x - myPlayer.x;
    const dy = myPlayer.target.y - myPlayer.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 1) {
      const moveX = (dx / distance) * myPlayer.speed;
      const moveY = (dy / distance) * myPlayer.speed;
      myPlayer.x += moveX;
      myPlayer.y += moveY;
    }

  }
  //Merge data
  const serverPlayer = data.players[myPlayerId];

  if (serverPlayer) {
    // Reconciliation: Smoothly adjust our predicted position towards the
    // server's authoritative position.  This prevents large jumps.
    const reconciliationRate = 0.1; // Adjust this for smoothness
    myPlayer.x = myPlayer.x + (serverPlayer.x - myPlayer.x) * reconciliationRate;
    myPlayer.y = myPlayer.y + (serverPlayer.y - myPlayer.y) * reconciliationRate;
  }

  //Update Players object
  players[myPlayerId] = myPlayer;
  // Update score display after state update
  updateScoreDisplay();
});

// Function to update the score display
function updateScoreDisplay() {
  const myPlayer = players[myPlayerId];
  if (myPlayer) {
    // Calculate score based on radius (common in agar.io style games)
    const score = Math.floor(myPlayer.radius * 10); // Adjust multiplication factor as needed
    scoreDisplay.innerHTML = `HighScore: ${score} | CurrentSize: ${myPlayer.radius.toFixed(1)}`;
  }
}

// Get Mouse Position on canvas
function getMousePos(evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
//Send Input data to server
canvas.addEventListener('mousemove', (event) => {
  const mousePos = getMousePos(event);
  socket.emit('playerInput', mousePos);
});


// Game loop (drawing)
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  for (const playerId in players) {
    const player = players[playerId];
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
  }

  // Draw food
  for (const foodPellet of food) {
    ctx.beginPath();
    ctx.arc(foodPellet.x, foodPellet.y, foodPellet.radius, 0, 2 * Math.PI);
    ctx.fillStyle = foodPellet.color;
    ctx.fill();
    ctx.closePath();
  }
  requestAnimationFrame(draw); // Call draw() again on the next frame
}

draw(); // Start the game loop



