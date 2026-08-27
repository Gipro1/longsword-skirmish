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


const svgNS = "http://www.w3.org/2000/svg";
const svg = document.getElementById("mySVG");
const banshee = document.getElementById("banshee");

export let enemies = [];
export let takeDowns = 0;
export let passedThrough = 0;
let enemyCount = 0;

const enemyTypes = {
    banshee: {
        templateId: "banshee", 
        hp: 100,
        hitW: 55, hitH: 35,
        update: update
    },
    phantom: {
        templateId: "phantom",
        hp: 1000, 
        hitW: 69, hitH: 75,
        update: update
    }
}

/**
 * - 
 * 
 * @param {*} typeName 
 */
export function spawnEnemy(typeName) {
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
 * - 
 * 
 * @param {*} enemyObj 
 * @param {*} reason 
 */
function removeEnemy(enemyObj, reason) {
    enemyObj.element.remove();
    const i = enemies.indexOf(enemyObj);
    if (i !== -1) enemies.splice(i,1);
    if (reason === "passed") passedThrough++;
    if (reason === "killed") takeDowns++;
}

/**
 * - Temporarily, for the sake of making sure this shit works, enemies can start spawning at the beginning
 * 
 */
let spawnTime = 4000;
let spawnTimeout;
let enemyType;
export function spawner() {
    function spawnLoop() {
        if (!game) { return; }
    
        if (parseInt(gameTime) % 5 == 0) {
            enemyType = "phantom";
        } else {
            enemyType = "banshee";
        }

        spawnEnemy(enemyType);
        if (spawnTime > 800) {
            spawnTime -= 100;
        }
        
        spawnTimeout = setTimeout(spawnLoop, spawnTime);
    }
    spawnLoop();
}

/**
 * -
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
 * - 
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
            plasma1.setAttribute("cy", plasmaY);
            plasma2.setAttribute("cy", plasmaY);
      
            const hitX1 = (x1 >= x && x1 <= x + 70);
            const hitX2 = (x2 >= x && x2 <= x + 70);
            const hitY = (plasmaY >= y - 7 && plasmaY <= y +65);

            // boundary check stops interval if above viewport
            if (plasmaY > 550) {
                plasma1.remove();
                plasma2.remove();
                clearInterval(plasmaTravel);
            } else if (hitX1 && hitX2 && hitY) {
                plasma1.remove();
                plasma2.remove();
                clearInterval(plasmaTravel);
                takeDamage(10);
            }
        }, 16);
    } else if (enemyObj.type === "phantom") {
        const cannon = enemyObj.element.querySelector("#body_vertical");
        const cannonBox = cannon.getBBox(); // getBBox retrives enemyUnit coords within <g> tag

        let plasmaX = enemyObj.x + cannonBox.x + cannonBox.width / 2;
        let plasmaY = enemyObj.y + cannonBox.y + cannonBox.height;
    
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

            // boundary check stops interval if above viewport
            if (plasmaY > 550 || plasmaX > 1000 || plasmaX < 0) {
                plasmaCannon.remove();
                clearInterval(plasmaTravel);
            } /*else if (hit) {
                plasmaCannon.remove();
                clearInterval(plasmaTravel);
                takeDamage(enemyObj.type, 20);
            }*/
        }, 16);
    }
}

