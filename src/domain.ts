import { CarType, Driver, Point, calculateDistance } from "./types";

// --- Pricing Engine ---
export class TieredPricingStrategy {
  private minFare = 50;
  private multipliers: Record<CarType, number> = {
    [CarType.HATCHBACK]: 1.0,
    [CarType.SEDAN]: 1.25,
  };
  private tiers = [
    { startKm: 0, endKm: 2, ratePerKm: 10 },
    { startKm: 2, endKm: 5, ratePerKm: 8 },
    { startKm: 5, endKm: Infinity, ratePerKm: 5 },
  ];

  public calculateFare(distanceKm: number, carType: CarType): number {
    let fare = 0;
    const multiplier = this.multipliers[carType] || 1.0;

    for (const tier of this.tiers) {
      if (distanceKm > tier.startKm) {
        const chargeableDist = Math.min(distanceKm, tier.endKm) - tier.startKm;
        fare += chargeableDist * (tier.ratePerKm * multiplier);
      }
    }
    return Math.max(this.minFare, fare);
  }
}

// --- Coupon Manager ---
export class CouponManager {
  private coupons = new Map<string, { percent: number; max: number }>();

  public addCoupon(code: string, percent: number, max: number) {
    this.coupons.set(code.toUpperCase(), { percent, max });
  }

  public applyDiscount(code: string | undefined, gross: number): number {
    if (!code) return gross;
    const coupon = this.coupons.get(code.toUpperCase());
    if (!coupon) throw new Error("Invalid coupon");

    const discount = Math.min((gross * coupon.percent) / 100, coupon.max);
    return Math.max(0, gross - discount);
  }
}

// --- Matching Strategy ---
export class NearestDriverStrategy {
  public match(drivers: Driver[], pickup: Point, radiusKm: number): Driver | null {
    let best: Driver | null = null;
    let minDist = Infinity;

    for (const d of drivers) {
      if (!d.isAvailable) continue;
      const dist = calculateDistance(d.location, pickup);
      if (dist <= radiusKm && dist < minDist) {
        minDist = dist;
        best = d;
      }
    }
    return best;
  }
}