// Paolo Fermin and Tilden Fernandez
// ECE 4525 Video Game Design 1
// Final Project

/* Global variables to use for structuing game flow */

// Control what part of the game is running 
// i.e. start_screen, playing_level_1, win_screen, lose_screen, etc.
var game_state = "win_screen"

// Tile map of the game
level1_tilemap = ["wwwwwwwwwwwwwwwwwwwwww",
            "w--------------------w",
            "w--------------p-----w",
            "w--------------------w",
            "w--------------------w",
            "w-----wwwwwwwwwwwwwwww",
            "w----------w---------w",
            "wwwwwwwwww-w---e-----w",
            "w--------w-w---------w",
            "w--------w-w---------w",
            "w--------w-w---------w",
            "w--------w-w---------w",
            "w--------------------w",
            "w----e---------------w",
            "w--------------------w",
            "w--------------------w",
            "w--------------------w",
            "w--------------------w",
            "wwwwwwwwwwwwwwwwwww--w",
            "w--------------------w",
            "w--------------------w",
            "w--wwwwwwwwwwwwwwwwwww",
            "w-------------------ew",
            "wwwwwwwwwwwwwwwwwwwwww"];

// Define the width of one tile
let tile_width = 20;
let half_tile = tile_width / 2;

let MAX_X_OFFSET = 0;
let MIN_X_OFFSET = -40;
let MAX_Y_OFFSET = 0;
let MIN_Y_OFFSET = -140;

let DIST_FOR_VIEW_WINDOW_MOVE = 120;

let PLAYER_MOVEMENT_SPEED = 2;

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

// Array of gems (p5 vector of position)
var gems = [];

// Loaded images
var bow_img;
var heart_img;
var gem_img;
var castle_img;
var background_img;

var background_tiles = [];

// global var to keep track of font
var font 

var startScreen;
var instructionsScreen;
var infoBar;
var win_screen;

// gravity affects some items
var gravity;

// graph nodes for a* BFS
var graph_nodes = [];

var attack_animations = [];

// Variable to keep track of current level for win/lose screen buttons
var curr_level

function preload() {
    font = loadFont('HyliaSerifBeta-Regular.otf');
    wall_img = loadImage('images/gray_rock.png');
    bow_img = loadImage('sprites/weapons/bow.png');
    heart_img = loadImage('images/heart.png');
    gem_img = loadImage('images/gem.png');
    castle_img = loadImage('images/castle.png');

    instructionsScreen = new InstructionsScreen();
    infoBar = new InformationBar();
    win_screen = new WinScreen();

    makeTileMap(level1_tilemap);

    // Note each node's adjacent nodes
    for (var i = 0; i < graph_nodes.length; i++) {
        for (var j = 0; j < graph_nodes.length; j++) {
            // If the nodes are adjacent, note it
            if (graph_nodes[i].pos.x - graph_nodes[j].pos.x === 0 &&
                graph_nodes[i].pos.y - graph_nodes[j].pos.y != 0 &&
                abs(graph_nodes[i].pos.y - graph_nodes[j].pos.y) <= 30) {
                    graph_nodes[i].adjacent_nodes.push(graph_nodes[j]);
            }
            if (graph_nodes[i].pos.y - graph_nodes[j].pos.y === 0 &&
                graph_nodes[i].pos.x - graph_nodes[j].pos.x != 0 &&
                abs(graph_nodes[i].pos.x - graph_nodes[j].pos.x) <= 30) {
                    graph_nodes[i].adjacent_nodes.push(graph_nodes[j]);
            }
        }
    }
}


function setup() {
    createCanvas(400, 400);
    textFont(font);
    
    startScreen  = new StartScreen();
    instructionsScreen = new InstructionsScreen();

    gravity = new p5.Vector(0, 0.3);
}

function draw() {
    // Display start screen
    if (game_state === "start_screen") {
        startScreen.draw();
    }
    // Display level 1
    else if (game_state === "playing_level_1") {
        background(17, 166, 51);

        for (var i = 0; i < walls.length; i++) {
            walls[i].draw();
        }
        // draw all attack animations
        for (var i = 0; i < attack_animations.length; i++) {
            attack_animations[i].draw();

            // if the animation is done, remove it
            if (attack_animations[i].done) {
                attack_animations.splice(i, 1);
            }
        }



        for (var i = 0; i < enemies.length; i++) {
            if (enemies[i].health > 0) {
                enemies[i].draw();
                // Execute the current state of the enemy
                enemies[i].update();
            }
        }

        ///// PLAYER MOVEMENT   //////


        // Player can use space to attack
        if (keyIsDown(32)) {
            player.attack();
        }
        else {
            player.attack_done();
            
            if (keyIsDown(LEFT_ARROW)) {
                player.moveLeft()
            }
            else if (keyIsDown(RIGHT_ARROW)) {
                player.moveRight();
            }
            else if (keyIsDown(UP_ARROW)) {
                player.moveUp();
            }
            else if (keyIsDown(DOWN_ARROW)) {
                player.moveDown();
            } else {
                player.idle();
            }
    
        }

        player.draw();


        infoBar.draw();
    }
    // Display win screen
    else if (game_state === "win_screen") {
        win_screen.draw();
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

class wallModel {
    constructor(x, y) {
        this.pos = new p5.Vector(x, y);
    }
    draw() {
        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        image(wall_img, -half_tile, -half_tile, tile_width, tile_width);
        pop();
    }
}

/**
 * Draw the level select screen
 */
function drawLevelSelect() {
    background(54, 207, 207);
    fill(130, 85, 36);
    textSize(32);
    noStroke();
    text("Select a Level", 30, 45);

    fill(25);
    noStroke();

    rect(50, 100, 300, 30);
    rect(50, 150, 300, 30);
    rect(50, 200, 300, 30);
    rect(50, 250, 300, 30);

    rect(50, 350, 300, 30);

    textSize(16);
    fill(255);
    text("Level 1", 175, 120);
    text("Level 2", 175, 170);
    text("Level 3", 175, 220);
    text("Level 4", 175, 270);
    text("Return to Main Menu", 125, 370);

    noFill();
    stroke(219, 84, 46);
    strokeWeight(3);
    if (mouseX >= 50 && mouseX <= 350 &&
        mouseY >= 100 && mouseY <= 130) {
            rect(50, 100, 300, 30);

            noStroke();
            fill(219, 84, 46);
            text("Level 1", 175, 120);

            drawGem(30, 100);
    }

    if (mouseX >= 50 && mouseX <= 350 &&
        mouseY >= 150 && mouseY <= 180) {
            rect(50, 150, 300, 30);

            noStroke();
            fill(219, 84, 46);
            text("Level 2", 175, 170);

            drawGem(30, 150);
    }

    if (mouseX >= 50 && mouseX <= 350 &&
        mouseY >= 200 && mouseY <= 230) {
            rect(50, 200, 300, 30);

            noStroke();
            fill(219, 84, 46);
            text("Level 3", 175, 220);

            drawGem(30, 200);
    }

    if (mouseX >= 50 && mouseX <= 350 &&
        mouseY >= 250 && mouseY <= 280) {
            rect(50, 250, 300, 30);

            noStroke();
            fill(219, 84, 46);
            text("Level 4", 175, 270);

            drawGem(30, 250);
    }

    if (mouseX >= 50 && mouseX <= 350 &&
        mouseY >= 350 && mouseY <= 380) {
            rect(50, 350, 300, 30);

            noStroke();
            fill(219, 84, 46);
            text("Return to Main Menu", 125, 370);

            drawGem(30, 350);
    }
}

/**
 * Function to interpret a tilemap
 */
 function makeTileMap(tmap) {
    // For each row and column, check if the character if coded
    var iNum = 0;
    for (var i = 0; i < tmap[0].length; i++) {
        for (var j = 0; j < tmap.length; j++) {
            // 'w' is a wall
            if (tmap[j][i] === 'w') {
                walls.push(new wallModel(tile_width*i + half_tile, tile_width*j + half_tile));
            }
            // Add all non-wall tiles to the graph for astar search
            else {
                graph_nodes.push(new node(tile_width*i + half_tile, tile_width*j + half_tile));
                // background_tiles.push(new p5.Vector(tile_width*i, tile_width*j));
            }

            // 'e' is an enemy
            if (tmap[j][i] === 'e') {
                enemies.push(new enemyModel(tile_width*i + half_tile, tile_width*j + half_tile, iNum));
                enemies[enemies.length - 1].frameNum = 50;      // Need to change
                iNum++;
                enemies[enemies.length - 1].currNode = graph_nodes[graph_nodes.length - 1];
                enemies[enemies.length - 1].target = graph_nodes[graph_nodes.length - 1];
            }

            // 'p' is the player model
            if (tmap[j][i] === 'p') {
                player =  new playerModel(tile_width*i + half_tile, tile_width*j + half_tile);
            }
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
                curr_level = 1;
                clear();
        }

        if (mouseX >= 150 && mouseX <= 260 &&
            mouseY >= 220 && mouseY <= 250) {
                instructionsScreen.first = 1;
                clear();
                game_state = "instructions"
        }

        if (mouseX >= 275 && mouseX <= 375 &&
            mouseY >= 220 && mouseY <= 250) {
                clear();
                game_state = "level_select"
        }
    }
    // Record player clicking on instructions menu
    else if (game_state === "instructions") {
                clear();
                game_state = "start_screen";
    }
    else if (game_state === "level_select") {
        if (mouseX >= 50 && mouseX <= 350 &&
            mouseY >= 100 && mouseY <= 130) {
                clear();
                game_state = "playing_level_1";
                curr_level = 1;
        }
    
        if (mouseX >= 50 && mouseX <= 350 &&
            mouseY >= 150 && mouseY <= 180) {
                clear();
                game_state = "playing_level_2";
                curr_level = 2;
        }
    
        if (mouseX >= 50 && mouseX <= 350 &&
            mouseY >= 200 && mouseY <= 230) {
                clear();
                game_state = "playing_level_3";
                curr_level = 3;
        }
    
        if (mouseX >= 50 && mouseX <= 350 &&
            mouseY >= 250 && mouseY <= 280) {
                clear();
                game_state = "playing_level_4";
                curr_level = 4;
        }
    
        if (mouseX >= 50 && mouseX <= 350 &&
            mouseY >= 350 && mouseY <= 380) {
                clear();
                game_state = "start_screen";
        }
        
    }
    else if (game_state === "win_screen") {
        if (mouseX >= 75 && mouseX <= 175 &&
            mouseY >= 300 && mouseY <= 330) {
                game_state = "start_screen"
        }

        if (mouseX >= 225 && mouseX <= 325 &&
            mouseY >= 300 && mouseY <= 330) {
                switch (curr_level) {
                    case 1:
                        game_state = "playing_level_2";
                        break;
                    case 2:
                        game_state = "playing_level_3";
                        break;
                    case 3:
                        game_state = "playing_level_2";
                        break;
                }
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

// Check if any (x, y) hits a wall
function detectWallCollision(x, y) {
    for (var i = 0; i < walls.length; i++) {
        if (walls[i].pos.x - x + half_tile < tile_width-1 && walls[i].pos.x - x + half_tile > -tile_width+1 &&
            walls[i].pos.y - y + half_tile < tile_width-1 && walls[i].pos.y - y + half_tile > -tile_width+1) {
                return true;
            }
    }
    return false;
}

function drawGem(x, y) {
    push()
        translate(x, y);
        scale(cos(frameCount/10), 1);
        image(gem_img, -12, 0, 25, 30);
        pop()
}