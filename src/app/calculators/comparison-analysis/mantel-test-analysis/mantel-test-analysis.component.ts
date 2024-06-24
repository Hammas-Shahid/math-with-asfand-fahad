import { Component, Input } from '@angular/core';
import * as math from 'mathjs';

@Component({
  selector: 'app-mantel-test-analysis',
  templateUrl: './mantel-test-analysis.component.html',
  styleUrls: ['./mantel-test-analysis.component.css']
})
export class MantelTestAnalysisComponent {
  private _distanceMatrix: number[][] = [];
  private _directDistanceMatrix: number[][] = [];
  mantelTestResult: any = null;

  @Input()
  set distanceMatrix(value: number[][]) {
    this._distanceMatrix = value;
    this.performMantelTest();
  }

  @Input()
  set directDistanceMatrix(value: number[][]) {
    this._directDistanceMatrix = value;
    this.performMantelTest();
  }

  get distanceMatrix(): number[][] {
    return this._distanceMatrix;
  }

  get directDistanceMatrix(): number[][] {
    return this._directDistanceMatrix;
  }

  performMantelTest() {
    console.log('before')
    if (this._distanceMatrix.length && this._directDistanceMatrix.length) {
      console.log('after')

      const x = this._distanceMatrix.flat();
      const y = this._directDistanceMatrix.flat();

      const meanX = math.mean(x);
      const meanY = math.mean(y);

      const centeredX = x.map(xi => xi - meanX);
      const centeredY = y.map(yi => yi - meanY);

      const numerator = math.sum(centeredX.map((xi, i) => xi * centeredY[i]));
      const denominator = Math.sqrt(math.sum(centeredX.map(xi => xi * xi)) * math.sum(centeredY.map(yi => yi * yi)));

      const r = numerator / denominator;
      this.mantelTestResult = r;
    }
  }
}
