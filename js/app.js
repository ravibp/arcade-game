/** @param welcomeModal - Get the modal to select the player */
const welcomeModal = document.getElementById('welcomeModal');

/**  @description - display the modal on startup */
welcomeModal.style.display="block";

/**@param playerPicker - get the images of the player */
const playerPicker = document.getElementsByClassName("image");

/** @description -  @param playerSelected - set to false to restrict the game starting before player is selected */
var playerSelected = false;

/** @description - adding event listener to all player images */
for (var j = 0; j < 5; j += 1) {
    playerPicker[j].addEventListener("click", function () {
        /** @description - remove modal on click 
         *  and get the images source address of the clicked item
         * **/
        welcomeModal.style.display = "none";
        playerSelected = true;
        player.sprite=this.childNodes[0].attributes[0].nodeValue;
    });
}


/** @description - Enemies our player must avoid
 * @param sprite - image source address
 * @param x and @param y - initial position of the enemy
 * @param speed - speed of the enemy
 * */

var Enemy = function(sprite,x,y,speed) {
    this.sprite = sprite;
    this.x = x ;
    this.y = y ;
    this.speed = speed ;
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

/** @description - it continuously compares the position of enemy and player
 *  and detects collision
 */
Enemy.prototype.checkCol = function(){
    //below line conditions are optimised for best collision detection experience.
    if (this.x + 50 > player.x && player.x + 40 > this.x && this.y == player.y){
        //reseting player positions on collision
        player.y = 316;
        player.x = 101;
        player.lives -= 1;
        livesDisplay(player.lives);
        //condition to check game over due to loss of all lives
        if (player.lives === 0){
            modal.style.display = "block";
            modalSetup(player.currentScore, player.lives,false);
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
var numberOfEnemies = 700;

/**@description - instantiating allenemies objects with different values from different functions
 * that return positions and speeds for the enemy objects
 */
for(var i = 0; i<numberOfEnemies ; i +=1){
    allEnemies[i] = new Enemy('images/enemy-bug.png',getX(i),getRow(i),getSpeed(i));
}

/**@description - this function equally distributes the enemies among 3 rows */
function getRow(j){
    switch(j%3){
        case 0:
            return  67;
             break;

        case 1:
            return 150;
            break;

        case 2:
            return 233;
            break;
    }
}

/**@description - get different X poosition for the enemy(higher negative arrive late to display) */
function getX(k){
    var temporaryX = 0;
    if(k % 3 === 0){
        temporaryX = (k/3) * (-320);
        return temporaryX;
    }else if(k % 3 === 1){
        temporaryX = Math.floor(k/3) * (-255);
        return temporaryX;
    }else if(k % 3 === 2){
        temporaryX = Math.floor(k/3) * (-295);
        return temporaryX;
    }
}

/** @description - get different speeds to different enemies
 * also increase the speed as more time elapsed
 */
function getSpeed(k){
    if (k % 3 === 0){
        if(k <= numberOfEnemies * 0.2){
            return 180;
        } else if (k > numberOfEnemies * 0.2 && k <= (numberOfEnemies*0.4)){
            return 195;
        } else if (k > (numberOfEnemies * 0.4) && k <= (numberOfEnemies* 0.6)){
            return 210;
        }else{
            return 220;
        }
    }else if(k % 3 === 1){
        if (k <= numberOfEnemies / 5) {
            return 150;
        } else if (k > numberOfEnemies * 0.2 && k <= (numberOfEnemies * 0.6)) {
            return 165;
        } else if (k > numberOfEnemies*0.6) {
            return 180;
        }
    }else if(k % 3 === 2){
        if (k <= numberOfEnemies / 5) {
            return 115;
        } else if (k > numberOfEnemies * 0.2 && k <= (numberOfEnemies * 0.6)) {
            return 145;
        } else if (k > numberOfEnemies * 0.6) {
            return 165;
        }
    }
}

/** @description - player object stores different player properties
 * @param x and @param y - initial positions of the player
 * @param minPosY - value of y coordinate the bottom  most end of the canvas
 * @param maxPosY - value of y coordinate a top most end of canvas
 * @param hasCrossed - variable to store whether the player crossed the enemy flow
 * @param hasCollided - variable to check whether the player has collided with enemy
 * @param currentScore - to store the current score
 * @param lives - to store the remaining lives of the player
 */
var Player = function (){
    this.x = 101;
    this.y = 316;
    this.MinPosY= -16;
    this.MaxPosY= 399;
    this.MinPosX= 0;
    this.MaxPosX= 404;
    this.hasCrossed = false;
    this.hasCollided = false;
    this.currentScore = 0;
    this.lives = 10;
};
 
//new player object
var player = new Player ;

/** @description - update function to set the player to initial 
 * position on successfull cross and a call to update score
 */
Player.prototype.update = function(){
     if(this.y === this.MinPosY){
        this.hasCrossed = true;
        this.updateScore();
        this.y = 316;
        this.x = 101;
        return;
    }
};

/**@description - perform operation on the current score based on diffferent flags 
 * and reset them to normal.
 */
Player.prototype.updateScore = function(){
    if (this.currentScore != 0 && this.hasCollided != false) {
        this.currentScore -= 2;
        this.hasCollided = false;
    }
    if(this.hasCrossed != false){
        this.currentScore += 4;
        this.hasCrossed = false;
    }
    document.getElementById('score_now').innerHTML = this.currentScore;
};


/** @description - function to display the enemy image 
 * condition ensure that player is displayed only after the player selection
 */

Player.prototype.render = function(){
    if(playerSelected != true ){
        return;
    }else{
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

/** @description - function changes the player position based on the
 * keyboard input(provided by another function).
 * also ensures that the player object won't run off canvas boundary
 * also compares the position of the rock and thus restricts the 
 * movement to that set of co-ordinates
 */
Player.prototype.handleInput = function(k){
    var rockIsThere;
    switch(k){
        case "up":
            if (this.y === this.MinPosY) {
                break;
            } else {
                this.y -= 83;
                if (this.x === 202 && this.y === 316) {
                    this.y += 83;
                }
                break;
            }
        case "down":
            if (this.y === this.MaxPosY) {
                break;
            } else {
                this.y += 83;
                if (this.x === 202 && this.y === 316) {
                    this.y -= 83;
                }
                break;
            }
        case "left":
            if (this.x === this.MinPosX) {
                break;
            } else {
                this.x -= 101;
                if (this.x === 202 && this.y === 316) {
                    this.x += 101;
                }
                break;
            }
        case "right":
            if (this.x === this.MaxPosX) {
                break;
            } else {
                this.x += 101;
                if (this.x === 202 && this.y === 316) {
                    this.x -= 101;
                }
                break;
            }
    }
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

/** @description - game timer to keep track of the timing since start of the game
**/
let gameTimer = setInterval(myTimer,1000);

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
        minuteLeft = Math.floor(timeUnit/60);
        minute.innerHTML= minuteLeft;
        secondLeft = timeUnit-(minuteLeft*60);
        if(secondLeft<10){
            second.innerHTML = "0"+secondLeft;
        }else{
            second.innerHTML= secondLeft;
        }
        //condition to check game over due to time up
        if(timeUnit === 0){
            modal.style.display = "block";
            modalSetup(player.currentScore, player.lives,true);
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
var Gem = function(sprite,onTime,offTime,xPos,yPos,score){
    this.sprite = sprite;
    this.onTime = onTime;
    this.offTime = offTime;
    this.xPos = xPos;
    this.yPos = yPos;
    this.score = score;
    this.gemCollected = false;
    this.currentState = 'inactive';
};

// arbitrarily assigning above values to different gem objects
var gem1 = new Gem('images/Gem orange.png',295, 287 , 202, -16 ,20);
var gem2 = new Gem('images/Gem Green.png', 220, 214, 303 , -16,15);
var gem3 = new Gem('images/Gem-Blue.png', 170 , 164, 404 , -16 ,25);
var gem4 = new Gem('images/Heart.png',85,78,303,-16,30);
var gem5 = new Gem('images/star.png',60,53,404,-16,40);

//array of gems
var allGems = [gem1, gem2, gem3, gem4, gem5];

/**@description - function to display the gem
 *  conditions inside ensure that gem is appeared only between on and off time
 * @param currentState - is made inactive right after the gem disappered from the screen
 * 
 */
Gem.prototype.render = function(){
    if(this.onTime >= timeUnit && this.offTime < timeUnit && !this.gemCollected ){
        ctx.drawImage(Resources.get(this.sprite), this.xPos, this.yPos);
        this.currentState = 'active';
    }else{
        this.currentState = 'inactive';
    }
};

/**@description - function that adds the score on gem collect,disappears 
 * it and makes the state inactive */
Gem.prototype.gemCollect = function(){
    if(this.xPos === player.x  && this.yPos === player.y && this.currentState === 'active'){
        this.gemCollected = true;
        player.currentScore += this.score;
        this.currentState = 'inactive';
    }
};

/**@description - rock object that exists always on the screen
 * @param sprite - image source address of the rock
 * @param x and @param y - position of the rock
 */
var Rock =function(){
    this.sprite = 'images/rock.png';
    this.x = 202;
    this.y = 316;
};

//new rock object
var rock = new Rock;

// display the rock (always)
Rock.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite),this.x,this.y);
};

/** @param modal - Get the modal */
const modal = document.getElementById('myModal');

//this variable ensures that game is no more running on modal is on due to game over
let gameOver = false;

/** @description function to set up modal with winning scorecard 
 * @param timeUpFlag - true if game Over was due to time up, else false
 * @param lives - number of lives remaining at the time of game over
 * @param score - final score of the player
 */
function modalSetup(score,lives,timeUpFlag){
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
    if(lives === 0){
        document.getElementsByClassName("time-up")[0].style.display= 'none';
        document.getElementsByClassName("lives-card")[0].style.display = 'none';
        document.getElementsByClassName("em-clock1230")[0].style.display = 'none';
        document.getElementsByClassName("lives-up")[0].style.display = '';
        document.getElementsByClassName("em-hushed")[0].style.display = '';
    }

    if(timeUpFlag ===  true){
        document.getElementsByClassName("lives-up")[0].style.display = 'none';
        document.getElementsByClassName("em-hushed")[0].style.display = 'none';
        document.getElementsByClassName("time-up")[0].style.display = '';
        document.getElementsByClassName("lives-card")[0].style.display = '';
        document.getElementsByClassName("em-clock1230")[0].style.display = '';
    }
}

/** @description - This funtion is used to display number of lives remaining
 * in the game as the number of stars.
 * @param index - is the total number of lives remaining
 * stars are opened based on index value received
 */
function livesDisplay(index){
    const list = document.getElementsByClassName("stars"); 
    list[0].children[index].children[0].classList.value = "fa fa-star-o";
}

/** @param playAgain - get the Play again button on the modal and add event Listener on click */
const playAgain = document.getElementsByClassName("modalButton");

playAgain[0].addEventListener("click", Restart);

/**@description - this function triggers on Restart to reset the game */
function Restart(){
    modal.style.display = "none";
    timeUnit = 300;
    gameTimer = setInterval(myTimer, 1000);
    allEnemies = [];
    numberOfEnemies = 700;
    gameOver = false;

    for (var i = 0; i < numberOfEnemies; i += 1) {
        allEnemies[i] = new Enemy('images/enemy-bug.png', getX(i), getRow(i), getSpeed(i));
    }

    const starList = document.getElementsByClassName("stars"); 

    //reset the stars to default
    for (let i = 0; i < 10; i += 1) {
        starList[0].children[i].children[0].classList.value = "fa fa-star";
    }

    player.lives = 10;
    player.currentScore = 0;
    document.getElementById('score_now').innerHTML = player.currentScore;

    for(var k=0; k<5; k += 1){
        allGems[k].gemCollected = false;
    }
}
