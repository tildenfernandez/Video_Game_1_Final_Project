/** 
 * Tilden Fernandez and Paolo Fermin
 * 10/28/2021
 * ECE 4525 Video Game Design 1
 * 
 * Instructions Screen Class
 */ 


class InstructionsScreen {
    constructor() {
        this.playerChar = new StartScreenPlayer(30, 75, 40, 40);
        this.enemyChar = new StartScreenSkeleton(30, 150, 40, 40);
        this.boss = new StartScreenOrc(30, 225, 40, 40);
        this.weapon = new Bow(30, 300, 40, 40);
    }
    draw() {
        background(248, 179, 173);
        noStroke();
        fill(color('teal'));
        textSize(24);
        
        // Page text
        text("How to Play", 25, 40);
        textSize(14);
        text("Click anywhere to return to Main Menu", 130, 380);

        /* Labels for each model */
        fill(30);
        textSize(14);
        text("The Player:", 95, 80);
        text("The Enemies:", 95, 155);
        text("The Enemy Boss:", 95, 230);
        text("Weapons:", 95, 305);

        /* Description text */
        fill(100);
        textSize(12);

        // Player character
        text("This is you! Move around using the arrow keys and", 95, 95);
        text("attack enemies using space bar. Collect all the", 95, 110);
        text("treasures and escape to win!", 95, 125);

        // Enemies
        text("These monsterous enemies are present in most levels.", 95, 170);
        text("They will attack you to try and prevent you from", 95, 185);
        text("collecting treasure or escaping.", 95, 200);

        // Enemy Boss
        text("This is the final big bad guy. He has more health,", 95, 245);
        text("deals more damage, and fights smarter than the", 95, 260);
        text("other enemies.", 95, 275);

        // Weapons
        text("These are your tools as you progress through the", 95, 320);
        text("game. They can help you fight enemies, solve puzzles,", 95, 335);
        text("and collect treasure allong the way.", 95, 350);

        /* Show the models in little rectangles */
        fill(230);
        stroke(0);
        rect(20, 65, 60, 60, 10);
        rect(20, 140, 60, 60, 10);
        rect(20, 215, 60, 60, 10);
        rect(20, 290, 60, 60, 10);

        checkMouseY(this);

        this.playerChar.draw();
        this.enemyChar.draw();
        this.boss.draw();
        this.weapon.draw();
    }
}

class Bow {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw() {
        push();
        translate(this.x, this.y);
        image(bow_img, 0, 0, this.w, this.h);

    }
}

// Cause the mini models to walk when the mouse is over their area of the screen
function checkMouseY(me) {
    // Player character
    if (mouseY >= 65 && mouseY <= 120) {
        // update the image every 5 frames
        if (frameCount - me.playerChar.imageFrameCount > 5) {
            me.playerChar.imageIndex = (me.playerChar.imageIndex + 1) % me.playerChar.images.length;
            me.playerChar.imageFrameCount = frameCount;
        }
    }
    else {
        me.playerChar.imageIndex = 0;
    }

    // Skeleton character
    if (mouseY >= 140 && mouseY <= 200) {
        // update the image every 5 frames
        if (frameCount - me.enemyChar.imageFrameCount > 5) {
            me.enemyChar.imageIndex = (me.enemyChar.imageIndex + 1) % me.enemyChar.images.length;
            me.enemyChar.imageFrameCount = frameCount;
        }
    }
    else {
        me.enemyChar.imageIndex = 0;
    }

    // Orc character
    if (mouseY >= 215 && mouseY <= 275) {
        // update the image every 5 frames
        if (frameCount - me.boss.imageFrameCount > 5) {
            me.boss.imageIndex = (me.boss.imageIndex + 1) % me.boss.images.length;
            me.boss.imageFrameCount = frameCount;
        }
    }
    else {
        me.boss.imageIndex = 0;
    }
}