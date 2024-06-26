import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { iframeViewerComponent} from "./calculators/iframe-viewer/iframe-viewer.component";

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'calculators', loadChildren: () => import('./calculators/calculators.module').then(m => m.CalculatorsModule) },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
