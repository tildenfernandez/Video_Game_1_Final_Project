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
            attackup: loadImageSequence('sprites/player/attack/up/', 6),
            attackdown: loadImageSequence('sprites/player/attack/down/', 6),
            attackleft: loadImageSequence('sprites/player/attack/left/', 6),
            attackright: loadImageSequence('sprites/player/attack/right/', 6),
        }

        // Player information to be displayed
        this.health = 5;
        this.current_weapon = "";
        this.ammo = 10;
        this.coins = 0;
        this.attack_again = true;

        // essentially use a string as an FSM for the player
        this.state = "idle";
        this.direction = "right";

        this.frameCount = frameCount;
        this.imageIndex = 0;
        this.images = this.imageDict.walkRight;
        this.attackTimer = frameCount;
    }
    draw() {
        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        noStroke();
        fill(255, 0, 255);
        ellipse(-half_tile, -half_tile, 20, 20);

        // attack is active for 60 frames
        if (this.state === "attack" && frameCount - this.attackTimer > 60) {
            this.state = "idle"; 
        }

        var frameInterval;
        switch (this.state) {
            case "idle":
            case "walk":
                frameInterval = 10;
                break;
            case "attack":
                frameInterval = 6;
                break;
        }

        // cycle to the next image every 10 frames
        if (frameCount - this.frameCount > frameInterval) {
            this.frameCount = frameCount;

            // cycle to the next image
            // there are only ever 9 images per animation
            switch (this.state) {
                case "idle":
                    this.imageIndex = 0;
                    break;
                case "walk":
                    this.imageIndex = (this.imageIndex + 1) % 9;
                    break;
                case "attack":
                    this.imageIndex = (this.imageIndex + 1) % 6;
                    break;
            }

        }

        var tempstate = this.state;
        if (this.state === "idle") {
            // idle and walk use the same images
            tempstate = "walk";
        }

        // if you are attacking, start an attack animation
        if (this.state === "attack") {
            var xOffset = 0;
            var yOffset = 0;

            switch (this.direction) {
                case "up":
                    yOffset = -20;
                    break;
                case "down":
                    yOffset = 20;
                    break;
                case "right":
                    xOffset = 20;
                    break;
                case "left":
                    xOffset = -20;
                    break;
            }

            // there is a global variable that stores all the current attack animations
            attack_animations.push(new AttackAnimation(this.pos.x + xOffset - half_tile, this.pos.y + yOffset - half_tile, this.direction));
        }

        this.images = this.imageDict[tempstate + this.direction];

        image(this.images[this.imageIndex], -half_tile-18, -half_tile-25, 40, 40);
        pop();
    }
    idle() {
        if (this.state !== "attack") {
            // change back to idle if you release an arrow key and you're not attacking
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
            this.attackTimer = frameCount;
            this.state = "attack";
            for (var i = 0; i < enemies.length; i++) {
                if (squaredDist(this.pos.x, this.pos.y, enemies[i].pos.x, enemies[i].pos.y) < 800) {
                    enemies[i].health--;
                }
            }
            this.attack_again = false;
        } 
    }
    attack_done() {
        this.attack_again = true;
        // this.imageIndex = 0;
    }
}

class AttackAnimation {
    constructor(x, y, direction) {
        this.pos = createVector(x, y, direction);
        this.direction = direction;
        this.startTime = frameCount;
        
        // how long the attack lasts
        this.duration = 30;
        this.done = false;
    }

    draw() {
        // draw a white half circle to indicate a slashing motion
        var angleOffset;

        var framesPassed = frameCount - this.startTime;

        // if framesPassed is longer than duration, done
        if (framesPassed > this.duration) {
            this.done = true;
        }

        switch (this.direction) {
            case "right":
                angleOffset = -PI/4;
                break;
            case "left":
                angleOffset = 3*PI/4;
                break;
            case "up":
                angleOffset = -3*PI/4;
                break;
            case "down":
                angleOffset = PI/4;
                break;
        }

        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        fill(color('white'));
        stroke(255);
        strokeWeight(2);
        arc(0, 0, 30, 30, angleOffset, angleOffset + PI/2);
        pop();

    }
}