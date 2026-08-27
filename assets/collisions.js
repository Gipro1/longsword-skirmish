/**
 * - 
 * 
 * @author: Angelo Scala
 */

import { powerUpCount } from "./items.js";

/**
 * - Handles powerUp collection.
 * 
 * @param {*} nodeX 
 * @param {*} yDrift 
 * @param {*} x - longsword x
 * @param {*} y - longsword y
 * @returns boolean
 */
export function collectPower(nodeX, yDrift, x, y) {
    let pickUpX = ( nodeX < x + 70) && (nodeX + 10 > x);
    let pickUpY = (yDrift < y + 65) && (yDrift + 10 > y);

    if (pickUpX && pickUpY) {
        //powerUpCount++;
        return true;
    }
    return false;
}