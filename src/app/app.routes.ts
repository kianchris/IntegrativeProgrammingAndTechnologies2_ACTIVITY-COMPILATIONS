import { Routes } from '@angular/router';

import { HomeOutletComponent } from './home-outlet.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeOutletComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: '**', redirectTo: '' },
];
