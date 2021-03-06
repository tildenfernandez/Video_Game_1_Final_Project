// Paolo Fermin and Tilden Fernandez
// ECE 4525 Video Game Design 1
// Final Project

/* Global variables to use for structuing game flow */

// Control what part of the game is running 
// i.e. start_screen, playing_level_1, win_screen, lose_screen, etc.
var game_state = "start_screen"

/**
 * TILE MAP KEY
 * w = wall (normal, destructable by bombs only)
 * x = boundary wall (completely indestructable)
 * b = bush (normal, destructable)
 * s = shrub (normal, destructable)
 * h = heart
 * g = gem
 * p = player (should have only one per map, or only the last one will appear)
 * e = melee enemy
 * r = ranged enemy
 * m = boss
 */

// Tile map of the game
let level1_tilemap = [
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", 
    "xwwwb     h               b      wwwwwwx",
    "xbb                         s     swwwwx",
    "x s     p       g    h               s x",
    "x                                  s   x",
    "x   s     s                            x",
    "xwwwwwwwwwwbb         e       g        x",
    "xwwwwwwwwwbbb                  g       x",
    "x ss bbb bbb                    g      x",
    "x             e                        x",
    "x  gg                    bwwb          x",
    "x                      swwwwws         x",
    "xbbbb         s       wwwsb            x",
    "xswwwss      b         bbb    g        x",
    "xwwwwwwwwbb                  g      sbbx",
    "xwwwwwwwbs         e        g    swwsbsx",
    "xwwwwbb                       bbwwwwbbsx",
    "xsbb   g                    bbsbwwwbwwwx",
    "x     g    bb               swww       x",
    "x       wwwww                          x",
    "x        www b     b               g   x",
    "x        ssb               e   e  ggg  x",
    "x   b                              g   x",
    "x                                      x",
    "x    b      b             bbwww ww     x",
    "x                        sss  wwwwwwwwwx",
    "x         s        s      ssssw bbsswbbx",
    "x                                 bssswx",
    "x                        s          wwbx",
    "xwbbss                                 x",
    "xwwwssbb  s                   w        x",
    "xwwwwwwwww            b                x",
    "xwwwwwwwwwb    s                       x",
    "xwwwwwwwwwsb                   b      bx",
    "xwwwwwwwwwswsbbb                    sbwx",
    "xwwwwwwwwwwwwsbbb                  swwwx",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", 

]          

let level2_tilemap =   ["xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                        "xbb-------wwwwwwwwwwws------------swwwwx",
                        "xs---------------------------------bswwx",
                        "x---h----------p-----------------------x",
                        "x----------------------------------g---x",
                        "xwwwsbssbb-------------------bww--g-g--x",
                        "xwwwwwsbssb----------------sswww---g---x",
                        "xwwwwbsbb------------------bswww--r----x",
                        "xwwbsbb--------------------bwwww---g---x",
                        "xsss--------------e----g-----sbw--g-g--x",
                        "xb-------r---bww------g-g-----ss---g-r-x",
                        "x----------wwwwwws-----g---------------x",
                        "x-----------h--sbb---------------------x",
                        "x----e-----------------------------h---x",
                        "x--------------g-----------------------x",
                        "x-----b-------ggg---------bsww---------x",
                        "x----s---------g---------swwwww-------wx",
                        "x-------------------e----bbwwws-------wx",
                        "xss--------------------------sb------swx",
                        "xss---e----r------------------------swwx",
                        "xbsb----------r---------------------bwwx",
                        "xsssb-rh---bsswwwwbbb-------g--r----swwx",
                        "xbsbbb--sbwwwwwwwwwwsbs----ghg-----bbwwx",
                        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"];

let level3_tilemap = [
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "xwww---------ssbbwwwwwwwwwwwwwwwwwsbb-eee-----------------bsbsbsbsbbsbsbbbsbsbbx",
    "xwbs-----p-------bsssswwwwwwwwsbssbs------r--------r----------bbsbbbsbsbsbssbbsx",
    "xb-------------------sbsbbssbssbbs-----------------------r-----------sssbsbbsbbx",
    "x--------------------------------------------------c---------------------h-bsbbx",
    "x--------------------------------------------------e-----------w---------------x",
    "x--------------------------------------------r----------------swbs-------------x",
    "x---sb-------------------------------------------------g------swwww-----g------x",
    "x-sbsssb------------------b----------------ss---e-----g-g-------bsww---ggg-----x",
    "xbbsb----------------sb---------------r---sbwwwb-------g-------e--------g----e-x",
    "xbsbsbss--e---------bwsb--e-------------bswwwwwwwb----h------------------------x",
    "xbsbsbbbbs-----------wwws---------h-----wwwwwwss-------------------------------x",
    "xbsbbbsbsbb-e---r-----------------------b--------------------e-----r---------bsx",
    "xssbbs-b----g---------r------------------------g-----e----------e------------wwx",
    "xbss-----r-ggg-------sb-s----ss---bsb---------g-g---------r---------sbb----wwwwx",
    "xbbsbbsbs----g---swwwwwwwwwwwwwwwwwwwwbssbs-----g-------------h--bwwwwwwwwwwwwwwx",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
]

let level4_tilemap =   ["xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                        "x                   bbswwssb        sbbx",
                        "x   p                 bwwsbsb        sbx",
                        "x                      wwb             x",
                        "xwwwwwwwwwwwwwwwww     wwwwwwwwwww     x",
                        "xsb                           ssww     x",
                        "xb                             bww     x",
                        "x      wwwwwwwwwwwwwwwwww       ww     x",
                        "x            wwsb               ww     x",
                        "xs           ww                 ww     x",
                        "xww   wwww   ww    wwwwwwwwwwwwwww     x",
                        "xww   wwww   ww    wwsbs               x",
                        "xb           ww    ww                  x",
                        "x            ww    ww    wwwwwwwwww    x",
                        "x    wwwwwwwwww                        x",
                        "x    wwwwwwwwww                        x",
                        "x      swwwsb        wwwwwwwwww    wwwwx",
                        "x      bwww              sw           wx",
                        "x       wwwb              w           wx",
                        "x       wwwwwwwwwwwww                  x",
                        "x          ww                   m      x",
                        "x          ww                          x",
                        "x     w    ww       wwwwwww           wx",
                        "x s   w                 ssw           wx",
                        "xbb   w               ssbbwwww     wwwwx",
                        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"];

let LEVEL_COINS_NEEDED = [15, 20, 25];

// Define the width of one tile
let tile_width = 20;
let half_tile = tile_width / 2;

let MAX_X_OFFSET = 0;
let MIN_X_OFFSET = [-400, -400, -1200, -400];    // min is (# rows - 20)* -20 * think
let MAX_Y_OFFSET = 0;
let MIN_Y_OFFSET = [-400, -140, 0, -180];

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
var boundary_walls = [];
var wall_img;

// Array of gems (p5 vector of position)
var gems = [];

// Array of hearts (p5 vector of position)
var hearts = [];

// array of arrows
var arrows = [];

// array of bombs
var bombs = [];
var bomb_explosions = [];

// Delays between attacking for each weapon
let attack_times = [30, 15, 60];
var attack_counter = 0;
var weapon_ind = 0;

// Loaded images
var bow_img;
var heart_img;
var gem_img;
var castle_img;
var background_img;
var shield_img;
var arrow_img;
var bomb_img;

// Sprite image dicts
let player_img_dict, melee_img_dict, ranged_img_dict, boss_img_dict;

var background_tiles = [];

// global var to keep track of font
var font 

// Global variables for classes that display screens
var startScreen;
var instructionsScreen;
var win_screen;
var lose_screen;

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
    axe_img = loadImage('sprites/weapons/axe.png');
    bomb_img = loadImage('images/bomb.png');

    // Load music
    songs[0] = loadSound('sounds/music/start_screen.mp3');
    songs[1] = loadSound('sounds/music/level1.mp3');
    songs[2] = loadSound('sounds/music/level1.mp3');
    songs[3] = loadSound('sounds/music/level1.mp3');
    songs[4] = loadSound('sounds/music/level1.mp3'); // TODO: add boss level music

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
        shootup: loadImageSequence('sprites/player/shoot/up/', 13),
        shootdown: loadImageSequence('sprites/player/shoot/down/', 13),
        shootleft: loadImageSequence('sprites/player/shoot/left/', 13),
        shootright: loadImageSequence('sprites/player/shoot/right/', 13),
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
        walkright: loadImageSequence('sprites/skeleton/walk/right/', 9),
        walkup: loadImageSequence('sprites/skeleton/walk/up/', 9),
        walkdown: loadImageSequence('sprites/skeleton/walk/down/', 9),
        walkleft: loadImageSequence('sprites/skeleton/walk/left/', 9),
        attackup: loadImageSequence('sprites/skeleton/shoot/up/', 13),
        attackdown: loadImageSequence('sprites/skeleton/shoot/down/', 13),
        attackleft: loadImageSequence('sprites/skeleton/shoot/left/', 13),
        attackright: loadImageSequence('sprites/skeleton/shoot/right/', 13),
    }

    boss_img_dict = {
        walkright: loadImageSequence('sprites/boss/walk/right/', 9),
        walkup: loadImageSequence('sprites/boss/walk/up/', 9),
        walkdown: loadImageSequence('sprites/boss/walk/down/', 9),
        walkleft: loadImageSequence('sprites/boss/walk/left/', 9),
        attackup: loadImageSequence('sprites/boss/attack/up/', 6),
        attackdown: loadImageSequence('sprites/boss/attack/down/', 6),
        attackleft: loadImageSequence('sprites/boss/attack/left/', 6),
        attackright: loadImageSequence('sprites/boss/attack/right/', 6),
    }

    // Set up objects from different classes used to organize code
    win_screen = new WinScreen();
    lose_screen = new LoseScreen();
    next_level_screen = new NextLevelScreen();
}

function setup() {
    createCanvas(400, 400);

    // Make the shield image
    dcircle(200, 200, 200, 27, 224, 216, 20);
    shield_img = get(0, 0, width, height);
    clear();
    
    // Set the font
    textFont(font);
    
    // initialize grass images
    for (var i = 0; i < 4; i++) {
        grass_img[i] = createGrassyField();
    }

    // These classes need the canvas to be set up
    startScreen  = new StartScreen();
    instructionsScreen = new InstructionsScreen();

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
             game_state === "playing_level_2" || 
             game_state === "playing_level_3" || 
             game_state === "playing_level_4") {

        
        // The third level is extra long and narrow
        if (curr_level === 3) {
            image(grass_img[curr_level-1], x_offset, y_offset, 1600, 400);
        }
        else {
            // Use an image with random noise for the background
            image(grass_img[curr_level-1], x_offset, y_offset, 800, 800);
        }

        // Draw all the walls
        for (var i = 0; i < walls.length; i++) {
            walls[i].draw();
        }

        // Draw all the boundary walls
        for (var i = 0; i < boundary_walls.length; i++) {
            boundary_walls[i].draw();
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

                // the boss is able to summon enemies
                if (enemies[i].boss) {
                    // randomly summon other enemies 1/100 times
                    if (int(random(500)) === 42) {
                        enemies[i].summon_others();
                    }
                }
            } else {
                enemies[i].kill();
                enemies.splice(i, 1);
            }
        }

        // Draw all bombs placed
        for (var i = 0; i < bombs.length; i++) {
            // Bomb sits for three seconds after being placed
            if (frameCount - bombs[i].start_frame < 180) {
                bombs[i].draw();
            }
            // After three seconds, the bomb explodes, then is deleted
            else {
                bombs[i].explode();
                bombs.splice(i, 1);
            }
        }

        // Draw all explosions
        for (var i = 0; i < bomb_explosions.length; i++) {
            // If the bomb is in the process of 'exploding', draw and update the animation
            if (bomb_explosions[i].timeLeft > 0) {
                bomb_explosions[i].execute();
                bomb_explosions[i].draw();
            }
            // If the bomb is finished 'exploding' remove the objects
            else {
                bomb_explosions.splice(i, 1);
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
        if (keyIsDown(32) && (frameCount - attack_counter > attack_times[weapon_ind])) {
                player.attack();
                attack_counter = frameCount
        }
        // Player can only move while not attacking
        else {
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

        // number keys will change the weapon equipped,
        // but only if the player has access to these items
        if (keyIsDown(49)) {    // 1 changes to the ax
            player.currentWeapon = "axe";
            weapon_ind = 0;
        } else if (keyIsDown(50)) { // 2 changes to the bow
            if (player.bowAcquired == true) {
                player.currentWeapon = "bow";
                weapon_ind = 1;
            }
        } else if (keyIsDown(51)) { // 3 changes to the bomb
            if (player.bombAcquired == true) {
                player.currentWeapon = "bomb";
                weapon_ind = 2;
            }
        }

        // Draw the player
        player.draw();

        // Player can use their shield as long as they aren't attacking
        if (!keyIsDown(32) && keyIsDown(SHIFT)) {
            player.use_shield();
        } else {
            player.shielding = false;
        }

        // Draw the information bar at the bottom
        drawInformationBar();

        // If the player is out of health, they lose the level
        if (player.health <= 0) {
            game_state = "lose_screen";
        }

        // if the player collects enough coins, they win the level
        // the final level can only be won by killing the boss
        if (curr_level < 4 && player.coins >= LEVEL_COINS_NEEDED[curr_level-1]) {
            game_state = "next_level_screen";
        }
    }
    // display next level screen
    else if (game_state === "next_level_screen") {
        next_level_screen.draw();
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
    boundary_walls = [];
    graph_nodes = [];
    bombs = [];
    bomb_explosions = [];

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
        case 3:
            makeTileMap(level3_tilemap);
            x_offset = 0;
            y_offset = 0;
            break;
        case 4:
            makeTileMap(level4_tilemap);
            x_offset = 0;
            y_offset = 0;
            break;
    }

    // Note each node's adjacent nodes
    for (var i = 0; i < graph_nodes.length; i++) {
        for (var j = 0; j < graph_nodes.length; j++) {
            // If the nodes are adjacent, note it
            // Check for vertical nodes
            if (graph_nodes[i].pos.x - graph_nodes[j].pos.x === 0 &&
                graph_nodes[i].pos.y - graph_nodes[j].pos.y != 0 &&
                abs(graph_nodes[i].pos.y - graph_nodes[j].pos.y) <= 30) {
                    graph_nodes[i].adjacent_nodes.push(graph_nodes[j]);
            }
            // Check for horizontal nodes
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

