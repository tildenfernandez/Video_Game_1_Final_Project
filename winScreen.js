class WinScreen {
    constructor() {

        this.firework = [new fireworkObj(0), new fireworkObj(1), new fireworkObj(2), new fireworkObj(0)];

    }
    draw() {
        background(color('black'));
      //background(0, 0, 0);  // erase the entire canvas
      fill(0, 0, 0, 60);  // don't erase the entire screen
      rect(0, 0, 400, 400);
  
      for (var j = 0; j < this.firework.length; j++) {
          if (this.firework[j].step === 0) {
              this.firework[j].position.set(200, 450);
              this.firework[j].target.set(random(100, 300), random(50, 120));
              this.firework[j].direction.set(this.firework[j].target.x - this.firework[j].position.x, this.firework[j].target.y - this.firework[j].position.y);
              var s = random(1, 2) / 100;
              this.firework[j].direction.mult(s);
              this.firework[j].step++;
          }
          else if (this.firework[j].step === 1) {
              this.firework[j].draw();
          }
          else if (this.firework[j].step === 2) {
              for (var i = 0; i < this.firework[j].explosions.length; i++) {
                  this.firework[j].explosions[i].draw();
              }
              if (this.firework[j].explosions[0].timer <= 0) {
                  this.firework[j].step = 0;
              }
          }
      }

      // you win big text in center
        fill(color('red'));
        textSize(50);
        textAlign(CENTER);
        text("You Win!", 200, 200);
        textSize(20);

        // Button rectangles
        noStroke();
        fill(color('gray'));
        rect(155, 300, 100, 30);

        // Button text
        fill(255);
        textAlign(LEFT);
        textSize(16);
        text("Main Menu", 165, 320);


        // Highlight buttons when the mouse is over them
        noFill();
        stroke(219, 84, 46);
        strokeWeight(3);
        if (mouseX >= 155 && mouseX <= 255 &&
            mouseY >= 300 && mouseY <= 330) {
                rect(155, 300, 100, 30);

                noStroke();
                fill(219, 84, 46);
                text("Main Menu", 165, 320);
        }

        
    }
}

   // cos and sin using Polar Coordinates to determine direction of explosions
// compare with cartesian explosion
// add "fill(0, 0, 0, 60); rect(0, 0, 400, 400);" and see

class explosionObj {
    constructor(a) {
      this.position = new p5.Vector(0, 0);
      this.direction = new p5.Vector(0, 0);
      this.size = random(1, 3);
      if (a === 0) {
          this.c1 = random(0, 250);
      }
      else {
          this.c1 = random(100, 255);
      }
      if (a === 1) {
          this.c2 = random(0, 250);
      }
      else {
          this.c2 = random(100, 255);
      }
      if (a === 3) {
          this.c3 = random(0, 250);
      }
      else {
          this.c3 = random(100, 255);
      }
      this.timer = 0;
    }
    
    //// EXPERIMENT direction of explosion /////
    draw() {
      fill(this.c1, this.c2, this.c3, this.timer);        // 4th value fader
      noStroke();
      ellipse(this.position.x, this.position.y, this.size, this.size);
  
      this.position.x += this.direction.y*cos(this.direction.x);
      this.position.y += this.direction.y*sin(this.direction.x);
  /*  this.position.add(this.direction); // random cartesian direction */
      this.position.y += (90/(this.timer + 100));    //gravity
      this.timer--;
    }
  }
  
  ///// EXPERIMENT number of particles ////
  class fireworkObj {
    constructor(a) {
      this.position = new p5.Vector(200, 380);
      this.direction = new p5.Vector(0, 0);
      this.target = new p5.Vector(mouseX, mouseY);
      this.step = 0;
      this.explosions = [];
      for (var i = 0; i < 100; i++) {
          this.explosions.push(new explosionObj(a));
      }
    }
    
    //// EXPERIMENT direction of explosion /////
    draw() {
      fill(255, 255, 255);
      noStroke();
      ellipse(this.position.x, this.position.y, 2, 2);
  
      this.position.add(this.direction);
      if (dist(this.position.x, this.position.y, this.target.x, this.target.y) < 4) {
          this.step = 2;
          for (var i = 0; i < this.explosions.length; i++) {
              this.explosions[i].position.set(this.target.x, this.target.y);
  
              this.explosions[i].direction.set(random(0, 360), random(-0.3, 0.3));
  /*          this.explosions[i].direction.set(random(-0.3, 0.3),
                  random(-0.3, 0.3)); // cartesian (instead of polar) direction */
              this.explosions[i].timer = 180;
          }
      }
    }
  }  // fireworkObj
  
  class NextLevelScreen {
    constructor() {
        this.playerChar = new StartScreenPlayer(120, 160, 100, 100);
        this.playerChar.imageIndex = 2;
    }
    draw() {
        background(54, 207, 207);
        textSize(42);
        noStroke();
        fill('green');
        text("Level Passed", 80, 100);

        this.playerChar.draw();

        ///////// PLAYER CHAR UPDATE ///////////////
// if chasing, then face left and move to the right 
        // if not chasing, then face right and move to the left
        if (this.playerChar.chasing) {
            this.playerChar.velocity.x = 2;
            drawGem(330, 200, 25, 30);
        } else {
            this.playerChar.velocity.x = -2;
            drawGem(70, 200, 25, 30);
        }

        this.playerChar.position.add(this.playerChar.velocity);

        // if you are off the right of the screen, turn around and start being chased
        if (this.playerChar.position.x > this.playerChar.startX + 150) {
            this.playerChar.chasing = false;
        } else if (this.playerChar.position.x < this.playerChar.startX - 90) {
            this.playerChar.chasing = true;
        }

        // update the image every 5 frames
        if (frameCount - this.playerChar.imageFrameCount > 5) {
            if (this.playerChar.imageIndex < 8) {
                this.playerChar.imageIndex++;
            } else {
                this.playerChar.imageIndex = 0;
            }
            // this.imageIndex = (this.imageIndex + 1) % this.images.length;
            this.playerChar.imageFrameCount = frameCount;
        }

        //////// END PLAYER CHAR UPDATE ////////////

        noStroke();
        fill(25);
        rect(75, 300, 100, 30);
        rect(225, 300, 100, 30);

        fill(255);
        textSize(16);
        text("Main Menu", 85, 320);
        text("Next Level", 234, 320);

        noFill();
        stroke(219, 84, 46);
        strokeWeight(3);
        if (mouseX >= 75 && mouseX <= 175 &&
            mouseY >= 300 && mouseY <= 330) {
                rect(75, 300, 100, 30);

                noStroke();
                fill(219, 84, 46);
                text("Main Menu", 85, 320);
        }

        if (mouseX >= 225 && mouseX <= 325 &&
            mouseY >= 300 && mouseY <= 330) {
                rect(225, 300, 100, 30);

                noStroke();
                fill(219, 84, 46);
                text("Next Level", 234, 320);
        }

    }
}