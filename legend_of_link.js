/* Global variables to use for structuing game flow */

// Control what part of the game is running 
// i.e. start_screen, playing_level_1, win_screen, lose_screen, etc.
var game_state = "start_screen"

// Tile map of the game
tile_map = ["",
            "",
            "",
            ""];


// Instance of a playerModel object
var player;

// Array of enemyModel objects
var enemy = [];

function setup() {
  createCanvas(400, 400);
}

function draw() {
    // Display start screen
    if (game_state === "start_screen") {

    }
    // Display level 1
    else if (game_state === "playing_level_1") {

    }
    // Display win screen
    else if (game_state === "win_screen") {

    }
    // Display lose screen
    else if (game_state === "lose_screen") {

    }
    // Display instructions menu
    else if (game_state === "instructions") {

    }
}

/**
 * Player model object, has methods for doing everything the player should do
 */
class playerModel {
    constructor(x, y) {
        this.pos = new p5.Vector(x, y);
    }
    draw() {

    }
    move() {

    }
    attack() {

    }
}

/**
 * Enemy model object, has methods for doing everything the enemy should do
 */
class enemyModel {
    constructor(x, y) {
        this.pos = new p5.Vector(x, y);
    }
    draw() {

    }
    move() {

    }
    attack() {

    }
}

/**
 * Function to interpret a tilemap
 */
function makeTileMap() {

}

/**
 * Function to draw the art for the character model
 */
function drawPlayerCharacter() {

}

/**
 * Capture mouse input as necessary
 */
function mousePressed() {
    // Record player clicking buttons on start screen
    if (game_state === "start_screen") {

    }
    // Record player clicking on instructions menu
    else if (game_state === "instructions") {

    }
}