import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatTableModule} from "@angular/material/table";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatInput} from "@angular/material/input";
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";
import {MatTooltip} from "@angular/material/tooltip";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatCheckbox} from "@angular/material/checkbox";
import { MetricDimensionComponent } from './metric-dimension/metric-dimension.component';
import { MetricDimensionDialogComponent } from './metric-dimension/metric-dimension-dialog/metric-dimension-dialog.component';
import {MatIconModule} from "@angular/material/icon";
import {MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatButton, MatIconButton} from "@angular/material/button";

@NgModule({
  declarations: [
    AppComponent,
    MetricDimensionComponent,
    MetricDimensionDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatSelectModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MatSelect,
    MatOption,
    MatTooltip,
    MatMenu,
    MatMenuTrigger,
    MatRadioGroup,
    MatRadioButton,
    MatCheckbox,
    FormsModule,
    MatIconModule,
    MatDialogClose,
    MatIconButton,
    MatDialogTitle,
    MatDialogContent,
    MatButton
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
