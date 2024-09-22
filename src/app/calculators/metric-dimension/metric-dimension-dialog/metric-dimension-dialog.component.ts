import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {CalculatorsService} from "../../calculators.service";

@Component({
  selector: 'app-metric-dimension-dialog',
  templateUrl: './metric-dimension-dialog.component.html',
  styleUrls: ['./metric-dimension-dialog.component.css']
})
export class MetricDimensionDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private calculatorsService: CalculatorsService) {
    const navigatedData = this.calculatorsService.metricTableDataSubject.value;
    if (navigatedData)
    this.inputType = navigatedData.inputType;
  }

  inputType = null;
}
