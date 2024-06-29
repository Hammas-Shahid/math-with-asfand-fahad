import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { CalculatorsRoutingModule } from './calculators-routing.module';
import { MetricDimensionComponent } from './metric-dimension/metric-dimension.component';
import { MetricDimensionDialogComponent } from './metric-dimension/metric-dimension-dialog/metric-dimension-dialog.component';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import { VectorCalculatorComponent } from './vector-calculator/vector-calculator.component';
import { InformationSystemComponent } from './information-system/information-system.component';
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatOption, MatSelect} from "@angular/material/select";
import { DirectDistanceComponent } from './direct-distance/direct-distance.component';
import { ComparisonAnalysisComponent } from './comparison-analysis/comparison-analysis.component';
import { RegressionAnalysisComponent } from './comparison-analysis/regression-analysis/regression-analysis.component';
import { MantelTestAnalysisComponent } from './comparison-analysis/mantel-test-analysis/mantel-test-analysis.component';
import { MdsAnalysisComponent } from './comparison-analysis/mds-analysis/mds-analysis.component';
import { PcaAnalysisComponent } from './comparison-analysis/pca-analysis/pca-analysis.component';
import { HeatmapAnalysisComponent } from './comparison-analysis/heatmap-analysis/heatmap-analysis.component';
import {BaseChartDirective, provideCharts, withDefaultRegisterables} from "ng2-charts";
import { Chart, registerables } from 'chart.js';
import {iframeViewerComponent} from "./iframe-viewer/iframe-viewer.component";
import { AdjacencyListInputComponent } from './adjacency-list-input/adjacency-list-input.component';

Chart.register(...registerables);


@NgModule({
  providers: [provideCharts(withDefaultRegisterables())],
  declarations: [
    MetricDimensionComponent,
    MetricDimensionDialogComponent,
    VectorCalculatorComponent,
    InformationSystemComponent,
    DirectDistanceComponent,
    ComparisonAnalysisComponent,
    RegressionAnalysisComponent,
    MantelTestAnalysisComponent,
    MdsAnalysisComponent,
    PcaAnalysisComponent,
    HeatmapAnalysisComponent,
    iframeViewerComponent,
    AdjacencyListInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    CalculatorsRoutingModule,
    MatGridList,
    MatGridTile,
    MatMenuTrigger,
    MatCheckbox,
    MatMenu,
    MatRadioButton,
    MatRadioGroup,
    MatSelect,
    MatOption,
    BaseChartDirective,
  ]
})
export class CalculatorsModule { }
