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

  message = '';
  isLoggedIn = false;
  showRegister = false;
  showRegisteredTable = false;

  // Registered users array
  registeredUsers: RegisteredUser[] = [];

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

  getFormattedDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  login() {
    if (!this.username || !this.password) {
      this.message = "Please enter username and password!";
      return;
    }
    if (!this.validatePassword(this.password)) {
      this.message = "Password must contain uppercase, lowercase, number, and be at least 8 characters!";
      return;
    }

    this.isLoggedIn = true;
    this.message = '';
  }

  register() {
    if (!this.regUsername || !this.regEmail || !this.regPassword || !this.regConfirmPassword) {
      this.message = "Please fill all fields!";
      return;
    }
    if (!this.validateEmail(this.regEmail)) {
      this.message = "Please enter a valid email!";
      return;
    }
    if (!this.validatePassword(this.regPassword)) {
      this.message = "Password must be at least 8 chars with upper, lower, and number!";
      return;
    }
    if (this.regPassword !== this.regConfirmPassword) {
      this.message = "Passwords do not match!";
      return;
    }

    // Create new user object with date
    const newUser = {
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
  }

  toggleRegister() {
    this.showRegister = !this.showRegister;
    this.message = '';
    this.showRegisteredTable = false;
  }

  toggleRegisteredTable() {
    this.showRegisteredTable = !this.showRegisteredTable;
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
  }

}

