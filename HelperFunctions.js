/**
 * Collection of short helper functions used elsewhere in the code
 */


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
    // For each wall, check if the (x, y) is near the wall
    for (var i = 0; i < walls.length; i++) {
        if (walls[i].pos.x - x + half_tile < tile_width-1 && walls[i].pos.x - x + half_tile > -tile_width+1 &&
            walls[i].pos.y - y + half_tile < tile_width-1 && walls[i].pos.y - y + half_tile > -tile_width+1) {
                return true;
            }
    }
    return false;
}

/**
 * Stop the music
 */
 function stopAllSongs() {
    for (var i = 0; i < songs.length; i++) {
        songs[i].stop();
    }
}

/**
 * Draw a sphere illusion of a given position (x,y), size s, color (r, g, b) and depth x
 */
var dcircle = function(x, y, s, r, b, g, z) {
    s -= z;
    var fs = s - z;
    for(var i = 0; i < s; i ++) {
        noFill();
        stroke(r - (i * 1.5 - fs), b - (i * 1.5 - fs), g - (i * 1.5 - fs));
        ellipse(x, y, i, i);
    }
}

/**
 * Function to draw a background image with random noise and variance
 * @returns 400x400 background image
 */
 function createGrassyField() {
    var a=random(1500);

    push();
    background(3, 242, 102);
    noStroke();

    // sky
    var n1 = a;
    for (var x=0; x<=800; x+=4) {
        var n2 = 0;
        for (var y=0; y<=800; y+=4) {
            var c = map(noise(n1,n2),0,1,0,255);
            fill(c, c+50,c,100);
            rect(x,y,4,4);
            n2 += 0.075; // step size in noise
        }
        n1 += 0.02; // step size in noise
    }
    pop();

    // take a picture
    return get(0, 0, 400, 400);    
}