export interface User {
  id: string;
  name: string;
}
export interface UserRepository {
  save(user: User): void;
  findById(id: string): User | null;
}