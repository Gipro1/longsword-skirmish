/**
 * - Controls collectible spawns and tracks collection.
 * - PowerUp multiplies missile damage when collected.
 * - Armament adds firing modes. // pending
 * - Fenris adds nuke. // pending
 * - TimeExtend adds 60 seconds to game's time limit. // pending
 * 
 * @author: Angelo Scala
 */

import { svg, x, y, leftTilt, rightTilt } from "./longsword.js";
import { enemies } from "./covenant.js";
import { hitDetection } from "./collisions.js";
import { displayWeapon } from "./hud.js";
import { weaponDropCount } from "./items.js";

const svgNS = "http://www.w3.org/2000/svg";


// Weapon selection.
let select = 0;
export let weapons = ["missiles"];
export let equippedWeapon = weapons[select];


/**
 * - Called from main using up and down arrow keys. // not setup yet
 * 
 */
export function setWeapon() {
    if (select === 0) {
        select = weapons.length-1;
    } else {
        select -= 1;
    }
    equippedWeapon = weapons[select];
    displayWeapon(equippedWeapon);
}


/**
 * - Adds collected weapons to weapons array.
 * 
 * @param {*} weapon 
 */
export function addWeapons(weapon) {
    weapons.push(weapon);
}


/**
 * - Fires equippedWeapon.
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} tiltString 
 */
export function fireWeapon(x, y, tiltString) {
    const cannon = document.getElementById("leftCannon");

    // Coordinats for missileDuo group spawn
    let xDuo = x + parseFloat(cannon.getAttribute("x"))+1.5;
    let yDuo = y + parseFloat(cannon.getAttribute("y"))-5;
    
    // Checks for longsword tilt for every missileDuo fired.
    let angledLeft = false;
    let angledRight = false;
    let missileTilt = 0;

    // Determines missile angle upon firing.
    if (leftTilt) {
        angledLeft = true;
        xDuo -= 19;
        yDuo += 15;
    } else if (rightTilt) {
        angledRight = true;
        xDuo += 29;
        yDuo -= 4;
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

    // Calls weapon to fire.
    if (equippedWeapon === "missiles") {
        missiles(xDuo, yDuo, missileTilt);

    } else if (equippedWeapon === "quadMissiles") {
        quadMissiles(xDuo, yDuo, missileTilt);
    }
}


/**
 * - Creates each missile and fires it.
 * - Missile is rotated based on missileTilt.
 * - Tracks missile, checks if missile goes beyond canvas boundary or impacts enemy.
 * 
 * @param {*} missileObj 
 * @param {*} missileTilt 
 */
function missileFire(missileObj, missileTilt) {    
    // Corrects offsets for missiles on angle.
    if (missileObj.id > 1) {
        if (missileTilt === -45) {
            if (missileObj.id === 2) {
                missileObj.yOffset = -17;
                missileObj.xOffset = 19;
            } 
            if (missileObj.id === 3 || missileObj.id === 4) {
                if (missileObj.id === 3) {
                    missileObj.yOffset = -20;
                    missileObj.xOffset = 34;
                }
                if (missileObj.id === 4) {
                    missileObj.yOffset = 19;
                    missileObj.xOffset = 4;
                }
            }
        } else if (missileTilt === 45) {
            if (missileObj.id === 2) {
                missileObj.yOffset = 17;
                missileObj.xOffset = 19;
            } 
            if (missileObj.id === 3 || missileObj.id === 4) {
                if (missileObj.id === 3) {
                    missileObj.yOffset = 36;
                    missileObj.xOffset = 23;
                }
                if (missileObj.id === 4) {
                    missileObj.yOffset = 1;
                    missileObj.xOffset = -19;
                }
            }
        }
    }

    // Uses global x and y coordinates for missile.
    const svgX = missileObj.xDuo + missileObj.xOffset;
    const svgY = missileObj.yDuo + missileObj.yOffset;

    const spreadAngle = (missileObj.spread ?? 0) * 8;
    const totalAngel = missileTilt + spreadAngle;

    missileObj.missile = document.createElementNS(svgNS, "ellipse");
    missileObj.missile.setAttribute("cx", `${svgX}`);
    missileObj.missile.setAttribute("cy", `${svgY}`);
    missileObj.missile.setAttribute("r", "1");
    missileObj.missile.setAttribute("rx", "1");
    missileObj.missile.setAttribute("ry", "10");
    missileObj.missile.setAttribute("fill", "orange");
    missileObj.missile.setAttribute("transform", `rotate(${totalAngel}, ${svgX}, ${svgY})`);
    svg.appendChild(missileObj.missile);

    let missileTick = 0; // Tracks time missiles exist.


    // Checks for longsword tilt for every missileDuo fired.
    let missileTravel = setInterval(()=>{ // Assigns missile directional speed.
        if (missileTilt === 0) {
            missileObj.yDuo-=10;
        } else {
            if (missileTilt === -45) {
                missileObj.yDuo-=7;
                missileObj.xDuo-=7;

                // If missileObj has spread, it is incremented or decremented based on missileTilt.
                missileObj.xOffset += (missileObj.spread ?? 0) * 0.35;
                missileObj.yOffset -= (missileObj.spread ?? 0) * 0.35;
                
                // Offsets are also incremented or decremented based on missileTilt.
                if (missileObj.id === 3) {
                    missileObj.xOffset += 0.25;
                    missileObj.yOffset -= 0.25;
                } else if (missileObj.id === 4) {
                    missileObj.xOffset -= 0.15;
                    missileObj.yOffset += 0.15;
                }

            } else if (missileTilt === 45) {
                missileObj.yDuo-=7;
                missileObj.xDuo+=7;

                // If missileObj has spread, it is incremented or decremented based on missileTilt.
                missileObj.xOffset += (missileObj.spread ?? 0) * 0.35;
                missileObj.yOffset += (missileObj.spread ?? 0) * 0.35;
                
                // Offsets are also incremented or decremented based on missileTilt.
                if (missileObj.id === 3) {
                    missileObj.xOffset += 0.15;
                    missileObj.yOffset += 0.15;
                    
                } else if (missileObj.id === 4) {
                    missileObj.xOffset -= 0.25;
                    missileObj.yOffset -= 0.25;
                }
            }
        }

        // Increments offsets values.
        missileObj.xOffset += missileObj.spread ?? 0;
        if (missileObj.spread > 0) {
            missileObj.yOffset += missileObj.spread ?? 0;
        } else {
            missileObj.yOffset -= missileObj.spread ?? 0;
        }

        // Current global coordinates for missile.
        const currentX = missileObj.xDuo + missileObj.xOffset;
        const currentY = missileObj.yDuo + missileObj.yOffset;

        // Increments missile attributes.
        if (missileObj.missile) {
            missileObj.missile.setAttribute("transform", `rotate(${totalAngel}, ${currentX}, ${currentY})`);
            missileObj.missile.setAttribute("cx", `${currentX}`);
            missileObj.missile.setAttribute("cy", `${currentY}`);
        }
        missileTick++;

        // Boundary check stops interval if above viewport.
        if (currentY < 0 || currentX < 0 || currentX > 1000 || missileTick > 188) { // missileTick check removes missiles if they become frozen in view.
            if (missileObj.missile) {
                missileObj.missile.remove();
                missileObj.missile = null;
            }
            clearInterval(missileTravel);
            return;
        }

        // Cycles through banshees banshees array
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];
            if (!enemy) { continue; }    
            
            // hitX and hitY make up enemy hitbox
            let hitX = (enemy.x < missileObj.xDuo + missileObj.xOffset +2) && (enemy.x + enemy.hitW > missileObj.xDuo + missileObj.xOffset +1);
            let hitY = (enemy.y+enemy.hitH > missileObj.yDuo + missileObj.yOffset) && (enemy.y < missileObj.yDuo + missileObj.yOffset +10);
            
            // Detects missile impacts on banshees
            if (!missileObj.missile) {
                clearInterval(missileTravel);
                return;
            }
            if (missileObj.missile && hitDetection(hitX, hitY, enemy, "missileImpact")) {
                missileObj.missile.remove();
                missileObj.missile = null;
            }
        }
    }, 16);
}



/**
 * - Creates and fires two missiles upwards from longsword cannons.
 * - If missiles travel above screen boundary they are removed.
 * - If missiles strike banshee, banshee takes damage, missile is removed.
 * 
 * @param {*} x - Longsword's x
 * @param {*} y - Longsword's y
 * @param {*} tiltString - Indicates rotated direction 
 */
function missiles(xDuo, yDuo, missileTilt) {
    // Missile objects
    let missileObj1 = {
        id: 1,
        missile: null,
        xDuo: xDuo,        // Missile coordinates.
        yDuo: yDuo,
        xOffset: 0,
        yOffset: 0
    }
    let missileObj2 = {
        id: 2,
        missile: null,
        xDuo: xDuo,       // Missile coordinates. 
        yDuo: yDuo,
        xOffset: 26,
        yOffset: 0
    }

    missileFire(missileObj1, missileTilt);
    missileFire(missileObj2, missileTilt);
}




/**
 * - Creates and fires volly of 4 missiles, spreading apart ahead of Longsword.
 * - If missiles travel beyond screen boundaries they are removed.
 * - If missiles strike banshee, banshee takes damage, missile is removed.
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} leftTilt 
 * @param {*} rightTilt 
 */
export function quadMissiles(xDuo, yDuo, missileTilt) {
    // quadMissiles fires four missiles in spread.
    let missileObj1 = {
        id: 1,
        missile: null,
        xDuo: xDuo,        // Missile coordinates.
        yDuo: yDuo,
        xOffset: 0,
        yOffset: 0,
        spread: -1
    }
    let missileObj2 = {
        id: 2,
        missile: null,
        xDuo: xDuo,       // Missile coordinates. 
        yDuo: yDuo,
        xOffset: 26,
        yOffset: 0,
        spread: 1
    }
    let missileObj3 = {
        id: 3,
        missile: null,
        xDuo: xDuo,        // Missile coordinates.
        yDuo: yDuo,
        xOffset: 41,
        yOffset: 10,
        spread: 2.5
    }
    let missileObj4 = {
        id: 4,
        missile: null,
        xDuo: xDuo,       // Missile coordinates. 
        yDuo: yDuo,
        xOffset: -16,
        yOffset: 10,
        spread: -2.5
    }

    // Calls missileFire for each cannon.
    missileFire(missileObj1, missileTilt);
    missileFire(missileObj2, missileTilt);
    missileFire(missileObj3, missileTilt);
    missileFire(missileObj4, missileTilt);
}
