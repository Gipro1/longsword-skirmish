/**
 * - Covenant controller
 * - Spawns banshees and phantoms on regular intervals.
 * - Tracks takeDowns, passedThrough and enemyCount.
 * 
 * @author: Angelo Scala
 */


import { gameTime, x, y, takeDamage } from "./longsword.js";
import { randomXSpawn, ySpawn } from "./helpers.js";
import { game } from "./main.js";
import { plasmaImpact } from "./collisions.js";


const svgNS = "http://www.w3.org/2000/svg";
const svg = document.getElementById("mySVG");
const banshee = document.getElementById("banshee");

export let enemies = [];
export let passedThrough = 0;
let enemyCount = 0;

// EnemyType objects
export const enemyTypes = {
    banshee: {
        templateId: "banshee", 
        hp: 100,
        hitW: 55, hitH: 35, // hitbox
        takeDowns: 0,
        passedThrough: 0,
        update: update
    },
    phantom: {
        templateId: "phantom",
        hp: 1000, 
        hitW: 69, hitH: 75, // hitbox
        takeDowns: 0,
        passedThrough: 0,
        update: update
    }
}

/**
 * - Called from spawnLoop() embedded in spawner().
 * - Spawns enemyType, adds enemy to enemies array.
 * - Checks if enemy has travelled beyond canvas boundary or hp is below 0. 
 * 
 * @param {*} typeName 
 */
function spawnEnemy(typeName) {
    const cfg = enemyTypes[typeName];
    const template = document.getElementById(cfg.templateId);
    const startX = randomXSpawn();
    const startY = ySpawn;

    const enemyUnit = template.cloneNode(true);
    enemyUnit.id = `${typeName}_${enemyCount++}`;
    svg.appendChild(enemyUnit);

    const enemyObj ={
        type: typeName,
        x: startX, y: startY,
        hp: cfg.hp,
        hitW: cfg.hitW, hitH: cfg.hitH,
        element: enemyUnit,
        impact: false,
        firing: false,
        fireRate: null
    };
    enemies.push(enemyObj);

    const tick = setInterval(() => {
        cfg.update(enemyObj);
        enemyObj.element.setAttribute("transform", `translate(${enemyObj.x},${enemyObj.y})`);

        if (enemyObj.y > 540) {
            clearInterval(tick);
            removeEnemy(enemyObj, "passed");
        
        } else if (enemyObj.hp <= 0) {
            clearInterval(tick);
            removeEnemy(enemyObj, "killed");
        }
    }, 100);
}

/**
 * - Checks if enemy is firing. Clears firing.
 * - Removes enemy element, removes enemy from enemies array.
 * - Addes 1 to stat variables based on removal reason.
 * 
 * @param {*} enemyObj 
 * @param {*} reason 
 */
function removeEnemy(enemyObj, reason) {
    // Clears firing if firing.
    if (enemyObj.fireRate) {
        clearInterval(enemyObj.fireRate);
        enemyObj.fireRate = null;
    }
    enemyObj.element.remove();
    const i = enemies.indexOf(enemyObj);
    if (i !== -1) enemies.splice(i,1);
    if (reason === "passed") enemyTypes[enemyObj.type].passedThrough++;
    if (reason === "killed") enemyTypes[enemyObj.type].takeDowns++;
}

/**
 * - Determines enemy spawns.
 * - Calls spawnEnemy() on recursive function loop.
 * 
 */
let spawnTime = 6000;
let spawnTimeout;
let enemyType;
export function spawner() {
    let lastPhantom = 0;
    function spawnLoop() {
        if (!game) { return; }
    
        if (gameTime - lastPhantom >= 20) {
            enemyType = "phantom";
            lastPhantom = gameTime;
        } else {
            enemyType = "banshee";
        }

        spawnEnemy(enemyType);
        if (spawnTime > 500) {
            if (spawnTime > 4500) {   
                spawnTime -= 70;
            } else {
                spawnTime -= 140;
            }
        }
        
        spawnTimeout = setTimeout(spawnLoop, spawnTime);
    }
    spawnLoop();
}

/**
 * - Updates enemy crafts.
 * - Banshees move downward continuously.
 * - If Lonhsword crosses banshee's path, banshee starts shooting, calls blasters().
 * - Phantoms move down until it is within vertical range of longsword and starts shooting towards player, calls blasters().
 * 
 * @param {*} enemyObj 
 */
function update(enemyObj) {
    if (enemyObj.type === "banshee") {
        enemyObj.y += 3;

        const path = enemyObj.x <= x+50 && enemyObj.x >= x-30 && enemyObj.y <= y-50;
        if (path) {
            if (!enemyObj.firing) {
                enemyObj.firing = true;
                blasters(enemyObj);
                enemyObj.fireRate = setInterval(() => {
                    blasters(enemyObj);
                }, 500);
            }
        } else if (!path) {
            enemyObj.firing = false;
            if (enemyObj.fireRate) {
                clearInterval(enemyObj.fireRate);
                enemyObj.fireRate = null;
            } 
        }

    } else if (enemyObj.type === "phantom") {
        if (enemyObj.y < y-300) {
            enemyObj.y += 2;
            
            if (enemyObj.firing) { // stops firing while moving down
                enemyObj.firing = false;
                clearInterval(enemyObj.fireRate);
                enemyObj.fireRate = null;
            }
        } else {
            if (!enemyObj.firing) {
                enemyObj.firing = true;
                blasters(enemyObj);
                    
                enemyObj.fireRate = setInterval(() => {
                    blasters(enemyObj);
                }, 1000);
            }
        }   
    }
}

/**
 * - Called by update().
 * - Handles weapon firing for enemy crafts.
 * 
 * @param {*} enemyObj 
 */
function blasters(enemyObj) {
    if (enemyObj.type === "banshee") {
        const turret = enemyObj.element.querySelector("#middleFront");
        const turretBox = turret.getBBox(); // getBBox retrives enemyUnit coords within <g> tag
        
        const x1 = enemyObj.x + turretBox.x;
        const x2 = enemyObj.x + turretBox.x + turretBox.width;
        let plasmaY = enemyObj.y + turretBox.y + turretBox.height;
    
        // plasma SVGs
        let plasma1 = document.createElementNS(svgNS, "ellipse");
        plasma1.setAttribute("cx", x1);
        plasma1.setAttribute("cy", plasmaY);
        plasma1.setAttribute("r", "1");
        plasma1.setAttribute("rx", "1");
        plasma1.setAttribute("ry", "7");
        plasma1.setAttribute("fill", "lightblue");
        svg.appendChild(plasma1);
        
        let plasma2 = document.createElementNS(svgNS, "ellipse");
        plasma2.setAttribute("cx", x2);
        plasma2.setAttribute("cy", plasmaY);
        plasma2.setAttribute("r", "1");
        plasma2.setAttribute("rx", "1");
        plasma2.setAttribute("ry", "7");
        plasma2.setAttribute("fill", "lightblue");
        svg.appendChild(plasma2);
        let plasmaTravel;

        plasmaTravel = setInterval(()=>{
            plasmaY+=10;
            if (plasma1 || plasma2) {
                // Checks if plasma shots are not null. 
                if (plasma1) {    
                    plasma1.setAttribute("cy", plasmaY);
                    // Checks if plasma shots impact player or go below canvas.
                    if (plasmaImpact(plasma1, x1, plasmaY, x, y, enemyObj.type)) {
                        plasma1 = null;
                    }
                }
                if (plasma2) {  
                    plasma2.setAttribute("cy", plasmaY);
                    // Checks if plasma shots impact player or go below canvas.  
                    if (plasmaImpact(plasma2, x2, plasmaY, x, y, enemyObj.type)) {
                        plasma2 = null;
                    }
                }
            } else if (!plasma1 && !plasma2) {
                clearInterval(plasmaTravel);
            }
    
        }, 16);
    } else if (enemyObj.type === "phantom") {
        const cannon = enemyObj.element.querySelector("#body_vertical");
        const cannonBox = cannon.getBBox(); // getBBox retrives enemyUnit coords within <g> tag

        let plasmaX = enemyObj.x + cannonBox.x + cannonBox.width / 2;
        let plasmaY = enemyObj.y + cannonBox.y + cannonBox.height;
    
        // plasma SVG
        let plasmaCannon = document.createElementNS(svgNS, "ellipse");
        plasmaCannon.setAttribute("cx", plasmaX);
        plasmaCannon.setAttribute("cy", plasmaY);
        plasmaCannon.setAttribute("r", "2");
        plasmaCannon.setAttribute("rx", "2");
        plasmaCannon.setAttribute("ry", "2");
        plasmaCannon.setAttribute("stroke", "red");
        plasmaCannon.setAttribute("stroke-width", "2");
        plasmaCannon.setAttribute("fill", "yellow");
        svg.appendChild(plasmaCannon);
        let plasmaTravel;

        // player's direction
        const dx = x+35 - plasmaX;
        const dy = y+29 - plasmaY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        const speed = 3;
        const velocityX = (dx / dist) * speed;
        const velocityY = (dy / dist) * speed;

        plasmaTravel = setInterval(()=>{
            plasmaX += velocityX;
            plasmaY += velocityY;
            plasmaCannon.setAttribute("cx", plasmaX);
            plasmaCannon.setAttribute("cy", plasmaY);

            if (plasmaImpact(plasmaCannon, plasmaX, plasmaY, x, y, enemyObj.type)) {
                plasmaCannon = null;
            }
        }, 16);
    }
}

