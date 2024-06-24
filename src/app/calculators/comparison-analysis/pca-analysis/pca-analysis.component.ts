import { Component, Input } from '@angular/core';
import PCA from 'pca-js';

@Component({
  selector: 'app-pca-analysis',
  templateUrl: './pca-analysis.component.html',
  styleUrls: ['./pca-analysis.component.css']
})
export class PcaAnalysisComponent {
  private _distanceMatrix: number[][] = [];
  private _directDistanceMatrix: number[][] = [];
  pcaResult1: number[][] = [];
  pcaResult2: number[][] = [];

  @Input()
  set distanceMatrix(value: number[][]) {
    this._distanceMatrix = value;
    this.performPCA();
  }

  @Input()
  set directDistanceMatrix(value: number[][]) {
    this._directDistanceMatrix = value;
    this.performPCA();
  }

  get distanceMatrix(): number[][] {
    return this._distanceMatrix;
  }

  get directDistanceMatrix(): number[][] {
    return this._directDistanceMatrix;
  }

  performPCA() {
    if (this._distanceMatrix.length && this._directDistanceMatrix.length) {
      this.pcaResult1 = this.calculatePCA(this._distanceMatrix);
      this.pcaResult2 = this.calculatePCA(this._directDistanceMatrix);
    }
  }

  calculatePCA(matrix: number[][]): number[][] {
    const pca = PCA.getEigenVectors(matrix);
    const projected = PCA.computeAdjustedData(matrix, pca[0], pca[1]).adjustedData;
    return projected.map((point: any) => [point[0], point[1]]);
  }
}
