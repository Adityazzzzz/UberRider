import { CarType } from "@domain/driver";
import { CouponRepository } from "@domain/coupon";

export interface PricingStrategy {
    calculateFare(distanceKm: number,carType: CarType): number;
}

export class TieredPricingStrategy implements PricingStrategy {
    private readonly minFare = 50;
    private readonly carMultipliers: Record<CarType,number> = {
        [CarType.HATCHBACK]: 1.0,
        [CarType.SEDAN]: 1.25,
    };
    private readonly tiers = [ // I can simply add a new pricing model here
        { startKm: 0,endKm: 2,rate: 10 },
        { startKm: 2,endKm: 5,rate: 8 },
        { startKm: 5,endKm: Infinity,rate: 5 },
    ];

    calculateFare(distanceKm: number,carType: CarType): number {
        let fare = 0;
        const multiplier = this.carMultipliers[carType] || 1.0;
        
        for (const tier of this.tiers) {
            if (distanceKm > tier.startKm) {
                const slab = Math.min(distanceKm,tier.endKm) - tier.startKm;
                fare += slab * (tier.rate * multiplier);
            }
        }
        return Math.max(this.minFare,fare);
    }
}

export class CouponApplier {
    constructor(private couponRepo: CouponRepository) {}

    apply(code: string | undefined,grossAmount: number): { netAmount: number; discount: number } {
        if (!code) return { netAmount: grossAmount,discount: 0 };
        const coupon = this.couponRepo.findByCode(code);
        if (!coupon) throw new Error(`Invalid coupon: ${code}`);

        const calculated = (grossAmount * coupon.discountPercentage) / 100;
        const discount = Math.min(calculated,coupon.maxDiscountAmount);
        return { netAmount: Math.max(0,grossAmount - discount),discount };
    }
}