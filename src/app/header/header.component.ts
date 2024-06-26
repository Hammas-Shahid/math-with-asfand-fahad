import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { fromEvent, timer } from 'rxjs';
import { buffer, debounceTime, filter, map } from 'rxjs/operators';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router: Router) {
  }
  runFunction() {
    console.log('Function executed!');
    this.router.navigate([`calculators/iframe`]);
  }
}
