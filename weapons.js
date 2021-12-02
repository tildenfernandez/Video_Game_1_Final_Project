
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
        this.num_explosion_circles = 50;
    }
    draw() {
        noStroke();
        fill(255, 0, 255);

        push();
        translate(this.pos.x + x_offset, this.pos.y + y_offset);
        image(bomb_img, -15, -15, 60, 30);
        pop();
    }
    explode() {
        // Draw explosion
        for (var i = 0; i < this.num_explosion_circles; i++) {
            bomb_explosions.push(new explosionCirlceObj(this.pos.x, this.pos.y));
        }

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

// Set of pre-defined possible colors for an explosion
var possible_explosion_colors = [[255, 140, 0], [255, 94, 14], [255, 69, 0],
                                 [255, 140, 0], [226, 99, 16], [237, 145, 33],
                                 [247, 135, 2], [227, 74, 39], [195, 71, 35],
                                 [138, 51, 36], [236, 88, 0]];

// Explosion component (basically  a red/orange circle)
var explosionCirlceObj = function(x, y) {
    this.pos = new p5.Vector(x+random(-20, 20), y+random(-20, 20));

    this.size = random(5, 25);

    this.color = [0, 0, 0];
    // Need to deep copy memory
    arrayCopy(possible_explosion_colors[int(random(0, 11))], this.color);

    this.timeLeft = 255;

    // Start some circles a bit later
    this.delay_start = random(-15, 10);
}

// Draw the circle
explosionCirlceObj.prototype.draw = function() {
    // Wait if this circle starts later
    if (this.delay_start > 0) {
        this.delay_start--;
    }
    // Otherwise, make a circle of the set color and position
    else {
        noStroke();
        fill(this.color[0], this.color[1], this.color[2], this.timeLeft);
        ellipse(this.pos.x+x_offset, this.pos.y+y_offset, this.size, this.size);
    }
}

// Update each circle
explosionCirlceObj.prototype.execute = function() {
    // Make the color fade to white
    for (var i = 0; i < 3; i++) {
        if (this.color[i] < 255) {
            this.color[i] += 3;
        }
    }
    // Circle fades out
    this.timeLeft -= 2;
}