import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CalculatorsService {

  metricTableDataSubject = new BehaviorSubject(null)
  constructor() { }
}
