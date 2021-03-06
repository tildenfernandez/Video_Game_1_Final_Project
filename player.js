/**
 * Player model object, includes drawing, moving, attacking, and shielding
 */
class playerModel {
    constructor(x, y) {
        this.pos = new p5.Vector(x, y);

        // Player tools available
        this.all_tools = [];

        this.imageDict = player_img_dict;

        // Player information to be displayed
        this.health = 5;
        this.ammo = 10;
        this.coins = 0;
        this.attack_again = true;
        this.currentWeapon = "axe";

        // essentially use a string as an FSM for the player
        this.state = "idle";
        this.direction = "right";

        // Animation variables
        this.frameCount = frameCount;
        this.imageIndex = 0;
        this.images = this.imageDict.walkright;
        this.attackTimer = frameCount;
        this.attackOffset = new p5.Vector(0, 0);

        // Note if the player has access to different weapons
        this.bowAcquired = true;
        this.bombAcquired = true;

        // Note if the player is shielding or not
        this.shielding = false;

    }
    draw() {
        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        noStroke();

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
        // only move if theres no wall collision
        if (!detectWallCollision(this.pos.x+PLAYER_MOVEMENT_SPEED, this.pos.y)) {
            player.pos.x += PLAYER_MOVEMENT_SPEED;
            if (player.pos.x + x_offset > (width - DIST_FOR_VIEW_WINDOW_MOVE) &&
                x_offset > MIN_X_OFFSET[curr_level-1]) {
                    x_offset -= PLAYER_MOVEMENT_SPEED;
            }
        }
        this.state = "walk";
        this.direction = "right";
    }
    moveLeft() {
        // only move if theres no wall collision
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
        // only move if theres no wall collision
        if (!detectWallCollision(this.pos.x, this.pos.y+PLAYER_MOVEMENT_SPEED)) {
            player.pos.y += PLAYER_MOVEMENT_SPEED;
            if (player.pos.y + y_offset > (height - DIST_FOR_VIEW_WINDOW_MOVE) &&
                y_offset > MIN_Y_OFFSET[curr_level-1]) {
                    y_offset -= PLAYER_MOVEMENT_SPEED;
            }
        }
        this.state = "walk";
        this.direction = "down";
    }
    moveUp() {
        // only move if theres no wall collision
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
        // Control when the player can attack again
        if (this.attack_again || true) {
            this.attackTimer = frameCount;
            this.attack_again = false;

            this.attackOffset.x = 0;
            this.attackOffset.y = 0;

            // Set offset based on direction player is facing
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

            // Player attacks depending on what weapon they are currently using
            if (this.currentWeapon === "bow") {
                this.shoot();   // bow shoots arrows
            } else if (this.currentWeapon === "bomb") {
                // bomb drops a bomb
                bombs.push(new Bomb(player.pos.x - half_tile, player.pos.y - half_tile));
            } else {
                // swing the axe
                this.state = "attack";

                // Hurt any enemies within range
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
    }
    shoot() {
        // this is called if you press the space bar and you have the bow currently equipped
        this.state = "shoot";

        // instantiate a new arrow object in the direction based on this.attackOffset
        arrows.push(new Arrow(this.pos.x + this.attackOffset.x - half_tile, this.pos.y + this.attackOffset.y - half_tile, this.direction, true));

    }
    // Use the player's shield
    use_shield() {
        push();
        // Note that the player has their shield up
        this.shielding = true;
        // Draw the shield
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        tint(255, 127);
        image(shield_img, -half_tile-44, -half_tile-50, 90, 90);
        pop();
    }
}

// Animation for the player attacking
class AttackAnimation {
    constructor(x, y, direction) {
        this.pos = createVector(x, y, direction);
        this.direction = direction;
        this.startTime = frameCount;

        this.radius = 30;
        
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

        // Set offset based on direction player is facing
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



        // Draw an arc when the player attacks
        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        fill(color('white'));
        stroke(255);
        strokeWeight(2);
        if (this.direction === "left" || this.direction === "up") {
            var currentAngle = lerp(angleOffset, angleOffset + PI/2, framesPassed/this.duration);
            var startAngle = max(angleOffset, currentAngle - PI/4);
            arc(0, 0, this.radius, this.radius, startAngle, currentAngle);
        } else {
            // reverse rotation direction if facing down or right
            var currentAngle = lerp(angleOffset + PI/2, angleOffset, framesPassed/this.duration);
            var startAngle = min(angleOffset + PI/2, currentAngle + PI/4);
            arc(0, 0, this.radius, this.radius, currentAngle, startAngle);
        }
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

class BossAttackAnimation extends AttackAnimation {
    constructor(x, y, direction) {
        super(x, y, direction);
        this.duration = 20;

        this.radius = 120;
    }

}
