// Paolo Fermin and Tilden Fernandez
// ECE 4525 Video Game Design 1
// Final Project

/* Global variables to use for structuing game flow */

// Control what part of the game is running 
// i.e. start_screen, playing_level_1, win_screen, lose_screen, etc.
var game_state = "playing_level_1"

// Tile map of the game
tile_map = ["wwwwwwwwwwwwwwwwwwwwww",
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
let MAX_Y_OFFSET = 60;
let MIN_Y_OFFSET = -80;

let DIST_FOR_VIEW_WINDOW_MOVE = 120;

let PLAYER_MOVEMENT_SPEED = 2;

// Global offsets for scrolling game window
var x_offset = 0;
var y_offset = 60;

// Instance of a playerModel object
var player;

// Array of enemyModel objects
var enemies = [];

// Array of where wall (x, y) positions
var walls = [];
var wall_img;

var bow_img;

var heart_img;

// global var to keep track of font
var font 

var startScreen;
var instructionsScreen;
var infoBar;

// gravity affects some items
var gravity;

// graph nodes for a* BFS
var graph_nodes = [];

function preload() {
    font = loadFont('HyliaSerifBeta-Regular.otf');
    wall_img = loadImage('images/gray_rock.png');
    bow_img = loadImage('sprites/weapons/bow.png');
    heart_img = loadImage('images/heart.png');

    instructionsScreen = new InstructionsScreen();
    infoBar = new InformationBar();

    makeTileMap(tile_map);

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

    // player = new playerModel(0, 0);

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
            walls[i].draw();
        }

        player.draw();

        for (var i = 0; i < enemies.length; i++) {
            if (enemies[i].health > 0) {
                enemies[i].draw();
                // Execute the current state of the enemy
                enemies[i].update();
            }
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

        // Player can use space to attack
        if (keyIsDown(32)) {
            player.attack();
        }
        else {
            player.attack_done();
        }

        infoBar.draw();
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

        this.images = loadImageSequence('sprites/player/walk/walk', 9);

        // Player information to be displayed
        this.health = 3;
        this.current_weapon = "";
        this.ammo = 10;
        this.attack_again = true;
    }
    draw() {
        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        noStroke();
        fill(255, 0, 255);
        ellipse(-half_tile, -half_tile, 20, 20);
        image(this.images[0], -half_tile-18, -half_tile-25, 40, 40);
        pop();
    }
    moveRight() {
        if (!detectWallCollision(this.pos.x+PLAYER_MOVEMENT_SPEED, this.pos.y)) {
            player.pos.x += PLAYER_MOVEMENT_SPEED;
            if (player.pos.x + x_offset > (width - DIST_FOR_VIEW_WINDOW_MOVE) &&
                x_offset > MIN_X_OFFSET) {
                    x_offset -= PLAYER_MOVEMENT_SPEED;
            }
        }
    }
    moveLeft() {
        if (!detectWallCollision(this.pos.x-PLAYER_MOVEMENT_SPEED, this.pos.y)) {
            player.pos.x -= PLAYER_MOVEMENT_SPEED;
            if (player.pos.x + x_offset < DIST_FOR_VIEW_WINDOW_MOVE &&
                x_offset < MAX_X_OFFSET) {
                    x_offset += PLAYER_MOVEMENT_SPEED;
            }
        }
    }
    moveDown() {
        if (!detectWallCollision(this.pos.x, this.pos.y+PLAYER_MOVEMENT_SPEED)) {
            player.pos.y += PLAYER_MOVEMENT_SPEED;
            if (player.pos.y + y_offset > (height - DIST_FOR_VIEW_WINDOW_MOVE) &&
                y_offset > MIN_Y_OFFSET) {
                    y_offset -= PLAYER_MOVEMENT_SPEED;
            }
        }
    }
    moveUp() {
        if (!detectWallCollision(this.pos.x, this.pos.y-PLAYER_MOVEMENT_SPEED)) {
            player.pos.y -= PLAYER_MOVEMENT_SPEED;
            if (player.pos.y + y_offset < DIST_FOR_VIEW_WINDOW_MOVE &&
                y_offset < MAX_Y_OFFSET) {
                    y_offset += PLAYER_MOVEMENT_SPEED;
            }
        }
    }
    attack() {
        if (this.attack_again) {
            for (var i = 0; i < enemies.length; i++) {
                if (squaredDist(this.pos.x, this.pos.y, enemies[i].pos.x, enemies[i].pos.y) < 800) {
                    enemies[i].health--;
                }
            }
            this.attack_again = false;
        }
    }
    attack_done() {
        this.attack_again = true;
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

        this.state = [new waitState(), new chaseState(), new attackState()];
        this.currState = 0;

        // Member variables used for a star search chasing
        this.currNode = 0;
        this.targetNum = 0;
        this.firstChaseLoop = false;
        this.path = 0;
        this.target = 0;
    }
    draw() {
        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        noStroke();
        fill("blue");
        ellipse(0, 0, 20, 20);
        pop();
    }
    // encapsulate FSM behavior
    update() {
        this.state[this.currState].execute(this);
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
        if (squaredDist(me.pos.x, me.pos.y, player.pos.x, player.pos.y) < 20000) {
            me.changeState(1);
        }
    }
}

class chaseState {
    constructor() {
    }
    execute(me) {
        // If this is my frame to search, or I just started chasing, calculate a path using a star search
        if (!(frameCount & me.frameNum) || me.firstChaseLoop) {
            me.path = astar_search(me);
            me.targetNum = me.path.length - 2;
            me.firstChaseLoop = false;
        }

        // If I have a path (should always have a path), travel along it
        if (me.path != 0) {
            // Draw magenta circle
            // for (var x = 0; x < me.path.length; x++) {
            //     fill(255, 0, 255);
            //     noStroke();
            //     ellipse(me.path[x].pos.x, me.path[x].pos.y, 10, 10);
            // }

            // Set my target to the correct node in the path
            me.target = me.path[me.targetNum];

            // If I haven't made it to my target yet, move towards it
            if (me.target.pos.x != me.pos.x || me.pos.y != me.target.pos.y) {
                var xDiff = me.target.pos.x - me.pos.x;
                var yDiff = me.target.pos.y - me.pos.y;

                if (xDiff < 0) {
                    me.pos.x--;
                    me.flipImage = true;
                }
                if (xDiff > 0) {
                    me.pos.x++;
                    me.flipImage = false;
                }
                if (yDiff < 0) {
                    me.pos.y--;
                }
                if (yDiff > 0) {
                    me.pos.y++;
                }
            }
            // If I am at my target node, update to target the next node in the path
            else {
                me.currNode = me.target;
                if (me.targetNum > 0) {
                    me.targetNum--;
                }
                // If I have reached the end of my path, calculate a new path
                else {
                    me.firstChaseLoop = true;
                }

                // Can only change state when I am at a node to avoid going off the paths
                var dist_to_player = squaredDist(me.pos.x, me.pos.y, player.pos.x, player.pos.y)

                // If we chase close enough to the player, go to attack state
                if (dist_to_player < 800) {
                    me.changeState(2);
                }
                // If the player gets too far away, go to the waiting state
                if (dist_to_player > 20000) {
                    me.changeState(0);
                }
            }
        }  
    }
}

class attackState {
    constructor() {
    }
    execute(me) {
        // If the player gets too far away, go to the chase state
        if (squaredDist(me.pos.x, me.pos.y, player.pos.x, player.pos.y) > 800) {
            me.changeState(1);
        }
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
 * Node object used for graph based search algorithm
 */
 class node {
    constructor(x, y) {
        this.pos = new p5.Vector(x, y);
        this.parent_node = 0;
        this.adjacent_nodes = [];
        this.used = false;
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

// Calculate the a* search algorithm
function astar_search(me) {
    var node_path = [];     // path to return
    var node_tree = [];     // tree of nodes

    // Add my current node to the tree
    node_tree.push([me.currNode]);

    // Note that my current node is the root of the tree, and therefor has no parent node
    me.currNode.parent_node = 0;

    var done = false;

    // Set all nodes except for my current node to be unused
    for (var i = 0; i < graph_nodes.length; i++) {
        graph_nodes[i].used = false;
    }
    me.currNode.used = true;

    // Search until we find a node close to pacman
    while (!done) {
        // Initialize a list of new nodes to add to the tree
        var new_leaf_nodes = [];

        // for each leaf node in the tree
        for (var j = 0; j < node_tree[node_tree.length - 1].length; j++) {
            var curr_leaf_node = node_tree[node_tree.length - 1][j];

            // check each node adjacent to the current node
            for (var i = 0; i < curr_leaf_node.adjacent_nodes.length; i++) {

                // If it is unsued:
                if (!curr_leaf_node.adjacent_nodes[i].used) {
                    // Add to list of next leaf nodes
                    new_leaf_nodes.push(curr_leaf_node.adjacent_nodes[i]);

                    // Update the parent of the node
                    new_leaf_nodes[new_leaf_nodes.length - 1].parent_node = curr_leaf_node;
                    
                    // note that this node has been used
                    curr_leaf_node.adjacent_nodes[i].used = true;

                    // fill(0, 255, 0);
                    // noStroke();
                    // ellipse(curr_leaf_node.adjacent_nodes[i].pos.x, curr_leaf_node.adjacent_nodes[i].pos.y, 10, 10);
                }
            }
        }
        // Add list of new leaf nodes to the tree
        node_tree.push(new_leaf_nodes);

        // check all lead nodes to see if one is close to pacman
        for (var i = 0; i < new_leaf_nodes.length; i++) {
            var d = squaredDist(new_leaf_nodes[i].pos.x, new_leaf_nodes[i].pos.y, player.pos.x, player.pos.y);
            // if one is, find the path from it to the head node
            if (d < 500) {
                // Note we are done searching - exit the while loop
                done = true;

                // Add this node to the node path
                node_path.push(new_leaf_nodes[i]);

                // Exit the for loop
                i = new_leaf_nodes.length;
            }
        }
    }

    // Backtrack to find the shortest path
    // Go until we find the root node, which has no parent node
    while (node_path[node_path.length - 1].parent_node != 0) {
        var n_length = node_path.length;
        // Append the current node to the path
        node_path.push(node_path[n_length -1].parent_node);
    }

    // Return the path to the player
    return node_path;
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