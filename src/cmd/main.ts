import {MemoryUserRepository} from "@repository/memory/memory_user_repo";
import {MemoryDriverRepository} from "@repository/memory/memory_driver_repo";
import {MemoryRideRepository} from "@repository/memory/memory_ride_repo";
import {MemoryCouponRepository} from "@repository/memory/memory_coupon_repo";
import {TieredPricingStrategy, CouponApplier} from "@usecase/pricing/strategy";
import {NearestDriverStrategy} from "@usecase/matching/strategy";
import {BookingService} from "@usecase/booking/booking_service";
import {CarType} from "@domain/driver";

async function bootstrap() {
    const userRepo = new MemoryUserRepository();
    const driverRepo = new MemoryDriverRepository();
    const rideRepo = new MemoryRideRepository();
    const couponRepo = new MemoryCouponRepository();

    const pricing = new TieredPricingStrategy();
    const couponApplier = new CouponApplier(couponRepo);
    const matching = new NearestDriverStrategy();

    const bookingService = new BookingService(
        userRepo,
        driverRepo,
        rideRepo,
        pricing,
        couponApplier,
        matching
    );

    // Seed mock data
    userRepo.save({id:"U1", name:"Alice"});
    driverRepo.save({id:"D1", name:"Bob", carType:CarType.SEDAN, location:{x:1, y:1}, isAvailable:true, rating:4.9});
    couponRepo.save({code:"WELCOME20", discountPercentage:20, maxDiscountAmount:100});

    console.log("--- Executing Ride Hailing Simulation ---");



    const ride = await bookingService.bookRide("U1", CarType.HATCHBACK, {x:0, y:0}, {x:0, y:10}, "WELCOME20");
    console.log("Ride Booked:", {ID:ride.id, AssignedCar:ride.assignedCarType, IsUpgraded:ride.isUpgraded });

    const result = bookingService.endRide(ride.id, {x:0, y:10 });
    console.log(`Ride Ended Successfully. Final Fare Billed (at Hatchback rate with coupon):₹${result.finalFare}`);

    console.log("User Ride History:", rideRepo.findByUserId("U1"));
}

bootstrap().catch(console.error);