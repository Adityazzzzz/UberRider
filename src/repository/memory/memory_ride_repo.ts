import { Ride, RideRepository, RideStatus } from "@domain/ride";

export class MemoryRideRepository implements RideRepository {
  private rides = new Map<string, Ride>();

  save(ride: Ride): void { 
    this.rides.set(ride.id, ride); 
  }
  findById(id: string): Ride | null { 
    return this.rides.get(id) || null; 
  }

  findByUserId(userId: string): Ride[] {
    return Array.from(this.rides.values()).filter(r => r.userId === userId);
  }

  findByDriverId(driverId: string): Ride[] {
    return Array.from(this.rides.values()).filter(r => r.driverId === driverId);
  }

  updateStatus(id: string, status: RideStatus, finalFare?: number): void {
    const ride = this.rides.get(id);
    if(ride){
      ride.status = status;
      if(finalFare !== undefined) ride.finalFare = finalFare;
    }
  }
}