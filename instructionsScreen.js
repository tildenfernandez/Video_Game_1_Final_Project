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
        this.boss = new StartScreenBoss(30, 225, 40, 40);
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

        this.playerChar.draw();
        this.boss.draw();

    }
}