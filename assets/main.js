/**
 * - Main hold eventListeners for keyboard input to move and shoot.
 * 
 * @author: Angelo Scala
 */


import { startGame, setDirection, shiftCheck, setTilt, x, y, tiltString } from "./longsword.js";
import { missiles } from "./weapons.js";
import { splashScreen } from "./splasn&end.js";

export const btn = document.getElementById("btn");

// Global game state
export let game = false;
export function setGame(state) {
    game = state;
}

btn.addEventListener("click", (e) => startGame(e));
window.addEventListener("load", splashScreen);

// Directional controls
const controlKeys = ["w", "W", "s", "S", "a", "A", "d", "D"];


// Event Listener takes keydown inputs for directional booleans
document.addEventListener("keyup", (e) => {
    if (controlKeys.includes(e.key)) { // checks controlKeys list for e.key
        e.preventDefault();
        setDirection(e.key, false);
    }
});

// Event Listener takes keyup inputs for directional booleans
document.addEventListener("keydown", (e) => {
    if (!game) { return; }
    if (controlKeys.includes(e.key)) { // checks controlKeys list for e.key
        e.preventDefault();
        setDirection(e.key, true);
    }
});


let firing = false;
let firingInterval = null;

// Event Listeners for firing missiles
document.addEventListener("keyup", (e)=>{
    if (e.key === " ") {
        e.preventDefault();
        firing = false;
        clearInterval(firingInterval);
        firingInterval = null;
    }
}); 

document.addEventListener("keydown", (e)=>{
    if (!game) { return; }
    if (e.key === " ") {
        e.preventDefault();
        if (!firing) {
            firing = true;
            missiles(x, y, tiltString);
            firingInterval = setInterval(() => {
                missiles(x, y, tiltString);
            }, 200);
        }
    }
});


// Event Listeners for shift key
/*
document.addEventListener("keyup", (e)=>{
    if (e.key === "Shift") {
        e.preventDefault();
        shiftCheck(false);
    }
});

document.addEventListener("keydown", (e)=>{
    if (!game) {return;}
    if (e.key === "Shift") {
        e.preventDefault();
        shiftCheck(true);
    }
});
*/


// Tilt controls
const tiltKeys = ["ArrowLeft", "ArrowRight"];


// Event Listener takes keydown inputs for tilt booleans
document.addEventListener("keyup", (e) => {
    if (tiltKeys.includes(e.key)) { 
        e.preventDefault();
        setTilt(e.key, false);
    }
});

// Event Listener takes keyup inputs for tilt booleans
document.addEventListener("keydown", (e) => {
    if (!game) { return; }
    if (tiltKeys.includes(e.key)) { 
        e.preventDefault();
        setTilt(e.key, true);
    }
});
