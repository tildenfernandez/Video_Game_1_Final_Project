class WinScreen {
    constructor() {
        this.playerChar = new StartScreenPlayer(120, 160, 100, 100);
        this.playerChar.imageIndex = 2;
    }
    draw() {
        background(54, 207, 207);
        textSize(42);
        noStroke();
        fill('green');
        text("Level Passed", 80, 100);

        this.playerChar.draw();
        
        ///////// PLAYER CHAR UPDATE ///////////////
// if chasing, then face left and move to the right 
        // if not chasing, then face right and move to the left
        if (this.playerChar.chasing) {
            this.playerChar.velocity.x = 2;
            drawGem(330, 200);
        } else {
            this.playerChar.velocity.x = -2;
            drawGem(70, 200);
        }

        this.playerChar.position.add(this.playerChar.velocity);
     
        // if you are off the right of the screen, turn around and start being chased
        if (this.playerChar.position.x > this.playerChar.startX + 150) {
            this.playerChar.chasing = false;
        } else if (this.playerChar.position.x < this.playerChar.startX - 90) {
            this.playerChar.chasing = true;
        }

        // update the image every 5 frames
        if (frameCount - this.playerChar.imageFrameCount > 5) {
            if (this.playerChar.imageIndex < 8) {
                this.playerChar.imageIndex++;
            } else {
                this.playerChar.imageIndex = 0;
            }
            // this.imageIndex = (this.imageIndex + 1) % this.images.length;
            this.playerChar.imageFrameCount = frameCount;
        }

        //////// END PLAYER CHAR UPDATE ////////////

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