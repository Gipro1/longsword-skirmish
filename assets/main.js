/**
 * - Main hold eventListeners for keyboard input to move and shoot.
 * 
 * @author: Angelo Scala
 */


import { startGame, setDirection, setTilt, x, y, tiltString } from "./longsword.js";
import { fireWeapon, setWeapon } from "./weapons.js";
import { splashScreen } from "./splash&end.js";
import { displayWeapon, noAltMsg } from "./hud.js";

// Start button
export const btn = document.getElementById("btn");
// Start button text "Start"
export const start = document.getElementById("start");

// Splash screen displays game controls.
window.addEventListener("load", splashScreen);

// Global game state
export let game = false;
/**
 * - game set to true when started.
 * - Several functions require game = true to work.
 * - game is set to false after either victory or death. 
 * 
 * @param {*} state 
 */
export function setGame(state) {
    game = state;
}


// Clicked prevents spamming start button.
let clicked = false;
/**
 * - Start button listener.
 */
btn.addEventListener("click", (e) => {
    if (clicked || game) { return; }
        clicked = true;
        startGame(e);
});



/**
 * - Event Listeners for directional controls.
 * 
 */

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
            fireWeapon(x, y, tiltString);
            firingInterval = setInterval(() => {
                fireWeapon(x, y, tiltString);
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


// True when new weapon is collected.
let weaponPick = false;
// True when any alternate weapon is owned.
let altWeaponOwned = false;
/**
 * - Automatically switches equipped weapon to newly collected weapon.
 * 
 * @param {*} pick 
 */
export function setWeaponPick(pick) {
    weaponPick = pick;
    setWeapon();
    if (weaponPick) {
        altWeaponOwned = true;
        weaponPick = false;
    }
}


// Event Listener takes keyup inputs for weapon switching
document.addEventListener("keydown", (e) => {
    if (!game) { return; }
    if (e.key === "ArrowDown") { 
        e.preventDefault();
        if (!altWeaponOwned) {
            noAltMsg();
        } else {
            setWeapon();
        }
        return;
    }
});