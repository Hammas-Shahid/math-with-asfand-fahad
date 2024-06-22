import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MetricDimensionComponent} from "./metric-dimension/metric-dimension.component";

const routes: Routes = [
  { path: '', component: MetricDimensionComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
