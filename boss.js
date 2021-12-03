class Boss {
    constructor(x, y) {
        this.pos = new p5.Vector(x, y);

        this.health = 100;

        this.direction = "right";
        this.state = "idle";

        this.frameCount = frameCount;
        this.imageDict = boss_img_dict;
        this.imageIndex = 0;
        this.images = this.imageDict.walkright;

    }

    draw() {
        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        noStroke();

        // attack is active for 30 frames
        if (this.state === "attack" && frameCount - this.attackTimer > 30) {
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
}

class BossAttackAnimation extends AttackAnimation {
    constructor(x, y, direction) {
        // call parent constructor
        super(x, y, direction)
    }
}