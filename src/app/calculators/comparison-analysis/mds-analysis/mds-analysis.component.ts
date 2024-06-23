import { Component, Input } from '@angular/core';
import { Matrix, SVD } from 'ml-matrix';

@Component({
  selector: 'app-mds-analysis',
  templateUrl: './mds-analysis.component.html',
  styleUrls: ['./mds-analysis.component.css']
})
export class MdsAnalysisComponent {
  private _distanceMatrix: number[][] = [];
  private _directDistanceMatrix: number[][] = [];
  mdsResult1: number[][] = [];
  mdsResult2: number[][] = [];

  @Input()
  set distanceMatrix(value: number[][]) {
    this._distanceMatrix = value;
    this.performMDS();
  }

  @Input()
  set directDistanceMatrix(value: number[][]) {
    this._directDistanceMatrix = value;
    this.performMDS();
  }

  get distanceMatrix(): number[][] {
    return this._distanceMatrix;
  }

  get directDistanceMatrix(): number[][] {
    return this._directDistanceMatrix;
  }

  performMDS() {
    if (this._distanceMatrix.length && this._directDistanceMatrix.length) {
      this.mdsResult1 = this.calculateMDS(this._distanceMatrix);
      this.mdsResult2 = this.calculateMDS(this._directDistanceMatrix);
    }
  }

  calculateMDS(distanceMatrix: number[][]): number[][] {
    const n = distanceMatrix.length;
    const H = Matrix.eye(n).add(Matrix.ones(n, n).mul(-1 / n));
    const B = H.mmul(new Matrix(distanceMatrix)).mmul(H).mul(-0.5);

    const svd = new SVD(B);
    const eigenValues = svd.diagonalMatrix.diag();
    const eigenVectors = svd.leftSingularVectors;

    const positiveEigenValues = eigenValues.filter(eigenValue => eigenValue > 0);
    const dimensions = Math.min(2, positiveEigenValues.length);
    const lambda = Matrix.diag(positiveEigenValues.slice(0, dimensions));

    return eigenVectors.subMatrix(0, eigenVectors.rows - 1, 0, dimensions - 1).mmul(lambda.sqrt()).to2DArray();
  }
}
