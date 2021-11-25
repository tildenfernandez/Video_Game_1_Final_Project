/**
 * Enemy model object, has methods for doing everything the enemy should do
 */

let ENEMY_WAIT_IDX = 0;
let ENEMY_CHASE_IDX = 1;
let ENEMY_ATTACK_IDX = 2;
let ENEMY_LOS_IDX = 3;
let ENEMY_RANGE_IDX = 4;

 class enemyModel {
    constructor(x, y) {
        this.pos = new p5.Vector(x, y);

        // Enemy stats
        this.health = 3;
        this.attack_damage = 1;

        // State machine variables
        this.state = [new waitState(), new chaseState(), new attackState(), new lineOfSightState(), new rangeAttackState()];
        this.currState = 3;

        // load images
        this.imageDict = {
            walkright: loadImageSequence('sprites/orc/walk/right/', 9),
            walkup: loadImageSequence('sprites/orc/walk/up/', 9),
            walkdown: loadImageSequence('sprites/orc/walk/down/', 9),
            walkleft: loadImageSequence('sprites/orc/walk/left/', 9),
            attackup: loadImageSequence('sprites/orc/attack/up/', 6),
            attackdown: loadImageSequence('sprites/orc/attack/down/', 6),
            attackleft: loadImageSequence('sprites/orc/attack/left/', 6),
            attackright: loadImageSequence('sprites/orc/attack/right/', 6),
        }
        this.imageIndex = 0;
        this.images = this.imageDict.walkright;

        this.direction = "right";
        this.stateName = "idle";

        this.frameCount = 0;

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
        // fill("blue");
        // ellipse(0, 0, 20, 20);

        // offset for slashing animations
        this.xOffset = 0;
        this.yOffset = 0;

        var frameInterval;
        switch (this.stateName) {
            case "idle":
            case "walk":
                frameInterval = 10;
                break;
            case "attack":
                frameInterval = 4;
                break;
        }


        // cycle to the next image every 10 frames
        if (frameCount - this.frameCount > frameInterval) {
            this.frameCount = frameCount;

            // cycle to the next image
            // there are only ever 9 images per animation
            switch (this.stateName) {
                case "idle":
                    this.imageIndex = 0;
                    break;
                case "walk":
                    if (this.imageIndex < 8) {
                        this.imageIndex++;
                    } else {
                        this.imageIndex = 0;
                    }
                    break;
                case "attack":
                    if (this.imageIndex < 5) {
                        this.imageIndex++;
                    } else {
                        this.imageIndex = 0;
                    }
                    break;
            }
        }

        var tempState = this.stateName;
        if (this.stateName === "idle") {
            // idle and walk use the same images
            tempState = "walk";
        }

        this.images = this.imageDict[tempState + this.direction];

        // error handling
        // if the image index is greater than the number of images, simply take the last one
        if (this.imageIndex >= this.images.length) {
            this.imageIndex = this.images.length - 1;
        }

        image(this.images[this.imageIndex], -half_tile-10, -half_tile-23, 40, 40);

        // display hearts over enemy's head if game is not over
        if (game_state !== "win_screen" && game_state !== "lose_screen") {
            for (var i = 0; i < this.health; i++) {
                image(heart_img, -half_tile-5 + i * 10, -half_tile - 20, 10, 10);
                // image(heart_img, 290 + (20*i), height-40, 20, 20);
            }
        }

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
        me.stateName = "walk";

        // If the enemy is not at the target node, move towards the node
        if (me.target.pos.x != me.pos.x || me.pos.y != me.target.pos.y) {
            var xDiff = me.target.pos.x - me.pos.x;
            var yDiff = me.target.pos.y - me.pos.y;

            // Move and change images used for animation
            if (xDiff < 0) {
                me.pos.x--;
                me.direction = "left";
            }
            if (xDiff > 0) {
                me.pos.x++;
                me.direction = "right";
            }
            if (yDiff < 0) {
                me.pos.y--;
                me.direction = "up";
            }
            if (yDiff > 0) {
                me.pos.y++;
                me.direction = "down";
            }
        }
        // If the enemy is at the target node, pick a new target from the neighboring nodes
        else {
            me.currNode = me.target;

            // Get a random node from the options
            var r = int(random(me.currNode.adjacent_nodes.length));

            // Update the target
            me.target = me.currNode.adjacent_nodes[r];

            // State changes can only occur when we are on a node to avoid going off the paths
            // If the player gets near, change to chase state
            if (squaredDist(me.pos.x, me.pos.y, player.pos.x, player.pos.y) < 20000) {
                // me.changeState(ENEMY_CHASE_IDX);
                me.changeState(ENEMY_LOS_IDX);
                me.target = me.currNode;
                me.firstChaseLoop = true;
            }
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

        // set my state to walking
        me.stateName = "walk";

        // If I have a path (should always have a path), travel along it
        if (me.path != 0) {

            // Set my target to the correct node in the path
            me.target = me.path[me.targetNum];

            // If I haven't made it to my target yet, move towards it
            if (me.target.pos.x != me.pos.x || me.pos.y != me.target.pos.y) {
                var xDiff = me.target.pos.x - me.pos.x;
                var yDiff = me.target.pos.y - me.pos.y;

                if (xDiff < 0) {
                    me.pos.x--;
                    me.flipImage = true;
                    me.direction = "left";
                }
                if (xDiff > 0) {
                    me.pos.x++;
                    me.flipImage = false;
                    me.direction = "right";
                }
                if (yDiff < 0) {
                    me.pos.y--;
                    me.direction = "up";
                }
                if (yDiff > 0) {
                    me.pos.y++;
                    me.direction = "down";
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
                    me.changeState(ENEMY_ATTACK_IDX);
                }
                // If the player gets too far away, go to the waiting state
                if (dist_to_player > 20000) {
                    me.changeState(ENEMY_WAIT_IDX);
                }
            }
        }  
    }
}

class attackState {
    constructor() {
        this.frameCount = frameCount;
    }
    execute(me) {
        me.stateName = "attack";
        
        switch (me.direction) {
            case "up":
                me.yOffset = -10;
                break;
            case "down":
                me.yOffset = 10;
                break;
            case "right":
                me.xOffset = 10;
                break;
            case "left":
                me.xOffset = -10;
                break;
        }

        // create a new slash animation every 30 seconds
        if (frameCount - this.frameCount > 30) {
            this.frameCount = frameCount;
            attack_animations.push(new AttackAnimation(me.pos.x + me.xOffset, me.pos.y + me.yOffset, me.direction));

            // hurt the player if they are close enough and in the right direction
            if (squaredDist(me.pos.x + me.xOffset, me.pos.y + me.yOffset, player.pos.x, player.pos.y) < 400) {
                player.health -= 1;
            }


        }

        // If the player gets too far away, go to the chase state
        if (squaredDist(me.pos.x, me.pos.y, player.pos.x, player.pos.y) > 800) {
            me.changeState(ENEMY_CHASE_IDX);
        }
    }
}

class lineOfSightState {
    constructor() {
    }
    execute(me) {
        // If this is my frame to search, or I just started chasing, calculate a path using a star search
        if (!(frameCount & me.frameNum) || me.firstChaseLoop) {
            me.path = astar_search(me);
            me.targetNum = me.path.length - 2;
            me.firstChaseLoop = false;
        }

        // set my state to walking
        me.stateName = "walk";

        // If I have a path (should always have a path), travel along it
        if (me.path != 0) {

            // Set my target to the correct node in the path
            me.target = me.path[me.targetNum];

            // If I haven't made it to my target yet, move towards it
            if (me.target.pos.x != me.pos.x || me.pos.y != me.target.pos.y) {
                var xDiff = me.target.pos.x - me.pos.x;
                var yDiff = me.target.pos.y - me.pos.y;

                if (xDiff < 0) {
                    me.pos.x--;
                    me.flipImage = true;
                    me.direction = "left";
                }
                if (xDiff > 0) {
                    me.pos.x++;
                    me.flipImage = false;
                    me.direction = "right";
                }
                if (yDiff < 0) {
                    me.pos.y--;
                    me.direction = "up";
                }
                if (yDiff > 0) {
                    me.pos.y++;
                    me.direction = "down";
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
                if (dist_to_player < 5000) {
                    // If we are in line with the player
                    var xDiff = player.pos.x - me.pos.x - half_tile;
                    var yDiff = player.pos.x - me.pos.x - half_tile;

                    // var lineOfSight = true;
                    
                    if (xDiff <= 10 && xDiff >= -10) {

                        // if (xDiff < 0) {
                        //     for (var j = 0; j > xDiff; j -= 10) {
                        //         // For each wall, check if the (x, y) is near the wall
                        //         for (var i = 0; i < walls.length; i++) {
                        //             if (walls[i].pos.x - x + half_tile < tile_width-1 && walls[i].pos.x - x + half_tile > -tile_width+1 &&
                        //                 walls[i].pos.y - y + half_tile < tile_width-1 && walls[i].pos.y - y + half_tile > -tile_width+1) {
                        //                     return true;
                        //                 }
                        //         }
                        //     }
                        // }
                        // else {
                        //     for (var i = 0; i > xDiff; i -= 10) {
                                
                        //     }
                        // }

                        me.changeState(ENEMY_RANGE_IDX);
                    }
                    if (yDiff <= 10 && yDiff >= -10) {
                        me.changeState(ENEMY_RANGE_IDX);
                    }                    
                }
                // If the player gets too far away, go to the waiting state
                if (dist_to_player > 20000) {
                    me.changeState(ENEMY_WAIT_IDX);
                }
            }
        }  
    }
}

class rangeAttackState {
    constructor() {

    }
    execute(me) {
        strokeWeight(1);
        stroke(255, 0, 255);
        line(me.pos.x+x_offset, me.pos.y+y_offset, player.pos.x+x_offset-half_tile, player.pos.y+y_offset-half_tile);

        if (squaredDist(me.pos.x, me.pos.y, player.pos.x - half_tile, player.pos.y - half_tile) > 15000 ||
            ((player.pos.x - half_tile - me.pos.x > 10 || player.pos.x - half_tile - me.pos.x < -10) &&
            ( player.pos.y - half_tile - me.pos.y > 10 || player.pos.y - half_tile - me.pos.y < -10))) {
            me.changeState(ENEMY_LOS_IDX);
        }
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