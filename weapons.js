
class Arrow {
    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.speed = 5;
        this.width = 20;
        this.height = 8;
        this.damage = 1;
        this.hitbox = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
        this.startFrame = frameCount;
        // arrow will be removed after 1 seconds
        this.duration = 60;
        this.done = false;
    }

    update() {
        if (this.dir == "up") {
            this.y -= this.speed;
        } else if (this.dir == "down") {
            this.y += this.speed;
        } else if (this.dir == "left") {
            this.x -= this.speed;
        } else if (this.dir == "right") {
            this.x += this.speed;
        }
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;

        // check if the arrow hits a wall or duration has passed
        if (detectWallCollision(this.x, this.y) || (frameCount - this.startFrame) > this.duration) {
            this.done = true;
        } 

    }

    draw() {
        // draw the arrow image
        // right facing is 0 degrees
        push();
        translate(this.x, this.y);
        rotate(this.dir == "right" ? 0 : this.dir == "left" ? PI : this.dir == "up" ? -PI / 2 : PI / 2);
        image(arrow_img, -this.width / 2, -this.height / 2, this.width, this.height);
        pop();
    }
}