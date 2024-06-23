import { Component, Input } from '@angular/core';
import * as math from 'mathjs';

@Component({
  selector: 'app-regression-analysis',
  templateUrl: './regression-analysis.component.html',
  styleUrls: ['./regression-analysis.component.css']
})
export class RegressionAnalysisComponent {
  private _distanceMatrix: number[][] = [];
  private _directDistanceMatrix: number[][] = [];
  regressionResult: any = null;

  @Input()
  set distanceMatrix(value: number[][]) {
    console.log('adsfa')
    this._distanceMatrix = value;
    this.performRegressionAnalysis();
  }

  @Input()
  set directDistanceMatrix(value: number[][]) {
    this._directDistanceMatrix = value;
    this.performRegressionAnalysis();
  }

  get distanceMatrix(): number[][] {
    return this._distanceMatrix;
  }

  get directDistanceMatrix(): number[][] {
    return this._directDistanceMatrix;
  }

  performRegressionAnalysis() {
    if (this._distanceMatrix.length && this._directDistanceMatrix.length) {
      const x = this._distanceMatrix.flat();
      const y = this._directDistanceMatrix.flat();

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
}
