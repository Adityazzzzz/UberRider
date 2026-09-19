import { Driver, User, CarType } from "./types";

export class DataStore {
  public users = new Map<string, User>();
  public drivers = new Map<string, Driver>();

  public saveUser(user: User) { this.users.set(user.id, user); }
  public saveDriver(driver: Driver) { this.drivers.set(driver.id, driver); }

  public findAvailableDrivers(type: CarType): Driver[] {
    return Array.from(this.drivers.values()).filter(d => d.isAvailable && d.carType === type);
  }
}