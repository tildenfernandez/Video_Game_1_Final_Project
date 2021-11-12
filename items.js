/**
 * This file will keep track of all pickup items in the game.
 * This includes gems, hearts, and weapons.
 * 
 */


/**
 * Draw a gem in the given (x,y) coordinante, of the given [width, height] size
 * @param {x position to draw gem} x 
 * @param {y position of gem} y 
 * @param {width to draw gem} w
 * @param {height to draw gem} h
 */
 function drawGem(x, y, w, h) {
    push()
    translate(x, y);
    scale(cos(frameCount/10), 1);
    image(gem_img, -(floor(w>>1)), 0, w, h);
    pop()
}

function drawHeart(x, y, w, h) {
    push()
    translate(x, y);
    scale(cos(frameCount/10), 1);
    image(heart_img, -(floor(w>>1)), 0, w, h);
    pop()
}