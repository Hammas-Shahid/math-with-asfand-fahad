import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-comparison-analysis',
  templateUrl: './comparison-analysis.component.html',
  styleUrls: ['./comparison-analysis.component.css']
})
export class ComparisonAnalysisComponent {
  form1: FormGroup;
  form2: FormGroup;
  vectors: number[][] = [];
  distanceMatrix: number[][] = [];
  directDistanceMatrix: number[][] = [];
  vectorLabels: string[] = [];
  resultsVisible = false;

  constructor(private fb: FormBuilder) {
    this.form1 = this.fb.group({
      vars1: ['', Validators.required]
    });
    this.form2 = this.fb.group({
      vars2: ['', Validators.required]
    });
  }

  calculateDataAndDistances() {
    const varValues1 = this.form1.get('vars1')?.value.split(',').map(Number);
    const varValues2 = this.form2.get('vars2')?.value.split(',').map(Number);
    if (varValues1.length === 0 || varValues2.length === 0) {
      this.resetResults();
      return;
    }

    this.vectors = varValues1.map((varValue: any) => this.vectorFunction(varValue, varValues1));
    this.distanceMatrix = this.calculateDistanceMatrix(this.vectors);
    this.directDistanceMatrix = this.calculateDirectDistanceMatrix(varValues2);
    this.vectorLabels = this.vectors.map((_, index) => `v<sub>${index + 1}</sub>`);
    this.resultsVisible = true;
  }

  resetResults() {
    this.vectors = [];
    this.distanceMatrix = [];
    this.directDistanceMatrix = [];
    this.resultsVisible = false;
  }

  vectorFunction(varValue: number, allVars: number[]): number[] {
    const otherVars = allVars.filter((v) => v !== varValue);
    const maxDiff = Math.max(...otherVars.map((v) => Math.abs(varValue - v))) / varValue;
    const sumDiff = otherVars.reduce((sum, v) => sum + Math.abs(varValue - v), 0) / varValue / allVars.length;
    return [varValue, maxDiff, sumDiff];
  }

  calculateDistanceMatrix(vectors: number[][]): number[][] {
    const distanceMatrix: number[][] = Array(vectors.length).fill(null).map(() => Array(vectors.length).fill(0));
    for (let i = 0; i < vectors.length; i++) {
      for (let j = 0; j < vectors.length; j++) {
        distanceMatrix[i][j] = Math.sqrt(vectors[i].reduce((sum, value, index) => sum + Math.pow(value - vectors[j][index], 2), 0));
      }
    }
    return distanceMatrix;
  }

  calculateDirectDistanceMatrix(vars: number[]): number[][] {
    const distanceMatrix: number[][] = Array(vars.length).fill(null).map(() => Array(vars.length).fill(0));
    for (let i = 0; i < vars.length; i++) {
      for (let j = 0; j < vars.length; j++) {
        distanceMatrix[i][j] = Math.sqrt(Math.pow(vars[i] - vars[j], 2));
      }
    }
    return distanceMatrix;
  }
}
