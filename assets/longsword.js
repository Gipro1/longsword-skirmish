/**
 * - Initiates game after start button clicked: game is set true
 * - Intro sequence plays and calls enemy spawner()
 * - Longsword controls become active, can be moved and fires missiles
 * - Tracks longsword hp
 * 
 * @author: Angelo Scala
 */


import { btn, game, setGame } from "./main.js";
import { clearSplash, endGame } from "./splasn&end.js";
import { collectPower, hitDetection } from "./collisions.js";
import { enemies, spawner, takeDowns, passedThrough } from "./covenant.js";
import { powerUp } from "./items.js";

const svgNS = "http://www.w3.org/2000/svg";
export const svg = document.getElementById("mySVG");
const controls = document.getElementById("controls");

export let gameTime = 0.0; // Tracks time spent playing
let gameTimer; // Timing interval
export let gameVictory = false;

// Longsword
const rocket = document.getElementById("rocket");
const flameLeft = document.getElementById("flameLeft");
const flameRight = document.getElementById("flameRight");
export const stats = {
    hp: 100,
    missileDamage: 10
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
            setTimeout(()=>{ btn.innerHTML = "Pause"; }, 1000);
        }, 5000);
        loading = setInterval(()=>{
            if (dots === "...") {
                dots = ".";
            } else {
                dots += ".";
            }
            btn.innerHTML = "Starting" + dots;
        },800);
        let timer = 2; // temporary limit.....
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

/**
 * - Not made yet
 * 
 *//*
function pauseGame(e) {

}*/

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
        rocket.setAttribute("transform", `translate(${x},${y}) rotate(${rotated})`);
    },50);
    setTimeout(()=>{
        clearInterval(startUp);

        spawner();
        gameTimer = setInterval(()=>{
            gameTime+=0.01;
            if (gameTime >= 600.00) { // game Won!
                clearInterval(gameTimer);
                gameVictory = true;
                clearInterval(controllable);
                endGame(gameVictory, gameTime, takeDowns, passedThrough);
            }
        },10);
        
        powerUp();
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
    rocket.setAttribute("transform", `translate(${x},${y}) rotate(${rotated})`);
    collision();
}


// Longsword tilt booleans.
let leftTilt = false;
let rightTilt = false;

let shiftDown = false;
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
        
    } else if (leftTilt) {
        rotated = -45;

    } else if (rightTilt) {
        rotated = 45;   
    }
}

/**
 * - 
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
        setGame(false);
        clearInterval(gameTimer);
        rocket.remove();
        
        clearInterval(controllable);
        endGame(gameVictory, gameTime, takeDowns, passedThrough);
    }
}

/**
 * - Tracks player coordinates 
 * - Checks if they intercept enemy coordinates from enemies array
 * - Converts both player and collided enemy colors
 * - Subtracts HP from both
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
 * - Creates and fires missiles upwards from longsword canons
 * - If missiles travel above screen boundary they are removed
 * - If missiles strike banshee, banshee takes damage, missile is removed
 * 
 */
export function missiles() {
    const leftCanon = document.getElementById("leftCanon");

    // Coordinats for missileDuo group spawn
    let xDuo = x + parseFloat(leftCanon.getAttribute("x"))+1.5;
    let yDuo = y + parseFloat(leftCanon.getAttribute("y"));
    
        // Checks for longsword tilt for every missileDuo fired.
    let angledLeft = false;
    let angledRight = false;
    let missileTilt = 0;

    // Determines missile angle upon firing.
    if (leftTilt) {
        angledLeft = true;
        xDuo -= 1;
        yDuo -= 14;
    } else if (rightTilt) {
        angledRight = true;
        xDuo -= 13;
        yDuo += 17;
    }
    if (!angledLeft && !angledRight) {
            missileTilt = 0; // tilt angle
        } else {
            if (angledLeft) {
                missileTilt = -45; // 30 degrees left
            } else if (angledRight) {
                missileTilt = 45; // 30 degrees right
            }
        }

    let missileDuo = document.createElementNS(svgNS, "g");
    missileDuo.setAttribute("transform", `translate(${xDuo}, ${yDuo}) rotate(${missileTilt})`);
    svg.appendChild(missileDuo);

    let missile1 = document.createElementNS(svgNS, "ellipse");
    missile1.setAttribute("cx", `${1}`);
    missile1.setAttribute("cy", `${-7}`);
    missile1.setAttribute("r", "1");
    missile1.setAttribute("rx", "1");
    missile1.setAttribute("ry", "10");
    missile1.setAttribute("fill", "orange");
    missileDuo.appendChild(missile1);

    let missile2 = document.createElementNS(svgNS, "ellipse");
    missile2.setAttribute("cx", `${26}`);
    missile2.setAttribute("cy", `${-7}`);
    missile2.setAttribute("r", "1");
    missile2.setAttribute("rx", "1");
    missile2.setAttribute("ry", "10");
    missile2.setAttribute("fill", "orange");
    missileDuo.appendChild(missile2);
    let missileTick = 0; // Tracks time missiles exist.

    let missileTravel;
    //  let missileAngled = false;

    // Checks for longsword tilt for every missileDuo fired.
    missileTravel = setInterval(()=>{ // Assigns missile directional speed.
        if (!angledLeft && !angledRight) {
            yDuo-=10;
        } else {
            if (angledLeft) {
                yDuo-=7;
                xDuo-=7;
            } else if (angledRight) {
                yDuo-=7;
                xDuo+=7;
            }
        }
        missileDuo.setAttribute("transform", `translate(${xDuo},${yDuo}) rotate(${missileTilt})`);
        missileTick++;

        // Boundary check stops interval if above viewport.
        if (yDuo < 0) {
            missile1.remove();
            missile2.remove();
            missileDuo.remove();
            clearInterval(missileTravel);
            return;
        } else if (missileTick > 188) { // Removes missiles if they become frozen in view.
            missile1.remove();
            missile2.remove();
            missileDuo.remove();
            clearInterval(missileTravel);
            return;
        }

        // Cycles through banshees banshees array
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];
            if (!enemy) { continue; }    
            
            // hitX and hitY make up enemy hitbox
            let hitX = (enemy.x < xDuo+2) && (enemy.x + enemy.hitW > xDuo+1);
            let hitY = (enemy.y+enemy.hitH > yDuo || enemy.y+enemy.hitH > yDuo) && (enemy.y < yDuo+10 || enemy.y < yDuo+10);
            
            // Detects missile impacts on banshees
            if (hitDetection(hitX, hitY, enemy, "missileImpact")) {
                clearInterval(missileTravel);
                missile1.remove();
                missile2.remove();
                missileDuo.remove();
                return;
            }
        }
    }, 16);
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