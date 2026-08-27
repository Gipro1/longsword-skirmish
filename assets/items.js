/**
 * - Controls powerUp node spawns
 * - Multiplies missile damage when collected
 * 
 * @author: Angelo Scala
 */


import { randomXSpawn, ySpawn } from "./helpers.js";
import { svg, x, y, stats } from "./longsword.js";
import { collectPower } from "./collisions.js";

const svgNS = "http://www.w3.org/2000/svg";

export let powerUpCount = 0;

/**
 * - Creates power up node
 * - Node travels down screen until it passes lower boundary
 * - Loop recreates node on interval
 * 
 */
export function powerUp() {

    let yDrift;
    let drift;
    let powerNodeSpawner = setInterval(()=>{
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
                powerNode.remove();
                clearInterval(drift);
            }
            if (yDrift > 550) {
                powerNode.remove();
                clearInterval(drift);
            }
        }, 16);
    }, 20000);
}
