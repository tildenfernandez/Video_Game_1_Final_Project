
class Arrow {
    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.speed = 5;
        this.width = 20;
        this.halfwidth = this.width / 2;
        this.height = 8;
        this.halfheight = this.height / 2;
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

        // check if the duration has passed
        if (frameCount - this.startFrame > this.duration) {
            this.done = true;
        } 



        // check if the arrow has hit a wall
        // assume a rectangular hitbox
        for (var i = 0; i < walls.length; i++) {
            // if (squaredDist(this.x, this.y, walls[i].pos.x, walls[i].pos.y) < 800) {
            //     this.done = true;
            // }

            // two rectangle collision that depends upon the direction of the arrow
            if (this.dir == "up" || this.dir == "down") {
                // draw arrow hitbox
                push();
                noFill();
                stroke(color('red'));
                strokeWeight(4);
                rect(this.x - this.halfheight, this.y - this.halfwidth, this.height, this.width);
                pop();
                if (this.x + this.halfheight > walls[i].pos.x - half_tile&&
                    this.x - this.halfheight < walls[i].pos.x + half_tile &&
                    this.y - this.halfwidth < walls[i].pos.y + half_tile &&
                    this.y + this.halfwidth > walls[i].pos.y - half_tile) {
                    push();
                    noFill();
                    stroke(color('red'));
                    rect(walls[i].pos.x, walls[i].pos.y, tile_width, tile_width);
                    pop();
                    this.done = true;
                }
            } else {
                // draw arrow hitbox
                push();
                noFill();
                stroke(color('red'));
                strokeWeight(4);
                rect(this.x - this.halfwidth, this.y - this.halfheight, this.width, this.height);
                pop();
                if (this.x + this.halfheight > walls[i].pos.x - half_tile &&
                    this.x - this.halfheight < walls[i].pos.x + half_tile &&
                    this.y - this.halfwidth < walls[i].pos.y + half_tile &&
                    this.y + this.halfwidth > walls[i].pos.y - half_tile) {
                    push();
                    noFill();
                    stroke(color('red'));
                    rect(walls[i].pos.x, walls[i].pos.y, tile_width, tile_width);
                    pop();
                    this.done = true;
                }
            }

        }

    }

    draw() {
        // draw the arrow image
        // right facing is 0 degrees
        push();
        // translate(this.x + this.halfwidth + x_offset, this.y + this.halfheight + y_offset);
        translate(this.x + this.halfwidth + x_offset - half_tile, this.y + this.halfheight + y_offset - half_tile);
        rotate(this.dir == "right" ? 0 : this.dir == "left" ? PI : this.dir == "up" ? -PI / 2 : PI / 2);

        // circle for debugging
        fill(color('red'));
        circle(0, 0, 4);

        image(arrow_img, -this.halfwidth, -this.halfheight, this.width, this.height);
        pop();
    }
}

class Bomb {
    constructor(x, y) {
        this.pos = new p5.Vector(x, y);
        this.start_frame = frameCount;
    }
    draw() {
        noStroke();
        fill(0);

        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        ellipse(-15, -15, 30, 30);
        pop();
    }
    explode() {
        // Draw explosion

        // Remove walls
        for (var i = 0; i < walls.length; i++) {
            if (squaredDist(this.pos.x, this.pos.y, walls[i].pos.x, walls[i].pos.y) < 1600) {
                walls[i].destroy();
                walls.splice(i, 1);
            }
        }

        // Damage nearby enemies

        // Remove nearby hearts and gems

        // Damage the player if they are nearby
    }
}