import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface RegisteredUser {
  username: string;
  email: string;
  date?: Date;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  @Input() regUsername = '';
  @Input() regEmail = '';
  @Input() regPassword = '';
  @Input() regConfirmPassword = '';
  @Input() showRegisteredTable = false;
  @Input() registeredUsers: RegisteredUser[] = [];
  @Input() registerErrors: any = {};
  @Input() registerSubmitted = false;

  @Output() regUsernameChange = new EventEmitter<string>();
  @Output() regEmailChange = new EventEmitter<string>();
  @Output() regPasswordChange = new EventEmitter<string>();
  @Output() regConfirmPasswordChange = new EventEmitter<string>();

  @Output() registerSubmit = new EventEmitter<void>();
  @Output() toggleRegisteredUsers = new EventEmitter<void>();
  @Output() backToLogin = new EventEmitter<void>();
}
