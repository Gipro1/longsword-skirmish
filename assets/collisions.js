/**
 * - 
 * 
 * @author: Angelo Scala
 */


import { svg, stats as longsword, hpStatus } from "./longsword.js";
import { enemies, spawner, takeDowns, passedThrough } from "./covenant.js";
import { powerUpCount } from "./items.js";

/**
 * - Handles powerUp collection.
 * 
 * @param {*} nodeX 
 * @param {*} yDrift 
 * @param {*} x - longsword x
 * @param {*} y - longsword y
 * @returns boolean
 */
export function collectPower(nodeX, yDrift, x, y) {
    let pickUpX = ( nodeX < x + 70) && (nodeX + 10 > x);
    let pickUpY = (yDrift < y + 65) && (yDrift + 10 > y);

    if (pickUpX && pickUpY) {
        //powerUpCount++;
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
        const lsParts = svg.querySelectorAll("#nose, #trunkLeft, #trunkRight, #leftWing, #rightWing, #leftEngine, #rightEngine, #tail");
        
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