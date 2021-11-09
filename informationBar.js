
class InformationBar {
    constructor() {

    }
    draw() {
        noStroke();
        fill(8);
        rect(0, 0, width, 60);

        stroke('blue');
        strokeWeight(4);
        noFill();
        rect(220, 15, 30, 40);
        rect(180, 15, 30, 40);

        noStroke();
        textFont('Georgia');
        textStyle(BOLD);
        textSize(32);
        fill(255);
        stroke(8);
        strokeWeight(1);
        text("1", 187, 20);
        text("2", 227, 20);

        fill('red');
        noStroke();
        textFont(font);
        textSize(16);
        text("-Health-", 325, 25);
        

        image(heart_img, 330, 30, 20, 20);
        image(heart_img, 350, 30, 20, 20);
        image(heart_img, 370, 30, 20, 20);
        
    }
}