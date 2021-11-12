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
    
        this.player = new StartScreenPlayer(250, height - 80, 80, 80);
        this.orc = new StartScreenOrc(150, height - 80, 80, 80);
        this.skeleton = new StartScreenSkeleton(50, height - 80, 80, 80);

        this.castle_img = loadImage('images/castle.png');
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
        rect(145, 220, 115, 30);    // Instructions button
        rect(275, 220, 100, 30);    // Levels button

        // credits
        fill(color('teal'));
        textSize(16);
        text("Tilden Fernandez and Paolo Fermin present", 40, 30);

        // Title text
        fill(0);
        textSize(18);
        textStyle(BOLD);
        text("THE ADVENTURE OF", 60, 90);
        
        textSize(72);
        scale(1.6, 1);
        text("TAOLO", 15, 162);
        fill(212, 62, 17);
        text("TAOLO", 12, 160);
        scale(0.625, 1);

        // Button text
        textSize(16);
        fill(0);
        text("Start", 60, 240);
        text("Instructions", 157, 240);
        text("Levels", 300, 240);

        // Emphasize buttons when mouse is on top of them
        if (mouseX >= 30 && mouseX <= 130 &&
            mouseY >= 220 && mouseY <= 250) {
                fill(255);
                stroke(0);
                strokeWeight(2);
                rect(30, 220, 100, 30);

                text("Start", 60, 240);
        }
        if (mouseX >= 145 && mouseX <= 260 &&
            mouseY >= 220 && mouseY <= 250) {
                fill(255);
                stroke(0);
                strokeWeight(2);
                rect(145, 220, 115, 30);

                text("Instructions", 157, 240);
        }
        if (mouseX >= 275 && mouseX <= 375 &&
            mouseY >= 220 && mouseY <= 250) {
                fill(255);
                stroke(0);
                strokeWeight(2);
                rect(275, 220, 100, 30);

                text("Levels", 300, 240);
        }

        this.player.update();
        this.player.draw();

        this.orc.update();
        this.orc.draw();

        this.skeleton.update();
        this.skeleton.draw();

    }
}

var drawRange = function(c1, c2, c3, offset) {
    push();
    var incAmount = 0.01;
    for (var t = 0; t < incAmount*width; t += incAmount) {
        stroke(c1, c2, c3);
        var n = noise(t + c1 * 20);
        var y = map(n, 0, 1, 0, height/4);
        rect(t*100, height-y - offset, 1, y+offset);
    }
    pop();
};

function loadImageSequence(dir, length) {
    // load images from directory and return array
    var images = [];
    for (var i = 0; i < length; i++) {
        images[i] = loadImage(dir + i + '.png');
    }
    return images;
}

class StartScreenCharacter {
    constructor(x, y, width, height) {
        this.position = new p5.Vector(x, y);
        this.velocity = new p5.Vector(0, 0);

        this.startX = x;
        
        this.width = width;
        this.height = height;

        this.chasing = true;

        this.images = [];
        this.imageFrameCount = frameCount;
        this.imageIndex = 0;
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
        } else if (this.position.x < this.startX - 400) {
            this.chasing = true;
        }

        // update the image every 5 frames
        if (frameCount - this.imageFrameCount > 3) {
            if (this.imageIndex < 8) {
                this.imageIndex++;
            } else {
                this.imageIndex = 0;
            }
            // this.imageIndex = (this.imageIndex + 1) % this.images.length;
            this.imageFrameCount = frameCount;
        }
    }

    draw() {
        push();
        translate(this.position.x, this.position.y);
        if (this.velocity.x < 0) {
            // flip the image horizontally
            scale(-1, 1);
            image(this.images[this.imageIndex], -this.width, 0, this.width, this.height);   
        } else {
            image(this.images[this.imageIndex], 0, 0, this.width, this.height);
        }
        pop();
    }
}

class StartScreenPlayer extends StartScreenCharacter{
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.images = loadImageSequence('sprites/player/walk/right/', 9);
    }
}

class StartScreenOrc extends StartScreenCharacter{
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.images = loadImageSequence('sprites/orc/walk/right/', 9);
    }
}

class StartScreenSkeleton extends StartScreenCharacter{
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.images = loadImageSequence('sprites/skeleton/walk/walk', 9);
    }
}

