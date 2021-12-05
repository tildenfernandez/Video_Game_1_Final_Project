/**
 * Capture mouse input as necessary
 */
 function mousePressed() {
    // Record player clicking buttons on start screen
    if (game_state === "start_screen") {
        // First button redirects to the first level
        if (mouseX >= 30 && mouseX <= 130 &&
            mouseY >= 220 && mouseY <= 250) {
                game_state = "playing_level_1"
                resetGameState(1);
                clear();
        }
        // Second button redirects to the instructions menu
        if (mouseX >= 150 && mouseX <= 260 &&
            mouseY >= 220 && mouseY <= 250) {
                instructionsScreen.first = 1;
                clear();
                game_state = "instructions"
        }
        // Third button redirects to the level select menu
        if (mouseX >= 275 && mouseX <= 375 &&
            mouseY >= 220 && mouseY <= 250) {
                clear();
                game_state = "level_select"
        }
    }
    // Record player clicking on instructions menu
    else if (game_state === "instructions") {
                // All clicks here redirect back to the main menu
                clear();
                game_state = "start_screen";
    }
    // Record player clicks on the level select menu
    else if (game_state === "level_select") {
        // First button goes to level one
        if (mouseX >= 50 && mouseX <= 350 &&
            mouseY >= 100 && mouseY <= 130) {
                clear();
                game_state = "playing_level_1";
                resetGameState(1);
        }
        // Second button goes to level 2
        if (mouseX >= 50 && mouseX <= 350 &&
            mouseY >= 150 && mouseY <= 180) {
                clear();
                game_state = "playing_level_2";
                resetGameState(2);
        }
        // Third button goes to level 3
        if (mouseX >= 50 && mouseX <= 350 &&
            mouseY >= 200 && mouseY <= 230) {
                clear();
                game_state = "playing_level_3";
                resetGameState(3);
        }
        // Fourth button goes to level 4
        if (mouseX >= 50 && mouseX <= 350 &&
            mouseY >= 250 && mouseY <= 280) {
                clear();
                game_state = "playing_level_4";
                resetGameState(4);
        }
        // Last button returns to the main menu
        if (mouseX >= 50 && mouseX <= 350 &&
            mouseY >= 350 && mouseY <= 380) {
                clear();
                game_state = "start_screen";
        }
    }
    // Mouse input on the next level screen
    else if (game_state === "next_level_screen") {
        // First button returns to the main menu
        if (mouseX >= 155 && mouseX <= 255 &&
            mouseY >= 300 && mouseY <= 330) {
                game_state = "start_screen"
        }
        // Second button redirects to the next level
        if (mouseX >= 225 && mouseX <= 325 &&
            mouseY >= 300 && mouseY <= 330) {
                // Redirect to different levels based on the current level
                switch (curr_level) {
                    case 1:
                        game_state = "playing_level_2";
                        resetGameState(2);
                        break;
                    case 2:
                        game_state = "playing_level_3";
                        resetGameState(3);
                        break;
                    case 3:
                        game_state = "playing_level_4";
                        resetGameState(4);
                        break;
                }
        }
    }
    // Mouse input on the win screen
    else if (game_state === "win_screen") {
        // First button returns to the main menu
        if (mouseX >= 155 && mouseX <= 255 &&
            mouseY >= 300 && mouseY <= 330) {
                game_state = "start_screen"
        }
        // Second button redirects to the next level
        if (mouseX >= 225 && mouseX <= 325 &&
            mouseY >= 300 && mouseY <= 330) {
                // Redirect to different levels based on the current level
                switch (curr_level) {
                    case 1:
                        game_state = "playing_level_2";
                        resetGameState(2);
                        break;
                    case 2:
                        game_state = "playing_level_3";
                        resetGameState(3);
                        break;
                    case 3:
                        game_state = "playing_level_4";
                        resetGameState(4);
                        break;
                }
        }
    }
    // Mouse input on the lose screen
    else if (game_state === "lose_screen") {
        // First button returns to the main menu
        if (mouseX >= 75 && mouseX <= 175 &&
            mouseY >= 300 && mouseY <= 330) {
                stopAllSongs();
                songs[0].play();
                game_state = "start_screen"
        }
        // Second button restarts the current level
        if (mouseX >= 225 && mouseX <= 325 &&
            mouseY >= 300 && mouseY <= 330) {
                // Redirect to different level based on the current level
                switch (curr_level) {
                    case 1:
                        game_state = "playing_level_1";
                        resetGameState(1);
                        break;
                    case 2:
                        game_state = "playing_level_2";
                        resetGameState(2);
                        break;
                    case 3:
                        game_state = "playing_level_3";
                        resetGameState(3);
                        break;
                    case 4:
                        game_state = "playing_level_4";
                        resetGameState(4);
                        break;
                }
        }
    }
}