// server/game.js
class Player {
    constructor(id, x, y, radius, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = 2; // Adjust as needed
        this.target = { x: x, y: y }; // Target position for movement
    }
  
    // Update player position based on target
    update() {
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
  
      if (distance > 1) { // Check if the player has reached the target
          const moveX = (dx / distance) * this.speed;
          const moveY = (dy / distance) * this.speed;
          this.x += moveX;
          this.y += moveY;
      }
  }
}

class Food {
    constructor(id, x, y, radius, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
}

function checkCollision(entity1, entity2) { // Made more general (checks between players or players and food)
    const dx = entity1.x - entity2.x;
    const dy = entity1.y - entity2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < entity1.radius + entity2.radius;
}

module.exports = {
    Player,
    Food,
    checkCollision
};