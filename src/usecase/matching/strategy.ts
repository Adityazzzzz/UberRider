import { Driver, Point, calculateDistance } from "@domain/driver";

export interface DriverMatchingStrategy {
    match(drivers: Driver[], pickup: Point, radiusKm: number): Driver | null;
}

export class NearestDriverStrategy implements DriverMatchingStrategy {
    match(drivers: Driver[], pickup: Point, radiusKm: number): Driver | null {
        let best: Driver | null = null;
        let minDist = Infinity;

        for(const d of drivers) {
            if(!d.isAvailable) continue;
            const dist = calculateDistance(d.location, pickup);
            if(dist <= radiusKm && dist < minDist) {
                minDist = dist;
                best = d;
            }
        }
        return best;
    }
}