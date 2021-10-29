// Paolo Fermin and Tilden Fernandez
// ECE 4525 Video Game Design 1
// Final Project

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
var wall_img;

// global var to keep track of font
var font 

var startScreen;
var instructionsScreen;

// keep track of images
var images = [];
var playerImages = [];

var gravity;

function preload() {
    font = loadFont('HyliaSerifBeta-Regular.otf');
    wall_img = loadImage('gray_rock.png');

    instructionsScreen = new InstructionsScreen();

    playerImages = loadImageSequence('sprites/player/walk/walk', 9);

    // do the same for other character images


    makeTileMap();
}


function setup() {
    createCanvas(400, 400);
    textFont(font);
    
    drawLink();

    startScreen  = new StartScreen();

    gravity = new p5.Vector(0, 0.3);
}

function draw() {
    // Display start screen
    if (game_state === "start_screen") {
        startScreen.draw();
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
        instructionsScreen.draw();
    }
    else if (game_state === "level_select") {
        drawLevelSelect();
    }
    else {
        // Provide clear debug if the state machine breaks
        background(225);
        noStroke();
        fill(0);
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
        // ellipse(0, 0, 20, 20);
        image(images[0], 0, 0, 40, 40);
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
 * Draw the level select screen
 */
function drawLevelSelect() {
    background(225);
    fill(color('teal'));
    noStroke();
    text("Select a Level", 30, 30);

    fill(25);
    noStroke();

    rect(50, 100, 300, 30);
    rect(50, 150, 300, 30);
    rect(50, 200, 300, 30);
    rect(50, 250, 300, 30);

    rect(50, 350, 300, 30);


    fill(255);
    text("Level 1", 175, 120);
    text("Level 2", 175, 170);
    text("Level 3", 175, 220);
    text("Level 4", 175, 270);
    text("Return to Main Menu", 125, 370);

    noFill();
    stroke('yellow');
    strokeWeight(3);
    if (mouseX >= 50 && mouseX <= 350 &&
        mouseY >= 100 && mouseY <= 130) {
            rect(50, 100, 300, 30);
    }

    if (mouseX >= 50 && mouseX <= 350 &&
        mouseY >= 150 && mouseY <= 180) {
            rect(50, 150, 300, 30);
    }

    if (mouseX >= 50 && mouseX <= 350 &&
        mouseY >= 200 && mouseY <= 230) {
            rect(50, 200, 300, 30);
    }

    if (mouseX >= 50 && mouseX <= 350 &&
        mouseY >= 250 && mouseY <= 280) {
            rect(50, 250, 300, 30);
    }

    if (mouseX >= 50 && mouseX <= 350 &&
        mouseY >= 350 && mouseY <= 380) {
            rect(50, 350, 300, 30);
    }
}

/**
 * Draw a wall tile at the specified (x,y) coordinant
 * 
 * @param x: x coordinate of the wall 
 * @param y: y coordinate of the wall
 */
function drawWall(x, y) {
    image(wall_img, x, y, tile_width, tile_width);
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
        if (mouseX >= 30 && mouseX <= 130 &&
            mouseY >= 220 && mouseY <= 250) {
                game_state = "playing_level_1"
        }

        if (mouseX >= 150 && mouseX <= 260 &&
            mouseY >= 220 && mouseY <= 250) {
                game_state = "instructions"
        }

        if (mouseX >= 275 && mouseX <= 375 &&
            mouseY >= 220 && mouseY <= 250) {
                game_state = "level_select"
        }
    }
    // Record player clicking on instructions menu
    else if (game_state === "instructions") {
        game_state = "start_screen";
    }
    else if (game_state === "level_select") {
        if (mouseX >= 50 && mouseX <= 350 &&
            mouseY >= 100 && mouseY <= 130) {
                game_state = "playing_level_1";
        }
    
        if (mouseX >= 50 && mouseX <= 350 &&
            mouseY >= 150 && mouseY <= 180) {
                game_state = "playing_level_2";
        }
    
        if (mouseX >= 50 && mouseX <= 350 &&
            mouseY >= 200 && mouseY <= 230) {
                game_state = "playing_level_3";
        }
    
        if (mouseX >= 50 && mouseX <= 350 &&
            mouseY >= 250 && mouseY <= 280) {
                game_state = "playing_level_4";
        }
    
        if (mouseX >= 50 && mouseX <= 350 &&
            mouseY >= 350 && mouseY <= 380) {
                game_state = "start_screen";
        }
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