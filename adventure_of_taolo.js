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
    "wwwwwwwwwbb                  g      sbbw",
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

let level2_tilemap =   ["wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
                        "wbb-------wwwwwwwwwwws------------swwwww",
                        "ws---------------------------------bswww",
                        "w---h----------p-----------------------w",
                        "w----------------------------------g---w",
                        "wwwwsbssbb-------------------bww--g-g--w",
                        "wwwwwwsbssb----------------sswww---g---w",
                        "wwwwwbsbb------------------bswww--r----w",
                        "wwwbsbb--------------------bwwww---g---w",
                        "wsss--------------e----g-----sbw--g-g--w",
                        "wb-------r---bww------g-g-----ss---g-r-w",
                        "w----------wwwwwws-----g---------------w",
                        "w-----------h--sbb---------------------w",
                        "w----e-----------------------------h---w",
                        "w--------------g-----------------------w",
                        "w-----b-------ggg---------bsww---------w",
                        "w----s---------g---------swwwww-------ww",
                        "w-------------------e----bbwwws-------ww",
                        "wss--------------------------sb------sww",
                        "wss---e----r------------------------swww",
                        "wbsb----------r---------------------bwww",
                        "wsssb-rh---bsswwwwbbb-------g--r----swww",
                        "wbsbbb--sbwwwwwwwwwwsbs----ghg-----bbwww",
                        "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"];

let LEVEL_COINS_NEEDED = [20, 25];

// Define the width of one tile
let tile_width = 20;
let half_tile = tile_width / 2;

let MAX_X_OFFSET = 0;
let MIN_X_OFFSET = [-400, -400];    // min is (# rows - 20)* -20 * think
let MAX_Y_OFFSET = 0;
let MIN_Y_OFFSET = [-400, -140];    // no idea how to calculate play around with it

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

// array of arrows
var arrows = [];

// Loaded images
var bow_img;
var heart_img;
var gem_img;
var castle_img;
var background_img;
var shield_img;
var arrow_img;

// Sprite image dicts
let player_img_dict, melee_img_dict, ranged_img_dict;

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
    // Load all the images
    font = loadFont('HyliaSerifBeta-Regular.otf');
    wall_img = loadImage('images/gray_rock.png');
    bow_img = loadImage('sprites/weapons/bow.png');
    heart_img = loadImage('images/heart.png');
    gem_img = loadImage('images/gem.png');
    castle_img = loadImage('images/castle.png');
    bush_img = loadImage('images/bush.png');
    stump_img = loadImage('images/stump.png');
    arrow_img = loadImage('sprites/weapons/arrow.png');

    // Load music
    songs[0] = loadSound('sounds/music/start_screen.mp3');
    songs[1] = loadSound('sounds/music/level1.mp3');
    songs[2] = loadSound('sounds/music/level1.mp3');

    ////////////// Load image sequences for character models //////////////

    // Player images
    player_img_dict = {
        walkright: loadImageSequence('sprites/player/walk/right/', 9),
        walkup: loadImageSequence('sprites/player/walk/up/', 9),
        walkdown: loadImageSequence('sprites/player/walk/down/', 9),
        walkleft: loadImageSequence('sprites/player/walk/left/', 9),
        attackup: loadImageSequence('sprites/player/attack/up/', 6),
        attackdown: loadImageSequence('sprites/player/attack/down/', 6),
        attackleft: loadImageSequence('sprites/player/attack/left/', 6),
        attackright: loadImageSequence('sprites/player/attack/right/', 6),
    }

    // Orc models (melee enemies)
    melee_img_dict = {
        walkright: loadImageSequence('sprites/orc/walk/right/', 9),
        walkup: loadImageSequence('sprites/orc/walk/up/', 9),
        walkdown: loadImageSequence('sprites/orc/walk/down/', 9),
        walkleft: loadImageSequence('sprites/orc/walk/left/', 9),
        attackup: loadImageSequence('sprites/orc/attack/up/', 6),
        attackdown: loadImageSequence('sprites/orc/attack/down/', 6),
        attackleft: loadImageSequence('sprites/orc/attack/left/', 6),
        attackright: loadImageSequence('sprites/orc/attack/right/', 6),
    }

    // Skeleton models (ranged enemies)
    ranged_img_dict = {
        walkright: loadImageSequence('sprites/skeleton/walk/walk', 9),
        walkup: loadImageSequence('sprites/skeleton/walk/walk', 9),
        walkdown: loadImageSequence('sprites/skeleton/walk/walk', 9),
        walkleft: loadImageSequence('sprites/skeleton/walk/walk', 9),
        attackup: loadImageSequence('sprites/skeleton/shoot/shoot', 13),
        attackdown: loadImageSequence('sprites/skeleton/shoot/shoot', 13),
        attackleft: loadImageSequence('sprites/skeleton/shoot/shoot', 13),
        attackright: loadImageSequence('sprites/skeleton/shoot/shoot', 13),
    }

    // Set up objects from different classes used to organize code
    infoBar = new InformationBar();
    win_screen = new WinScreen();
    lose_screen = new LoseScreen();
}

function setup() {
    createCanvas(400, 400);

    dcircle(200, 200, 200, 27, 224, 216, 20);

    shield_img = get(0, 0, width, height);
    clear();
    
    textFont(font);
    
    // initialize grass images
    for (var i = 0; i < 4; i++) {
        grass_img[i] = createGrassyField();
    }

    // These classes need the canvas to be set up
    startScreen  = new StartScreen();
    instructionsScreen = new InstructionsScreen();

    // Initialize gravity for some objects
    gravity = new p5.Vector(0, 0.3);
    // Start the music
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

        // Use an image with random noise for the background
        image(grass_img[1], x_offset, y_offset, 800, 800);

        // Draw all the walls
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

        // draw all arrows
        for (var i = 0; i < arrows.length; i++) {
            arrows[i].draw();
            arrows[i].update();

            // if the arrow is done, remove it
            if (arrows[i].done) {
                arrows.splice(i, 1);
            }
        }

        // Draw and update all enemies
        for (var i = 0; i < enemies.length; i++) {
            if (enemies[i].health > 0) {
                enemies[i].draw();
                // Execute the current state of the enemy
                enemies[i].update();
            }
        }

        // Draw and implement all gems
        for (var i = 0; i < gems.length; i++) {
            if (gems[i][2] === 1) {
                drawGem(gems[i][0]+x_offset, gems[i][1]+y_offset, 16, 20);

                // If the player is near the gem, they collect it
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

                // If the player is near the heart, they collect it
                if (squaredDist(player.pos.x, player.pos.y, hearts[i][0], hearts[i][1]+half_tile) < 400) {
                    player.health++;

                    // The player can only get a maximum of 5 health
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
            
            // The player moves with the arrow keys
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
                // If the player is not moving, they are animated as idle
                player.idle();
            }
        }

        // Draw the player
        player.draw();

        // Player can use their shield as long as they aren't attacking
        if (!keyIsDown(32) && keyIsDown(SHIFT)) {
            player.use_shield();
        }

        // Draw the information bar at the bottom
        infoBar.draw();

        // If the player is out of health, they lose the level
        if (player.health <= 0) {
            game_state = "lose_screen";
        }

        // if the player collects enough coins, they win the level
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
    // Display the level select menu
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
 * Functin to reset values in the game when going to a new level
 * @param {the game level to reset to} game_level 
 */
function resetGameState(game_level) {
    clear();

    // Reset songs
    stopAllSongs();
    songs[game_level].play();

    curr_level = game_level;

    // Reset tile maps
    enemies = [];
    gems = [];
    walls = [];
    graph_nodes = [];

    // Reset differently depending on the current level
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

    // Reset player stats
    player.coins = 0;
    player.health = 5;
}

