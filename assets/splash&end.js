/**
 * - Displays splash screen on page load presenting game controls.
 * 
 * @author: Angelo Scala
 */

import { svg, gameVictory, gameTime } from "./longsword.js";
import { enemyTypes, passedThrough } from "./covenant.js";
import { formatGameTime } from "./hud.js";

const startScreen = document.getElementById("startScreen");
const svgNS = "http://www.w3.org/2000/svg";

const splash = document.getElementById("splash");
const endStats = document.getElementById("endStats");


/**
 * - Presents splash screen to display game controls upon page load. 
 * 
 */
export function splashScreen() {
            splash.setAttribute("x", "100");
            splash.setAttribute("y", "100");
            svg.appendChild(splash);

            // Move Longsword controls
            let movement = document.createElementNS(svgNS, "text");
            movement.setAttribute("x", "120");
            movement.setAttribute("y", "70");
            movement.setAttribute("font-family", "Arial");
            movement.setAttribute("fill", "lightblue");
            movement.setAttribute("font-size", "20");
            movement.innerHTML = "Move Longsword";
            splash.appendChild(movement);

            // W key
            let wKey = document.createElementNS(svgNS, "rect");
            wKey.setAttribute("x", "160");
            wKey.setAttribute("y", "100");
            wKey.setAttribute("width", "50");
            wKey.setAttribute("height", "50");
            wKey.setAttribute("rx", "10");
            wKey.setAttribute("ry", "10");
            wKey.setAttribute("stroke", "lightblue");
            wKey.setAttribute("stroke-width", "2");
            splash.appendChild(wKey);

            let wChar = document.createElementNS(svgNS, "text");
            wChar.setAttribute("x", "165");
            wChar.setAttribute("y", "125");
            wChar.setAttribute("font-family", "Arial");
            wChar.setAttribute("fill", "lightblue");
            wChar.setAttribute("font-size", "25");
            wChar.innerHTML = "W";
            splash.appendChild(wChar);

            // A key
            let aKey = document.createElementNS(svgNS, "rect");
            aKey.setAttribute("x", "115");
            aKey.setAttribute("y", "160");
            aKey.setAttribute("width", "50");
            aKey.setAttribute("height", "50");
            aKey.setAttribute("rx", "10");
            aKey.setAttribute("ry", "10");
            aKey.setAttribute("stroke", "lightblue");
            aKey.setAttribute("stroke-width", "2");
            splash.appendChild(aKey);

            let aChar = document.createElementNS(svgNS, "text");
            aChar.setAttribute("x", "120");
            aChar.setAttribute("y", "185");
            aChar.setAttribute("font-family", "Arial");
            aChar.setAttribute("fill", "lightblue");
            aChar.setAttribute("font-size", "25");
            aChar.innerHTML = "A";
            splash.appendChild(aChar);

            // S key
            let sKey = document.createElementNS(svgNS, "rect");
            sKey.setAttribute("x", "175");
            sKey.setAttribute("y", "160");
            sKey.setAttribute("width", "50");
            sKey.setAttribute("height", "50");
            sKey.setAttribute("rx", "10");
            sKey.setAttribute("ry", "10");
            sKey.setAttribute("stroke", "lightblue");
            sKey.setAttribute("stroke-width", "2");
            splash.appendChild(sKey);

            let sChar = document.createElementNS(svgNS, "text");
            sChar.setAttribute("x", "180");
            sChar.setAttribute("y", "185");
            sChar.setAttribute("font-family", "Arial");
            sChar.setAttribute("fill", "lightblue");
            sChar.setAttribute("font-size", "25");
            sChar.innerHTML = "S";
            splash.appendChild(sChar);

            // D key
            let dKey = document.createElementNS(svgNS, "rect");
            dKey.setAttribute("x", "235");
            dKey.setAttribute("y", "160");
            dKey.setAttribute("width", "50");
            dKey.setAttribute("height", "50");
            dKey.setAttribute("rx", "10");
            dKey.setAttribute("ry", "10");
            dKey.setAttribute("stroke", "lightblue");
            dKey.setAttribute("stroke-width", "2");
            splash.appendChild(dKey);

            let dChar = document.createElementNS(svgNS, "text");
            dChar.setAttribute("x", "240");
            dChar.setAttribute("y", "185");
            dChar.setAttribute("font-family", "Arial");
            dChar.setAttribute("fill", "lightblue");
            dChar.setAttribute("font-size", "25");
            dChar.innerHTML = "D";
            splash.appendChild(dChar);

            // Spacebar to shoot
            let shoot = document.createElementNS(svgNS, "text");
            shoot.setAttribute("x", "135");
            shoot.setAttribute("y", "266");
            shoot.setAttribute("font-family", "Arial");
            shoot.setAttribute("fill", "lightblue");
            shoot.setAttribute("font-size", "20");
            shoot.innerHTML = "Shoot Missiles";
            splash.appendChild(shoot);

            let spaceBar = document.createElementNS(svgNS, "rect");
            spaceBar.setAttribute("x", "100");
            spaceBar.setAttribute("y", "295");
            spaceBar.setAttribute("width", "200");
            spaceBar.setAttribute("height", "50");
            spaceBar.setAttribute("rx", "10");
            spaceBar.setAttribute("ry", "10");
            spaceBar.setAttribute("stroke", "lightblue");
            spaceBar.setAttribute("stroke-width", "2");
            splash.appendChild(spaceBar);

            let spaceLabel = document.createElementNS(svgNS, "text");
            spaceLabel.setAttribute("x", "160");
            spaceLabel.setAttribute("y", "330");
            spaceLabel.setAttribute("font-family", "Arial");
            spaceLabel.setAttribute("fill", "lightblue");
            spaceLabel.setAttribute("font-size", "25");
            spaceLabel.innerHTML = "Space";
            splash.appendChild(spaceLabel);


            // Arrow Keys for longsword tilt
            let shipTilt = document.createElementNS(svgNS, "text");
            shipTilt.setAttribute("x", "710");
            shipTilt.setAttribute("y", "130");
            shipTilt.setAttribute("font-family", "Arial");
            shipTilt.setAttribute("fill", "lightblue");
            shipTilt.setAttribute("font-size", "20");
            shipTilt.innerHTML = "Rotate Longsword";
            splash.appendChild(shipTilt);

            // Left arrow
            let leftArrowKey = document.createElementNS(svgNS, "rect");
            leftArrowKey.setAttribute("x", "705");
            leftArrowKey.setAttribute("y", "160");
            leftArrowKey.setAttribute("width", "50");
            leftArrowKey.setAttribute("height", "50");
            leftArrowKey.setAttribute("rx", "10");
            leftArrowKey.setAttribute("ry", "10");
            leftArrowKey.setAttribute("stroke", "lightblue");
            leftArrowKey.setAttribute("stroke-width", "2");
            splash.appendChild(leftArrowKey);

            let leftArrow = document.createElementNS(svgNS, "polygon");
            leftArrow.setAttribute("points", "712,175,720,170,720,175,730,175,720,175,720,180,712,175");
            leftArrow.setAttribute("stroke", "lightblue");
            leftArrow.setAttribute("fill", "lightblue");
            leftArrow.setAttribute("stroke-width", "2");
            splash.appendChild(leftArrow);

            // Right arrow
            let rightArrowKey = document.createElementNS(svgNS, "rect");
            rightArrowKey.setAttribute("x", "825");
            rightArrowKey.setAttribute("y", "160");
            rightArrowKey.setAttribute("width", "50");
            rightArrowKey.setAttribute("height", "50");
            rightArrowKey.setAttribute("rx", "10");
            rightArrowKey.setAttribute("ry", "10");
            rightArrowKey.setAttribute("stroke", "lightblue");
            rightArrowKey.setAttribute("stroke-width", "2");
            splash.appendChild(rightArrowKey);

            let rightArrow = document.createElementNS(svgNS, "polygon");
            rightArrow.setAttribute("points", "850,175 842,170 842,175 832,175 842,175 842,180 850,175");
            rightArrow.setAttribute("stroke", "lightblue");
            rightArrow.setAttribute("fill", "lightblue");
            rightArrow.setAttribute("stroke-width", "2");
            splash.appendChild(rightArrow);

            // Down arrow
            let switching = document.createElementNS(svgNS, "text");
            switching.setAttribute("x", "715");
            switching.setAttribute("y", "266");
            switching.setAttribute("font-family", "Arial");
            switching.setAttribute("fill", "lightblue");
            switching.setAttribute("font-size", "20");
            switching.innerHTML = "Switch Weapons";
            splash.appendChild(switching);
            
            let downArrowKey = document.createElementNS(svgNS, "rect");
            downArrowKey.setAttribute("x", "765");
            downArrowKey.setAttribute("y", "295");
            downArrowKey.setAttribute("width", "50");
            downArrowKey.setAttribute("height", "50");
            downArrowKey.setAttribute("rx", "10");
            downArrowKey.setAttribute("ry", "10");
            downArrowKey.setAttribute("stroke", "lightblue");
            downArrowKey.setAttribute("stroke-width", "2");
            splash.appendChild(downArrowKey);

            let downArrow = document.createElementNS(svgNS, "polygon");
            downArrow.setAttribute("points", "777,320 772,312 777,312 777,302 777,312 782,312 777,320");
            downArrow.setAttribute("stroke", "lightblue");
            downArrow.setAttribute("fill", "lightblue");
            downArrow.setAttribute("stroke-width", "2");
            splash.appendChild(downArrow);


            // Splash messages
            let objective = document.createElementNS(svgNS, "text");
            objective.setAttribute("x", "690");
            objective.setAttribute("y", "410");
            objective.setAttribute("font-family", "Arial");
            objective.setAttribute("fill", "lightblue");
            objective.setAttribute("font-size", "15");
            objective.innerHTML = "Objective: Survive 5 minutes.";
            splash.appendChild(objective);

            let tip = document.createElementNS(svgNS, "text");
            tip.setAttribute("x", "690");
            tip.setAttribute("y", "450");
            tip.setAttribute("font-family", "Arial");
            tip.setAttribute("fill", "lightblue");
            tip.setAttribute("font-size", "15");
            tip.innerHTML = "Tip: Collect falling objects.";
            splash.appendChild(tip);
}

/**
 * - Removes splash screen upon game start.
 * 
 */
export function clearSplash() {
    svg.removeChild(splash);
}

// not used currently
export function appendSplash() {
    svg.appendChild(splash);
}

/**
 * - 
 * 
 */
export function endGame(gameVictory, gametime, enemyTypes) {
    if (gameVictory) {

        let gameWon = document.createElementNS(svgNS, "text");
        gameWon.setAttribute("x", "300");
        gameWon.setAttribute("y", "200");
        gameWon.setAttribute("font-family", "Arial");
        gameWon.setAttribute("fill", "white");
        gameWon.setAttribute("font-size", "50");
        endStats.appendChild(gameWon);
        gameWon.innerHTML = "Mission Complete";
    } else {
        let gameOver = document.createElementNS(svgNS, "text");
        gameOver.setAttribute("x", "370");
        gameOver.setAttribute("y", "200");
        gameOver.setAttribute("font-family", "Arial");
        gameOver.setAttribute("fill", "white");
        gameOver.setAttribute("font-size", "50");
        endStats.appendChild(gameOver);
        gameOver.innerHTML = "Game Over";
    }
    
    let timeStat = document.createElementNS(svgNS, "text");
    timeStat.setAttribute("x", "430");
    timeStat.setAttribute("y", "250");
    timeStat.setAttribute("font-family", "Arial");
    timeStat.setAttribute("fill", "white");
    timeStat.setAttribute("font-size", "20");
    endStats.appendChild(timeStat);
    timeStat.innerHTML = "Time: " + formatGameTime(gameTime);
    
    let takeDownStatB = document.createElementNS(svgNS, "text");
    takeDownStatB.setAttribute("x", "400");
    takeDownStatB.setAttribute("y", "280");
    takeDownStatB.setAttribute("font-family", "Arial");
    takeDownStatB.setAttribute("fill", "white");
    takeDownStatB.setAttribute("font-size", "20");
    endStats.appendChild(takeDownStatB);
    takeDownStatB.innerHTML = "Banshee Takedowns: " + enemyTypes.banshee.takeDowns;
    
    let missedStatB = document.createElementNS(svgNS, "text");
    missedStatB.setAttribute("x", "410");
    missedStatB.setAttribute("y", "310");
    missedStatB.setAttribute("font-family", "Arial");
    missedStatB.setAttribute("fill", "white");
    missedStatB.setAttribute("font-size", "20");
    endStats.appendChild(missedStatB);
    missedStatB.innerHTML = "Banshees missed: " + enemyTypes.banshee.passedThrough;

    if (enemyTypes.phantom.takeDowns > 0) {

        let takeDownStatP = document.createElementNS(svgNS, "text");
        takeDownStatP.setAttribute("x", "400");
        takeDownStatP.setAttribute("y", "340");
        takeDownStatP.setAttribute("font-family", "Arial");
        takeDownStatP.setAttribute("fill", "white");
        takeDownStatP.setAttribute("font-size", "20");
        endStats.appendChild(takeDownStatP);
        takeDownStatP.innerHTML = "Phantom Takedowns: " + enemyTypes.phantom.takeDowns;
        
        let missedStatP = document.createElementNS(svgNS, "text");
        missedStatP.setAttribute("x", "410");
        missedStatP.setAttribute("y", "370");
        missedStatP.setAttribute("font-family", "Arial");
        missedStatP.setAttribute("fill", "white");
        missedStatP.setAttribute("font-size", "20");
        endStats.appendChild(missedStatP);
        missedStatP.innerHTML = "Phantoms missed: " + enemyTypes.phantom.passedThrough;
    }
}