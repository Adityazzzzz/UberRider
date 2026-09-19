import {CarType, Point, DriverRepository, calculateDistance} from "@domain/driver";
import {UserRepository} from "@domain/user";
import {Ride, RideRepository, RideStatus} from "@domain/ride";
import {PricingStrategy, CouponApplier} from "@usecase/pricing/strategy";
import {DriverMatchingStrategy} from "@usecase/matching/strategy";

export class BookingService {
    private isLocked = false; // Concurrency lock

    constructor(
        private userRepo: UserRepository,
        private driverRepo: DriverRepository,
        private rideRepo: RideRepository,
        private pricingStrategy: PricingStrategy,
        private couponApplier: CouponApplier,
        private matchingStrategy: DriverMatchingStrategy
    ) {}

    async bookRide(
        userId: string,
        requestedCarType: CarType,
        pickup: Point,
        destination: Point,
        couponCode?: string,
        radiusKm: number = 5
    ): Promise<Ride> {
        while(this.isLocked) await new Promise((r) => setTimeout(r, 5));
        this.isLocked = true;

        try{
            if(!this.userRepo.findById(userId)) throw new Error("User not found");

            let candidates = this.driverRepo.findAvailableByType(requestedCarType);
            let driver = this.matchingStrategy.match(candidates, pickup, radiusKm);
            let isUpgraded = false;

            // Free Upgrade Rule
            if(!driver && requestedCarType === CarType.HATCHBACK) {
                candidates = this.driverRepo.findAvailableByType(CarType.SEDAN);
                driver = this.matchingStrategy.match(candidates, pickup, radiusKm);
                if(driver) isUpgraded = true;
            }

            if(!driver) throw new Error("No drivers available in the specified radius");

            this.driverRepo.setAvailability(driver.id, false);
            const ride: Ride = {
                id: `RIDE_${Date.now()}`,
                userId,
                driverId: driver.id,
                requestedCarType,
                assignedCarType: driver.carType,
                isUpgraded,
                pickup,
                destination,
                couponCode,
                status: RideStatus.IN_PROGRESS,
            };

            this.rideRepo.save(ride);
            return ride;
        } 
        finally {
            this.isLocked = false;
        }
    }
}