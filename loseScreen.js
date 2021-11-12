class LoseScreen {
    constructor() {
        this.playerChar = new playerModel(120, 300);
        this.enemyChar = new enemyModel(80, 293);

        this.playerChar.state = "walk";
        this.enemyChar.stateName = "walk";

        this.playerState = 0;
        this.enemyState = 0;

        this.playerChar.imageIndex = 4;

        this.movement_speed = 2;
    }
    draw() {
        background(54, 207, 207);
        textSize(42);
        noStroke();
        fill('red');
        text("Level Failed", 80, 100);

        noStroke();
        fill(25);
        rect(75, 300, 100, 30);
        rect(225, 300, 100, 30);

        fill(255);
        textSize(16);
        text("Main Menu", 85, 320);
        text("Retry", 252, 320);

        this.playerChar.draw();
        this.enemyChar.draw();

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
                text("Retry", 252, 320);
        }

        // Player walking state machine
        if (this.playerState === 0) {
            this.playerChar.pos.x += this.movement_speed;
            
            if (this.playerChar.pos.x >= 320) {
                this.playerState = 1;
                this.playerChar.direction = "up";
            }
        }
        if (this.playerState === 1) {
            this.playerChar.pos.y -= this.movement_speed;

            if (this.playerChar.pos.y <= 120) {
                this.playerState = 2;
                this.playerChar.direction = "left";
            }
        }
        if (this.playerState === 2) {
            this.playerChar.pos.x -= this.movement_speed;

            if (this.playerChar.pos.x <= 100) {
                this.playerState = 3;
                this.playerChar.direction = "down";
            }
        }
        if (this.playerState === 3) {
            this.playerChar.pos.y += this.movement_speed;

            if (this.playerChar.pos.y >= 300) {
                this.playerState = 0;
                this.playerChar.direction = "right";
            }
        }

        // Enemy walking state machine
        if (this.enemyState === 0) {
            this.enemyChar.pos.x += this.movement_speed;
            
            if (this.enemyChar.pos.x >= 312) {
                this.enemyState = 1;
                this.enemyChar.direction = "up";
            }
        }
        if (this.enemyState === 1) {
            this.enemyChar.pos.y -= this.movement_speed;

            if (this.enemyChar.pos.y <= 112) {
                this.enemyState = 2;
                this.enemyChar.direction = "left";
            }
        }
        if (this.enemyState === 2) {
            this.enemyChar.pos.x -= this.movement_speed;

            if (this.enemyChar.pos.x <= 92) {
                this.enemyState = 3;
                this.enemyChar.direction = "down";
            }
        }
        if (this.enemyState === 3) {
            this.enemyChar.pos.y += this.movement_speed;

            if (this.enemyChar.pos.y >= 292) {
                this.enemyState = 0;
                this.enemyChar.direction = "right";
            }
        }
    }
}