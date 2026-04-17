import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent {
  readonly contactEmail = 'kianchris.gio@evsu.edu.ph';

  readonly closed = output<void>();

  close(): void {
    this.closed.emit();
  }
}
