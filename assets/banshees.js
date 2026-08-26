/**
 * - 
 * 
 * @author: Angelo Scala
 */


import { randomXSpawn, ySpawn } from "./helpers.js";
import { game } from "./main.js";

const svg = document.getElementById("mySVG");
const banshee = document.getElementById("banshee");

export let banshees = [];
export let takeDowns = 0;
export let passedThrough = 0;

export let bansheeCount = 0;
/**
 * - Clones original banshee svg group with randomX argument 
 * 
 */
function bansheeSpawn(randomXSpawn,ySpawn) {
    const newBanshee = banshee.cloneNode(true);
    newBanshee.id = "banshee_" + bansheeCount;
    bansheeCount++;
    svg.appendChild(newBanshee);
    return newBanshee;
}

/**
 * - Spawns banshees into game
 * - New banshees added to banshees array
 * - Banshees travel downwards and dissapear when off screen or if hp is drained to 0
 * - Banshees destroyed or passed boundary are removed from banshees array
 * 
 */
function bansheeAction() {
    let bansheeX = randomXSpawn();
    let bansheeY = ySpawn;
    let b = bansheeSpawn(bansheeX, bansheeY);
    let bansheeXY = {x: bansheeX, y: bansheeY, index: bansheeCount, element: b, hp: 100, impact: false};
    banshees.push(bansheeXY);
    let bansheeApproach = setInterval(()=>{
        bansheeY += 3;
        b.setAttribute("transform", `translate(${bansheeX},${bansheeY})`);
        bansheeXY.y = bansheeY;
        if (bansheeY > 540) { // This block checks if banshee is passed viewport boundary
            clearInterval(bansheeApproach);
            b.remove();
            for (let i = 0; i < banshees.length; i++) {
                if (banshees[i].element === b) {
                    banshees.splice(i,1);
                    passedThrough++;
                    break;
                }
            }
        }
        if (bansheeXY.hp <= 0) { // This block checks if banshee hp is 0
            clearInterval(bansheeApproach);
            b.remove();
            for (let i = 0; i < banshees.length; i++) {
                if (banshees[i].element === b) {
                    banshees.splice(i,1);
                    takeDowns++;
                    break;
                }
            }
        }
    },100);
}

/**
 * - Calls bansheeAction which deploys banshees
 * - Starts recurring loop 
 * 
 */
let spawnTime = 4000;
let spawnTimeout;
export function spawner() {
    function spawnLoop() {
        if (!game) { return; }
        
        bansheeAction();
        
        if (spawnTime > 800) {
            spawnTime -= 100;
        }
        
        spawnTimeout = setTimeout(spawnLoop, spawnTime);
    }
    spawnLoop();
}
