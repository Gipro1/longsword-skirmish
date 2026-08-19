/*
@author: Angelo Scala
I made this.
*/


let svgNS = "http://www.w3.org/2000/svg";
let svg = document.getElementById("mySVG");
let btn = document.getElementById("btn");
let controls = document.getElementById("controls");
let gameTime = 0.0; // Tracks time spent playing

let gameTimer; // Timing interval


// Longsword
let rocket = document.getElementById("rocket");
let flameLeft = document.getElementById("flameLeft");
let flameRight = document.getElementById("flameRight");
let hp = 100;
let missileDamage = 10;
let takeDowns = 0
let passedThrough = 0;

// Banshee
let banshee = document.getElementById("banshee");

btn.addEventListener("click", startGame);
let game = false;
let gameState;
let clock;
let countDown;
/**
 * - Starts countdown which triggers game to start.
 * 
 */
function startGame() {
    if (!game) {
        game = true;
        let loading;
        let dots = "";
        setTimeout(()=>{
            clearInterval(loading);
            setTimeout(()=>{ btn.innerHTML = "Pause"; }, 1000);
        }, 5000);
        loading = setInterval(()=>{
            if (dots === "...") {
                dots = ".";
            } else {
                dots += ".";
            }
            btn.innerHTML = "Starting" + dots;
        },800);
        let timer = 5;
        if (clock) {
            clock.remove();
        }
        if (countDown) {
            clearInterval(countDown);
        }
        clock = document.createElementNS(svgNS, "text");
        clock.setAttribute("x", "488");
        clock.setAttribute("y", "200");
        clock.setAttribute("font-family", "Arial");
        clock.setAttribute("fill", "white");
        clock.setAttribute("font-size", "50");
        svg.appendChild(clock);
        clock.innerHTML = timer;
        countDown = setInterval(()=>{
            if (timer == 0) {
                clock.remove();
                intro();
                clearInterval(countDown);
                gameState = setInterval(controller, 16);
            }
            timer--;
            clock.innerHTML = timer;
        },1000);
    } else {
        pauseGame(e);
    }
}

/**
 * - Not made yet
 * 
 */
function pauseGame(e) {

}

// default position
let x = 465;
let y = 430;
let speed = 10;
/**
 * - Longsword engines burn hotter
 * - Longsword drifts upwards for 2 seconds
 * - Banshees begin spawning
 * - gameTime starts ticking
 * - powerUp function called
 * 
 */
function intro() {
    flameLeft.setAttribute("points", "19,38,21,50,23,38");
    flameRight.setAttribute("points", "47,38,49,50,51,38");
    let startUp = setInterval(()=>{
        y-=2;
        rocket.setAttribute("transform", `translate(${x},${y})`);
    },50);
    setTimeout(()=>{
        clearInterval(startUp)

        spawner();
        gameTimer = setInterval(()=>{
            gameTime+=0.01;
        },10);
        
        powerUp();
    },2000);
}

// Directional booleans
let up = false;
let down = false;
let left = false;
let right = false;

// Event Listener takes keydown inputs for directional booleans
document.addEventListener("keyup", (e) => {
    if (["ArrowUp", "w", "ArrowDown", "s", "ArrowLeft", "a", "ArrowRight", "d"].includes(e.key)) {
        e.preventDefault();
    }
    if (e.key === "ArrowUp" || e.key === "w") { up = false; }
    if (e.key === "ArrowDown" || e.key === "s") { down = false; }
    if (e.key === "ArrowLeft" || e.key === "a") { left = false; }
    if (e.key === "ArrowRight" || e.key === "d") { right = false; }
});

// Event Listener takes keyup inputs for directional booleans
document.addEventListener("keydown", (e) => {
    if (["ArrowUp", "w", "ArrowDown", "s", "ArrowLeft", "a", "ArrowRight", "d"].includes(e.key)) {
        e.preventDefault();
    }
    if (e.key === "ArrowUp" || e.key === "w") { up = true; }
    if (e.key === "ArrowDown" || e.key === "s") { down = true; }
    if (e.key === "ArrowLeft" || e.key === "a") { left = true; }
    if (e.key === "ArrowRight" || e.key === "d") { right = true; }
});

/**
 * - If game is active, increments or decrements x and y based on directional booleans
 * 
 */
function controller() {
    if (!game) {
        return 
    } else {
        if (up) { 
            if (y < +7) {
                y = +7;
            }
            y -= speed; 
        }
        if (down) { 
            if (y > 450) {
                y = 450;
            }
            y += speed; 
        }
        if (left) { 
            if (x < 0) {
                x = 0;
            }
            x -= speed; 
        }
        if (right) { 
            if ( x > 930) {
                x = 930;
            }
            x += speed; 
        }
        rocket.setAttribute("transform", `translate(${x},${y})`);
    }
}

function randomXSpawn() {
    return (Math.random() * 940)+5;
}
const ySpawn = -50;

let banshees = [];
let bansheeCount = 0;
/**
 * - Clones original banshee svg group with randomX argument 
 * 
 */
function bansheeSpawn(randomX,ySpawn) {
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
        collision();
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
function spawner() {
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

/**
 * - If player hp is drained to 0, game over screen is generated
 * - Displays "Game Over"
 * - Displays total game time
 * - Displays banshee takedowns
 * - Displays banshees missed
 * 
 */
function hpStatus() {
    if (hp <= 0) {
        hp = 0;
        clearInterval(gameTimer);
        rocket.remove();
        let totalTakeDowns = takeDowns;
        failStateStats = document.createElementNS(svgNS, "g");
        svg.appendChild(failStateStats);

        gameOver = document.createElementNS(svgNS, "text");
        gameOver.setAttribute("x", "370");
        gameOver.setAttribute("y", "200");
        gameOver.setAttribute("font-family", "Arial");
        gameOver.setAttribute("fill", "white");
        gameOver.setAttribute("font-size", "50");
        failStateStats.appendChild(gameOver);
        gameOver.innerHTML = "Game Over";

        timeStat = document.createElementNS(svgNS, "text");
        timeStat.setAttribute("x", "450");
        timeStat.setAttribute("y", "250");
        timeStat.setAttribute("font-family", "Arial");
        timeStat.setAttribute("fill", "white");
        timeStat.setAttribute("font-size", "20");
        failStateStats.appendChild(timeStat);
        timeStat.innerHTML = "Time: " + gameTime.toFixed(2);
        
        takeDownStat = document.createElementNS(svgNS, "text");
        takeDownStat.setAttribute("x", "400");
        takeDownStat.setAttribute("y", "280");
        takeDownStat.setAttribute("font-family", "Arial");
        takeDownStat.setAttribute("fill", "white");
        takeDownStat.setAttribute("font-size", "20");
        failStateStats.appendChild(takeDownStat);
        takeDownStat.innerHTML = "Banshee Takedowns: " + totalTakeDowns;
        
        missedStat = document.createElementNS(svgNS, "text");
        missedStat.setAttribute("x", "410");
        missedStat.setAttribute("y", "310");
        missedStat.setAttribute("font-family", "Arial");
        missedStat.setAttribute("fill", "white");
        missedStat.setAttribute("font-size", "20");
        failStateStats.appendChild(missedStat);
        missedStat.innerHTML = "Banshees missed: " + passedThrough;
    }
}

/**
 * - Tracks player coordinates 
 * - Checks if they intercept banshee coordinates from banshees array
 * - Converts both player and collided banshee colors
 * - Subtracts HP from both
 * 
 */
function collision() {
    const lsParts = svg.querySelectorAll("#nose, #trunkLeft, #trunkRight, #leftWing, #rightWing, #leftEngine, #rightEngine, #tail");

    banshees.forEach((banshee) => {
        let hitX = (banshee.x < x + 70) && (banshee.x + 55 > x);
        let hitY = (banshee.y < y + 65) && (banshee.y + 35 > y);
        
        if (hitX && hitY) {
            if (!banshee.impact) {
                banshee.impact = true;
                const bBody = banshee.element.querySelectorAll("#middleBack, #middleFront");
                const bJets = banshee.element.querySelectorAll("#leftJet, #rightJet");
        
                hp-=10;
                hpStatus();
                banshee.hp -= 25;

                lsParts.forEach(part => part.setAttribute("fill", "red"));
                bBody.forEach(part => part.setAttribute("fill", "lightblue"));
                bJets.forEach(part => part.setAttribute("stroke", "lightblue"));    
                
                setTimeout(() => {
                    lsParts.forEach(part => part.setAttribute("fill", "lightgrey"));
                    bBody.forEach(part => part.setAttribute("fill", "indigo"));
                    bJets.forEach(part => part.setAttribute("stroke", "indigo"));
                }, 100);
            }
            
        } else {
            banshee.impact = false;
        }
    });
}

const leftCanon = document.getElementById("leftCanon");
const rightCanon = document.getElementById("rightCanon");
/**
 * - Creates and fires missiles upwards from longsword canons
 * - If missiles travel above screen boundary they are removed
 * - If missiles strike banshee, banshee takes damage, missile is removed
 * 
 */
function missiles() {
    let x1 = x + parseFloat(leftCanon.getAttribute("x"))+1.5;
    let y1 = y + parseFloat(leftCanon.getAttribute("y"))-10;
    
    let x2 = x + parseFloat(rightCanon.getAttribute("x"))+1.5;
    let y2 = y + parseFloat(rightCanon.getAttribute("y"))-10;

    let missile1 = document.createElementNS(svgNS, "ellipse");
    missile1.setAttribute("cx", `${x1}`);
    missile1.setAttribute("cy", `${y1}`);
    missile1.setAttribute("r", "1");
    missile1.setAttribute("rx", "1");
    missile1.setAttribute("ry", "10");
    missile1.setAttribute("fill", "orange");
    svg.appendChild(missile1);

    let missile2 = document.createElementNS(svgNS, "ellipse");
    missile2.setAttribute("cx", `${x2}`);
    missile2.setAttribute("cy", `${y2}`);
    missile2.setAttribute("r", "1");
    missile2.setAttribute("rx", "1");
    missile2.setAttribute("ry", "10");
    missile2.setAttribute("fill", "orange");
    svg.appendChild(missile2);
    let missileTravel;

    missileTravel = setInterval(()=>{
        y1-=10;
        y2-=10;
        missile1.setAttribute("cy", `${y1}`);
        missile2.setAttribute("cy", `${y2}`);

        // boundary check stops interval if above viewport
        if (y1 < 0 || y2 < 0) {
            missile1.remove();
            missile2.remove();
            clearInterval(missileTravel);
            return;
        }

        // Cycles through banshees banshees array
        for (let i = 0; i < banshees.length; i++) {
            let target = banshees[i];
            if (!target) { continue; }    
            let hitX = (target.x < x2+2) && (target.x + 55 > x1+1);
            let hitY = (target.y+35 > y1 || target.y+35 > y2) && (target.y < y1+10 || target.y < y2+10);
            
            // Detects missile impacts on banshees
            if (hitX && hitY) {
                // Flashes banshee color change to indicate damage taken
                const bBody = target.element.querySelectorAll("#middleBack, #middleFront");
                const bJets = target.element.querySelectorAll("#leftJet, #rightJet");

                bBody.forEach(part => part.setAttribute("fill", "lightblue"));
                bJets.forEach(part => part.setAttribute("stroke", "lightblue"));    
                
                setTimeout(() => {
                    bBody.forEach(part => part.setAttribute("fill", "indigo"));
                    bJets.forEach(part => part.setAttribute("stroke", "indigo"));
                }, 50);
                target.hp -= missileDamage;
                clearInterval(missileTravel);
                missile1.remove();
                missile2.remove();
                return;
            }
        }
    }, 16);
}
// Fires missiles
document.addEventListener("keydown", (e)=>{
    if (e.key === " ") {
        e.preventDefault();
        missiles();
    }
});

/**
 * - Creates power up node
 * - Node travels down screen until it passes lower boundary
 * - Loop recreates node on interval
 * 
 */
function powerUp() {

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
            if (collectPower(nodeX, yDrift)) {
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


/**
 * - 
 * 
 */
function collectPower(nodeX, yDrift) {
    let pickUpX = ( nodeX < x + 70) && (nodeX + 10 > x);
    let pickUpY = (yDrift < y + 65) && (yDrift + 10 > y);

    if (pickUpX && pickUpY) {
        missileDamage *= 3;
        return true;
    }
    return false;
}