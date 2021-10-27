/* Global variables to use for structuing game flow */

// Control what part of the game is running 
// i.e. start_screen, playing_level_1, win_screen, lose_screen, etc.
var game_state = "start_screen"

// Tile map of the game
tile_map = ["wwwwwwwwwwwwwwwwwwww",
            "w------------------w",
            "w--p---------------w",
            "w------------------w",
            "w------------------w",
            "w------------------w",
            "w------------------w",
            "w--------------e---w",
            "w------------------w",
            "w------------------w",
            "w------------------w",
            "w------------------w",
            "w------------------w",
            "w----e-------------w",
            "w------------------w",
            "w------------------w",
            "w------------------w",
            "w------------------w",
            "w------------------w",
            "wwwwwwwwwwwwwwwwwwww"];

// Define the width of one tile
let tile_width = 20;

// Global offsets for scrolling game window
var x_offset = 0;
var y_offset = 0;

// Instance of a playerModel object
var player;

// Array of enemyModel objects
var enemies = [];

// Array of where wall (x, y) positions
var walls = [];

// global var to keep track of font
var font 

function preload() {
    font = loadFont('HyliaSerifBeta-Regular.otf');
}


function setup() {
    createCanvas(400, 400);
    textFont(font);

    makeTileMap();
}

function draw() {
    // Display start screen
    if (game_state === "start_screen") {
        background(248, 179, 173);
        noStroke();

        fill(255);
        rect(25, 300, 100, 30);     // Start button rectangle
        rect(150, 300, 100, 30);    // Instructions button
        rect(275, 300, 100, 30);    // Levels button


        // Title text
        fill(0);
        textSize(18);
        textStyle(BOLD);
        text("THE LEGEND OF", 60, 100);
        
        textSize(72);
        scale(1.6, 1);
        text("LINK", 47, 162);
        fill(212, 62, 17);
        text("LINK", 45, 160);
        scale(0.625, 1);

        // Button text
        textSize(16);
        fill(0);
        text("Start", 60, 320);
        text("Instructions", 155, 320);
        text("Levels", 300, 320);
    }
    // Display level 1
    else if (game_state === "playing_level_1") {
        background(230);

        for (var i = 0; i < walls.length; i++) {
            drawWall(walls[i][0], walls[i][1]);
        }

        player.draw();

        for (var i = 0; i < enemies.length; i++) {
            enemies[i].draw();
            // Execute the current state of the enemy
            (enemies[i].state[enemies[i].currState]).execute(enemies[i]);

        }

        ///// PLAYER MOVEMENT   //////

        // move player left
        if (keyIsDown(LEFT_ARROW)) {
            player.moveLeft()
        }
        // Move player right
        if (keyIsDown(RIGHT_ARROW)) {
            player.moveRight();
        }
        if (keyIsDown(UP_ARROW)) {
            player.moveUp();
        }
        if (keyIsDown(DOWN_ARROW)) {
            player.moveDown();
        }
    }
    // Display win screen
    else if (game_state === "win_screen") {

    }
    // Display lose screen
    else if (game_state === "lose_screen") {
        
    }
    // Display instructions menu
    else if (game_state === "instructions") {
        background(255);
        text("This is the instructions menu", 100, 100);
    }
    else if (game_state === "level_select") {
        background(225);
        text("This is the level select menu", 100, 100);
    }
    else {
        background(225);
        text("This state should never be reached", 100, 100);
        text("Check updates to game state", 100, 130);
    }
}

/**
 * Player model object, has methods for doing everything the player should do
 */
class playerModel {
    constructor(x, y) {
        this.pos = new p5.Vector(x, y);

        // Player tools available
        this.all_tools = [];

        // Player information to be displayed
        this.health = 3;
        this.current_weapon = "";
        this.ammo = 10;
    }
    draw() {
        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        noStroke();
        fill(255, 0, 255);
        ellipse(0, 0, 20, 20);
        pop();
    }
    moveRight() {
        player.pos.x++;
    }
    moveLeft() {
        player.pos.x--;
    }
    moveDown() {
        player.pos.y++;
    }
    moveUp() {
        player.pos.y--;
    }

    attack() {

    }
}

/**
 * Function to draw the art for the character model
 */
 function drawPlayerCharacter() {

}

/**
 * Enemy model object, has methods for doing everything the enemy should do
 */
class enemyModel {
    constructor(x, y) {
        this.pos = new p5.Vector(x, y);

        this.health = 3;
        this.attack_damage = 1;

        this.state = [new waitState(), new chaseState(), new attackState()];
        this.currState = 0;
    }
    draw() {
        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        noStroke();
        fill("blue");
        ellipse(0, 0, 20, 20);
        pop();
    }
    changeState(newState) {
        this.currState = newState;
    }
}

/**
 * Function to draw the art for an enemy model
 */
 function drawEnemyCharacter() {

}

class waitState {
    constructor() {
    }
    execute(me) {
        // If the player gets near, change to chase state
        if (squaredDist(me.pos.x, me.pos.y, player.pos.x, player.pos.y) < 20) {
            me.changeState(1);
        }
    }
}

class chaseState {
    constructor() {
    }
    execute(me) {
        var dist_to_player = squaredDist(me.pos.x, me.pos.y, player.pos.x, player.pos.y)
        // If we chase close enough to the player, go to attack state
        if (dist_to_player < 8) {
            me.changeState(2);
        }
        // If the player gets too far away, go to the waiting state
        if (dist_to_player > 20) {
            me.changeState(0);
        }
    }
}

class attackState {
    constructor() {
    }
    execute(me) {
        // If the player gets too far away, go to the chase state
        if (squaredDist(me.pos.x, me.pos.y, player.pos.x, player.pos.y) > 11) {
            me.changeState(1);
        }
    }
}

/**
 * Draw a wall tile at the specified (x,y) coordinant
 * 
 * @param x: x coordinate of the wall 
 * @param y: y coordinate of the wall
 */
function drawWall(x, y) {
    noStroke();
    fill(40);
    rect(x+x_offset, y+y_offset, tile_width, tile_width);
}

/**
 * Function to interpret a tilemap
 */
function makeTileMap() {
    for (var i = 0; i < tile_map[0].length; i++) {
        for (var j = 0; j < tile_map.length; j++) {
            if (tile_map[i][j] === "p") {
                // add player
                player = new playerModel(i*tile_width, j*tile_width);
            }
            else if (tile_map[i][j] === "e") {
                // add enemy model
                enemies.push(new enemyModel(i*tile_width, j*tile_width));
            }
            else if (tile_map[i][j] === "w") {
                // add wall
                walls.push([i*tile_width, j*tile_width]);
            }
            // else, tile will be empty
        }
    }
}

/**
 * Capture mouse input as necessary
 */
function mousePressed() {
    // Record player clicking buttons on start screen
    if (game_state === "start_screen") {
        if (mouseX >= 25 && mouseX <= 125 &&
            mouseY >= 300 && mouseY <= 330) {
                game_state = "playing_level_1"
        }

        if (mouseX >= 150 && mouseX <= 250 &&
            mouseY >= 300 && mouseY <= 330) {
                game_state = "instructions"
        }

        if (mouseX >= 275 && mouseX <= 375 &&
            mouseY >= 300 && mouseY <= 330) {
                game_state = "level_select"
        }
    }
    // Record player clicking on instructions menu
    else if (game_state === "instructions") {
        game_state = "start_screen";
    }
}

/**
 * Calculate the square of the distance between to points
 * 
 * @param {*} x1 x coordinant of the first point
 * @param {*} y1 y coordinant of the first point
 * @param {*} x2 x coordinant of the second point
 * @param {*} y2 y coordinant of the second point
 * @returns the squared distance between the two points
 */
function squaredDist(x1, y1, x2, y2) {
    return (((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)))
}