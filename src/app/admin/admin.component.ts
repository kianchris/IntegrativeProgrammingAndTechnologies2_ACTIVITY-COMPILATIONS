import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html'
})
export class AdminComponent {
  @Input() username = '';
  @Output() logout = new EventEmitter<void>();
}
