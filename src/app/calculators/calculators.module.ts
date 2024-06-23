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
import { DashboardComponent } from '../dashboard/dashboard.component';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import { VectorCalculatorComponent } from './vector-calculator/vector-calculator.component';
import { InformationSystemComponent } from './information-system/information-system.component';
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatOption, MatSelect} from "@angular/material/select";

@NgModule({
  declarations: [
    MetricDimensionComponent,
    MetricDimensionDialogComponent,
    VectorCalculatorComponent,
    InformationSystemComponent
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
    MatOption
  ]
})
export class CalculatorsModule { }
