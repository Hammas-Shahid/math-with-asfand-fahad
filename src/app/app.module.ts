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

@NgModule({
  declarations: [
    AppComponent,
    MetricDimensionComponent
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
    FormsModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
