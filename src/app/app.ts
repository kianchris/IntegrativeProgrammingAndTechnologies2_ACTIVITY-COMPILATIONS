import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  username = '';
  password = '';
  message = '';

  validatePassword(pass: string): boolean {
    const upper = /[A-Z]/;
    const lower = /[a-z]/;
    const number = /[0-9]/;

    return upper.test(pass) && lower.test(pass) && number.test(pass);
  }

  login() {
    if (!this.validatePassword(this.password)) {
      this.message = "Password must contain uppercase, lowercase, and number!";
      return;
    }

    this.message = "Welcome, " + this.username + "!";
  }

}