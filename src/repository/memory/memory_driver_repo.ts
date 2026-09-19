import { Driver, DriverRepository, CarType, Point } from "@domain/driver";

export class MemoryDriverRepository implements DriverRepository {
  private drivers = new Map<string, Driver>();

  save(driver: Driver): void { 
    this.drivers.set(driver.id, driver); 
  }
  findById(id: string): Driver | null { 
    return this.drivers.get(id) || null; 
  }

  findAvailableByType(carType: CarType): Driver[] {
    return Array.from(this.drivers.values()).filter(d => d.isAvailable && d.carType === carType);
  }

  updateLocation(id: string, location: Point): void {
    const d = this.drivers.get(id);
    if(d){ 
        d.location = location; 
    }
  }

  setAvailability(id: string, isAvailable: boolean): void {
    const d = this.drivers.get(id);
    if(d){ 
        d.isAvailable = isAvailable; 
    }
  }
}