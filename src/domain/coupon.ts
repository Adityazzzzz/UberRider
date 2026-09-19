export interface Coupon {
  code: string;
  discountPercentage: number;
  maxDiscountAmount: number;
}

export interface CouponRepository {
  save(coupon: Coupon): void;
  findByCode(code: string): Coupon | null;
  delete(code: string): boolean;
}