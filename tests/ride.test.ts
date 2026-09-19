import { TieredPricingStrategy, CouponManager } from "../src/domain";
import { CarType } from "../src/types";

describe("Pricing Engine & Coupons", () => {
  const pricing = new TieredPricingStrategy();
  const coupons = new CouponManager();
  coupons.addCoupon("SAVE20", 20, 50);

  test("Minimum ride price is ₹50", () => {
    expect(pricing.calculateFare(1, CarType.HATCHBACK)).toBe(50);
  });

  test("Calculates correct tiered rate for 10km Hatchback (₹69)", () => {
    // 2km*10 + 3km*8 + 5km*5 = 20 + 24 + 25 = 69
    expect(pricing.calculateFare(10, CarType.HATCHBACK)).toBe(69);
  });

  test("Sedan pricing is higher (1.25x)", () => {
    expect(pricing.calculateFare(10, CarType.SEDAN)).toBe(86.25);
  });

  test("Coupon applies correctly with max cap", () => {
    // 20% of 500 = 100, capped at 50. Net = 450
    expect(coupons.applyDiscount("SAVE20", 500)).toBe(450);
  });
});