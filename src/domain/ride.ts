import { CarType, Point } from "./driver";

export enum RideStatus {
  REQUESTED = "REQUESTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
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

export interface RideRepository {
  save(ride: Ride): void;
  findById(id: string): Ride | null;
  findByUserId(userId: string): Ride[];
  findByDriverId(driverId: string): Ride[];
  updateStatus(id: string, status: RideStatus, finalFare?: number): void;
}