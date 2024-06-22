import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-metric-dimension-dialog',
  templateUrl: './metric-dimension-dialog.component.html',
  styleUrls: ['./metric-dimension-dialog.component.css']
})
export class MetricDimensionDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
