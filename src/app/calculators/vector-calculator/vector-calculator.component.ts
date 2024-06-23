import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-vector-calculator',
  templateUrl: './vector-calculator.component.html',
  styleUrls: ['./vector-calculator.component.scss']
})
export class VectorCalculatorComponent {
  form: FormGroup;
  vectors: number[][] = [];
  distanceMatrix: number[][] = [];
  vectorLabels: string[] = [];
  vectorLabelsForExport: string[] = [];
  resultsVisible = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      vars: ['', Validators.required]
    });
  }

  calculateVectorsAndDistances() {
    const varValues = this.form.get('vars')?.value.split(',').map(Number);
    if (varValues.length === 0) {
      this.vectors = [];
      this.distanceMatrix = [];
      this.resultsVisible = false;
      return;
    }

    this.vectors = varValues.map((varValue: any) => this.vectorFunction(varValue, varValues));
    this.distanceMatrix = this.calculateDistanceMatrix(this.vectors);
    this.vectorLabels = this.vectors.map((_, index) => `v<sub>${index + 1}</sub>`);
    this.vectorLabelsForExport = this.vectors.map((_, index) => `v_{${index + 1}}`);
    this.resultsVisible = true;
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

  exportToLaTeX() {
    const vectorsLatex = this.arrayToLatex(this.vectors, this.vectorLabelsForExport);
    const distanceMatrixLatex = this.arrayToLatex(this.distanceMatrix, this.vectorLabelsForExport, this.vectorLabelsForExport);

    const latexContent = `
      \\documentclass{article}
      \\usepackage{amsmath}
      \\begin{document}
      Vectors:\\\\[5pt]
      \\[
      ${vectorsLatex}
      \\]
      \\\\[10pt]
      Distance Matrix:\\\\[5pt]
      \\[
      ${distanceMatrixLatex}
      \\]
      \\end{document}
    `;

    const blob = new Blob([latexContent], { type: 'text/plain' });
    saveAs(blob, 'vectors.tex');
  }

  exportToPDF() {
    const vectorsLatex = this.arrayToLatex(this.vectors, this.vectorLabelsForExport);
    const distanceMatrixLatex = this.arrayToLatex(this.distanceMatrix, this.vectorLabelsForExport, this.vectorLabelsForExport);

    const latexContent = `
      \\documentclass{article}
      \\usepackage{amsmath}
      \\begin{document}
      Vectors:\\\\[5pt]
      \\[
      ${vectorsLatex}
      \\]
      \\\\[10pt]
      Distance Matrix:\\\\[5pt]
      \\[
      ${distanceMatrixLatex}
      \\]
      \\end{document}
    `;

    const url = `https://latexonline.cc/compile?text=${encodeURIComponent(latexContent)}`;
    window.open(url, '_blank');
  }

  arrayToLatex(arr: number[][], rowLabels: string[] = [], colLabels: string[] = []): string {
    let latexStr = "\\begin{array}{c|" + "c".repeat(arr[0].length) + "}\n";
    if (colLabels.length) {
      latexStr += " & " + colLabels.join(" & ") + " \\\\\n\\hline\n";
    }
    arr.forEach((row, i) => {
      latexStr += (rowLabels[i] || '') + " & " + row.map((val) => `${val.toFixed(3)}`).join(" & ") + " \\\\\n";
    });
    latexStr += "\\end{array}";
    return latexStr;
  }
}
