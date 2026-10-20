import { Routes } from '@angular/router';
import { DeveloperPageComponent } from './developer-page/developer-page.component';

export const routes: Routes = [
  { path: '', component: DeveloperPageComponent, title: 'Rubén · Developer' },
  { path: '**', redirectTo: '' },
];
