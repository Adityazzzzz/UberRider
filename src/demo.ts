import { DataStore } from "./repositories";
import { TieredPricingStrategy, CouponManager, NearestDriverStrategy } from "./domain";
import { BookingService } from "./service";
import { CarType } from "./types";

async function runDemo() {
  const store = new DataStore();
  store.saveUser({ id: "U1", name: "Alice" });
  // Only a Sedan is available nearby
  store.saveDriver({ id: "D1", name: "Bob", carType: CarType.SEDAN, location: { x: 1, y: 1 }, isAvailable: true, rating: 5 });

  const coupons = new CouponManager();
  coupons.addCoupon("WELCOME", 50, 100); // 50% off, max 100

  const service = new BookingService(store, new TieredPricingStrategy(), new NearestDriverStrategy(), coupons);

  console.log("Booking Hatchback (will trigger free upgrade to Sedan)...");
  const ride = await service.bookRide("U1", CarType.HATCHBACK, { x: 0, y: 0 }, { x: 0, y: 10 }, "WELCOME");
  
  console.log("Ride Assigned:", { ID: ride.id, Driver: ride.driverId, Upgraded: ride.isUpgraded });

  console.log("Ending Ride...");
  const result = service.endRide(ride.id, { x: 0, y: 10 });
  
  console.log(`Final Fare for 10km: ₹${result.fare} (Discount applied, billed at Hatchback rate)`);
}

runDemo().catch(console.error);