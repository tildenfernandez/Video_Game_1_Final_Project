
// this "tilemap" will create link pixel by pixel
var link = [
    "      bbggggbb      ",
    "     bbggggggbb     ",
    "    bbggggggggbb    ",
    "    bgbyyyyyybgb    ",
    "    bbyyyyyyyybb    ",
    "   bbyybyyyybyybb   ",
    " bbbbybyyyybbbybbbb ",
    " bttbbyyyybbtbybttb ",
    "  bbbbyybbbttbybbb  ",
    "   bybbbbbtbbbbyb   ",
    "   bybwbbttbbwbyb   ",
    "   bbbtbwttwbtbbb   ",
    "    bbbttttttbbb    ",
    "    bgbggggggbgb    ",
    "   bggbggggggbggb   ",
    "  bttbbggggggbbttb  ",
    "  bbtbgbbyybbgbtbb  ",
    "   bbbggbyybggbbb   ",
    "     bbbggggbbb     ",
    "    bmmmbbbbmmmb    ",
];

function drawLink() {
    push();
    background(0, 0, 0, 0);
    noStroke();
    for (var i = 0; i< link.length; i++) {
        for (var j =0; j < link[i].length; j++) {
            switch (link[i][j]) {
                case 'g': 
                    fill(color('green'));
                    break;
                case 'b':
                    fill(color('black'));
                    break;
                case 'y':
                    fill(color('yellow'));
                    break;
                case 't':
                    fill(color('tan'));
                    break;
                case 'w':
                    fill(color('white'));
                    break;
                case 'm':
                    //brown = mud
                    fill(color('brown'));
                    break;
                default:
                    //transparent square
                    fill(0, 0, 0, 0);
                    break;
            }
            rect(j*20, i*20, 20, 20);
        }
    }

    images.push(get(0, 0, width, height));
    pop();
}
