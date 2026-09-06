/**
 * - Handles item collections, collisions, and projectile impacts.
 * - collectItem handles item collections.
 * - hitDetection handles craft collisions with longsword and missile impacts on enemy crafts.
 * 
 * @author: Angelo Scala
 */


import { svg, stats as longsword, hpStatus } from "./longsword.js";
import { enemies, spawner, enemyTypes } from "./covenant.js";

const svgNS = "http://www.w3.org/2000/svg";


/**
 * - Function is called to retrieve longsword parts.
 * 
 * @returns - lsParts variable containing longsword parts. 
 */
function getLongswordParts() {
    const lsParts = svg.querySelectorAll("#nose, #trunkLeft, #trunkRight, #leftWing, #rightWing, #leftEngine, #rightEngine, #tail");
    return lsParts;
}

/**
 * - Handles item collection.
 * - Longsword flashes color based on item.
 * - Item effect pops up.
 * 
 * @param {*} nodeX 
 * @param {*} yDrift 
 * @param {*} x - longsword x
 * @param {*} y - longsword y
 * @returns boolean
 */
export function collectItem(nodeX, yDrift, x, y, item) {
    let pickUpX = ( nodeX < x + 70) && (nodeX + 10 > x);
    let pickUpY = (yDrift < y + 65) && (yDrift + 10 > y);
    
    const lsParts = getLongswordParts();
    if (pickUpX && pickUpY) {
        let flashColor;
        let pickUp;
        let pickUpMsg;
        
        // Detects item type.
        if (item === "powerUp") { 
            flashColor = "yellow";
            pickUpMsg = "DMG +";
        } else if (item === "regenHP") {
            flashColor = "chartreuse";
            pickUpMsg = "HP +";
        }
        lsParts.forEach(part => part.setAttribute("fill", `${flashColor}`)); // Longsword flashes item color.
        if (pickUp) {
            pickUp.remove();
        }
        pickUp = document.createElementNS(svgNS, "text"); // Displays item effect.
        pickUp.setAttribute("x", `${x+19}`);
        pickUp.setAttribute("y", `${y-20}`);
        pickUp.setAttribute("font-family", "Arial");
        pickUp.setAttribute("fill", `${flashColor}`);
        pickUp.setAttribute("font-size", "15");
        pickUp.innerHTML = pickUpMsg;
        svg.appendChild(pickUp);
        setTimeout(() => {
            lsParts.forEach(part => part.setAttribute("fill", "lightgrey"));
            pickUp.remove();
        }, 500);
        return true;
    }
    return false;
}


/**
 * - Detects hits on enemies with longsword or longsword's missiles.
 * - Reduces hp of enemies and longsword if crafts collide.
 * - Reduces hp of enemies if they are struck by missiles.
 * - Colors of affected craft will flash to indicate hit.
 * 
 * @param {*} hitX 
 * @param {*} hitY 
 * @param {*} enemy 
 * @param {*} hitType 
 * @returns boolean
 */
export function hitDetection(hitX, hitY, enemy, hitType) {
    if (!(hitX && hitY)) {
        if (hitType === "collision") { enemy.impact = false; }
        return false; // Ensures if no collision is occuring enemy.impact is false
    }
    
    if (hitType === "collision" && enemy.impact) {
        return false; // Checks if collision just occured and prevents repeating
    }
    
    if (hitX && hitY) { // Fresh collision
        const lsParts = getLongswordParts();

        let eBody; // enemy body uses fill
        let eJets; // jets use stroke

        let sD; // stroke damage color
        let fD; // fill damage color
        let sC; // stroke color
        let fC; // fill color

        // Flashes banshee color change to indicate damage taken
        if (enemy.type === "banshee") {
            eBody = enemy.element.querySelectorAll("#middleBack, #middleFront");
            eJets = enemy.element.querySelectorAll("#leftJet, #rightJet");
            sD = "lightblue"; fD = "lightblue";
            sC = "indigo"; fC = "indigo";

        // Flashes phantom color change to indicate damage taken
        } else if (enemy.type === "phantom") {
            eBody = enemy.element.querySelectorAll("#body_horizontal_rear, #body_horizontal_front, #left_spike, #right_spike, #mid_spike, #body_left_rear, #body_right_rear, #body_left, #body_right, #body_horizontal_cover, #body_vertical");
            sD = "lightblue"; fD = "red";
            sC = "#702963"; fC = "#34132E";
        }
        

        // Reduces hp and flashes colors based on hitType
        if (hitType === "collision") {    
            longsword.hp-=10;
            hpStatus();
            lsParts.forEach(part => part.setAttribute("fill", "red"));
            enemy.impact = true;
            enemy.hp -= 25;
        } else if (hitType === "missileImpact") {
            enemy.hp -= longsword.missileDamage;
        }

        eBody.forEach(part => part.setAttribute("fill", fD));
        if (eJets) {
            eJets.forEach(part => part.setAttribute("stroke", sD));    
        }

        // Resets to normal colors after flash
        setTimeout(() => {
            lsParts.forEach(part => part.setAttribute("fill", "lightgrey"));
            eBody.forEach(part => part.setAttribute("fill", fC));    
            if (eJets) {
                eJets.forEach(part => part.setAttribute("stroke", sC));    
            }
        }, 100);
        return true;
    }
}

export function plasmaImpact() {
    
}