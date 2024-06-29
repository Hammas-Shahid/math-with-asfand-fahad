import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetricDimensionComponent } from './metric-dimension/metric-dimension.component';
import { VectorCalculatorComponent } from './vector-calculator/vector-calculator.component';
import { CalculatorPinGuard } from '../guards/calculator-pin.guard';
import {InformationSystemComponent} from "./information-system/information-system.component";
import {DirectDistanceComponent} from "./direct-distance/direct-distance.component";
import {ComparisonAnalysisComponent} from "./comparison-analysis/comparison-analysis.component";
import {iframeViewerComponent} from "./iframe-viewer/iframe-viewer.component";
import {AdjacencyListInputComponent} from "./adjacency-list-input/adjacency-list-input.component";

const routes: Routes = [
  { path: 'metric-dimension', component: MetricDimensionComponent, canActivate: [CalculatorPinGuard] },
  { path: 'vector-calculator', component: VectorCalculatorComponent, canActivate: [CalculatorPinGuard] },
  { path: 'information-system', component: InformationSystemComponent, canActivate: [CalculatorPinGuard] },
  { path: 'direct-distance', component: DirectDistanceComponent, canActivate: [CalculatorPinGuard] },
  { path: 'comparison-analysis', component: ComparisonAnalysisComponent, canActivate: [CalculatorPinGuard] },
  { path: 'iframe', component: iframeViewerComponent },
  { path: 'adjacency-list', component: AdjacencyListInputComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalculatorsRoutingModule { }
