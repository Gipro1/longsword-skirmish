/**
 * - 
 * 
 * @author: Angelo Scala
 */

import { powerUpCount } from "./items.js";

/**
 * - 
 * 
 */
export function collectPower(nodeX, yDrift, x, y) {
    let pickUpX = ( nodeX < x + 70) && (nodeX + 10 > x);
    let pickUpY = (yDrift < y + 65) && (yDrift + 10 > y);

    if (pickUpX && pickUpY) {
        return true;
        powerUpCount++;
    }
    return false;
}