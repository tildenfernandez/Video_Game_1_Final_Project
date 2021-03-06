/**
 * Enemy model object, base enemy can move, attack,change state, and die. Also has method to draw the enemy
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
        this.imageDict = {};

        this.imageIndex = 0;
        this.images = this.imageDict.walkright;

        // Animation variables
        this.direction = "right";
        this.stateName = "idle";

        this.frameCount = 0;

        // Member variables used for a star search chasing
        this.currNode = 0;
        this.targetNum = 0;
        this.firstChaseLoop = false;
        this.path = 0;
        this.target = 0;

        this.spriteOffset = new p5.Vector(-10, -23);
        this.spriteSize = new p5.Vector(40, 40);
        
        this.boss = false;

        this.attackRange = 800;
        this.attackHitboxRange = 400;
        this.damage = 1;
        this.playerDetectRange = 25000;
    }
    draw() {
        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        noStroke();

        // offset for slashing animations
        this.xOffset = 0;
        this.yOffset = 0;

        // Determine animation state
        var frameInterval;
        switch (this.stateName) {
            case "idle":
            case "walk":
                frameInterval = 10;
                break;
            case "attack":
                if (this.boss) {
                    frameInterval = 6;
                } else {
                    frameInterval = 4;
                }
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

        // get the correct images from the big image dictionary
        this.images = this.imageDict[tempState + this.direction];

        // error handling
        // if the image index is greater than the number of images, simply take the last one
        if (this.imageIndex >= this.images.length) {
            this.imageIndex = this.images.length - 1;
        }

        // if this is an attacking boss, the sprite size and offset are different
        if (this.boss) {
            if (this.stateName === "attack") {
                this.spriteSize.x = 240;
                this.spriteSize.y = 240;
                this.spriteOffset.x = -110;
                this.spriteOffset.y = -140;
            } else {
                this.spriteSize.x = 80;
                this.spriteSize.y = 80;
                this.spriteOffset.x = -30;
                this.spriteOffset.y = -58;
            }
        } else {
            this.spriteSize.x = 40;
            this.spriteSize.y = 40;
            this.spriteOffset.x = -10;
            this.spriteOffset.y = -23;
        }


        image(this.images[this.imageIndex], -half_tile + this.spriteOffset.x, -half_tile + this.spriteOffset.y, this.spriteSize.x, this.spriteSize.y);
        // fill(color('red'));
        // circle(0, 0, 10);

        if (!this.boss) {
            // display hearts over enemy's head if game is not over
            if (game_state !== "win_screen" && game_state !== "lose_screen") {
                for (var i = 0; i < this.health; i++) {
                    image(heart_img, -half_tile-5 + i * 10, -half_tile - 20, 10, 10);
                    // image(heart_img, 290 + (20*i), height-40, 20, 20);
                }
            }
            pop();

        } else {
            pop();
            // display the boss's health bar above the info bar
            var healthBarWidth = this.health * 10;
            var healthBarHeight = 10;
            var healthBarX = 10;
            var healthBarY = height - 80;
            push();
            fill(color('black'));
            text("The Minotaur", 10, height - 90);

            fill(color('red'));
            rect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
            pop();

        }

    }
    // ACtions to take if the enemy dies
    kill() {
        // randomly produce nothing, a gem, or a heart
        var rand = Math.floor(Math.random() * 2);
        switch (rand) {
            case 0:
                hearts.push([this.pos.x, this.pos.y, 1]);
                break;
            case 1:
                gems.push([this.pos.x, this.pos.y, 1]);
                break;
        }
        
    }

    // encapsulate FSM behavior
    update() {
        this.state[this.currState].execute(this);
    }
    // FSM state change
    changeState(newState) {
        this.currState = newState;
    }
}

// Ranged enemies are a type of enemy. They astar search differently, and have a different image
class RangedEnemy extends enemyModel {
    constructor(x, y) {
        super(x, y);
        this.state = [new waitState(), new lineOfSightState(), new rangeAttackState()];

        this.imageDict = ranged_img_dict;
    }
}

// Melee enemies are a type of enemy. They use the default astar search, and have a different image
class MeleeEnemy extends enemyModel {
    constructor(x, y) {
        super(x, y);
        this.state = [new waitState(), new chaseState(), new attackState()];

        this.imageDict = melee_img_dict;
    }
}

class BossEnemy extends enemyModel {
    constructor(x, y) {
        super(x, y);
        this.state = [new waitState(), new chaseState(), new attackState()];

        this.imageDict = boss_img_dict;

        this.health = 35;

        this.attackRange = 7000;
        this.playerDetectRange = 100000;
        this.attackHitboxRange = 3700;
        this.damage = 2;

        this.spriteSize = new p5.Vector(80, 80);
        this.boss = true;
    }

    kill() {
        // game over when the boss is dead
        game_state = "win_screen";
    }
    summon_others() {
        // Check all nodes
        for (let z = 0; z < graph_nodes.length; z++) {
            // If the node is close to the boss
            if (squaredDist(graph_nodes[z].pos.x, graph_nodes[z].pos.y, this.pos.x, this.pos.y) < 500) {
                // theres a one in four chance an enemy appears there
                let c = int(random(8));
                // 1/8 chance of melee enemy
                if (c === 1) {
                    enemies.push(new MeleeEnemy(graph_nodes[z].pos.x, graph_nodes[z].pos.y, 0));
                    enemies[enemies.length - 1].frameNum = z % 100;      // Need to change
                    enemies[enemies.length - 1].currNode = graph_nodes[z];
                    enemies[enemies.length - 1].target = graph_nodes[z];
                }
                // 1/8 chance of a ranged enemy
                if (c === 2) {
                    enemies.push(new RangedEnemy(graph_nodes[z].pos.x, graph_nodes[z].pos.y, 0));
                    enemies[enemies.length - 1].frameNum = z % 100;      // Need to change
                    enemies[enemies.length - 1].currNode = graph_nodes[z];
                    enemies[enemies.length - 1].target = graph_nodes[z];
                }
            }
        }
    }
}