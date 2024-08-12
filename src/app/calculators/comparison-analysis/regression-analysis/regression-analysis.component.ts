import { Component, Input } from '@angular/core';
import * as math from 'mathjs';
import * as jStat from 'jstat';

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
      const sumY2 = math.sum(y.map(yi => yi * yi));
      const n = x.length;

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      const r = (n * sumXY - sumX * sumY) / Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
      const rSquared = r * r;

      const residuals = y.map((yi, i) => yi - (slope * x[i] + intercept));
      const sse = math.sum(residuals.map(res => res * res));
      const sst = math.sum(y.map(yi => (yi - sumY / n) * (yi - sumY / n)));
      const mse = sse / (n - 2);
      const se = Math.sqrt(mse / math.sum(x.map(xi => (xi - sumX / n) * (xi - sumX / n))));
      const t = slope / se;
      const pValue = 2 * (1 - jStat.cdf(Math.abs(t), n - 2, 1));

      this.regressionResult = { slope, intercept, r, rSquared, pValue };
    }
  }
}
