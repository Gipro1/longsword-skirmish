/**
 * - Initiates game after start button clicked: game is set true
 * - Intro sequence plays and calls enemy spawner()
 * - Longsword controls become active, can be moved and fires missiles
 * - Tracks longsword hp
 * 
 * @author: Angelo Scala
 */


import { btn, start, game, setGame } from "./main.js";
import { clearSplash, endGame } from "./splash&end.js";
import { displayTime, displayHP, displayWeapon } from "./hud.js";
import { hitDetection } from "./collisions.js";
import { enemies, spawner, enemyTypes } from "./covenant.js";
import { powerUp, regenHP } from "./items.js";
import { equippedWeapon } from "./weapons.js";

const svgNS = "http://www.w3.org/2000/svg";
export const svg = document.getElementById("mySVG");

export let gameTime = 0.0; // Tracks time spent playing
let gameTimer; // Timing interval
export let gameVictory = false;
export let timeLimit = 600.00;

// Longsword
const rocket = document.getElementById("rocket");
const flameLeft = document.getElementById("flameLeft");
const flameRight = document.getElementById("flameRight");
export const stats = {
    hp: 100,
    missileDamage: 5
};
// Longsword rotation
let rotated = 0;

let controllable; // Interval is made to check user inputs every 16ms.
/**
 * - Starts countdown which triggers game to start.
 * 
 */
export function startGame(e) {
    let clock;
    let countDown;
    if (!game) {
        let loading;
        let dots = "";
        setTimeout(()=>{
            clearInterval(loading);
            setTimeout(()=>{
                start.remove();
                btn.remove();
            }, 1000);
        }, 3000);
        loading = setInterval(()=>{
            if (dots === "...") {
                dots = ".";
            } else {
                dots += ".";
            }
            start.innerHTML = "START" + dots;
        },990);
        let timer = 3; // temporary limit.....
        if (clock) {
            clock.remove();
        }
        if (countDown) {
            clearInterval(countDown);
        }
        clock = document.createElementNS(svgNS, "text");
        clock.setAttribute("x", "488");
        clock.setAttribute("y", "200");
        clock.setAttribute("font-family", "Arial");
        clock.setAttribute("fill", "white");
        clock.setAttribute("font-size", "50");
        svg.appendChild(clock);
        clock.innerHTML = timer;
        countDown = setInterval(()=>{
            if (timer == 0) {
                clearSplash();
                clock.remove();
                setGame(true);
                displayWeapon(equippedWeapon);
                displayHP();
                intro();
                clearInterval(countDown);
                controllable = setInterval(controller, 16);
            }
            timer--;
            clock.innerHTML = timer;
        },1000);
    } else {
        //pauseGame(e);
        console.log("fun");
    }
}



// default position
export let x = 465;
export let y = 430;
let speed = 10;
/**
 * - Longsword engines burn hotter
 * - Longsword drifts upwards for 2 seconds
 * - Covenant crafts begin spawning
 * - gameTime starts ticking
 * - powerUp function called
 * 
 */
function intro() {
    flameLeft.setAttribute("points", "19,38,21,50,23,38");
    flameRight.setAttribute("points", "47,38,49,50,51,38");
    let startUp = setInterval(()=>{
        y-=2;
        rocket.setAttribute("transform", `translate(${x},${y}) rotate(${rotated}, 35, 29)`);
    },50);
    setTimeout(()=>{
        clearInterval(startUp);

        spawner();
        gameTimer = setInterval(()=>{
            gameTime+=0.01;
            displayTime();
            displayHP();
            if (gameTime >= timeLimit) {
                clearInterval(gameTimer);
                gameVictory = true;
                clearInterval(controllable);
                endGame(gameVictory, gameTime, enemyTypes);
                setGame(false);
            }
        },10);
        
        powerUp();
        regenHP();
    },2000);
}


// Directional booleans
let up = false;
let down = false;
let left = false;
let right = false;

export function setDirection(key, pressed) {
    if (["w", "W"].includes(key)) { up = pressed; }
    if (["s", "S"].includes(key)) { down = pressed; }
    if (["a", "A"].includes(key)) { left = pressed; }
    if (["d", "D"].includes(key)) { right = pressed; }
}

/**
 * - If game is active, increments or decrements x and y based on directional booleans
 * 
 */
function controller() {
    tilt();
    if (up) { 
        if (y < +7) {
            y = +7;
        }
        y -= speed;
        tilt();
    }
    if (down) { 
        if (y > 450) {
            y = 450;
        }
        y += speed;
        tilt(); 
    }
    if (left) { 
        if (x < 0) {
            x = 0;
        }
        x -= speed;
        tilt();
    }
    if (right) { 
        if ( x > 930) {
            x = 930;
        }
        x += speed;
        tilt();
    }
    rocket.setAttribute("transform", `translate(${x},${y}) rotate(${rotated}, 35, 29)`);
    collision();
}


// Longsword tilt booleans.
export let leftTilt = false;
export let rightTilt = false;
export let tiltString = "";

let shiftDown = false; // not used
/**
 * - Updates shiftDown boolean based on eventListeners
 * from main.js.
 * 
 * @param {*} shift 
 */
export function shiftCheck(shift) {
    if (!shift) {
        shiftDown = false;
    } else {
        shiftDown = true;
    }
}

/**
 * - If shift key is down and either left or right is pressed
 * sets ship rotation.
 * 
 */
function tilt() {
     if (leftTilt && rightTilt || !leftTilt && !rightTilt) {
        rotated = 0;
        tiltString = "";
        
    } else if (leftTilt) {
        rotated = -45;
        tiltString = "left";

    } else if (rightTilt) {
        rotated = 45;   
        tiltString = "right";
    }
}

/**
 * - Recieves arrow key inputs from main.js.
 * - Sets longsword tilt based on key pressed.
 * 
 * @param {*} key 
 * @param {*} pressed 
 */
export function setTilt(key, pressed) {
    if (["ArrowLeft"].includes(key)) { leftTilt = pressed; }
    if (["ArrowRight"].includes(key)) { rightTilt = pressed; }
}


/**
 * - If player hp is drained to 0, game over screen is generated
 * - Displays "Game Over"
 * - Calls endGame()
 * 
 */
export function hpStatus() {
    if (stats.hp <= 0) {
        stats.hp = 0;
        displayHP();
        setGame(false);
        clearInterval(gameTimer);
        rocket.remove();
        
        clearInterval(controllable);
        endGame(gameVictory, gameTime, enemyTypes);
    }
}

/**
 * - Tracks player coordinates.
 * - Checks if they intercept enemy coordinates from enemies array.
 * - Converts both player and collided enemy colors.
 * - Subtracts HP from both.
 * 
 */
export function collision() {
    const lsParts = svg.querySelectorAll("#nose, #trunkLeft, #trunkRight, #leftWing, #rightWing, #leftEngine, #rightEngine, #tail");

    enemies.forEach((enemy) => {
        let hitX = (enemy.x < x + 70) && (enemy.x + enemy.hitW > x);
        let hitY = (enemy.y < y + 65) && (enemy.y + enemy.hitH > y);
        
        hitDetection(hitX, hitY, enemy, "collision");
    });
}


/**
 * - Subtracts damage amount from longsword's hp.
 * - Flashes longsword's color to indicate damage taken.
 * 
 * @param {*} damage 
 */
export function takeDamage(damage) {
        stats.hp -= damage;
        if (stats.hp < 0) {
            stats.hp = 0;
        }
        hpStatus();

        const lsParts = svg.querySelectorAll("#nose, #trunkLeft, #trunkRight, #leftWing, #rightWing, #leftEngine, #rightEngine, #tail"); 
        lsParts.forEach(part => part.setAttribute("fill", "red"));
        setTimeout(()=>{
            lsParts.forEach(part => part.setAttribute("fill", "lightgrey"));
        }, 100);
}