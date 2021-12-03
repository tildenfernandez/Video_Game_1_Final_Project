/**
 * Function to draw a bar of player information while the game is being played
 */
function drawInformationBar() {
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
    noFill();
    stroke('blue');
    strokeWeight(4);
    rect(230, height-55, 30, 40, 5);
    rect(190, height-55, 30, 40, 5);
    rect(150, height-55, 30, 40, 5);

    // highlight the player's currently selected item in gold
    stroke(240);
    strokeWeight(3);
    if (player.currentWeapon === "axe") {
        rect(148, height-57, 34, 44, 5);
    } else if (player.currentWeapon === "bow") {
        rect(188, height-57, 34, 44, 5);
    } else if (player.currentWeapon === "bomb") {
        rect(228, height-57, 34, 44, 5);
    }

    // draw the images for weapons available
    // axe is on by default
    image(axe_img, 160, height-50, 15, 30);
    
    // draw bow if it is available
    if (player.bowAcquired === true) {
        image(bow_img, 190, height-50, 30, 30);
    }

    if (player.bowAcquired === true) {
        image(bomb_img, 230, height-50, 60, 30);
    }

    fill(255);

    textStyle(BOLD);
    textSize(24);
    textFont('Helvetica');
    
    // Draw the number of coins the player has
    stroke(0);
    strokeWeight(2);
    text(player.coins, 60, 375);
    text("x", 40, 375);
    text("/", 90, 375);
    text(LEVEL_COINS_NEEDED[curr_level-1], 97, 375)

    // Label the two item boxes
    textSize(32);
    textFont('Georgia');
    text("1", 157, height-5);
    text("2", 197, height-5);
    textSize(28);
    text("3", 237, height-7);

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
    drawGem(30, 350, 25, 30);
}