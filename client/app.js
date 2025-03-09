// client/app.js
const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;  // Set canvas dimensions
canvas.height = 600;

let players = {}; // Store player data received from the server

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('init', (data) => {
    players = data.players;
});

socket.on('newPlayer', (player) => {
    players[player.id] = player;
});

socket.on('playerDisconnected', (playerId) => {
    delete players[playerId];
});

socket.on('gameStateUpdate', (data) => {
  players = data;
});


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

    requestAnimationFrame(draw); // Call draw() again on the next frame
}

draw(); // Start the game loop

let myPlayerId = null;

socket.on('connect', () => {
    console.log('Connected to server');
    myPlayerId = socket.id;  // Get the client's player ID
});

socket.on('gameStateUpdate', (data) => {
    //If the data is not me update it.
    for(let id in data){
      if(myPlayerId != id){
        players[id] = data[id];
      }
    }
  
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
      //Update Players object
      players[myPlayerId] = myPlayer;
    }
    //Merge data
    const serverPlayers = data[myPlayerId];
      if(serverPlayers){
      // Reconciliation: Smoothly adjust our predicted position towards the
        // server's authoritative position.  This prevents large jumps.
        const reconciliationRate = 0.1; // Adjust this for smoothness
        myPlayer.x = myPlayer.x + (serverPlayers.x - myPlayer.x) * reconciliationRate;
        myPlayer.y = myPlayer.y + (serverPlayers.y - myPlayer.y) * reconciliationRate;
      }
  });