export interface Point {
  x:number;
  y:number;
}

export function calculateDistance(p1:Point, p2:Point):number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export enum CarType {
  HATCHBACK = "HATCHBACK",
  SEDAN = "SEDAN",
}

export interface Driver {
  id:string;
  name:string;
  carType:CarType;
  location:Point;
  isAvailable:boolean;
  rating:number;
}

export interface DriverRepository {
  save(driver:Driver):void;
  findById(id:string):Driver | null;
  findAvailableByType(carType:CarType):Driver[];
  updateLocation(id:string, location:Point):void;
  setAvailability(id:string, isAvailable:boolean):void;
}