/** 
 * Tilden Fernandez and Paolo Fermin
 * 10/28/2021
 * ECE 4525 Video Game Design 1
 * 
 * Instructions Screen Class
 */ 


class InstructionsScreen {
    constructor() {
        this.playerChar = new StartScreenPlayer(15, 60, 60, 60);
        this.enemyChar = new StartScreenSkeleton(15, 135, 60, 60);
        this.boss = new StartScreenOrc(15, 210, 60, 60);
        this.weapon_ind = 0;
        this.weapon_ind_timer = 0;
        this.weapon_first = true;
        this.first = 0;
    }
    draw() {
        if (this.first == 1) {
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
            text("The Enemies:", 95, 185);
            // text("The Enemy Boss:", 95, 230);
            text("Weapons:", 95, 275);

            /* Description text */
            fill(100);
            textSize(12);

            // Player character
            text("This is you! Move around using the arrow keys,", 95, 95);
            text("attack enemies using space bar, change weapons with", 95, 110);
            text("number keys, and shield using shift. Collect enough", 95, 125);
            text("treasure and beat the final boss to win!", 95, 140);

            // Enemies
            text("These monsterous enemies are present in most levels.", 95, 200);
            text("They will attack you to try and prevent you from", 95, 215);
            text("collecting treasure or escaping.", 95, 230);

            // // Enemy Boss
            // text("This is the final big bad guy. He has more health,", 95, 245);
            // text("deals more damage, and fights smarter than the", 95, 260);
            // text("other enemies.", 95, 275);

            // Weapons
            text("These are your tools throughout the game. The", 95, 290);
            text("ax can clear away plants, the bow provides range", 95, 305);
            text("and the bomb is powerful enough to break walls!", 95, 320);

            this.first = 0;
        }

        /* Show the models in little rectangles */
        fill(230);
        stroke(0);
        rect(20, 65, 60, 60, 10);
        rect(20, 140, 60, 60, 10);
        rect(20, 215, 60, 60, 10);
        rect(20, 290, 60, 60, 10);

        checkMouseY(this);

        // Draw the player models by their descriptions
        this.playerChar.draw();
        this.enemyChar.draw();
        this.boss.draw();

        // Draw one of the weapons
        switch (this.weapon_ind) {
            case 0:
                image(axe_img, 40, 295, 25, 50);
                break;
            case 1:
                image(bow_img, 25, 295, 50, 50);
                break;
            case 2:
                image(bomb_img, 18, 293, 120, 60);
                break;
        }
    }
}

// Cause the mini models to walk when the mouse is over their area of the screen
function checkMouseY(me) {
    // Player character
    if (mouseY >= 65 && mouseY <= 120 &&
        mouseX >= 20 && mouseX <= 80) {
        // update the image every 5 frames
        if (frameCount - me.playerChar.imageFrameCount > 5) {
            if (me.playerChar.imageIndex < me.playerChar.images.length-1) {
                me.playerChar.imageIndex++;
            }
            else {
                me.playerChar.imageIndex = 0;
            }            
            // me.playerChar.imageIndex = (me.playerChar.imageIndex + 1) % me.playerChar.images.length;
            me.playerChar.imageFrameCount = frameCount;
        }
    }
    else {
        me.playerChar.imageIndex = 0;
    }

    // Skeleton character
    if (mouseY >= 140 && mouseY <= 200 &&
        mouseX >= 20 && mouseX <= 80) {
        // update the image every 5 frames
        if (frameCount - me.enemyChar.imageFrameCount > 5) {
            if (me.enemyChar.imageIndex < me.enemyChar.images.length-1) {
                me.enemyChar.imageIndex++;
            }
            else {
                me.enemyChar.imageIndex = 0;
            }
            me.enemyChar.imageFrameCount = frameCount;
        }
    }
    else {
        me.enemyChar.imageIndex = 0;
    }

    // Orc character
    if (mouseY >= 215 && mouseY <= 275 &&
        mouseX >= 20 && mouseX <= 80) {
        // update the image every 5 frames
        if (frameCount - me.boss.imageFrameCount > 5) {
            if (me.boss.imageIndex < me.boss.images.length-1) {
                me.boss.imageIndex++;
            }
            else {
                me.boss.imageIndex = 0;
            }
            // me.boss.imageIndex = (me.boss.imageIndex + 1) % me.boss.images.length;
            me.boss.imageFrameCount = frameCount;
        }
    }
    else {
        me.boss.imageIndex = 0;
    }

    // Rotate through weapons to display
    if (mouseY >= 290 && mouseY <= 350 &&
        mouseX >= 20 && mouseX <= 80) {
        if  ((frameCount - me.weapon_ind_timer > 45) || me.weapon_first) {
            me.weapon_ind++;
            me.weapon_ind_timer = frameCount;
            me.weapon_first = false;
            if (me.weapon_ind > 2) {
                me.weapon_ind = 0;
            }
        }
    }
    else {
        me.weapon_first = true;
    }
}