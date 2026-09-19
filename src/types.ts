export interface Point {
  x: number;
  y: number;
}

export function calculateDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export enum CarType {
  HATCHBACK = "HATCHBACK",
  SEDAN = "SEDAN",
}

export enum RideStatus {
  REQUESTED = "REQUESTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface User { id: string; name: string; }
export interface Driver {
  id: string;
  name: string;
  carType: CarType;
  location: Point;
  isAvailable: boolean;
  rating: number;
}

export interface Ride {
  id: string;
  userId: string;
  driverId: string;
  requestedCarType: CarType;
  assignedCarType: CarType;
  isUpgraded: boolean;
  pickup: Point;
  destination: Point;
  couponCode?: string;
  status: RideStatus;
  finalFare?: number;
}