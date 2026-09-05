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

const svgNS = "http://www.w3.org/2000/svg";

export let equippedWeapon = "missiles";

/**
 * - Called from main using up and down arrow keys. // not setup yet
 * 
 */
export function setWeapon() {
    equippedWeapon = weaponType;
}

/**
 * - Fires equippedWeapon.
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} tiltString 
 */
export function fireWeapon(x, y, tiltString) {
    if (equippedWeapon === "missiles") {
        missiles(x, y, tiltString);

    } else if (equippedWeapon === "quadMissiles") {
        quadMissiles(x, y, tiltString);
    }
}



/**
 * - Creates and fires two missiles upwards from longsword canons.
 * - If missiles travel above screen boundary they are removed.
 * - If missiles strike banshee, banshee takes damage, missile is removed.
 * 
 * @param {*} x - Longsword's x
 * @param {*} y - Longsword's y
 * @param {*} tiltString - Indicates rotated direction 
 */
function missiles(x, y, tiltString) {
    const canon = document.getElementById("leftCanon");

    // Coordinats for missileDuo group spawn
    let xDuo = x + parseFloat(canon.getAttribute("x"))+1.5;
    let yDuo = y + parseFloat(canon.getAttribute("y"))-5;
    
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

    // Missile objects
    let missileObj1 = {
        inPlay: true,
        missile1: null,
        xDuo,        // Missile coordinates.
        yDuo
    }
    let missileObj2 = {
        inPlay: true,
        missile2: null,
        xDuo,       // Missile coordinates. 
        yDuo
    }


    missileObj1.missile1 = document.createElementNS(svgNS, "ellipse");
    missileObj1.missile1.setAttribute("cx", `${missileObj1.xDuo}`);
    missileObj1.missile1.setAttribute("cy", `${missileObj1.yDuo}`);
    missileObj1.missile1.setAttribute("r", "1");
    missileObj1.missile1.setAttribute("rx", "1");
    missileObj1.missile1.setAttribute("ry", "10");
    missileObj1.missile1.setAttribute("fill", "orange");
    missileObj1.missile1.setAttribute("transform", `rotate(${missileTilt}, ${missileObj1.xDuo}, ${missileObj1.yDuo})`);
    svg.appendChild(missileObj1.missile1);

    missileObj2.missile2 = document.createElementNS(svgNS, "ellipse");
    missileObj2.missile2.setAttribute("cx", `${missileObj2.xDuo + 26}`);
    missileObj2.missile2.setAttribute("cy", `${missileObj2.yDuo}`);
    missileObj2.missile2.setAttribute("r", "1");
    missileObj2.missile2.setAttribute("rx", "1");
    missileObj2.missile2.setAttribute("ry", "10");
    missileObj2.missile2.setAttribute("fill", "orange");
    missileObj2.missile2.setAttribute("transform", `rotate(${missileTilt}, ${missileObj2.xDuo}, ${missileObj2.yDuo})`);
    svg.appendChild(missileObj2.missile2);
    let missileTick = 0; // Tracks time missiles exist.

    let missileTravel;

    // Checks for longsword tilt for every missileDuo fired.
    missileTravel = setInterval(()=>{ // Assigns missile directional speed.
        if (!angledLeft && !angledRight) {
            missileObj1.yDuo-=10;
            missileObj2.yDuo-=10;
        } else {
            if (angledLeft) {
                missileObj1.yDuo-=7;
                missileObj1.xDuo-=7;
                
                missileObj2.yDuo-=7;
                missileObj2.xDuo-=7;

            } else if (angledRight) {
                missileObj1.yDuo-=7;
                missileObj1.xDuo+=7;

                missileObj2.yDuo-=7;
                missileObj2.xDuo+=7;
            }
        }
        // Increments missile attributes.
        if (missileObj1.missile1) {
            missileObj1.missile1.setAttribute("transform", `rotate(${missileTilt}, ${missileObj1.xDuo}, ${missileObj1.yDuo})`);
            missileObj1.missile1.setAttribute("cx", `${missileObj1.xDuo}`);
            missileObj1.missile1.setAttribute("cy", `${missileObj1.yDuo}`);
        }
        if (missileObj2.missile2) {
            missileObj2.missile2.setAttribute("transform", `rotate(${missileTilt}, ${missileObj2.xDuo}, ${missileObj2.yDuo})`);
            missileObj2.missile2.setAttribute("cx", `${missileObj2.xDuo + 26}`);
            missileObj2.missile2.setAttribute("cy", `${missileObj2.yDuo}`);
        }
        missileTick++;

        // Tracks missile's yDuo against svg's y-axis.
        const svgY1 = yDuo + missileObj1.yDuo;
        const svgY2 = yDuo + missileObj2.yDuo; 

        // Boundary check stops interval if above viewport.
        if (svgY1 < 0 && svgY2 < 0) {
            if (missileObj1.missile1) {
                missileObj1.missile1.remove();
                missileObj1.missile1 = null;
            }
            if (missileObj2.missile2) {
                missileObj2.missile2.remove();
                missileObj2.missile2 = null;
            }
            clearInterval(missileTravel);
            return;
        } else if (svgY1 < 0) {
            missileObj1.missile1.remove();
            missileObj1.missile1 = null;
        } else if (svgY2 < 0) {
            missileObj2.missile2.remove();
            missileObj2.missile2 = null;
        }
        if (missileTick > 188) { // Removes missiles if they become frozen in view.
            if (missileObj1.missile1) {
                missileObj1.missile1.remove();
                missileObj1.missile1 = null;
            }
            if (missileObj2.missile2) {
                missileObj2.missile2.remove();
                missileObj2.missile2 = null;
            }
            clearInterval(missileTravel);
            return;
        }

        // Cycles through banshees banshees array
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];
            if (!enemy) { continue; }    
            
            // hitX and hitY make up enemy hitbox
            let hitX1 = (enemy.x < missileObj1.xDuo+2) && (enemy.x + enemy.hitW > missileObj1.xDuo+1);
            let hitY1 = (enemy.y+enemy.hitH > missileObj1.yDuo || enemy.y+enemy.hitH > missileObj1.yDuo) && (enemy.y < missileObj1.yDuo+10 || enemy.y < missileObj1.yDuo+10);
            
            let hitX2 = (enemy.x < missileObj2.xDuo+28) && (enemy.x + enemy.hitW > missileObj2.xDuo+27);
            let hitY2 = (enemy.y+enemy.hitH > missileObj2.yDuo || enemy.y+enemy.hitH > missileObj2.yDuo) && (enemy.y < missileObj2.yDuo+10 || enemy.y < missileObj2.yDuo+10);
            
            // Detects missile impacts on banshees
            if (!missileObj1.missile1 && !missileObj2.missile2) {
                clearInterval(missileTravel);
                return;
            }
            if (missileObj1.missile1 && hitDetection(hitX1, hitY1, enemy, "missileImpact")) {
                missileObj1.missile1.remove();
                missileObj1.missile1 = null;
            }
            if (missileObj2.missile2 && hitDetection(hitX2, hitY2, enemy, "missileImpact")) {
                missileObj2.missile2.remove();
                missileObj2.missile2 = null;
            }
        }
    }, 16);
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
export function quadMissiles(x, y, tiltString) {
    const canon = document.getElementById("leftCanon");

    // Coordinats for missiles in missileQuad group
    let xQuad = x + parseFloat(canon.getAttribute("x"))+1.5;
    let yQuad = y + parseFloat(canon.getAttribute("y"));
    
    // Checks for longsword tilt for every missileDuo fired.
    let angledLeft = false;
    let angledRight = false;
    let missileTilt = 0;

    // Determines missile angle upon firing.
    if (tiltString === "left") {
        angledLeft = true;
        xQuad -= 1;
        yQuad -= 14;
    } else if (tiltString === "right") {
        angledRight = true;
        xQuad -= 13;
        yQuad += 17;
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

    let missileQuad = document.createElementNS(svgNS, "g");
    missileQuad.setAttribute("transform", `translate(${xQuad}, ${yQuad}) rotate(${missileTilt}, 35, 29)`);
    svg.appendChild(missileQuad);

    // Individual missile coordinates.
    let xQuad1 = xQuad + 1;
    let yQuad1 = yQuad - 7;

    let xQuad2 = xQuad + 26;
    let yQuad2 = yQuad - 7;
    
    let xQuad3 = xQuad + 46;
    let yQuad3 = yQuad + 7;
    
    let xQuad4 = xQuad - 26;
    let yQuad4 = yQuad + 7;

    let missile1 = document.createElementNS(svgNS, "ellipse");
    missile1.setAttribute("cx", `${xQuad1}`);
    missile1.setAttribute("cy", `${yQuad1}`);
    missile1.setAttribute("r", "1");
    missile1.setAttribute("rx", "1");
    missile1.setAttribute("ry", "10");
    missile1.setAttribute("fill", "orange");
    missileQuad.appendChild(missile1);

    let missile2 = document.createElementNS(svgNS, "ellipse");
    missile2.setAttribute("cx", `${xQuad2}`);
    missile2.setAttribute("cy", `${yQuad2}`);
    missile2.setAttribute("r", "1");
    missile2.setAttribute("rx", "1");
    missile2.setAttribute("ry", "10");
    missile2.setAttribute("fill", "orange");
    missileQuad.appendChild(missile2);

    let missile3 = document.createElementNS(svgNS, "ellipse");
    missile3.setAttribute("cx", `${xQuad3}`);
    missile3.setAttribute("cy", `${yQuad3}`);
    missile3.setAttribute("r", "1");
    missile3.setAttribute("rx", "1");
    missile3.setAttribute("ry", "10");
    missile3.setAttribute("fill", "orange");
    missileQuad.appendChild(missile3);

    let missile4 = document.createElementNS(svgNS, "ellipse");
    missile4.setAttribute("cx", `${xQuad4}`);
    missile4.setAttribute("cy", `${yQuad4}`);
    missile4.setAttribute("r", "1");
    missile4.setAttribute("rx", "1");
    missile4.setAttribute("ry", "10");
    missile4.setAttribute("fill", "orange");
    missileQuad.appendChild(missile4);

    let missileTick = 0; // Tracks time missiles exist.

    let missileTravel;

    // Checks for longsword tilt for every missileDuo fired.
    missileTravel = setInterval(()=>{ // Assigns missile directional speed.
        if (!angledLeft && !angledRight) {
            yQuad1-=10;
            yQuad2-=10;
            yQuad3-=10;
            yQuad4-=10;
        } else {
            if (angledLeft) {
                xQuad1-=7;
                yQuad1-=7;

                xQuad2-=7;
                yQuad2-=7;
                
                xQuad3-=7;
                yQuad3-=7;
                
                xQuad4-=7;
                yQuad4-=7;
            } else if (angledRight) {
                xQuad1+=7;
                yQuad1-=7;
                
                xQuad2+=7;
                yQuad2-=7;
                
                xQuad3+=7;
                yQuad3-=7;
                
                xQuad4+=7;
                yQuad4-=7;
            }
        }
        missile1.setAttribute("transform", `translate(${xQuad1},${yQuad1})`);
        missile2.setAttribute("transform", `translate(${xQuad2},${yQuad2})`);
        missile3.setAttribute("transform", `translate(${xQuad3},${yQuad3})`);
        missile4.setAttribute("transform", `translate(${xQuad4},${yQuad4})`);
        missileTick++;

        // Boundary check stops interval if above viewport.
        if (yQuad < 0) {
            missile1.remove();
            missile2.remove();
            missile3.remove();
            missile4.remove();
            missileQuad.remove();
            clearInterval(missileTravel);
            return;
        } else if (missileTick > 188) { // Removes missiles if they become frozen in view.
            missile1.remove();
            missile2.remove();
            missile3.remove();
            missile4.remove();
            missileQuad.remove();
            clearInterval(missileTravel);
            return;
        }

        // Cycles through banshees banshees array
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];
            if (!enemy) { continue; }    
            
            // hitX and hitY make up enemy hitbox
            let hitX = (enemy.x < xQuad+2) && (enemy.x + enemy.hitW > xQuad+1);
            let hitY = (enemy.y+enemy.hitH > yQuad || enemy.y+enemy.hitH > yQuad) && (enemy.y < yQuad+10 || enemy.y < yDuo+10);
            
            // Detects missile impacts on banshees
            if (hitDetection(hitX, hitY, enemy, "missileImpact")) {
                clearInterval(missileTravel);
                missile1.remove();
                missile2.remove();
                missile3.remove();
                missile4.remove();
                missileQuad.remove();
                return;
            }
        }
    }, 16);
}
