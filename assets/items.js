/**
 * - Controls collectible spawns and tracks collection.
 * - PowerUp multiplies missile damage when collected.
 * - Armament adds firing modes. // pending
 * - Fenris adds nuke. // pending
 * - TimeExtend adds 60 seconds to game's time limit. // pending
 * 
 * @author: Angelo Scala
 */


import { randomXSpawn, ySpawn } from "./helpers.js";
import { svg, x, y, stats } from "./longsword.js";
import { collectPower } from "./collisions.js";

const svgNS = "http://www.w3.org/2000/svg";

export let powerUpCount = 0;


/**
 * - Creates powerUp.
 * - Flashes yellow.
 * - Travels down screen until it passes lower boundary or is collected.
 * - Loop recreates powerUp on interval.
 * - Multiplies missile damage by 3.
 * 
 */
export function powerUp() {

    let yDrift;
    let drift;
    let powerUpSpawner = setInterval(()=>{
        let powerNode = document.createElementNS(svgNS, "circle");
        let nodeX = randomXSpawn();

        powerNode.setAttribute("cx", `${nodeX}`);
        powerNode.setAttribute("cy", ySpawn);
        powerNode.setAttribute("r", "5");
        powerNode.setAttribute("fill", "yellow");
        svg.appendChild(powerNode);
        powerNode.classList.add("flashing");

        yDrift = 0;
        if (drift) { clearInterval(drift); }
        drift = setInterval(()=>{
            powerNode.setAttribute("cy", yDrift);
            yDrift++;
            if (collectPower(nodeX, yDrift, x, y)) {
                stats.missileDamage *= 3;
                powerUpCount++;
                powerNode.remove();
                clearInterval(drift);
            }
            if (yDrift > 550) {
                powerNode.remove();
                clearInterval(drift);
            }
        }, 16);
    }, 30000);
}


/**
 * - Creates Fenris nuke.
 * - Pulses red.
 * - Travels down screen until it passes lower boundary or is collected.
 * - Loop recreates Fenris on interval.
 * 
 */
export function fenrisNuke() {

    let yDrift;
    let drift;
    let nodeSpawner = setInterval(()=>{
        let fenrisNode = document.createElementNS(svgNS, "circle");
        let nodeX = randomXSpawn();

        fenrisNode.setAttribute("cx", `${nodeX}`);
        fenrisNode.setAttribute("cy", ySpawn);
        fenrisNode.setAttribute("r", "2");
        fenrisNode.setAttribute("fill", "red");
        svg.appendChild(fenrisNode);
        fenrisNode.classList.add("flashing");

        yDrift = 0;
        if (drift) { clearInterval(drift); }
        drift = setInterval(()=>{
            fenrisNode.setAttribute("cy", yDrift);
            yDrift++;
            if (collectPower(nodeX, yDrift, x, y)) {
                
                fenrisNode.remove();
                clearInterval(drift);
            }
            if (yDrift > 550) {
                fenrisNode.remove();
                clearInterval(drift);
            }
        }, 16);
    }, 10000);
}
