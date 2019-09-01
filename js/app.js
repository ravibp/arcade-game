//Our player must avoid enemies

var Enemy = function (x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
 
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemys position, requires method for the game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    
    this.x += this.speed * dt;
    console.log("player", player.x, player.y)
	// horizontal retrace of enemy delay
    if (this.x > 490) {
        this.x = -150;
        this.speed = 100 + Math.floor(Math.random() * 500);
    }
		if (player.x < this.x + 70 &&
    player.x + 40 > this.x &&
    player.y < this.y + 30 &&
    35 + player.y > this.y) {
        player.x = 210;   // reset position
        player.y = 370;
        alert("oh no! Lets Try again.")
    }
    if(player.y <= 40) {
        player.y = 370
        setTimeout(() => {
            // window.confirm("congratulations! you's it.");
            // alert("congratulations! you've made it.")
        }, 100);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (x, y, speed) {
    //define a player
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};


Player.prototype.update = function () {
    if (this.y > 370) {
        this.y = 370;
    }
    if (this.x > 410) {
        this.x = 410;
    }
    if (this.x < 0) {
        this.x = 0;
    }
    
    if (this.y < 0) {
        this.x = 210;
        this.y = 350;
    }
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (char) {
    if (char === "up") {
        this.y -= 100;
    } else if (char === "left") {
        this.x -= 90;
    } else if (char === "right") {
        this.x += 90;
    } else if (char === "down") {
        this.y += 100;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var Enemy1 = new Enemy(-100, 80, 190);
var Enemy2 = new Enemy(-110, 120, 180);
var Enemy3 = new Enemy(-220, 166, 300);
var Enemy4 = new Enemy(-360, 190, 300);
var allEnemies =[Enemy1, Enemy2, Enemy3, Enemy4];

var player = new Player(110, 330);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    
    player.handleInput(allowedKeys[e.keyCode]);
});