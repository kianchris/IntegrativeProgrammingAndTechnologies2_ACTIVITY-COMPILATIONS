import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { RegisteredUser, RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, RegisterComponent, AdminComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

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

  // CRUD for registered users
  registeredUsers: RegisteredUser[] = [];
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

    // Create new user object with date
    const newUser: RegisteredUser = {
      id: Date.now(), // Simple ID using timestamp
      username: this.regUsername,
      email: this.regEmail,
      date: new Date()
    };

    // Add to registered users table (unshift for newest first)
    this.registeredUsers.unshift(newUser);

    // After registration, return user to login form
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
    const user = this.registeredUsers.find(u => u.id === id);
    if (user) {
      this.editingUserId = id;
      this.editingUser = { ...user };
    }
  }

  updateUser() {
    if (this.editingUserId !== null && this.editingUser) {
      const index = this.registeredUsers.findIndex(u => u.id === this.editingUserId);
      if (index !== -1) {
        this.registeredUsers[index] = { 
          ...this.registeredUsers[index], 
          username: this.editingUser.username || '',
          email: this.editingUser.email || '',
          date: this.editingUser.date || new Date()
        };
      }
      this.cancelEdit();
    }
  }

  deleteUser(id: number) {
    if (confirm('Delete this user?')) {
      this.registeredUsers = this.registeredUsers.filter(u => u.id !== id);
    }
  }

  cancelEdit() {
    this.editingUserId = null;
    this.editingUser = null;
  }

  logout() {
    this.isLoggedIn = false;
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

