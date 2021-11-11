class Player {
    constructor(x, y, width, height) {
        
    }
}

/**
 * Player model object, has methods for doing everything the player should do
 */
 class playerModel {
    constructor(x, y) {
        this.pos = new p5.Vector(x, y);

        // Player tools available
        this.all_tools = [];

        this.imageDict = {
            walkright: loadImageSequence('sprites/player/walk/right/', 9),
            walkup: loadImageSequence('sprites/player/walk/up/', 9),
            walkdown: loadImageSequence('sprites/player/walk/down/', 9),
            walkleft: loadImageSequence('sprites/player/walk/left/', 9),
        }

        // Player information to be displayed
        this.health = 3;
        this.current_weapon = "";
        this.ammo = 10;
        this.attack_again = true;

        // essentially use a string as an FSM for the player
        this.state = "idle";
        this.direction = "right";

        this.frameCount = frameCount;
        this.imageIndex = 0;
        this.images = this.imageDict.walkRight;
    }
    draw() {
        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        noStroke();
        fill(255, 0, 255);
        ellipse(-half_tile, -half_tile, 20, 20);

        // cycle to the next image every 10 frames
        if (frameCount - this.frameCount > 10) {
            this.frameCount = frameCount;

            // cycle to the next image
            // there are only ever 9 images per animation
            if (this.state !== "idle") {
                this.imageIndex = (this.imageIndex + 1) % 9;
            } else {
                this.imageIndex = 0;
            }
        }

        var tempstate = this.state;
        // this.images = this.imageDict[this.state + this.direction];
        if (this.state === "idle") {
            // idle and walk use the same images
            tempstate = "walk";
        }

        this.images = this.imageDict[tempstate + this.direction];

        image(this.images[this.imageIndex], -half_tile-18, -half_tile-25, 40, 40);
        pop();
    }
    idle() {
        if (this.state !== "attack") {
            this.state = "idle";
        }
    }
    moveRight() {
        if (!detectWallCollision(this.pos.x+PLAYER_MOVEMENT_SPEED, this.pos.y)) {
            player.pos.x += PLAYER_MOVEMENT_SPEED;
            if (player.pos.x + x_offset > (width - DIST_FOR_VIEW_WINDOW_MOVE) &&
                x_offset > MIN_X_OFFSET) {
                    x_offset -= PLAYER_MOVEMENT_SPEED;
            }
        }
        this.state = "walk";
        this.direction = "right";
    }
    moveLeft() {
        if (!detectWallCollision(this.pos.x-PLAYER_MOVEMENT_SPEED, this.pos.y)) {
            player.pos.x -= PLAYER_MOVEMENT_SPEED;
            if (player.pos.x + x_offset < DIST_FOR_VIEW_WINDOW_MOVE &&
                x_offset < MAX_X_OFFSET) {
                    x_offset += PLAYER_MOVEMENT_SPEED;
            }
        }
        this.state = "walk";
        this.direction = "left";
    }
    moveDown() {
        if (!detectWallCollision(this.pos.x, this.pos.y+PLAYER_MOVEMENT_SPEED)) {
            player.pos.y += PLAYER_MOVEMENT_SPEED;
            if (player.pos.y + y_offset > (height - DIST_FOR_VIEW_WINDOW_MOVE) &&
                y_offset > MIN_Y_OFFSET) {
                    y_offset -= PLAYER_MOVEMENT_SPEED;
            }
        }
        this.state = "walk";
        this.direction = "down";
    }
    moveUp() {
        if (!detectWallCollision(this.pos.x, this.pos.y-PLAYER_MOVEMENT_SPEED)) {
            player.pos.y -= PLAYER_MOVEMENT_SPEED;
            if (player.pos.y + y_offset < DIST_FOR_VIEW_WINDOW_MOVE &&
                y_offset < MAX_Y_OFFSET) {
                    y_offset += PLAYER_MOVEMENT_SPEED;
            }
        }
        this.state = "walk";
        this.direction = "up"; 
    }
    attack() {
        if (this.attack_again) {
            for (var i = 0; i < enemies.length; i++) {
                if (squaredDist(this.pos.x, this.pos.y, enemies[i].pos.x, enemies[i].pos.y) < 800) {
                    enemies[i].health--;
                }
            }
            this.attack_again = false;
        }
        this.state = "attack";
    }
    attack_done() {
        this.attack_again = true;
    }
}