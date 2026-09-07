/**
 * - Heads Up Display
 * - Controls HUD elements.
 * - Displays gameTime.
 * - Displays equipped weapon.
 * 
 * @author: Angelo Scala
 */

import { game } from "./main.js";
import { svg, gameTime, stats } from "./longsword.js";
import { equippedWeapon } from "./weapons.js";

const svgNS = "http://www.w3.org/2000/svg";

// Primary color for HUD elements
let HUDColor = "lightblue";

/**
 * - Formats gameTime into string with minutes, seconds, and milliseconds.
 * 
 * @param {*} gameTime 
 * @returns - Formatted gameTime string. 
 */
export function formatGameTime(gameTime) {
    const minutes = Math.floor(gameTime / 60);
    const seconds = Math.floor(gameTime % 60);
    const milliseconds = Math.round((gameTime % 1) * 100);

    return String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0") + "." +
            String(milliseconds).padStart(2, "0");  
}

// Time element ticks in top left corner.
let time;
/**
 * - Creates svg element time to display in top left corner.
 * - Calls formatGameTime to retrieve formatted gameTime.
 * 
 */
export function displayTime() {
    if (time) {
        time.remove();
    }
    time = document.createElementNS(svgNS, "text");
    time.setAttribute("x", "5");
    time.setAttribute("y", "12");
    time.setAttribute("font-family", "Arial");
    time.setAttribute("fill", "white");
    time.setAttribute("font-size", "12");
    svg.appendChild(time);
    time.innerHTML = formatGameTime(gameTime);
}


let hitDetected = false;
// Longsword health displayed in top right.
export let hp;
/**
 * - Displays HP gauge in the top right corner.
 * - Called by startGame() and intro(), sits within gameTimer interval,
 * called ever 10 milliseconds.
 * 
 */
export function displayHP() {
    if (hp) {
        hp.remove();
    }

    hp = document.createElementNS(svgNS, "text");
    hp.setAttribute("x", "930");
    hp.setAttribute("y", "25");
    hp.setAttribute("font-family", "Arial");
    hp.setAttribute("fill", `${HUDColor}`);
    hp.setAttribute("font-size", "20");
    svg.appendChild(hp);
    hp.innerHTML = stats.hp;        
}


/**
 * - Called by takeDamaga() within longsword.js.
 * - Causes HP gauge to flash red upon taking damage. 
 * 
 */
export function hitDetectHP() {
    hitDetected = true;
    HUDColor = "red";
    setTimeout(()=>{
        HUDColor = "lightblue";
    }, 100);
    hitDetected = false;
}



/**
 * - Displays equipped weapon icon in lower right corner.
 * 
 * @param {*} equippedWeapon 
 */
export function displayWeapon(equippedWeapon) {
    let weaponSpace = document.createElementNS(svgNS, "g");
    weaponSpace.setAttribute("transform", "translate(900,450)");
    svg.appendChild(weaponSpace);

    if (equippedWeapon === "missiles") {
        // Missile 1
        let missileIconA1 = document.createElementNS(svgNS, "rect");
        missileIconA1.setAttribute("x", "0");
        missileIconA1.setAttribute("y", "0");
        missileIconA1.setAttribute("width", "10");
        missileIconA1.setAttribute("height", "30");
        missileIconA1.setAttribute("ry", "10");
        missileIconA1.setAttribute("fill", `${HUDColor}`);
        missileIconA1.setAttribute("stroke", "black");
        weaponSpace.appendChild(missileIconA1);
        
        let missileIconB1 = document.createElementNS(svgNS, "rect");
        missileIconB1.setAttribute("x", "0");
        missileIconB1.setAttribute("y", "25");
        missileIconB1.setAttribute("width", "10");
        missileIconB1.setAttribute("height", "5");
        missileIconB1.setAttribute("fill", `${HUDColor}`);
        missileIconB1.setAttribute("stroke", "black");
        weaponSpace.appendChild(missileIconB1);

        // Missile 2
        let missileIconA2 = document.createElementNS(svgNS, "rect");
        missileIconA2.setAttribute("x", "40");
        missileIconA2.setAttribute("y", "0");
        missileIconA2.setAttribute("width", "10");
        missileIconA2.setAttribute("height", "30");
        missileIconA2.setAttribute("ry", "10");
        missileIconA2.setAttribute("fill", `${HUDColor}`);
        missileIconA2.setAttribute("stroke", "black");
        weaponSpace.appendChild(missileIconA2);
        
        let missileIconB2 = document.createElementNS(svgNS, "rect");
        missileIconB2.setAttribute("x", "40");
        missileIconB2.setAttribute("y", "25");
        missileIconB2.setAttribute("width", "10");
        missileIconB2.setAttribute("height", "5");
        missileIconB2.setAttribute("fill", `${HUDColor}`);
        missileIconB2.setAttribute("stroke", "black");
        weaponSpace.appendChild(missileIconB2);
    } 
}