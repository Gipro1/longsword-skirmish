/**
 * - Initiates game after start button clicked: game is set true
 * - Intro sequence plays and calls enemy spawner()
 * - Longsword controls become active, can be moved and fires missiles
 * - Tracks longsword hp
 * 
 * @author: Angelo Scala
 */


import { btn, game, setGame } from "./main.js";
import { collectPower } from "./collisions.js";
import { enemies, spawner, takeDowns, passedThrough } from "./covenant.js";
import { powerUp } from "./items.js";

const svgNS = "http://www.w3.org/2000/svg";
export const svg = document.getElementById("mySVG");
const controls = document.getElementById("controls");
const endStats = document.getElementById("endStats");

export let gameTime = 0.0; // Tracks time spent playing
let gameTimer; // Timing interval
let gameVictory = false;

// Longsword
const rocket = document.getElementById("rocket");
const flameLeft = document.getElementById("flameLeft");
const flameRight = document.getElementById("flameRight");
export const stats = {
    hp: 100,
    missileDamage: 10
};



let controllable; // Interval is made to check user inputs every 16ms.
/**
 * - Starts countdown which triggers game to start.
 * 
 */
export function startGame(e) {
    let clock;
    let countDown;
    if (!game) {
        setGame(true);
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
        let timer = 5;
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
                clock.remove();
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
        rocket.setAttribute("transform", `translate(${x},${y})`);
    },50);
    setTimeout(()=>{
        clearInterval(startUp)

        spawner();
        gameTimer = setInterval(()=>{
            gameTime+=0.01;
            if (gameTime >= 600.00) {
                clearInterval(gameTimer);
                gameVictory = true;
                endGame();
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
    if (["ArrowUp", "w"].includes(key)) { up = pressed; }
    if (["ArrowDown", "s"].includes(key)) { down = pressed; }
    if (["ArrowLeft", "a"].includes(key)) { left = pressed; }
    if (["ArrowRight", "d"].includes(key)) { right = pressed; }
}

/**
 * - If game is active, increments or decrements x and y based on directional booleans
 * 
 */
export function controller() {
    if (up) { 
        if (y < +7) {
            y = +7;
        }
        y -= speed;
    }
    if (down) { 
        if (y > 450) {
            y = 450;
        }
        y += speed; 
    }
    if (left) { 
        if (x < 0) {
            x = 0;
        }
        x -= speed;
    }
    if (right) { 
        if ( x > 930) {
            x = 930;
        }
        x += speed; 
    }
    rocket.setAttribute("transform", `translate(${x},${y})`);
    collision();
}

/**
 * - If player hp is drained to 0, game over screen is generated
 * - Displays "Game Over"
 * - Calls endGame()
 * 
 */
function hpStatus() {
    if (stats.hp <= 0) {
        stats.hp = 0;
        setGame(false);
        clearInterval(gameTimer);
        rocket.remove();

        let gameOver = document.createElementNS(svgNS, "text");
        gameOver.setAttribute("x", "370");
        gameOver.setAttribute("y", "200");
        gameOver.setAttribute("font-family", "Arial");
        gameOver.setAttribute("fill", "white");
        gameOver.setAttribute("font-size", "50");
        endStats.appendChild(gameOver);
        gameOver.innerHTML = "Game Over";

        endGame();
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
        
        if (hitX && hitY) {
            let eBody;
            let eJets;
            
            let sD; // stroke damage color
            let fD; // fill damage color

            let sC; // stroke color
            let fC; // fill color

            if (!enemy.impact) {
                enemy.impact = true;
                if (enemy.type === "banshee") {
                    eBody = enemy.element.querySelectorAll("#middleBack, #middleFront");
                    eJets = enemy.element.querySelectorAll("#leftJet, #rightJet");
                    sD = "lightblue"; fD = "lightblue";
                    sC = "indigo"; fC = "indigo";

                } else if (enemy.type === "phantom") {
                    eBody = enemy.element.querySelectorAll("#body_horizontal_rear, #body_horizontal_front, #left_spike, #right_spike, #mid_spike, #body_left_rear, #body_right_rear, #body_left, #body_right, #body_horizontal_cover, #body_vertical");
                    sD = "lightblue"; fD = "red";
                    sC = "#702963"; fC = "#34132E";
                }

                stats.hp-=10;
                hpStatus();
                enemy.hp -= 25;

                lsParts.forEach(part => part.setAttribute("fill", "red"));
                eBody.forEach(part => part.setAttribute("fill", fD));
                
                if (eJets) {
                    eJets.forEach(part => part.setAttribute("stroke", sD));
                }
                
                setTimeout(() => {
                    lsParts.forEach(part => part.setAttribute("fill", "lightgrey"));
                    eBody.forEach(part => part.setAttribute("fill", fC));

                    if (eJets) {
                        eJets.forEach(part => part.setAttribute("stroke", sC));
                    }
                }, 100);
            }
            
        } else {
            enemy.impact = false;
        }
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
    const rightCanon = document.getElementById("rightCanon");
    
    let x1 = x + parseFloat(leftCanon.getAttribute("x"))+1.5;
    let y1 = y + parseFloat(leftCanon.getAttribute("y"))-10;
    
    let x2 = x + parseFloat(rightCanon.getAttribute("x"))+1.5;
    let y2 = y + parseFloat(rightCanon.getAttribute("y"))-10;

    let missile1 = document.createElementNS(svgNS, "ellipse");
    missile1.setAttribute("cx", `${x1}`);
    missile1.setAttribute("cy", `${y1}`);
    missile1.setAttribute("r", "1");
    missile1.setAttribute("rx", "1");
    missile1.setAttribute("ry", "10");
    missile1.setAttribute("fill", "orange");
    svg.appendChild(missile1);

    let missile2 = document.createElementNS(svgNS, "ellipse");
    missile2.setAttribute("cx", `${x2}`);
    missile2.setAttribute("cy", `${y2}`);
    missile2.setAttribute("r", "1");
    missile2.setAttribute("rx", "1");
    missile2.setAttribute("ry", "10");
    missile2.setAttribute("fill", "orange");
    svg.appendChild(missile2);
    let missileTravel;

    missileTravel = setInterval(()=>{
        y1-=10;
        y2-=10;
        missile1.setAttribute("cy", `${y1}`);
        missile2.setAttribute("cy", `${y2}`);

        // boundary check stops interval if above viewport
        if (y1 < 0 || y2 < 0) {
            missile1.remove();
            missile2.remove();
            clearInterval(missileTravel);
            return;
        }

        // Cycles through banshees banshees array
        for (let i = 0; i < enemies.length; i++) {
            let target = enemies[i];
            if (!target) { continue; }    
            
            let hitX = (target.x < x2+2) && (target.x + target.hitW > x1+1);
            let hitY = (target.y+target.hitH > y1 || target.y+target.hitH > y2) && (target.y < y1+10 || target.y < y2+10);
            
            let eBody; // enemy body uses fill
            let eJets; // jets use stroke

            let sD; // stroke damage color
            let fD; // fill damage color
            let sC; // stroke color
            let fC; // fill color

            // Detects missile impacts on banshees
            if (hitX && hitY) {
                // Flashes banshee color change to indicate damage taken
                if (target.type === "banshee") {
                    eBody = target.element.querySelectorAll("#middleBack, #middleFront");
                    eJets = target.element.querySelectorAll("#leftJet, #rightJet");
                    sD = "lightblue"; fD = "lightblue";
                    sC = "indigo"; fC = "indigo";

                } else if (target.type === "phantom") {
                    eBody = target.element.querySelectorAll("#body_horizontal_rear, #body_horizontal_front, #left_spike, #right_spike, #mid_spike, #body_left_rear, #body_right_rear, #body_left, #body_right, #body_horizontal_cover, #body_vertical");
                    sD = "lightblue"; fD = "red";
                    sC = "#702963"; fC = "#34132E";
                }
                                    
                eBody.forEach(part => part.setAttribute("fill", fD));
                if (eJets) {
                    eJets.forEach(part => part.setAttribute("stroke", sD));    
                }

                setTimeout(() => {
                    eBody.forEach(part => part.setAttribute("fill", fC));
                    if (eJets) {
                        eJets.forEach(part => part.setAttribute("stroke", sC));    
                    }
                }, 50);
                target.hp -= stats.missileDamage;
                clearInterval(missileTravel);
                missile1.remove();
                missile2.remove();
                return;
            }
        }
    }, 16);
}

function endGame() {
    clearInterval(controllable);
    setGame(false);
    if (gameVictory) {

        let gameWon = document.createElementNS(svgNS, "text");
        gameWon.setAttribute("x", "370");
        gameWon.setAttribute("y", "200");
        gameWon.setAttribute("font-family", "Arial");
        gameWon.setAttribute("fill", "white");
        gameWon.setAttribute("font-size", "50");
        endStats.appendChild(gameWon);
        gameWon.innerHTML = "Mission Complete";
    }
    
    let timeStat = document.createElementNS(svgNS, "text");
    timeStat.setAttribute("x", "450");
    timeStat.setAttribute("y", "250");
    timeStat.setAttribute("font-family", "Arial");
    timeStat.setAttribute("fill", "white");
    timeStat.setAttribute("font-size", "20");
    endStats.appendChild(timeStat);
    timeStat.innerHTML = "Time: " + (gameTime/60).toFixed(2);
    
    let takeDownStat = document.createElementNS(svgNS, "text");
    takeDownStat.setAttribute("x", "400");
    takeDownStat.setAttribute("y", "280");
    takeDownStat.setAttribute("font-family", "Arial");
    takeDownStat.setAttribute("fill", "white");
    takeDownStat.setAttribute("font-size", "20");
    endStats.appendChild(takeDownStat);
    takeDownStat.innerHTML = "Banshee Takedowns: " + takeDowns;
    
    let missedStat = document.createElementNS(svgNS, "text");
    missedStat.setAttribute("x", "410");
    missedStat.setAttribute("y", "310");
    missedStat.setAttribute("font-family", "Arial");
    missedStat.setAttribute("fill", "white");
    missedStat.setAttribute("font-size", "20");
    endStats.appendChild(missedStat);
    missedStat.innerHTML = "Banshees missed: " + passedThrough;
}

/**
 * - 
 * 
 * @param {*} damage 
 */
export function takeDamage(damage) {
        stats.hp -= damage;
}