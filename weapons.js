
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
            if (squaredDist(this.x, this.y, walls[i].pos.x, walls[i].pos.y) < 800) {
                this.done = true;
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

        image(arrow_img, -this.halfwidth, -this.halfheight, this.width, this.height);
        pop();
    }
}

class Bomb {
    constructor(x, y) {
        this.pos = new p5.Vector(x, y);
        this.start_frame = frameCount;
        this.e_radius = 50;
        this.e_radius_square = this.e_radius * this.e_radius;
    }
    draw() {
        noStroke();
        fill(0);

        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        ellipse(0, 0, 30, 30);
        pop();
    }
    explode() {
        // Draw explosion

        // Remove nearby hearts and gems
        for (var i = 0; i < gems.length; i++) {
            if (squaredDist(this.pos.x, this.pos.y, gems[i][0], gems[i][1]) < this.e_radius_square) {
                gems[i][2] = 0;
            }
        }

        // Remove nearby hearts
        for (var i = 0; i < hearts.length; i++) {
            if (squaredDist(this.pos.x, this.pos.y, hearts[i][0], hearts[i][1]) < this.e_radius_square) {
                hearts[i][2] = 0;
            }
        }

        // Remove walls
        for (var i = 0; i < walls.length; i++) {
            if (squaredDist(this.pos.x, this.pos.y, walls[i].pos.x, walls[i].pos.y) < this.e_radius_square) {
                walls[i].destroy();
                walls.splice(i, 1);
            }
        }

        // Damage nearby enemies
        for (var i = 0; i < enemies.length; i++) {
            if (squaredDist(this.pos.x, this.pos.y, enemies[i].pos.x, enemies[i].pos.y) < this.e_radius_square) {
                enemies[i].health -= 3;
            }
        }

        // Damage the player if they are nearby
        if (squaredDist(this.pos.x, this.pos.y, player.pos.x, player.pos.y) < this.e_radius_square) {
            player.health -= 3;
        }
    }
}