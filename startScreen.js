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
    }

    draw() {
        background(248, 179, 173);
        noStroke();


        // sky
        var n1 = this.a;
        for (var x=0; x<=400; x+=8) {
            var n2 = 0;
            for (var y=0; y<=250; y+=8) {
                var c = map(noise(n1,n2),0,1,0,255);
                fill(c, c, c+80,150);
                rect(x,y,8,8);
                n2 += 0.05; // step size in noise
            }
            n1 += 0.02; // step size in noise
        }
        this.a -= 0.01;  // speed of clouds

        // mountains
        drawRange(117, 115, 4, 25);
        drawRange(168, 143, 89, 15);
        drawRange(194, 178, 128, 0);

        fill(255);
        rect(25, 300, 100, 30);     // Start button rectangle
        rect(150, 300, 100, 30);    // Instructions button
        rect(275, 300, 100, 30);    // Levels button

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
        text("Start", 60, 320);
        text("Instructions", 155, 320);
        text("Levels", 300, 320);

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
