/**
 * Enemy model object, has methods for doing everything the enemy should do
 */
class enemyModel {
    constructor(x, y) {
        this.pos = new p5.Vector(x, y);

        // Enemy stats
        this.health = 3;
        this.attack_damage = 1;

        // State machine variables
        this.state = [];
        this.currState = 0;

        // load images
        this.imageDict = {
            walkright: loadImageSequence('sprites/orc/walk/right/', 9),
            walkup: loadImageSequence('sprites/orc/walk/up/', 9),
            walkdown: loadImageSequence('sprites/orc/walk/down/', 9),
            walkleft: loadImageSequence('sprites/orc/walk/left/', 9),
            attackup: loadImageSequence('sprites/orc/attack/up/', 6),
            attackdown: loadImageSequence('sprites/orc/attack/down/', 6),
            attackleft: loadImageSequence('sprites/orc/attack/left/', 6),
            attackright: loadImageSequence('sprites/orc/attack/right/', 6),
        }

        this.imageIndex = 0;
        this.images = this.imageDict.walkright;

        this.direction = "right";
        this.stateName = "idle";

        this.frameCount = 0;

        // Member variables used for a star search chasing
        this.currNode = 0;
        this.targetNum = 0;
        this.firstChaseLoop = false;
        this.path = 0;
        this.target = 0;
    }
    draw() {
        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        noStroke();
        // fill("blue");
        // ellipse(0, 0, 20, 20);

        // offset for slashing animations
        this.xOffset = 0;
        this.yOffset = 0;

        var frameInterval;
        switch (this.stateName) {
            case "idle":
            case "walk":
                frameInterval = 10;
                break;
            case "attack":
                frameInterval = 4;
                break;
        }


        // cycle to the next image every 10 frames
        if (frameCount - this.frameCount > frameInterval) {
            this.frameCount = frameCount;

            // cycle to the next image
            // there are only ever 9 images per animation
            switch (this.stateName) {
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
            }
        }

        var tempState = this.stateName;
        if (this.stateName === "idle") {
            // idle and walk use the same images
            tempState = "walk";
        }

        this.images = this.imageDict[tempState + this.direction];

        // error handling
        // if the image index is greater than the number of images, simply take the last one
        if (this.imageIndex >= this.images.length) {
            this.imageIndex = this.images.length - 1;
        }

        image(this.images[this.imageIndex], -half_tile-10, -half_tile-23, 40, 40);

        // display hearts over enemy's head if game is not over
        if (game_state !== "win_screen" && game_state !== "lose_screen") {
            for (var i = 0; i < this.health; i++) {
                image(heart_img, -half_tile-5 + i * 10, -half_tile - 20, 10, 10);
                // image(heart_img, 290 + (20*i), height-40, 20, 20);
            }
        }

        pop();
    }
    // encapsulate FSM behavior
    update() {
        this.state[this.currState].execute(this);
    }
    changeState(newState) {
        this.currState = newState;
    }
}

class RangedEnemy extends enemyModel {
    constructor(x, y) {
        super(x, y);
        this.state = [new waitState(), new lineOfSightState(), new rangeAttackState()];
    }
}

class MeleeEnemy extends enemyModel {
    constructor(x, y) {
        super(x, y);
        this.state = [new waitState(), new chaseState(), new attackState()];
    }
}