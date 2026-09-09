/**
 * - Controls collectible spawns and tracks collection.
 * - PowerUp multiplies missile damage when collected.
 * - RegenHP restores longsword hp.
 * - Armament adds firing modes. // pending
 * - Fenris adds nuke. // pending
 * - TimeExtend adds 60 seconds to game's time limit. // pending
 * 
 * @author: Angelo Scala
 */


import { setWeaponPick } from "./main.js";
import { randomXSpawn, ySpawn } from "./helpers.js";
import { svg, x, y, stats } from "./longsword.js";
import { collectItem } from "./collisions.js";
import { addWeapons } from "./weapons.js";

const svgNS = "http://www.w3.org/2000/svg";

export let powerUpCount = 0;
export let regenHPCount = 0;
export let weaponDropCount = 0;


/**
 * - 
 * 
 * @param {*} itemType 
 * @param {*} opperation 
 * @param {*} increment 
 */
function itemDrop(itemType, opperation, increment) {
    let yDrift;
    let drift;
    let item = document.createElementNS(svgNS, "circle");
    let nodeX = randomXSpawn();
    
    let itemA;
    let itemB;

    let color;
    let animClass;

    if (itemType === "powerUp") {
        color = "yellow";
        animClass = "flashing";
    } else if (itemType === "regenHP") {
        color = "chartreuse";
        animClass = "blinking";
    } else if (itemType === "weaponDrop") {
        color = "orange";
        animClass = "shining";
    }
    item.setAttribute("cx", `${nodeX}`);
    item.setAttribute("cy", `${ySpawn}`);
    item.setAttribute("r", "5");
    item.setAttribute("fill", `${color}`);
    svg.appendChild(item);
    item.classList.add(`${animClass}`);

    yDrift = ySpawn;
    if (drift) { clearInterval(drift); }
    drift = setInterval(()=>{
        item.setAttribute("cy", yDrift);
        yDrift++;
        if (collectItem(nodeX, yDrift, x, y, `${itemType}`)) {
            opperation();
            item.remove();
            clearInterval(drift);
        }
        if (yDrift > 550) {
            item.remove();
            clearInterval(drift);
        }
    }, 16);
}


/**
 * - Creates powerUp.
 * - Flashes yellow.
 * - Travels down screen until it passes lower boundary or is collected.
 * - Loop recreates powerUp on interval.
 * - Multiplies missile damage by 3.
 * 
 */
export function powerUp() {
    let powerUpSpawner = setInterval(()=>{
        itemDrop("powerUp", () => { stats.missileDamage *= 3; powerUpCount++; });
    }, 30000);
}



/**
 * - Creates regenHP.
 * - Flashes green.
 * - Travels down screen until it passes lower boundary or is collected.
 * - Loop recreates regenHP on interval.
 * - Regenerates and adds to longsword hp.
 * 
 */
export function regenHP() {
    let regenSpawner = setInterval(()=>{
        itemDrop("regenHP", () => { stats.hp += 50; regenHPCount++; });
    }, 60000);
}


let newWeapons = ["quadMissiles"];
/**
 * - Creates Fenris nuke.
 * - Pulses red.
 * - Travels down screen until it passes lower boundary or is collected.
 * - Loop recreates Fenris on interval.
 * 
 */
export function weaponDrop() {
    let nodeSpawner = setTimeout(()=>{
        itemDrop("weaponDrop", () => { 
            addWeapons(newWeapons[0]); 
            weaponDropCount++; 
            setWeaponPick(true); 
            flashSwitchKey(); });
    }, 170000);
}


/**
 * - If weaponDrop is collected, flashSwitchKey will flash ArrowDown key
 * instructing user how to switch weapons.
 * 
 */
function flashSwitchKey() {
    let flashes = 0;

    let flashGroup = document.createElementNS(svgNS, "g");
    svg.appendChild(flashGroup);

    // Down arrow
    let switching = document.createElementNS(svgNS, "text");
    switching.setAttribute("x", "715");
    switching.setAttribute("y", "266");
    switching.setAttribute("font-family", "Arial");
    switching.setAttribute("fill", "lightblue");
    switching.setAttribute("font-size", "20");
    switching.innerHTML = "Switch Weapons";
    flashGroup.appendChild(switching);
    
    let downArrowKey = document.createElementNS(svgNS, "rect");
    downArrowKey.setAttribute("x", "765");
    downArrowKey.setAttribute("y", "295");
    downArrowKey.setAttribute("width", "50");
    downArrowKey.setAttribute("height", "50");
    downArrowKey.setAttribute("rx", "10");
    downArrowKey.setAttribute("ry", "10");
    downArrowKey.setAttribute("stroke", "lightblue");
    downArrowKey.setAttribute("stroke-width", "2");
    flashGroup.appendChild(downArrowKey);

    let downArrow = document.createElementNS(svgNS, "polygon");
    downArrow.setAttribute("points", "777,320 772,312 777,312 777,302 777,312 782,312 777,320");
    downArrow.setAttribute("stroke", "lightblue");
    downArrow.setAttribute("fill", "lightblue");
    downArrow.setAttribute("stroke-width", "2");
    flashGroup.appendChild(downArrow);

    let flashing = setInterval(()=>{
        flashGroup.style.display = "none";
        setTimeout(()=>{
            flashGroup.style.display = "";
        }, 200);
    
        flashes++;

        if (flashes >= 5) {
            clearInterval(flashing);
            flashGroup.remove();
        }
    }, 600);
}