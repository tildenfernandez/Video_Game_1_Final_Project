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
            } else if (tmap[j][i] === 'x') {
                // Boundary wall (indestructable)
                boundary_walls.push(new wallModel(tile_width*i + half_tile, tile_width*j + half_tile, wall_img));
            } else {
                // Add all non-wall tiles to the graph for astar search
                graph_nodes.push(new node(tile_width*i + half_tile, tile_width*j + half_tile));
            }

            // 'e' is a melee enemy
            if (tmap[j][i] === 'e') {
                enemies.push(new MeleeEnemy(tile_width*i + half_tile, tile_width*j + half_tile, iNum));
                enemies[enemies.length - 1].frameNum = i * j % 100;      // Might need to change
                iNum++;
                enemies[enemies.length - 1].currNode = graph_nodes[graph_nodes.length - 1];
                enemies[enemies.length - 1].target = graph_nodes[graph_nodes.length - 1];
            }

            // 'r' is a ranged enemy
            if (tmap[j][i] === 'r') {
                enemies.push(new RangedEnemy(tile_width*i + half_tile, tile_width*j + half_tile, iNum));
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