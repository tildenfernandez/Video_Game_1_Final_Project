var mountains = [[],[],[],[],[],[]];
var a;

class StartScreen {
    constructor() {
        this.a=random(1500);
        for (var i=0; i<=5; i++) {
          for (var j=0; j<=40; j++) {
              var n = noise(this.a);
              mountains[i][j] = map(n,0,1,0,400-i*50);
              this.a += 0.025;  // ruggedness
          }
        }

        this.player = new StartScreenPlayer(150, height - 40, 40, 40);
        this.boss = new StartScreenBoss(50, height - 80, 80, 80);
        // this.link = new StartScreenLink(200, height - 40, 40, 40);

        this.castle_img = loadImage('castle.png');
    }

    draw() {
        background(248, 179, 173);
        noStroke();

        // Castle
        image(this.castle_img, 60, 140, 500/(2), 428/(2));

        // mountains
        drawRange(117, 115, 4, 30);
        drawRange(168, 143, 89, 15);
        drawRange(194, 178, 128, 0);

        fill(255);
        rect(30, 220, 100, 30);     // Start button rectangle
        rect(150, 220, 110, 30);    // Instructions button
        rect(275, 220, 100, 30);    // Levels button

        // credits
        fill(color('teal'));
        textSize(16);
        text("Tilden Fernandez and Paolo Fermin present", 40, 30);

        // Title text
        fill(0);
        textSize(18);
        textStyle(BOLD);
        text("THE LEGEND OF", 60, 90);
        
        textSize(72);
        scale(1.6, 1);
        text("LINK", 47, 162);
        fill(212, 62, 17);
        text("LINK", 45, 160);
        scale(0.625, 1);

        // Button text
        textSize(16);
        fill(0);
        text("Start", 60, 240);
        text("Instructions", 157, 240);
        text("Levels", 300, 240);

        this.player.update();
        this.player.draw();

        this.boss.update();
        this.boss.draw();

    }
}

class StartScreenLink {
    constructor(x, y, width, height) {
        this.position = new p5.Vector(x, y);
        this.velocity = new p5.Vector(0, 0);
        this.acceleration = new p5.Vector(0, 0);

        this.width = width;
        this.height = height;

        this.force = new p5.Vector(0, 0);

        this.jump = 0;
        this.jumpForce = new p5.Vector(0, -5);
        this.jumpInterval = frameCount;
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    update() {
        // jump every 5 seconds
        if (frameCount - this.jumpInterval > 300) {
            this.jump = 1;
            this.applyForce(this.jumpForce);
            this.jumpInterval = frameCount;
        }
        if (this.jump > 0) {
            this.applyForce(gravity);
        }    
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0);

        if (this.position.y + 40 >= height) {
            this.position.y = height - 40;
            this.velocity.y = 0;
            this.jump = 0;
        }
    }

    draw() {
        push();
        translate(this.position.x, this.position.y);
        image(images[0], 0, 0, this.width, this.height);
        pop();
    }
}

var drawRange = function(c1, c2, c3, offset) {
    push();
    var incAmount = 0.01;
    for (var t = 0; t < incAmount*width; t += incAmount) {
        stroke(c1, c2, c3);
        var n = noise(t + c1 * 20);
        var y = map(n, 0, 1, 0, height/4);
        rect(t*100, height-y - offset, 1, y);
    }
    pop();
};

class StartScreenCharacter {
    constructor(x, y, width, height) {
        this.position = new p5.Vector(x, y);
        this.velocity = new p5.Vector(0, 0);

        this.startX = x;
        
        this.width = width;
        this.height = height;

        this.chasing = true;
    }

    update() {
        // if chasing, then face left and move to the right 
        // if not chasing, then face right and move to the left
        if (this.chasing) {
            this.velocity.x = 2;
        } else {
            this.velocity.x = -2;
        }

        this.position.add(this.velocity);
     
        // if you are off the right of the screen, turn around and start being chased
        if (this.position.x > this.startX + 400) {
            this.chasing = false;
        } else if (this.position.x < this.startX - 200) {
            this.chasing = true;
        }
    }
}

class StartScreenBoss extends StartScreenCharacter {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }

    draw() {
        push();
        translate(this.position.x, this.position.y);
        image(images[0], 0, 0, this.width, this.height);
        pop();
    }
}

class StartScreenPlayer extends StartScreenCharacter {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }

    draw() {
        push();
        translate(this.position.x, this.position.y);
        image(images[0], 0, 0, this.width, this.height);
        pop();
    }
}