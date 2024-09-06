import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { PinDialogComponent } from './pin-dialog/pin-dialog.component';
import {CalculatorPinGuard} from "./guards/calculator-pin.guard";
import {AuthService} from "./auth.service";
import {DashboardComponent} from "./dashboard/dashboard.component";
import { saveAs } from 'file-saver';
import {LoggingService} from "../../encryptedKeyLogger";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PinDialogComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatMenuModule,
    MatRadioModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,

  ],
  providers: [CalculatorPinGuard, AuthService, LoggingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
