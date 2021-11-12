
class InformationBar {
    constructor() {

    }
    draw() {
        noStroke();
        fill(245, 200, 137);
        rect(0, height-60, width, 60);

        // fill(120, 94, 112);
        // rect(-5, height-60, width+10, 6);
        // fill(150, 124, 140);
        // rect(0, height-56, width, 3);

        strokeWeight(1);
        noFill();
        stroke(102, 83, 57);
        line(0, height-60, width, height-60);
        stroke(110, 90, 61);
        line(0, height-59, width, height-59);
        stroke(120, 98, 67);
        line(0, height-58, width, height-58);
        stroke(133, 108, 74);
        line(0, height-57, width, height-57);
        stroke(153, 125, 86);
        line(0, height-56, width, height-56);
        stroke(173, 142, 97);
        line(0, height-55, width, height-55);
        stroke(209, 171, 117);
        line(0, height-54, width, height-54);
        stroke(222, 181, 124);
        line(0, height-54, width, height-54);


        stroke('blue');
        strokeWeight(4);
        noFill();
        rect(220, height-55, 30, 40, 5);
        rect(180, height-55, 30, 40, 5);

        noStroke();
        fill(255);

        textStyle(BOLD);
        textSize(24);
        textFont('Helvetica');
        
        // fill(0);
        stroke(0);
        strokeWeight(2);
        text(player.coins, 80, 375);
        text("x", 60, 375);
        text("/20", 110, 375);

        textSize(32);
        textFont('Georgia');
        text("1", 187, height-5);
        text("2", 227, height-5);

        stroke('red');
        strokeWeight(2);
        noFill();
        rect(285, 355, 110, 35, 5);
        noStroke();
        fill(245, 200, 137);
        rect(310, 380, 60, 20);

        
        noStroke();
        textFont(font);
        textSize(16);
        fill('red');
        text("Health", 314, height-5);

        for (var i = 0; i < player.health; i++) {
            image(heart_img, 290 + (20*i), height-40, 20, 20);
        }
        
        drawGem(50, 350, 25, 30);
    }
}