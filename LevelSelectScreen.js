/**
 * Draw the level select screen
 */
 function drawLevelSelect() {
    background(54, 207, 207);

    // Title text
    fill(130, 85, 36);
    textSize(32);
    noStroke();
    text("Select a Level", 30, 45);

    // Button rectangles
    fill(25);
    noStroke();

    rect(50, 100, 300, 30);
    rect(50, 150, 300, 30);
    rect(50, 200, 300, 30);
    rect(50, 250, 300, 30);

    rect(50, 350, 300, 30);

    // Button text
    textSize(16);
    fill(255);
    text("Level 1", 175, 120);
    text("Level 2", 175, 170);
    text("Level 3", 175, 220);
    text("Level 4", 175, 270);
    text("Return to Main Menu", 125, 370);

    // Button highlights when the mouse is over them
    noFill();
    stroke(219, 84, 46);
    strokeWeight(3);
    if (mouseX >= 50 && mouseX <= 350 &&
        mouseY >= 100 && mouseY <= 130) {
            rect(50, 100, 300, 30);

            noStroke();
            fill(219, 84, 46);
            text("Level 1", 175, 120);

            drawGem(30, 110, 25, 30);
    }

    if (mouseX >= 50 && mouseX <= 350 &&
        mouseY >= 150 && mouseY <= 180) {
            rect(50, 150, 300, 30);

            noStroke();
            fill(219, 84, 46);
            text("Level 2", 175, 170);

            drawGem(30, 160, 25, 30);
    }

    if (mouseX >= 50 && mouseX <= 350 &&
        mouseY >= 200 && mouseY <= 230) {
            rect(50, 200, 300, 30);

            noStroke();
            fill(219, 84, 46);
            text("Level 3", 175, 220);

            drawGem(30, 210, 25, 30);
    }

    if (mouseX >= 50 && mouseX <= 350 &&
        mouseY >= 250 && mouseY <= 280) {
            rect(50, 250, 300, 30);

            noStroke();
            fill(219, 84, 46);
            text("Level 4", 175, 270);

            drawGem(30, 260, 25, 30);
    }

    if (mouseX >= 50 && mouseX <= 350 &&
        mouseY >= 350 && mouseY <= 380) {
            rect(50, 350, 300, 30);

            noStroke();
            fill(219, 84, 46);
            text("Return to Main Menu", 125, 370);

            drawGem(30, 360, 25, 30);
    }
}