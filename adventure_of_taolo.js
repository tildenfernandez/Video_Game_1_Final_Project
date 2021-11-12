// Paolo Fermin and Tilden Fernandez
// ECE 4525 Video Game Design 1
// Final Project

/* Global variables to use for structuing game flow */

// Control what part of the game is running 
// i.e. start_screen, playing_level_1, win_screen, lose_screen, etc.
var game_state = "start_screen"

// Tile map of the game
let level1_tilemap = [
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww", 
    "wwwwb     h               b      wwwwwww",
    "wbb                         s     swwwww",
    "w s     p       g    h               s w",
    "w                                  s   w",
    "w   s     s                            w",
    "wwwwwwwwwwwbb         e       g        w",
    "wwwwwwwwwwbbb                  g       w",
    "w ss bbb bbb                    g      w",
    "w             e                        w",
    "w  gg                    bwwb          w",
    "w                      swwwwws         w",
    "wbbbb         s       wwwsb            w",
    "wswwwss      b         bbb    g        w",
    "wwwwwwwwwbb                  g     sbbw",
    "wwwwwwwwbs         e        g    swwsbsw",
    "wwwwwbb                       bbwwwwbbsw",
    "wsbb   g                    bbsbwwwbwwww",
    "w     g    bb               swww       w",
    "w       wwwww                          w",
    "w        www b     b               g   w",
    "w        ssb               e   e  ggg  w",
    "w   b                              g   w",
    "w                                      w",
    "w    b      b             bbwww ww     w",
    "w                        sss  wwwwwwwwww",
    "w         s        s      ssssw bbsswbbw",
    "w                                 bsssww",
    "w                        s          wwbw",
    "wwbbss                                 w",
    "wwwwssbb  s                   w        w",
    "wwwwwwwwww            b                w",
    "wwwwwwwwwwb    s                       w",
    "wwwwwwwwwwsb                   b      bw",
    "wwwwwwwwwwswsbbb                    sbww",
    "wwwwwwwwwwwwwsbbb                  swwww",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww", 

]

// let level1_tilemap =   ["wwwwwwwwwwwwwwwwwwwwww",
//                         "w--------------------w",
//                         "w--------------p-----w",
//                         "w--------------------w",
//                         "w-g------------------w",
//                         "w-----wwwwwwwwwwwwwwww",
//                         "w----------w---------w",
//                         "wwwwwwwwww-w---e-----w",
//                         "w--------w-w---------w",
//                         "w--------w-w---------w",
//                         "w--------w-w----g----w",
//                         "w--------w-w---------w",
//                         "w--------------------w",
//                         "w----e---------------w",
//                         "w--------------g-----w",
//                         "w--------------------w",
//                         "w--------------------w",
//                         "w--------------------w",
//                         "wwwwwwwwwwwwwwwwwww--w",
//                         "w--------------------w",
//                         "w--------------------w",
//                         "w--wwwwwwwwwwwwwwwwwww",
//                         "w-------------------ew",
//                         "wwwwwwwwwwwwwwwwwwwwww"];          

let level2_tilemap =   ["wwwwwwwwwwwwwwwwwwwwww",
                        "w--------------------w",
                        "w--------------p-----w",
                        "w--------------------w",
                        "w--------------------w",
                        "w-g------------------w",
                        "w--------------------w",
                        "w--------------------w",
                        "w--------------------w",
                        "w--------------------w",
                        "w--------------------w",
                        "w----------w---------w",
                        "w--------------------w",
                        "w----e---------------w",
                        "w--------------g-----w",
                        "w--------------------w",
                        "w--------------------w",
                        "w--------------------w",
                        "w--------------------w",
                        "w--------------------w",
                        "w--------------------w",
                        "w--------------------w",
                        "w--------------------w",
                        "wwwwwwwwwwwwwwwwwwwwww"];

let LEVEL_COINS_NEEDED = [10, 2];

// Define the width of one tile
let tile_width = 20;
let half_tile = tile_width / 2;

let MAX_X_OFFSET = 0;
let MIN_X_OFFSET = -400;
let MAX_Y_OFFSET = 0;
let MIN_Y_OFFSET = -400;

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

// Array of hearts (p5 vector of position)
var hearts = [];

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
var lose_screen;

// gravity affects some items
var gravity;

// graph nodes for a* BFS
var graph_nodes = [];

var attack_animations = [];

// Variable to keep track of current level for win/lose screen buttons
var curr_level = 1;

// keep track of random grass background
var grass_img = [];

// keep track of songs
var songs = [];



function preload() {
    font = loadFont('HyliaSerifBeta-Regular.otf');
    wall_img = loadImage('images/gray_rock.png');
    bow_img = loadImage('sprites/weapons/bow.png');
    heart_img = loadImage('images/heart.png');
    gem_img = loadImage('images/gem.png');
    castle_img = loadImage('images/castle.png');
    bush_img = loadImage('images/bush.png');
    stump_img = loadImage('images/stump.png');

    instructionsScreen = new InstructionsScreen();
    infoBar = new InformationBar();
    win_screen = new WinScreen();
    lose_screen = new LoseScreen();

    songs[0] = loadSound('sounds/music/start_screen.mp3');
    songs[1] = loadSound('sounds/music/level1.mp3');
    songs[2] = loadSound('sounds/music/level1.mp3');
}


function setup() {
    createCanvas(400, 400);
    textFont(font);
    
    // initialize grass images
    for (var i = 0; i < 4; i++) {
        grass_img[i] = createGrassyField();
    }

    startScreen  = new StartScreen();
    instructionsScreen = new InstructionsScreen();

    gravity = new p5.Vector(0, 0.3);
    songs[0].play();

}

function draw() {
    // Display start screen
    if (game_state === "start_screen") {
        startScreen.draw();
    }
    // Display level 1
    else if (game_state === "playing_level_1" ||
             game_state === "playing_level_2") {
                 background('blue');
        image(grass_img[1], x_offset, y_offset, 800, 800);

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

        for (var i = 0; i < gems.length; i++) {
            if (gems[i][2] === 1) {
                drawGem(gems[i][0]+x_offset, gems[i][1]+y_offset, 16, 20);

                if (squaredDist(player.pos.x, player.pos.y, gems[i][0], gems[i][1]+half_tile) < 400) {
                    player.coins++;
                    gems[i][2] = 0;
                }
            }
        }

        // draw hearts
        for (var i = 0; i < hearts.length; i++) {
            if (hearts[i][2] === 1) {
                drawHeart(hearts[i][0]+x_offset, hearts[i][1]+y_offset, 16, 20);

                if (squaredDist(player.pos.x, player.pos.y, hearts[i][0], hearts[i][1]+half_tile) < 400) {
                    player.health++;

                    if (player.health > 5) {
                        player.health = 5;
                    }

                    hearts[i][2] = 0;
                }
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

        if (player.health <= 0) {
            game_state = "lose_screen";
        }

        // print(curr_level);
        if (player.coins >= LEVEL_COINS_NEEDED[curr_level-1]) {
            game_state = "win_screen";
        }
    }
    // Display win screen
    else if (game_state === "win_screen") {
        win_screen.draw();
    }
    // Display lose screen
    else if (game_state === "lose_screen") {
        x_offset = 0;
        y_offset = 0;
        lose_screen.draw();
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
    constructor(x, y, image) {
        this.pos = new p5.Vector(x, y);
        this.image = image;
        this.destructable = false;
    }
    draw() {
        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        image(this.image, -half_tile, -half_tile, tile_width, tile_width);
        pop();
    }
}

class destructableWallModel extends wallModel {
    constructor(x, y, image) {
        super(x, y, image);
        this.destructable = true;
    }
    draw() {
        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        image(this.image, -half_tile, -half_tile, tile_width, tile_width);
        pop();
    }

    destroy() {
        // randomly produce nothing, a gem, or a heart
        var rand = Math.floor(Math.random() * 3);
        switch (rand) {
            case 0:
                break;
            case 1:
                gems.push([this.pos.x, this.pos.y - half_tile, 1]);
                break;
            case 2:
                hearts.push([this.pos.x, this.pos.y - half_tile, 1]);
                break;
        }
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
                walls.push(new wallModel(tile_width*i + half_tile, tile_width*j + half_tile, wall_img));
            } else if (tmap[j][i] === 's') {
                // stump
                walls.push(new destructableWallModel(tile_width*i + half_tile, tile_width*j + half_tile, stump_img));
            } else if (tmap[j][i] === 'b') {
                // bush
                walls.push(new destructableWallModel(tile_width*i + half_tile, tile_width*j + half_tile, bush_img));
            } else {
                // Add all non-wall tiles to the graph for astar search
                graph_nodes.push(new node(tile_width*i + half_tile, tile_width*j + half_tile));
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

            // 'g' is a gem
            if (tmap[j][i] === 'g') {
                gems.push([tile_width*i + half_tile, tile_width*j + half_tile, 1]);
            }

            // 'h' is a heart
            if (tmap[j][i] === 'h') {
                hearts.push([tile_width*i + half_tile, tile_width*j + half_tile, 1]);
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
                resetGameState(1);
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
                resetGameState(1);
        }
    
        if (mouseX >= 50 && mouseX <= 350 &&
            mouseY >= 150 && mouseY <= 180) {
                clear();
                game_state = "playing_level_2";
                resetGameState(2);
        }
    
        if (mouseX >= 50 && mouseX <= 350 &&
            mouseY >= 200 && mouseY <= 230) {
                clear();
                game_state = "playing_level_3";
                resetGameState(3);
        }
    
        if (mouseX >= 50 && mouseX <= 350 &&
            mouseY >= 250 && mouseY <= 280) {
                clear();
                game_state = "playing_level_4";
                resetGameState(4);
        }
    
        if (mouseX >= 50 && mouseX <= 350 &&
            mouseY >= 350 && mouseY <= 380) {
                clear();
                game_state = "start_screen";
        }
        
    }
    // Mouse input on the win screen
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
                        resetGameState(2);
                        break;
                    case 2:
                        game_state = "playing_level_3";
                        resetGameState(3);
                        break;
                    case 3:
                        game_state = "playing_level_4";
                        resetGameState(4);
                        break;
                }
        }
    }
    // Mouse input on the lose screen
    else if (game_state === "lose_screen") {
        if (mouseX >= 75 && mouseX <= 175 &&
            mouseY >= 300 && mouseY <= 330) {
                stopAllSongs();
                songs[0].play();
                game_state = "start_screen"
        }

        if (mouseX >= 225 && mouseX <= 325 &&
            mouseY >= 300 && mouseY <= 330) {
                switch (curr_level) {
                    case 1:
                        game_state = "playing_level_1";
                        resetGameState(1);
                        break;
                    case 2:
                        game_state = "playing_level_2";
                        resetGameState(2);
                        break;
                    case 3:
                        game_state = "playing_level_3";
                        resetGameState(3);
                        break;
                    case 4:
                        game_state = "playing_level_4";
                        resetGameState(4);
                        break;
                }
        }
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

            drawGem(30, 100, 25, 30);
    }

    if (mouseX >= 50 && mouseX <= 350 &&
        mouseY >= 150 && mouseY <= 180) {
            rect(50, 150, 300, 30);

            noStroke();
            fill(219, 84, 46);
            text("Level 2", 175, 170);

            drawGem(30, 150, 25, 30);
    }

    if (mouseX >= 50 && mouseX <= 350 &&
        mouseY >= 200 && mouseY <= 230) {
            rect(50, 200, 300, 30);

            noStroke();
            fill(219, 84, 46);
            text("Level 3", 175, 220);

            drawGem(30, 200, 25, 30);
    }

    if (mouseX >= 50 && mouseX <= 350 &&
        mouseY >= 250 && mouseY <= 280) {
            rect(50, 250, 300, 30);

            noStroke();
            fill(219, 84, 46);
            text("Level 4", 175, 270);

            drawGem(30, 250, 25, 30);
    }

    if (mouseX >= 50 && mouseX <= 350 &&
        mouseY >= 350 && mouseY <= 380) {
            rect(50, 350, 300, 30);

            noStroke();
            fill(219, 84, 46);
            text("Return to Main Menu", 125, 370);

            drawGem(30, 350, 25, 30);
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

/**
 * Check if any (x, y) hits a wall
 * @param {x coordinant of position to check} x 
 * @param {y coordinant of position to check} y 
 * @returns 
 */
function detectWallCollision(x, y) {
    for (var i = 0; i < walls.length; i++) {
        if (walls[i].pos.x - x + half_tile < tile_width-1 && walls[i].pos.x - x + half_tile > -tile_width+1 &&
            walls[i].pos.y - y + half_tile < tile_width-1 && walls[i].pos.y - y + half_tile > -tile_width+1) {
                return true;
            }
    }
    return false;
}

/**
 * Functin to reset values in the game when going to a new level
 * @param {the game level to reset to} game_level 
 */
function resetGameState(game_level) {
    clear();
    stopAllSongs();
    
    songs[game_level].play();

    curr_level = game_level;

    enemies = [];
    gems = [];
    walls = [];
    graph_nodes = [];

    switch (game_level) {
        case 1:
            makeTileMap(level1_tilemap);
            x_offset = 0;
            y_offset = 0;
            break;
        case 2:
            makeTileMap(level2_tilemap);
            x_offset = 0;
            y_offset = 0;
            break;
    }

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

    player.coins = 0;
    player.health = 5;
}

function createGrassyField() {
    var a=random(1500);

    push();
    background(3, 242, 102);
    noStroke();

    // sky
    var n1 = a;
    for (var x=0; x<=800; x+=8) {
        var n2 = 0;
        for (var y=0; y<=800; y+=8) {
            var c = map(noise(n1,n2),0,1,0,255);
            fill(c, c+50,c,100);
            rect(x,y,8,8);
            n2 += 0.075; // step size in noise
        }
        n1 += 0.02; // step size in noise
    }
    pop();

    // take a picture
    return get(0, 0, 400, 400);    
}

function stopAllSongs() {
    for (var i = 0; i < songs.length; i++) {
        songs[i].stop();
    }
}