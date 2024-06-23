import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetricDimensionComponent } from './metric-dimension/metric-dimension.component';
import { VectorCalculatorComponent } from './vector-calculator/vector-calculator.component';
import { CalculatorPinGuard } from '../guards/calculator-pin.guard';
import {InformationSystemComponent} from "./information-system/information-system.component";

const routes: Routes = [
  { path: 'metric-dimension', component: MetricDimensionComponent, canActivate: [CalculatorPinGuard] },
  { path: 'vector-calculator', component: VectorCalculatorComponent, canActivate: [CalculatorPinGuard] },
  { path: 'information-system', component: InformationSystemComponent, canActivate: [CalculatorPinGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalculatorsRoutingModule { }
