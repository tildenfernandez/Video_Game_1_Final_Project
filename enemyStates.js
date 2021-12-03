let ENEMY_WAIT_IDX = 0;
let ENEMY_CHASE_IDX = 1;
let ENEMY_ATTACK_IDX = 2;
let ENEMY_LOS_IDX = 1;
let ENEMY_RANGE_IDX = 2;

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
            if (squaredDist(me.pos.x, me.pos.y, player.pos.x, player.pos.y) < me.playerDetectRange) {
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
                else if (xDiff > 0) {
                    me.pos.x++;
                    me.flipImage = false;
                    me.direction = "right";
                }
                else if (yDiff < 0) {
                    me.pos.y--;
                    me.direction = "up";
                }
                else if (yDiff > 0) {
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
                if (dist_to_player < me.attackRange) {
                    me.changeState(ENEMY_ATTACK_IDX);
                }
                // If the player gets too far away, go to the waiting state
                if (dist_to_player > me.playerDetectRange) {
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

        // create a new slash animation every 30 frames
        if (frameCount - this.frameCount > 40) {
            this.frameCount = frameCount;
            if (!me.boss) {
                attack_animations.push(new AttackAnimation(me.pos.x + me.xOffset, me.pos.y + me.yOffset, me.direction));
            } else {
                me.xOffset *= 2;
                me.yOffset *= 2;
                attack_animations.push(new BossAttackAnimation(me.pos.x + me.xOffset, me.pos.y + me.yOffset, me.direction));
            }

            // hurt the player if they are close enough and in the right direction
            if (squaredDist(me.pos.x + me.xOffset, me.pos.y + me.yOffset, player.pos.x, player.pos.y) < me.attackHitboxRange && !player.shielding) {
                player.health -= me.damage;
            }
        }

        // If the player gets too far away, go to the chase state
        if (squaredDist(me.pos.x, me.pos.y, player.pos.x, player.pos.y) > me.attackRange) {
            me.changeState(ENEMY_CHASE_IDX);
        }
    }
}

class lineOfSightState {
    constructor() {
    }
    execute(me) {
        // set my state to walking
        me.stateName = "walk";

        // If this is my frame to search, or I just started chasing, calculate a path using a star search
        if (!(frameCount & me.frameNum) || me.firstChaseLoop) {
            me.path = range_astar_search(me);
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
                else if (xDiff > 0) {
                    me.pos.x++;
                    me.flipImage = false;
                    me.direction = "right";
                }
                else if (yDiff < 0) {
                    me.pos.y--;
                    me.direction = "up";
                }
                else if (yDiff > 0) {
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

                // If we chase close enough to the player and we are in line with the player, go to attack state
                if (dist_to_player < 15000) {
                    // If we are in line with the player
                    var xDiff = player.pos.x - me.pos.x - half_tile;
                    var yDiff = player.pos.y - me.pos.y - half_tile;

                    if ((xDiff <= 10 && xDiff >= -10) || (yDiff <= 10 && yDiff >= -10)) {
                        let pos_is_good = true;

                        for (let m = me.pos.y; m < player.pos.y; m += 10) {
                            if (detectWallCollision(me.pos.x, m)) {
                                pos_is_good = false;
                                break;
                            }
                        }
        
                        for (let m = me.pos.y; m > player.pos.y; m -= 10) {
                            if (detectWallCollision(me.pos.x, m)) {
                                pos_is_good = false;
                                break;
                            }
                        }
                        
                        for (let m = me.pos.x; m < player.pos.x; m += 10) {
                            if (detectWallCollision(m, me.pos.y)) {
                                pos_is_good = false;
                                break;
                            }
                        }
                        for (let m = me.pos.x; m > player.pos.x; m -= 10) {
                            if (detectWallCollision(m, me.pos.y)) {
                                pos_is_good = false;
                                break;
                            }
                        }

                        if (pos_is_good) {
                            me.changeState(ENEMY_RANGE_IDX);
                        }
                    }                    
                }
                // If the player gets too far away, go to the waiting state
                if (dist_to_player > me.playerDetectRange) {
                    me.changeState(ENEMY_WAIT_IDX);
                }
            }
        }  
    }
}

class rangeAttackState {
    constructor() {
        this.frameCount = frameCount;
    }
    execute(me) {
        me.stateName = "attack";

        let xDiff = me.pos.x - player.pos.x;
        let yDiff = me.pos.y - player.pos.y;

        // Make the enemy face towards the player
        // Check whether the horizontal or vertical distance is greater
        if (abs(xDiff) > abs(yDiff)) {
            // Player has lower x val -> they are to my left
            if (xDiff > 0) {
                me.direction = "left";
            }
            // Face right
            else {
                me.direction = "right";
            }
        }
        else {
            // Player has lower y val -> they are above me
            if (yDiff > 0) {
                me.direction = "up";
            }
            // Face down
            else {
                me.direction = "down";
            }
        }

        // Calculate the arrow offset
        let arrow_offset = [0,0];
         // Set offset based on direction player is facing
         switch (me.direction) {
            case "up":
                arrow_offset[0] = 10;
                arrow_offset[1] = -10;
                break;
            case "down":
                arrow_offset[0] = 10;
                arrow_offset[1] = 10;
                break;
            case "right":
                arrow_offset[0] = 10;
                break;
            case "left":
                arrow_offset[0] = -10;
                break;
        }

        if (frameCount - this.frameCount > 18) {
        // Shoot an arrow
            arrows.push(new Arrow(me.pos.x + arrow_offset[0] - half_tile, me.pos.y + arrow_offset[1] - half_tile, me.direction));
            this.frameCount = frameCount;
        }

        // If the enemy is too far away or no longer straight ahead, go to the chase state
        if (squaredDist(me.pos.x, me.pos.y, player.pos.x - half_tile, player.pos.y - half_tile) > 20000 ||
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

// Calculate the a* search algorithm for a ranged enemy
function range_astar_search(me) {
    let node_path = [];     // path to return
    let node_tree = [];     // tree of nodes

    // Add my current node to the tree
    node_tree.push([me.currNode]);

    // Note that my current node is the root of the tree, and therefor has no parent node
    me.currNode.parent_node = 0;

    let done = false;

    // Set all nodes except for my current node to be unused
    for (var i = 0; i < graph_nodes.length; i++) {
        graph_nodes[i].used = false;
    }
    me.currNode.used = true;

    // Search until we find a node close to the player
    while (!done) {
        // Initialize a list of new nodes to add to the tree
        let new_leaf_nodes = [];

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
                }
            }
        }
        // Add list of new leaf nodes to the tree
        node_tree.push(new_leaf_nodes);

        // check all lead nodes to see if one is line of sight to the player
        for (let i = 0; i < new_leaf_nodes.length; i++) {
            let d = squaredDist(new_leaf_nodes[i].pos.x, new_leaf_nodes[i].pos.y, player.pos.x, player.pos.y);
            // if one is, find the path from it to the head node
            if (d < 15000) {
                 // If we are in line with the player
                 var xDiff = player.pos.x - new_leaf_nodes[i].pos.x - half_tile;
                 var yDiff = player.pos.y - new_leaf_nodes[i].pos.y - half_tile;

                if ((xDiff <= 10 && xDiff >= -10) || (yDiff <= 10 && yDiff >= -10)) {
                    let node_is_good = true;
                    // check if each node is in line of sight to the player

                    for (let m = new_leaf_nodes[i].pos.y-10; m < player.pos.y; m += 10) {
                        if (detectWallCollision(new_leaf_nodes[i].pos.x-10, m)) {
                            node_is_good = false;
                            break;
                        }
                    }

                    for (let m = new_leaf_nodes[i].pos.y-10; m > player.pos.y; m -= 10) {
                        if (detectWallCollision(new_leaf_nodes[i].pos.x-10, m)) {
                            node_is_good = false;
                            break;
                        }
                    }
                    
                    for (let m = new_leaf_nodes[i].pos.x-10; m < player.pos.x; m += 10) {
                        if (detectWallCollision(m, new_leaf_nodes[i].pos.y-10)) {
                            node_is_good = false;
                            break;
                        }
                    }
                    for (let m = new_leaf_nodes[i].pos.x-10; m > player.pos.x; m -= 10) {
                        if (detectWallCollision(m, new_leaf_nodes[i].pos.y-10)) {
                            node_is_good = false;
                            break;
                        }
                    }

                    // Only add this node if it is in line of sight to the player
                    if (node_is_good) {
                        // Note we are done searching - exit the while loop
                        done = true;

                        // Add this node to the node path
                        node_path.push(new_leaf_nodes[i]);

                        // Exit the for loop
                        i = new_leaf_nodes.length;
                    }
                }
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