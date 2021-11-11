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