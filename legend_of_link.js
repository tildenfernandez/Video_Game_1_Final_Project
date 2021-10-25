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
var enemies = [];

// Array of where wall (x, y) positions
var walls = [];


function setup() {
  createCanvas(400, 400);
}

function draw() {
    // Display start screen
    if (game_state === "start_screen") {
        background(100, 125, 200);

        fill(255);
        stroke(0);
        rect(75, 300, 100, 30);     // Start button rectangle
        rect(200, 300, 100, 30);     // Instructions button


        noStroke();
        fill(0);
        textSize(24);
        text("Legend of Link", 100, 100);
        
        textSize(16);
        text("Start", 110, 320);
        text("Instructions", 210, 320);
    }
    // Display level 1
    else if (game_state === "playing_level_1") {
        background(255);
        text("This is the level 1", 100, 100);
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

        this.health = 3;
        this.attack_damage = 1;
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
    for (var i = 0; i < tile_map[0].length; i++) {
        for (var j = 0; j < tile_map.length; j++) {
            if (tile_map[i][j] === "p") {
                // add player model
            }
            else if (tile_map[i][j] === "e") {
                // add enemy model
            }
            else if (tile_map[i][j] === "w") {
                // add wall
            }
            // else, tile will be empty
        }
    }
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
        if (mouseX >= 75 && mouseX <= 175 &&
            mouseY >= 300 && mouseY <= 330) {
                game_state = "playing_level_1"
        }
        else if (mouseX >= 200 && mouseX <= 300 &&
                 mouseY >= 300 && mouseY <= 330) {
                    game_state = "isntructions"
        }
    }
    // Record player clicking on instructions menu
    else if (game_state === "instructions") {
        
    }
}