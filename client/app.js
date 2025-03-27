// Client-side socket connection with robust error handling
const socket = io(window.location.origin, {
  withCredentials: false,
  transports: ['websocket', 'polling']
});

// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Create score display element
const scoreDisplay = document.createElement('div');
scoreDisplay.id = 'scoreDisplay';
scoreDisplay.style.position = 'absolute';
scoreDisplay.style.right = '20px';
scoreDisplay.style.top = '20px';
scoreDisplay.style.padding = '10px 15px';
scoreDisplay.style.fontFamily = 'Arial, sans-serif';
scoreDisplay.style.fontWeight = 'bold';
scoreDisplay.style.fontSize = '18px';
scoreDisplay.style.background = 'rgba(0, 0, 0, 0.6)';
scoreDisplay.style.color = 'white';
scoreDisplay.style.borderRadius = '10px';
scoreDisplay.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.3)';
document.body.appendChild(scoreDisplay);

// Game state variables
let players = {}; // Store player data received from the server
let food = []; // Array to store food
let myPlayerId = null;

// Socket event handlers
socket.on('connect', () => {
  console.log('Connected to server');
  myPlayerId = socket.id;  // Get the client's player ID
});

socket.on('connect_error', (error) => {
  console.error('Socket Connection Error:', error);
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

  // Client-side prediction for smoother movement
  const myPlayer = players[myPlayerId];
  if (myPlayer) {
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

  // Server reconciliation to prevent large position jumps
  const serverPlayer = data.players[myPlayerId];
  if (serverPlayer) {
    const reconciliationRate = 0.1; // Adjust for smoothness
    myPlayer.x = myPlayer.x + (serverPlayer.x - myPlayer.x) * reconciliationRate;
    myPlayer.y = myPlayer.y + (serverPlayer.y - myPlayer.y) * reconciliationRate;
  }

  // Update score display
  updateScoreDisplay();
});

// Update score display function
function updateScoreDisplay() {
  const myPlayer = players[myPlayerId];
  if (myPlayer) {
    const score = Math.floor(myPlayer.radius * 10);
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

// Send Input data to server
canvas.addEventListener('mousemove', (event) => {
  const mousePos = getMousePos(event);
  socket.emit('playerInput', mousePos);
});

// Game rendering loop
function draw() {
  // Apply gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#282c34');
  gradient.addColorStop(1, '#1e1e1e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Render players
  for (const playerId in players) {
    const player = players[playerId];
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.fillStyle = player.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(255,255,255,0.5)';
    ctx.fill();
    ctx.closePath();
  }

  // Render food with glow effect
  for (const foodPellet of food) {
    ctx.beginPath();
    ctx.arc(foodPellet.x, foodPellet.y, foodPellet.radius, 0, 2 * Math.PI);
    ctx.fillStyle = foodPellet.color;
    ctx.shadowBlur = 5;
    ctx.shadowColor = 'rgba(255,255,255,0.2)';
    ctx.fill();
    ctx.closePath();
  }

  // Continue rendering loop
  requestAnimationFrame(draw);
}

// Start the game rendering
draw();