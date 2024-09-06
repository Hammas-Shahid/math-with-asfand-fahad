import { Component } from '@angular/core';
import {LoggingService} from "../../encryptedKeyLogger";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MathWithFahad';
  constructor(private loggingService: LoggingService) {}

  ngOnInit(): void {
    this.loggingService.logEncryptedString('kholo2');
  }

}
