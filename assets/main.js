/**
 * - 
 * 
 * @author: Angelo Scala
 */


import { startGame, setDirection, missiles } from "./longsword.js";

const btn = document.getElementById("btn");

// Global game state
export let game = false;
export function setGame(state) {
    game = state;
}

btn.addEventListener("click", (e) => startGame(e));


const controlKeys = ["ArrowUp", "w", "ArrowDown", "s", "ArrowLeft", "a", "ArrowRight", "d"];

// Event Listener takes keydown inputs for directional booleans
document.addEventListener("keyup", (e) => {
    if (controlKeys.includes(e.key)) {
        e.preventDefault();
        setDirection(e.key, false);
    }
});

// Event Listener takes keyup inputs for directional booleans
document.addEventListener("keydown", (e) => {
    if (!game) { return; }
    if (controlKeys.includes(e.key)) {
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
    if (e.key === " " && !firing) {
        e.preventDefault();
        firing = true;
        missiles();
        firingInterval = setInterval(missiles, 200);
    }
});

