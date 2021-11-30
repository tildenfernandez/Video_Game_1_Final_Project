/**
 * Class to draw a bar of player information while the game is being played
 */
class InformationBar {
    constructor() {
    }
    draw() {
        // Draw the basic bar
        noStroke();
        fill(245, 200, 137);
        rect(0, height-60, width, 60);

        // Make the top darker
        strokeWeight(1);
        noFill();
        stroke(102, 83, 57);
        line(0, height-60, width, height-60);
        stroke(110, 90, 61);
        line(0, height-59, width, height-59);
        stroke(120, 98, 67);
        line(0, height-58, width, height-58);
        stroke(133, 108, 74);
        line(0, height-57, width, height-57);
        stroke(153, 125, 86);
        line(0, height-56, width, height-56);
        stroke(173, 142, 97);
        line(0, height-55, width, height-55);
        stroke(209, 171, 117);
        line(0, height-54, width, height-54);
        stroke(222, 181, 124);
        line(0, height-54, width, height-54);

        // Draw rectangles for items
        stroke('blue');
        strokeWeight(4);
        noFill();
        rect(220, height-55, 30, 40, 5);
        rect(180, height-55, 30, 40, 5);

        // draw the images for weapons available
        // axe is on by default
        image(axe_img, 190, height-50, 15, 30);
        
        // draw bow if it is available
        if (player.bow_acquired == true) {
            image(bow_img, 220, height-50, 30, 30);
        }

        fill(255);

        textStyle(BOLD);
        textSize(24);
        textFont('Helvetica');
        
        // Draw the number of coins the player has
        stroke(0);
        strokeWeight(2);
        text(player.coins, 80, 375);
        text("x", 60, 375);
        text("/20", 110, 375);

        // Label the two item boxes
        textSize(32);
        textFont('Georgia');
        text("1", 187, height-5);
        text("2", 227, height-5);

        // Draw a health box
        stroke('red');
        strokeWeight(2);
        noFill();
        rect(285, 355, 110, 35, 5);
        noStroke();
        fill(245, 200, 137);
        rect(310, 380, 60, 20);

        // Label the health box
        noStroke();
        textFont(font);
        textSize(16);
        fill('red');
        text("Health", 314, height-5);

        // Draw a number hearts based on the players current health
        for (var i = 0; i < player.health; i++) {
            image(heart_img, 290 + (20*i), height-40, 20, 20);
        }
        
        // Draw a gem by the coin information
        drawGem(50, 350, 25, 30);
    }
}