
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
            top: this.y,
            bottom: this.y,
            left: this.x,
            right: this.x
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

        // check if the duration has passed
        if (frameCount - this.startFrame > this.duration) {
            this.done = true;
        } 

        // change collision hitbox based on vertical or horizontal motion
        if (this.dir == "left" || this.dir == "right") {
            this.hitbox.top = this.y - this.halfheight;
            this.hitbox.bottom = this.y + this.halfheight;
            this.hitbox.left = this.x - this.halfwidth;
            this.hitbox.right = this.x + this.halfwidth;
        } else {
            this.hitbox.top = this.y - this.halfwidth;
            this.hitbox.bottom = this.y + this.halfwidth;
            this.hitbox.left = this.x - this.halfheight;
            this.hitbox.right = this.x + this.halfheight;
        }

        // draw the hitbox
        push();
        fill(color('red'));
        strokeWeight(4);
        rect(this.hitbox.left, this.hitbox.top, this.hitbox.right - this.hitbox.left, this.hitbox.bottom - this.hitbox.top);
        pop();

        // use helper functions to detect wall collisions
        if (detectWallCollision(this.hitbox.left, this.hitbox.top) || detectWallCollision(this.hitbox.right, this.hitbox.top) || detectWallCollision(this.hitbox.left, this.hitbox.bottom) || detectWallCollision(this.hitbox.right, this.hitbox.bottom)) {
            this.done = true;
        }


        // // check if the arrow has hit a wall
        // for (var i = 0; i < walls.length; i++) {
        //     // two rectangle collision based upon hitbox
        //     if (this.hitbox.left > walls[i].pos.x + half_tile  && 
        //         this.hitbox.right < walls[i].pos.x - half_tile &&
        //         this.hitbox.bottom < walls[i].pos.y - half_tile &&
        //         this.hitbox.top > walls[i].pos.y + half_tile) {
        //         push();
        //         noFill();
        //         stroke(color('red'));
        //         rect(walls[i].pos.x - half_tile, walls[i].pos.y - half_tile, tile_size, tile_size);
        //         pop();
        //         this.done = true;
        //     }
        // }

        // // check if the arrow has hit a boundary wall
        // for (var i = 0; i < boundary_walls.length; i++) {
        //     // two rectangle collision based upon hitbox
        //     if (this.hitbox.left > boundary_walls[i].pos.x + half_tile && 
        //         this.hitbox.right < boundary_walls[i].pos.x - half_tile &&
        //         this.hitbox.bottom < boundary_walls[i].pos.y - half_tile &&
        //         this.hitbox.top > boundary_walls[i].pos.y + half_tile) {
        //         this.done = true;
        //     }
        // }

        // check if the arrow has hit an enemy
        for (var i = 0; i < enemies.length; i++) {
            // two rectangle collision based upon hitbox
            if (this.hitbox.left > enemies[i].pos.x + half_tile && 
                this.hitbox.right < enemies[i].pos.x - half_tile &&
                this.hitbox.bottom < enemies[i].pos.y - half_tile &&
                this.hitbox.top > enemies[i].pos.y + half_tile) {
                enemies[i].health -= this.damage;
                this.done = true;
            }
        }

    }

    draw() {
        // draw the arrow image
        // right facing is 0 degrees
        push();
        // translate(this.x + this.halfwidth + x_offset, this.y + this.halfheight + y_offset);
        translate(this.x + this.halfwidth + x_offset - half_tile, this.y + this.halfheight - half_tile + y_offset);
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