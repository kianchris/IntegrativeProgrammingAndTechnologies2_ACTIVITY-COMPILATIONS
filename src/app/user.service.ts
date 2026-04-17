import { Injectable } from '@angular/core';

// OOP PRINCIPLE 1: ENCAPSULATION - Private data, public API
// OOP PRINCIPLE 2: ABSTRACTION - Abstract IUserService interface
export interface IUserService {
  addUser(user: Omit<RegisteredUser, 'id'>): RegisteredUser;
  getUsers(): RegisteredUser[];
  updateUser(id: number, updates: Partial<RegisteredUser>): RegisteredUser | null;
  deleteUser(id: number): boolean;
  findUser(id: number): RegisteredUser | null;
}

export interface RegisteredUser {
  id: number;
  username: string;
  email: string;
  date?: Date;
}
// OOP PRINCIPLE 5: SRP - Single Responsibility: only user data CRUD
export interface IUserService {
  addUser(user: Omit<RegisteredUser, 'id'>): RegisteredUser;
  getUsers(): RegisteredUser[];
  updateUser(id: number, updates: Partial<RegisteredUser>): RegisteredUser | null;
  deleteUser(id: number): boolean;
  findUser(id: number): RegisteredUser | null;
}

// OOP PRINCIPLE 3: INHERITANCE - Extends BaseUserService (base class for common logic)
abstract class BaseUserService implements IUserService {
  protected users: RegisteredUser[] = []; // Encapsulated data

  // Polymorphic overridable method - OOP PRINCIPLE 4: POLYMORPHISM
  protected generateId(): number {
    return Date.now();
  }

  // Abstraction - public API
  addUser(user: Omit<RegisteredUser, 'id'>): RegisteredUser {
    const newUser: RegisteredUser = {
      id: this.generateId(),
      ...user
    };
    this.users.unshift(newUser);
    return newUser;
  }

  getUsers(): RegisteredUser[] {
    return [...this.users]; // Return copy for immutability
  }

  updateUser(id: number, updates: Partial<RegisteredUser>): RegisteredUser | null {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  deleteUser(id: number): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  findUser(id: number): RegisteredUser | null {
    return this.users.find(u => u.id === id) || null;
  }
}

// OOP PRINCIPLE 6: OCP - Open for extension (implement interface)
// OOP PRINCIPLE 7: DIP - Depend on abstraction (IUserService)
@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseUserService implements IUserService {
  // LSP - Substitutable for base (no violation)
  // ISP - Only user CRUD methods exposed
  constructor() {
    super();
  }

  // Example polymorphic override
  override generateId(): number {
    // Custom ID logic, e.g. UUID sim
    return super.generateId();
  }
}
