/** @param welcomeModal - Get the modal to select the player */
const welcomeModal = document.getElementById("welcomeModal");
const difficultyModal = document.getElementById("difficultyModal");

/**  @description - display the modal on startup */
welcomeModal.style.display = "block";
difficultyModal.style.display = "none";

/**@param playerPicker - get the images of the player */
const playerPicker = document.getElementsByClassName("image");
const difficultyPicker = document.getElementsByClassName("difficulty");

/** @description -  @param playerSelected - set to false to restrict the game starting before player is selected */
var playerSelected = false;

/** @description - adding event listener to all player images */
for (var j = 0; j < 5; j += 1) {
  playerPicker[j].addEventListener("click", function() {
    /** @description - remove modal on click
     *  and get the images source address of the clicked item
     * **/
    welcomeModal.style.display = "none";
    difficultyModal.style.display = "block";

    player.sprite = this.childNodes[0].attributes[0].nodeValue;
  });
}
let readyToPlayFlag = false;
const GLOBAL_CONSTANTS = {
  INITAL_POSITION_X: 500,
  INITAL_POSITION_Y: 889,
  BOUNDARY_LEFT: 5,
  BOUNDARY_RIGHT: 1105,
  BOUNDARY_TOP: -32,
  BOUNDARY_BOTTOM: 889,
  NO_OF_ENEMIES: 2000,
  PLAYER_WIDTH: 20,
  PLAYER_HEIGHT: 20,
  ENEMY_WIDTH: 40,
  ENEMY_HEIGHT: 30,
  INCREMENT_POSITION_X: 30,
  INCREMENT_POSITION_Y: 30,
  ENEMY_ROWS: populateRows(),
  DIFFICULTY: "EASY"
};

/**@description - instantiating allenemies objects with different values from different functions
 * that return positions and speeds for the enemy objects
 */
function generateEnemies() {
  for (var i = 0; i < GLOBAL_CONSTANTS.NO_OF_ENEMIES; i += 1) {
    allEnemies[i] = new Enemy(
      "images/enemy-bug.png",
      getX(i),
      getRow(i),
      getSpeed(i) // check for NaN error
    );
  }
}
difficultyPicker[0].addEventListener("click", function() {
  playerSelected = true;
  readyToPlayFlag = true;
  GLOBAL_CONSTANTS.INCREMENT_POSITION_Y = 60;
  GLOBAL_CONSTANTS.INCREMENT_POSITION_Y = 60;
  GLOBAL_CONSTANTS.DIFFICULTY = "EASY";
  difficultyModal.style.display = "none";
  generateEnemies()
});
difficultyPicker[1].addEventListener("click", function() {
  playerSelected = true;
  readyToPlayFlag = true;
  GLOBAL_CONSTANTS.INCREMENT_POSITION_Y = 60;
  GLOBAL_CONSTANTS.INCREMENT_POSITION_Y = 60;
  GLOBAL_CONSTANTS.DIFFICULTY = "MEDIUM";
  difficultyModal.style.display = "none";
  generateEnemies()
});
difficultyPicker[2].addEventListener("click", function() {
  playerSelected = true;
  readyToPlayFlag = true;
  GLOBAL_CONSTANTS.INCREMENT_POSITION_Y = 30;
  GLOBAL_CONSTANTS.INCREMENT_POSITION_Y = 30;
  GLOBAL_CONSTANTS.DIFFICULTY = "HARD";
  difficultyModal.style.display = "none";
  generateEnemies()
});

/** @description - Enemies our player must avoid
 * @param sprite - image source address
 * @param x and @param y - initial position of the enemy
 * @param speed - speed of the enemy
 * */

const rows = populateRows();
function populateRows() {
  let row = [];
  let initialValue = 60;
  i = 0;
  while (i <= 9) {
    let rowYPosition = 60 + i * 82;
    row.push(rowYPosition);
    i++;
  }
  return row;
}

var Enemy = function(sprite, x, y, speed) {
  this.sprite = sprite;
  this.x = x;
  this.y = y;
  this.height = GLOBAL_CONSTANTS.ENEMY_HEIGHT;
  this.width = GLOBAL_CONSTANTS.ENEMY_WIDTH;
  this.speed = speed;
};

Enemy.prototype.update = function(dt) {
  /**@description - prevents the enemy running before player selection */
  if (playerSelected != true) {
    return;
  } else {
    // Parameter: dt, a time delta between ticks
    // for the same speed on different devices
    this.x += this.speed * dt;
  }
};

/** @description - Draw the enemy on the screen, required method for game
 * checks player selection finish and game over flags to render enemy images
 */
Enemy.prototype.render = function() {
  if (playerSelected != true || gameOver === true) {
    return;
  } else {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
};

function isCollide(a, b) {
  return !(
    a.y + a.height < b.y ||
    a.y > b.y + b.height ||
    a.x + a.width < b.x ||
    a.x > b.x + b.width
  );
}
/** @description - it continuously compares the position of enemy and player
 *  and detects collision
 */
Enemy.prototype.checkCol = function() {
  //  below line conditions are optimised for best collision detection experience.
  let isCollideFlag = isCollide(this, player);
  if (isCollideFlag) {
    document.getElementById("scoreBoard-id").style.background =
      "red !important";
    // //reseting player positions on collision
    player.x = GLOBAL_CONSTANTS.INITAL_POSITION_X;
    player.y = GLOBAL_CONSTANTS.INITAL_POSITION_Y;
    if (player.lives > 0) {
      player.lives -= 1;
    }
    livesDisplay(player.lives);
    // //condition to check game over due to loss of all lives
    if (player.lives === 0) {
      modal.style.display = "block";
      modalSetup(player.currentScore, player.lives, false);
      return;
    }
    /** @param hasCollided on player - used to negate 2 points on collision
     * function to update the score followed to display current score */
    player.hasCollided = true;
    player.updateScore();
  }
};

/**
 * @param allenemies - used to store all enemy objects
 * @param numberOfEnemies - optimised for the game play of 300 seconds.
 */
var allEnemies = [];
var numberOfEnemies = GLOBAL_CONSTANTS.NO_OF_ENEMIES;




/**@description - this function equally distributes the enemies among all rows */
function getRow(j) {
  let enemyRowArray = GLOBAL_CONSTANTS.ENEMY_ROWS;
  if (enemyRowArray[j % 10] !== enemyRowArray[5]) {
    return enemyRowArray[j % 10];
  }
  return enemyRowArray[4];
}

/**@description - get different X poosition for the enemy(higher negative arrive late to display) */
function getX(k) {
  var temporaryX = 0;
  if (k % 3 === 0) {
    temporaryX = (k / 3) * -320;
    return temporaryX;
  } else if (k % 3 === 1) {
    temporaryX = Math.floor(k / 3) * -255;
    return temporaryX;
  } else if (k % 3 === 2) {
    temporaryX = Math.floor(k / 3) * -295;
    return temporaryX;
  }
}

/** @description - get different speeds to different enemies
 * also increase the speed as more time elapsed
 */
function getSpeed(k) {
  let defaultSpeedValues = [1000, 790, 950, 600, 430, 900, 400, 500, 1000, 950];
  let difficultySpeed = {
    hard: defaultSpeedValues,
    medium: defaultSpeedValues.map(value => value / 2),
    easy: defaultSpeedValues.map(value => value / 4)
  };
  if (GLOBAL_CONSTANTS.DIFFICULTY === "EASY") {
    defaultSpeedValues = difficultySpeed.easy;
  } else if (GLOBAL_CONSTANTS.DIFFICULTY === "MEDIUM") {
    defaultSpeedValues = difficultySpeed.medium;
  } else {
    defaultSpeedValues = difficultySpeed.hard;
  }

  if (k % 3 === 0) {
    if (k <= numberOfEnemies * 0.2) {
      return defaultSpeedValues[0];
    } else if (k > numberOfEnemies * 0.2 && k <= numberOfEnemies * 0.4) {
      return defaultSpeedValues[1];
    } else if (k > numberOfEnemies * 0.4 && k <= numberOfEnemies * 0.6) {
      return defaultSpeedValues[2];
    } else {
      return defaultSpeedValues[3];
    }
  } else if (k % 3 === 1) {
    if (k <= numberOfEnemies / 5) {
      return defaultSpeedValues[4];
    } else if (k > numberOfEnemies * 0.3 && k <= numberOfEnemies * 0.5) {
      return defaultSpeedValues[5];
    } else if (k > numberOfEnemies * 0.6) {
      return defaultSpeedValues[6];
    }
  } else if (k % 3 === 2) {
    if (k <= numberOfEnemies / 5) {
      return defaultSpeedValues[7];
    } else if (k > numberOfEnemies * 0.2 && k <= numberOfEnemies * 0.5) {
      return defaultSpeedValues[8];
    } else if (k > numberOfEnemies * 0.5) {
      return defaultSpeedValues[9];
    }
  }
  return 1000;
}

var Player = function() {
  this.x = GLOBAL_CONSTANTS.INITAL_POSITION_X;
  this.y = GLOBAL_CONSTANTS.INITAL_POSITION_Y;
  this.height = GLOBAL_CONSTANTS.PLAYER_HEIGHT;
  this.width = GLOBAL_CONSTANTS.PLAYER_WIDTH;
  this.hasCrossed = false;
  this.hasCollided = false;
  this.currentScore = 0;
  this.lives = 10;
};

//new player object
var player = new Player();

/** @description - update function to set the player to initial
 * position on successfull cross and a call to update score
 */
Player.prototype.update = function() {
  if (this.y < GLOBAL_CONSTANTS.BOUNDARY_TOP) {
    this.hasCrossed = true;
    this.updateScore();
    this.x = GLOBAL_CONSTANTS.INITAL_POSITION_X;
    this.y = GLOBAL_CONSTANTS.INITAL_POSITION_Y;
    return;
  }
};

/**@description - perform operation on the current score based on diffferent flags
 * and reset them to normal.
 */
Player.prototype.updateScore = function() {
  if (this.currentScore != 0 && this.hasCollided != false) {
    this.currentScore -= 2;
    this.hasCollided = false;
    document.getElementById("score_now").style.color = "red";
    document.getElementById("score_now").classList.add("blinking-text");
    document.getElementById("shoutout").classList.add("blinking-text");

    setTimeout(() => {
      document.getElementById("score_now").classList.remove("blinking-text");
      document.getElementById("shoutout").classList.remove("blinking-text");
    }, 1000);
    document.getElementById("shoutout").innerHTML = "Whoops...";
  }
  if (this.hasCrossed != false) {
    this.currentScore += 4;
    this.hasCrossed = false;
    document.getElementById("score_now").style.color = "blue";
    document.getElementById("score_now").classList.add("zoomIn-text");
    document.getElementById("shoutout").classList.add("zoomIn-text");

    setTimeout(() => {
      document.getElementById("score_now").classList.remove("zoomIn-text");
      document.getElementById("shoutout").classList.remove("zoomIn-text");
    }, 1000);
    document.getElementById("shoutout").innerHTML = "Great!!!";
  }
  setTimeout(() => {
    document.getElementById("shoutout").innerHTML = "";
  }, 1000);
  document.getElementById("score_now").innerHTML = this.currentScore;
};

/** @description - function to display the enemy image
 * condition ensure that player is displayed only after the player selection
 */

Player.prototype.render = function() {
  if (playerSelected != true) {
    return;
  } else {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
};

/** @description - function changes the player position based on the
 * keyboard input(provided by another function).
 * also ensures that the player object won't run off canvas boundary
 * also compares the position of the rock and thus restricts the
 * movement to that set of co-ordinates
 */
Player.prototype.handleInput = function(k) {
  var rockIsThere;
  switch (k) {
    case "up":
      if (this.y <= GLOBAL_CONSTANTS.BOUNDARY_TOP) {
        this.y = GLOBAL_CONSTANTS.INITAL_POSITION_Y;
      } else {
        this.y -= GLOBAL_CONSTANTS.INCREMENT_POSITION_Y;
        break;
      }
    case "down":
      if (this.y > GLOBAL_CONSTANTS.BOUNDARY_BOTTOM) {
        break;
      } else {
        this.y += GLOBAL_CONSTANTS.INCREMENT_POSITION_Y;
        break;
      }
    case "left":
      if (this.x < GLOBAL_CONSTANTS.BOUNDARY_LEFT) {
        break;
      } else {
        this.x -= GLOBAL_CONSTANTS.INCREMENT_POSITION_X;
        break;
      }
    case "right":
      if (this.x > GLOBAL_CONSTANTS.BOUNDARY_RIGHT) {
        break;
      } else {
        this.x += GLOBAL_CONSTANTS.INCREMENT_POSITION_X;
        break;
      }
  }
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener("keyup", function(e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };
  player.handleInput(allowedKeys[e.keyCode]);
});

/** @description - game timer to keep track of the timing since start of the game
 **/
let gameTimer = setInterval(myTimer, 1000);

/** @param timeUnit - duration of the game in seconds */
let timeUnit = 300;

// get minute and second on score board
var minute = document.getElementsByClassName("min")[0];
var second = document.getElementsByClassName("sec")[0];

/** @description - timer function for proper timing conversion
 * condition ensures that timer is started only after the player is selected
 */

function myTimer() {
  if (playerSelected != true) {
    return;
  } else {
    var minuteLeft = 0;
    var secondLeft = 0;
    timeUnit -= 1;

    /** @description Timing conversions */
    minuteLeft = Math.floor(timeUnit / 60);
    minute.innerHTML = minuteLeft;
    secondLeft = timeUnit - minuteLeft * 60;
    if (secondLeft < 10) {
      second.innerHTML = "0" + secondLeft;
    } else {
      second.innerHTML = secondLeft;
    }
    //condition to check game over due to time up
    if (timeUnit === 0) {
      modal.style.display = "block";
      modalSetup(player.currentScore, player.lives, true);
    }
  }
}

/**@description - Gem object with following properties
 * @param sprite - source image adress of the gem
 * @param onTime - timeUnit at which the Gem has to be appeared on the canvas
 * @param offTime - timeUnit at which the Gem disappeares from the canvas incase not collected.
 * @param xPos and yPos - position(x and y coordinates) of the gem
 * @param score - score obtained by collecting the gem by the player
 * @param gemCollected - flag to check whether gem is collected or not(to make it disappear)
 * @param currentState - prevents gemCollection even after the gem disappeared
 */
var Gem = function(sprite, onTime, offTime, xPos, yPos, score) {
  this.sprite = sprite;
  this.onTime = onTime;
  this.offTime = offTime;
  this.xPos = xPos;
  this.yPos = yPos;
  this.score = score;
  this.gemCollected = false;
  this.currentState = "inactive";
};

// arbitrarily assigning above values to different gem objects
var gem1 = new Gem("images/gem-orange.png", 295, 287, 202, -16, 20);
var gem2 = new Gem("images/gem-green.png", 220, 214, 303, -16, 15);
var gem3 = new Gem("images/Gem-Blue.png", 170, 164, 404, -16, 25);
var gem4 = new Gem("images/Heart.png", 85, 78, 303, -16, 30);
var gem5 = new Gem("images/Star.png", 60, 53, 404, -16, 40);

//array of gems
var allGems = [gem1, gem2, gem3, gem4, gem5];

/**@description - function to display the gem
 *  conditions inside ensure that gem is appeared only between on and off time
 * @param currentState - is made inactive right after the gem disappered from the screen
 *
 */
Gem.prototype.render = function() {
  if (
    this.onTime >= timeUnit &&
    this.offTime < timeUnit &&
    !this.gemCollected
  ) {
    ctx.drawImage(Resources.get(this.sprite), this.xPos, this.yPos);
    this.currentState = "active";
  } else {
    this.currentState = "inactive";
  }
};

/**@description - function that adds the score on gem collect,disappears
 * it and makes the state inactive */
Gem.prototype.gemCollect = function() {
  if (
    this.xPos === player.x &&
    this.yPos === player.y &&
    this.currentState === "active"
  ) {
    this.gemCollected = true;
    player.currentScore += this.score;
    this.currentState = "inactive";
  }
};

/**@description - rock object that exists always on the screen
 * @param sprite - image source address of the rock
 * @param x and @param y - position of the rock
 */
var Rock = function() {
  this.sprite = "images/Rock.png";
  this.x = 202;
  this.y = 316;
};

//new rock object
var rock = new Rock();

// display the rock (always)
Rock.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/** @param modal - Get the modal */
const modal = document.getElementById("myModal");

//this variable ensures that game is no more running on modal is on due to game over
let gameOver = false;

/** @description function to set up modal with winning scorecard
 * @param timeUpFlag - true if game Over was due to time up, else false
 * @param lives - number of lives remaining at the time of game over
 * @param score - final score of the player
 */
function modalSetup(score, lives, timeUpFlag) {
  gameOver = true;
  //get score and lives display on the modal and display them
  const totalScore = document.getElementsByClassName("final-score");
  totalScore[0].innerHTML = score;
  const remLives = document.getElementsByClassName("lives");
  remLives[0].innerHTML = lives;

  //stop the timer on game over
  clearTimeout(gameTimer);

  /** @description - These 2 conditions render different contents to the display
   * based on the type of game over(lives or time)
   */
  if (lives === 0) {
    document.getElementsByClassName("time-up")[0].style.display = "none";
    document.getElementsByClassName("lives-card")[0].style.display = "none";
    document.getElementsByClassName("em-clock1230")[0].style.display = "none";
    document.getElementsByClassName("lives-up")[0].style.display = "";
    document.getElementsByClassName("em-hushed")[0].style.display = "";
  }

  if (timeUpFlag === true) {
    document.getElementsByClassName("lives-up")[0].style.display = "none";
    document.getElementsByClassName("em-hushed")[0].style.display = "none";
    document.getElementsByClassName("time-up")[0].style.display = "";
    document.getElementsByClassName("lives-card")[0].style.display = "";
    document.getElementsByClassName("em-clock1230")[0].style.display = "";
  }
}

/** @description - This funtion is used to display number of lives remaining
 * in the game as the number of stars.
 * @param index - is the total number of lives remaining
 * stars are opened based on index value received
 */
function livesDisplay(index) {
  const list = document.getElementsByClassName("stars");
  if (list && list[0]) {
    list[0].children[index].children[0].classList.value = "fa fa-star-o";
  }
}

/** @param playAgain - get the Play again button on the modal and add event Listener on click */
const playAgain = document.getElementsByClassName("modalButton");

playAgain[0].addEventListener("click", Restart);

/**@description - this function triggers on Restart to reset the game */
function Restart() {
  modal.style.display = "none";
  timeUnit = 300;
  gameTimer = setInterval(myTimer, 1000);
  allEnemies = [];
  numberOfEnemies = GLOBAL_CONSTANTS.NO_OF_ENEMIES;
  gameOver = false;

  for (var i = 0; i < numberOfEnemies; i += 1) {
    allEnemies[i] = new Enemy(
      "images/enemy-bug.png",
      getX(i),
      getRow(i),
      getSpeed(i)
    );
  }

  const starList = document.getElementsByClassName("stars");

  //reset the stars to default
  for (let i = 0; i < 10; i += 1) {
    starList[0].children[i].children[0].classList.value = "fa fa-star";
  }

  player.lives = 10;
  player.currentScore = 0;
  document.getElementById("score_now").innerHTML = player.currentScore;

  for (var k = 0; k < 5; k += 1) {
    allGems[k].gemCollected = false;
  }
}
