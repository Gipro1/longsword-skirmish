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

export let equippedWeapon = "missileDuo";

export function setWeapon() {
    equippedWeapon = weaponType;
}

/**
 * - Creates and fires missiles upwards from longsword canons
 * - If missiles travel above screen boundary they are removed
 * - If missiles strike banshee, banshee takes damage, missile is removed
 * 
 */
export function missiles(x, y, leftTilt, rightTilt) {
    const canon = document.getElementById("leftCanon");

    // Coordinats for missileDuo group spawn
    let xDuo = x + parseFloat(canon.getAttribute("x"))+1.5;
    let yDuo = y + parseFloat(canon.getAttribute("y"));
    
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
    missileDuo.setAttribute("transform", `translate(${xDuo}, ${yDuo}) rotate(${missileTilt}, 35, 29)`);
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
        missileDuo.setAttribute("transform", `translate(${xDuo},${yDuo}) rotate(${missileTilt}, 35, 29)`);
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
