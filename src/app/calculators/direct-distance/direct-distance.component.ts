import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-direct-distance',
  templateUrl: './direct-distance.component.html',
  styleUrls: ['./direct-distance.component.css']
})
export class DirectDistanceComponent {
  form: FormGroup;
  directDistanceMatrix: number[][] = [];
  vectorLabels: string[] = [];
  vectorLabelsForExport: string[] = [];
  resultsVisible = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      vars: ['', Validators.required]
    });
  }

  calculateDirectDistances() {
    const varValues = this.form.get('vars')?.value.split(',').map(Number);
    if (varValues.length === 0) {
      this.directDistanceMatrix = [];
      this.resultsVisible = false;
      return;
    }

    this.directDistanceMatrix = this.calculateDirectDistanceMatrix(varValues);
    this.vectorLabels = varValues.map((_: any, index: any) => `v<sub>${index + 1}</sub>`);
    this.vectorLabelsForExport = varValues.map((_: any, index: any) => `v_{${index + 1}}`);
    this.resultsVisible = true;
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

  exportToLaTeX() {
    const directDistanceMatrixLatex = this.arrayToLatex(this.directDistanceMatrix, this.vectorLabelsForExport, this.vectorLabelsForExport);

    const latexContent = `
      \\documentclass{article}
      \\usepackage{amsmath}
      \\begin{document}
      Distance Matrix for ????:\\\\[5pt]
      \\[
      ${directDistanceMatrixLatex}
      \\]
      \\end{document}
    `;

    const blob = new Blob([latexContent], { type: 'text/plain' });
    saveAs(blob, 'direct_distance_matrix.tex');
  }

  exportToPDF() {
    const directDistanceMatrixLatex = this.arrayToLatex(this.directDistanceMatrix, this.vectorLabelsForExport, this.vectorLabelsForExport);

    const latexContent = `
      \\documentclass{article}
      \\usepackage{amsmath}
      \\begin{document}
      Direct Distance Matrix:\\\\[5pt]
      \\[
      ${directDistanceMatrixLatex}
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
