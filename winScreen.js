class WinScreen {
    constructor() {
        this.playerChar = new StartScreenPlayer(120, 160, 100, 100);
        this.playerChar.imageIndex = 4;
    }
    draw() {
        background(54, 207, 207);
        textSize(42);
        noStroke();
        fill('green');
        text("Level Passed", 80, 100);

        this.playerChar.draw();

        noStroke();
        fill(25);
        rect(75, 300, 100, 30);
        rect(225, 300, 100, 30);

        fill(255);
        textSize(16);
        text("Main Menu", 85, 320);
        text("Next Level", 234, 320);

        noFill();
        stroke(219, 84, 46);
        strokeWeight(3);
        if (mouseX >= 75 && mouseX <= 175 &&
            mouseY >= 300 && mouseY <= 330) {
                rect(75, 300, 100, 30);

                noStroke();
                fill(219, 84, 46);
                text("Main Menu", 85, 320);
        }

        if (mouseX >= 225 && mouseX <= 325 &&
            mouseY >= 300 && mouseY <= 330) {
                rect(225, 300, 100, 30);

                noStroke();
                fill(219, 84, 46);
                text("Next Level", 234, 320);
        }
    }
}