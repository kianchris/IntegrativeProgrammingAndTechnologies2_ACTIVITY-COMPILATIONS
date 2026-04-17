import { Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { RegisterComponent } from './register/register.component';
import { UserService, RegisteredUser } from './user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, RegisterComponent, AdminComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  // OOP PRINCIPLE 7: DIP - Inject service abstraction
  private userService = inject(UserService);
  readonly router = inject(Router);

  // Login fields
  username = '';
  password = '';

  // Register fields
  regUsername = '';
  regEmail = '';
  regPassword = '';
  regConfirmPassword = '';

  // Validation errors
  loginErrors = {
    username: '',
    password: ''
  };
  registerErrors = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  submitted = false;
  registerSubmitted = false;

  message = '';
  isLoggedIn = false;
  showRegister = false;
  showRegisteredTable = false;

  /** Dialog open state — managed with a signal so the template stays in sync with navigation. */
  readonly kianDialogOpen = signal(false);

  /** Hide login shell when viewing portfolio route (router-outlet shows it). */
  get showLoginShell(): boolean {
    return !this.isLoggedIn && !this.router.url.startsWith('/portfolio');
  }

  /** Kian control only on the sign-in form, not on registration. */
  get showKianOnLoginOnly(): boolean {
    return this.showLoginShell && !this.showRegister;
  }

  openKianDialog(): void {
    this.kianDialogOpen.set(true);
  }

  closeKianDialog(): void {
    this.kianDialogOpen.set(false);
  }

  goToPortfolioFromKian(): void {
    this.kianDialogOpen.set(false);
    void this.router.navigate(['/portfolio']);
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !this.kianDialogOpen()) {
      return;
    }
    event.preventDefault();
    this.closeKianDialog();
  }

  // OOP PRINCIPLE 2: ABSTRACTION - Use service getter
  registeredUsers = [] as RegisteredUser[];

  get users(): RegisteredUser[] {
    return this.userService.getUsers();
  }

  // CRUD using service - SRP component orchestrates UI
  editingUserId: number | null = null;
  editingUser: Partial<RegisteredUser> | null = null;

  // Current date and time for welcome section
  currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Mock dashboard data for VSU
  stats = {
    students: 2547,
    courses: 89,
    faculty: 312,
    enrollmentRate: 78.5
  };

  validatePassword(pass: string): boolean {
    const upper = /[A-Z]/;
    const lower = /[a-z]/;
    const number = /[0-9]/;

    return upper.test(pass) && lower.test(pass) && number.test(pass) && pass.length >= 8;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  clearLoginErrors() {
    this.loginErrors = { username: '', password: '' };
  }

  clearRegisterErrors() {
    this.registerErrors = { username: '', email: '', password: '', confirmPassword: '' };
  }

  getFormattedDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  login() {
    this.submitted = true;
    this.clearLoginErrors();
    let hasError = false;

    if (!this.username.trim()) {
      this.loginErrors.username = 'Username is required';
      hasError = true;
    }
    if (!this.password) {
      this.loginErrors.password = 'Password is required';
      hasError = true;
    } else if (!this.validatePassword(this.password)) {
      this.loginErrors.password = 'Password must have uppercase, lowercase, number, and 8+ characters';
      hasError = true;
    }

    if (hasError) {
      this.message = '';
      return;
    }

    this.isLoggedIn = true;
    this.kianDialogOpen.set(false);
    this.message = '';
    this.submitted = false;
  }

  register() {
    this.registerSubmitted = true;
    this.clearRegisterErrors();
    let hasError = false;

    if (!this.regUsername.trim()) {
      this.registerErrors.username = 'Username is required';
      hasError = true;
    }
    if (!this.regEmail.trim()) {
      this.registerErrors.email = 'Email is required';
      hasError = true;
    } else if (!this.validateEmail(this.regEmail)) {
      this.registerErrors.email = 'Please enter a valid email';
      hasError = true;
    }
    if (!this.regPassword) {
      this.registerErrors.password = 'Password is required';
      hasError = true;
    } else if (!this.validatePassword(this.regPassword)) {
      this.registerErrors.password = 'Password must be at least 8 chars with upper, lower, number';
      hasError = true;
    }
    if (this.regConfirmPassword !== this.regPassword) {
      this.registerErrors.confirmPassword = 'Passwords do not match';
      hasError = true;
    }

    if (hasError) {
      this.message = '';
      return;
    }

    // OOP PRINCIPLE 1: ENCAPSULATION - Service handles data
    this.userService.addUser({
      username: this.regUsername,
      email: this.regEmail,
      date: new Date()
    });

    this.message = 'Registration successful! Please sign in.';
    
    // Reset form
    this.regUsername = '';
    this.regEmail = '';
    this.regPassword = '';
    this.regConfirmPassword = '';
    this.showRegister = false;
    this.showRegisteredTable = false;
    this.registerSubmitted = false;
  }

  toggleRegister() {
    this.showRegister = !this.showRegister;
    this.kianDialogOpen.set(false);
    this.message = '';
    this.clearLoginErrors();
    this.clearRegisterErrors();
    this.submitted = false;
    this.registerSubmitted = false;
    this.showRegisteredTable = false;
  }

  toggleRegisteredTable() {
    this.showRegisteredTable = !this.showRegisteredTable;
    if (!this.showRegisteredTable) {
      this.cancelEdit();
    }
  }

  editUser(id: number) {
    // OOP PRINCIPLE 4: POLYMORPHISM - Service method
    const user = this.userService.findUser(id);
    if (user) {
      this.editingUserId = id;
      this.editingUser = { ...user };
    }
  }

  updateUser() {
    if (this.editingUserId !== null && this.editingUser) {
      // OOP PRINCIPLE 6: OCP - Service update extensible
      this.userService.updateUser(this.editingUserId, this.editingUser);
      this.cancelEdit();
    }
  }

  deleteUser(id: number) {
    if (confirm('Delete this user?')) {
      // OOP PRINCIPLE 5: SRP - Delegate to service
      this.userService.deleteUser(id);
    }
  }

  cancelEdit() {
    this.editingUserId = null;
    this.editingUser = null;
  }

  logout() {
    this.isLoggedIn = false;
    this.kianDialogOpen.set(false);
    this.message = '';
    this.username = '';
    this.password = '';
    this.regUsername = '';
    this.regEmail = '';
    this.regPassword = '';
    this.regConfirmPassword = '';
    this.showRegister = false;
    this.showRegisteredTable = false;
    this.submitted = false;
    this.registerSubmitted = false;
  }

}

