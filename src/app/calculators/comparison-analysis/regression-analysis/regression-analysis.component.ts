import { Component, Input, OnChanges } from '@angular/core';
import * as math from 'mathjs';

@Component({
  selector: 'app-regression-analysis',
  templateUrl: './regression-analysis.component.html',
  styleUrls: ['./regression-analysis.component.css']
})
export class RegressionAnalysisComponent implements OnChanges {
  @Input() distanceMatrix: number[][] = [];
  @Input() directDistanceMatrix: number[][] = [];
  regressionResult: any = null;

  ngOnChanges() {
    if (this.distanceMatrix.length && this.directDistanceMatrix.length) {
      this.performRegressionAnalysis();
    }
  }

  performRegressionAnalysis() {
    const x = this.distanceMatrix.flat();
    const y = this.directDistanceMatrix.flat();

    const sumX = math.sum(x);
    const sumY = math.sum(y);
    const sumXY = math.sum(x.map((xi, i) => xi * y[i]));
    const sumX2 = math.sum(x.map(xi => xi * xi));
    const n = x.length;

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    this.regressionResult = { slope, intercept };
  }
}
