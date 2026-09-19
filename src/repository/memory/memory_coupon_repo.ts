import { Coupon, CouponRepository } from "@domain/coupon";

export class MemoryCouponRepository implements CouponRepository {
  private coupons = new Map<string, Coupon>();

  save(coupon: Coupon): void { 
    this.coupons.set(coupon.code.toUpperCase(), coupon); 
  }

  findByCode(code: string): Coupon | null { 
    return this.coupons.get(code.toUpperCase()) || null; 
  }
  delete(code: string): boolean { 
    return this.coupons.delete(code.toUpperCase()); 
  }
}