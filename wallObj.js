// Object for the walls
class wallModel {
    constructor(x, y, image) {
        this.pos = new p5.Vector(x, y);
        this.image = image;
        this.destructable = false;  // note if the player can destroy it or not
    }
    // Drawing is just an image at the position
    draw() {
        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        image(this.image, -half_tile, -half_tile, tile_width, tile_width);
        pop();
    }
    destroy() {
        // Add a node to the graph of nodes for enemy movement
        graph_nodes.push(new node(this.pos.x, this.pos.y));

        var gLength = graph_nodes.length;
        // Check for any adjacent nodes to connect to
        for (var j = 0; j < gLength; j++) {
            // If the nodes are adjacent, note it
            if (graph_nodes[gLength - 1].pos.x - graph_nodes[j].pos.x === 0 &&
                graph_nodes[gLength - 1].pos.y - graph_nodes[j].pos.y != 0 &&
                abs(graph_nodes[gLength - 1].pos.y - graph_nodes[j].pos.y) <= 30) {
                    graph_nodes[gLength - 1].adjacent_nodes.push(graph_nodes[j]);
                    graph_nodes[j].adjacent_nodes.push(graph_nodes[gLength - 1]);
            }
            if (graph_nodes[gLength - 1].pos.y - graph_nodes[j].pos.y === 0 &&
                graph_nodes[gLength - 1].pos.x - graph_nodes[j].pos.x != 0 &&
                abs(graph_nodes[gLength - 1].pos.x - graph_nodes[j].pos.x) <= 30) {
                    graph_nodes[gLength - 1].adjacent_nodes.push(graph_nodes[j]);
                    graph_nodes[j].adjacent_nodes.push(graph_nodes[gLength - 1]);
            }
        }
    }
}

// Some walls can be broken
class destructableWallModel extends wallModel {
    constructor(x, y, image) {
        super(x, y, image);
        this.destructable = true;
    }
    // draw() {
    //     push();
    //     translate(this.pos.x + x_offset, this.pos.y + y_offset);
    //     image(this.image, -half_tile, -half_tile, tile_width, tile_width);
    //     pop();
    // }

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

        // Add a node to the graph of nodes for enemy movement
        graph_nodes.push(new node(this.pos.x, this.pos.y));

        var gLength = graph_nodes.length;
        // Check for any adjacent nodes to connect to
        for (var j = 0; j < gLength; j++) {
            // If the nodes are adjacent, note it
            if (graph_nodes[gLength - 1].pos.x - graph_nodes[j].pos.x === 0 &&
                graph_nodes[gLength - 1].pos.y - graph_nodes[j].pos.y != 0 &&
                abs(graph_nodes[gLength - 1].pos.y - graph_nodes[j].pos.y) <= 30) {
                    graph_nodes[gLength - 1].adjacent_nodes.push(graph_nodes[j]);
                    graph_nodes[j].adjacent_nodes.push(graph_nodes[gLength - 1]);
            }
            if (graph_nodes[gLength - 1].pos.y - graph_nodes[j].pos.y === 0 &&
                graph_nodes[gLength - 1].pos.x - graph_nodes[j].pos.x != 0 &&
                abs(graph_nodes[gLength - 1].pos.x - graph_nodes[j].pos.x) <= 30) {
                    graph_nodes[gLength - 1].adjacent_nodes.push(graph_nodes[j]);
                    graph_nodes[j].adjacent_nodes.push(graph_nodes[gLength - 1]);
            }
        }
    }
}