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
            shootup: loadImageSequence('sprites/player/shoot/up/', 13),
            shootdown: loadImageSequence('sprites/player/shoot/down/', 13),
            shootleft: loadImageSequence('sprites/player/shoot/left/', 13),
            shootright: loadImageSequence('sprites/player/shoot/right/', 13),
        }

        // Player information to be displayed
        this.health = 5;
        this.ammo = 10;
        this.coins = 0;
        this.attack_again = true;
        this.currentWeapon = "bow";

        // essentially use a string as an FSM for the player
        this.state = "idle";
        this.direction = "right";

        this.frameCount = frameCount;
        this.imageIndex = 0;
        this.images = this.imageDict.walkright;
        this.attackTimer = frameCount;
        this.attackOffset = new p5.Vector(0, 0);

    }
    draw() {
        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        noStroke();
        // fill(255, 0, 255);
        // ellipse(-half_tile, -half_tile, 20, 20);

        // attack is active for 30 frames
        if (this.state === "attack" && frameCount - this.attackTimer > 30) {
            this.state = "idle"; 
        }

        // shoot is active for 30 frames
        if (this.state === "shoot" && frameCount - this.attackTimer > 30) {
            this.state = "idle";
        }

        var frameInterval;
        switch (this.state) {
            case "idle":
            case "walk":
                frameInterval = 10;
                break;
            case "attack":
                frameInterval = 4;
                break;
            case "shoot":
                frameInterval = 2;
                break;
        }

        // cycle to the next image every n frames
        if (frameCount - this.frameCount > frameInterval) {
            this.frameCount = frameCount;

            // cycle to the next image
            // there are a different number of frames per animation
            switch (this.state) {
                case "idle":
                    this.imageIndex = 0;
                    break;
                case "walk":
                    if (this.imageIndex < 8) {
                        this.imageIndex++;
                    } else {
                        this.imageIndex = 0;
                    }
                    break;
                case "attack":
                    if (this.imageIndex < 5) {
                        this.imageIndex++;
                    } else {
                        this.imageIndex = 0;
                    }
                    break;
                case "shoot":
                    if (this.imageIndex < 12) {
                        this.imageIndex++;
                    } else {
                        this.imageIndex = 0;
                    }
                    break;
            }

        }

        var tempstate = this.state;
        if (this.state === "idle") {
            // idle and walk use the same images
            tempstate = "walk";
        }

        this.images = this.imageDict[tempstate + this.direction];

        // error handling
        // if the image index is greater than the number of images, simply take the last one
        if (this.imageIndex >= this.images.length) {
            this.imageIndex = this.images.length - 1;
        }

        image(this.images[this.imageIndex], -half_tile-18, -half_tile-30, 40, 40);

        
        pop();
    }
    idle() {
        if (this.state !== "attack" && this.state !== "shoot") {
            // change back to idle if you release an arrow key and you're not attacking
            this.state = "idle";
        }
    }
    // Player movement functions
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
            this.attack_again = false;

            this.attackOffset.x = 0;
            this.attackOffset.y = 0;

            switch (this.direction) {
                case "up":
                    this.attackOffset.y = -10;
                    break;
                case "down":
                    this.attackOffset.y = 10;
                    break;
                case "right":
                    this.attackOffset.x = 10;
                    break;
                case "left":
                    this.attackOffset.x = -10;
                    break;
            }

            if (this.currentWeapon === "bow") {
                this.shoot();
            } else {
                // swing the axe
                this.state = "attack";

                for (var i = 0; i < enemies.length; i++) {
                    if (squaredDist(this.pos.x + this.attackOffset.x, this.pos.y + this.attackOffset.y, enemies[i].pos.x, enemies[i].pos.y) < 800) {
                        enemies[i].health--;
                    }
                }

                // there is a global variable that stores all the current attack animations
                attack_animations.push(new AttackAnimation(this.pos.x + this.attackOffset.x - half_tile, this.pos.y + this.attackOffset.y - half_tile, this.direction));

                // check if near any destructible walls
                // for now, loop through all walls
                // consider making a separate array for destructible walls
                for (var i = 0; i < walls.length; i++) {
                    if (walls[i].destructable === true && squaredDist(this.pos.x + this.attackOffset.x, this.pos.y + this.attackOffset.y, walls[i].pos.x, walls[i].pos.y) < 800) {
                        walls[i].destroy();
                        // remove wall from walls array
                        walls.splice(i, 1);
                    }
                }

            }

        } 
    }
    attack_done() {
        this.attack_again = true;
        // this.imageIndex = 0;
    }
    shoot() {
        // this is called if you press the space bar and you have the bow currently equipped
        this.state = "shoot";

        // instantiate a new arrow object in the direction based on this.attackOffset
        arrows.push(new Arrow(this.pos.x + this.attackOffset.x - half_tile, this.pos.y + this.attackOffset.y - half_tile, this.direction));

    }
    use_shield() {
        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        tint(255, 127);
        image(shield_img, -half_tile-44, -half_tile-50, 90, 90);
        pop();
    }
}

class AttackAnimation {
    constructor(x, y, direction) {
        this.pos = createVector(x, y, direction);
        this.direction = direction;
        this.startTime = frameCount;
        
        // how long the attack lasts
        this.duration = 10;
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

        var currentAngle = lerp(angleOffset, angleOffset + PI/2, framesPassed/this.duration);

        var startAngle = max(angleOffset, currentAngle - PI/4);

        // Draw an arc when the player attacks
        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        fill(color('white'));
        stroke(255);
        strokeWeight(2);
        arc(0, 0, 30, 30, startAngle, currentAngle);
        pop();

    }
}

// linearly interpolate the required angle to the current angle
function lerpAngle(current, required, speed) {
    var delta = required - current;
    var deltaAbs = abs(delta);
    if (deltaAbs > speed) {
        if (delta > 0) {
            return current + speed;
        } else {
            return current - speed;
        }
    } else {
        return required;
    }
}

