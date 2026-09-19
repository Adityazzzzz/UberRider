import { TieredPricingStrategy, CouponApplier } from "./strategy";
import { CarType } from "@domain/driver";
import { MemoryCouponRepository } from "@repository/memory/memory_coupon_repo";

describe("Pricing Engine & Coupons Unit Tests", () => {
  let pricing: TieredPricingStrategy;
  let couponApplier: CouponApplier;
  let couponRepo: MemoryCouponRepository;

  beforeEach(() => {
    pricing = new TieredPricingStrategy();
    couponRepo = new MemoryCouponRepository();
    couponApplier = new CouponApplier(couponRepo);
    couponRepo.save({ code: "SAVE50", discountPercentage: 20, maxDiscountAmount: 50 });
  });

  test("enforces minimum ride price of 50", () => {
    expect(pricing.calculateFare(1.0, CarType.HATCHBACK)).toBe(50);
  });

  test("calculates correct tiered rates for 10km Hatchback", () => {
    // (2*10) + (3*8) + (5*5) = 20 + 24 + 25 = 69
    expect(pricing.calculateFare(10, CarType.HATCHBACK)).toBe(69);
  });

  test("applies car type multipliers for Sedan", () => {
    // 69 * 1.25 = 86.25
    expect(pricing.calculateFare(10, CarType.SEDAN)).toBe(86.25);
  });

  test("applies coupon discounts correctly with limits", () => {
    const { netAmount, discount } = couponApplier.apply("SAVE50", 500);
    expect(discount).toBe(50); // Capped at 50
    expect(netAmount).toBe(450);
  });
});