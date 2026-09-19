import { User, UserRepository } from "@domain/user";

export class MemoryUserRepository implements UserRepository {
  private users = new Map<string, User>();

  save(user: User): void { 
    this.users.set(user.id, user); 
  }
  
  findById(id: string): User | null { 
    return this.users.get(id) || null; 
  }
}