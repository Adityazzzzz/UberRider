import { CarType, Point, Ride, RideStatus, calculateDistance } from "./types";
import { TieredPricingStrategy, CouponManager, NearestDriverStrategy } from "./domain";
import { DataStore } from "./repositories";

export class BookingService {
  public rides = new Map<string, Ride>();
  private isLocked = false; // Concurrency protection

  constructor(
    private store: DataStore,
    private pricing: TieredPricingStrategy,
    private matching: NearestDriverStrategy,
    private coupons: CouponManager
  ) {}

  public async bookRide(userId: string, reqType: CarType, pickup: Point, dest: Point, coupon?: string): Promise<Ride> {
    while (this.isLocked) await new Promise(r => setTimeout(r, 5));
    this.isLocked = true;

    try {
      if (!this.store.users.has(userId)) throw new Error("User not found");

      let candidates = this.store.findAvailableDrivers(reqType);
      let driver = this.matching.match(candidates, pickup, 5);
      let isUpgraded = false;

      // Free Upgrade Logic
      if (!driver && reqType === CarType.HATCHBACK) {
        candidates = this.store.findAvailableDrivers(CarType.SEDAN);
        driver = this.matching.match(candidates, pickup, 5);
        if (driver) isUpgraded = true;
      }

      if (!driver) throw new Error("No drivers available in radius");

      driver.isAvailable = false; // Lock driver

      const ride: Ride = {
        id: `RIDE_${Date.now()}`, userId, driverId: driver.id,
        requestedCarType: reqType, assignedCarType: driver.carType,
        isUpgraded, pickup, destination, couponCode: coupon, status: RideStatus.IN_PROGRESS
      };

      this.rides.set(ride.id, ride);
      return ride;
    } finally {
      this.isLocked = false;
    }
  }

  public endRide(rideId: string, dropOff: Point): { ride: Ride; fare: number } {
    const ride = this.rides.get(rideId);
    if (!ride || ride.status !== RideStatus.IN_PROGRESS) throw new Error("Invalid ride");

    const dist = calculateDistance(ride.pickup, dropOff);
    // Bill strictly by requested type to honor free upgrades
    const grossFare = this.pricing.calculateFare(dist, ride.requestedCarType);
    const finalFare = this.coupons.applyDiscount(ride.couponCode, grossFare);

    ride.status = RideStatus.COMPLETED;
    ride.finalFare = finalFare;

    const driver = this.store.drivers.get(ride.driverId)!;
    driver.location = dropOff;
    driver.isAvailable = true;

    return { ride, fare: finalFare };
  }
}