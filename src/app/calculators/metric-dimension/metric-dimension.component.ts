import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { MetricDimensionDialogComponent } from './metric-dimension-dialog/metric-dimension-dialog.component';
import { CalculatorsService } from '../calculators.service';
import {getSecondsBetweenDates} from "../../functions";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-metric-dimension',
  templateUrl: './metric-dimension.component.html',
  styleUrls: ['./metric-dimension.component.css']
})
export class MetricDimensionComponent implements OnInit {
  n: number = 0;
  table: (number | null)[][] = [];
  displayedColumns: string[] = [];
  resolvingSets: any[][] = [];
  minCardinalitySets: string[][] = [];
  minimalMetricSets: string[][] = [];
  metricDimension: number = 0;
  adjacencyMatrixInformation: number[] = [];

  constructor(public dialog: MatDialog, private calculatorsService: CalculatorsService) {}

  ngOnInit(): void {
    let navigatedData: any = null;
    this.calculatorsService.metricTableDataSubject.subscribe(value => {
      navigatedData = value.adjacencyList;
      if (navigatedData) {
        console.log('Received state:', navigatedData);
        navigatedData = this.calculateDistanceMatrixUsingList(navigatedData);
        this.table = navigatedData as any;
        this.n = this.table.length;
        this.generateTable(this.n, true);
        this.adjacencyMatrixInformation = value.adjacencyMatrix.map((vertex: boolean[]) => {
          let count = 0;
          vertex.forEach(e => {
            if (e) count++;
          });
          return count;
        });
        console.log(this.adjacencyMatrixInformation);
      } else {
        this.table = [];
        this.displayedColumns = [];
      }
    });
    console.log('Table after init:', this.table);
  }

  generateTable(n: number, fromData: boolean = false): void {
    if (!fromData) {
      this.table = Array.from({ length: n }, () => Array.from({ length: n }, () => null));
      for (let i = 0; i < n; i++) {
        this.table[i][i] = 0;
      }
    }
    this.displayedColumns = ['header', ...Array.from({ length: n }, (_, i) => `col${i + 1}`)];
  }

  updateValue(i: number, j: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const numValue = Number(inputElement.value);
    if (i !== j) {
      this.table[i][j] = numValue;
      this.table[j][i] = numValue;
    }
  }
  batchSize = 6;
  async findResolvingSets(): Promise<void> {
    const distinctSetsAgainstOrderedPairs = this.findEntriesOfDiscernibilityMatrix(this.n, this.table);
    const totalPairs = distinctSetsAgainstOrderedPairs.length - 1;
    const batchSize: number = this.batchSize;
    console.log('batchSize', batchSize);
    const startTime = new Date();
    let totalSets = 0;

    // Initialize an empty array to store all promises
    const workerPromises = [];

    for (let i = 0; i < totalPairs; i += batchSize) {
      console.log(`Batch ${Math.floor(i / batchSize) + 1} started at ${new Date()}`);
      // Create a batch of promises
      const currentBatchPromises = [];

      for (let j = i; j < i + batchSize && j < totalPairs; j++) {
        const worker = new Worker(new URL('./processPairWorker', import.meta.url));

        const promise = new Promise<void>((resolve, reject) => {
          worker.onmessage = ({ data }) => {
            this.resolvingSets.push(...data);
            // totalSets = totalSets + data.length;
            worker.terminate();
            resolve();
          };

          worker.onerror = (error) => {
            reject(error);
          };

          worker.postMessage({ distinctSetsAgainstOrderedPairs, i: j, j: j + 1 });
        });

        currentBatchPromises.push(promise);
      }

      // Wait for the current batch to complete before proceeding to the next batch
      await Promise.all(currentBatchPromises);
      console.log(`Batch ${Math.floor(i / batchSize) + 1} completed at ${new Date()}`);
    }

    getSecondsBetweenDates(startTime)

    // console.log(this.resolvingSets);
    // console.log('totalSets', totalSets);

    const distinctMinimalResolvingSets = this.getDistinctArrays(this.resolvingSets);
    const filteredDistinctMinimalResolvingSets = distinctMinimalResolvingSets.filter(e => !this.isProperSupersetOfAny(e, distinctMinimalResolvingSets));

    console.log('Final Minimal Resolving Sets (Distinct):', filteredDistinctMinimalResolvingSets);
    console.log('End: ', new Date());

    // this.sortResolvingSets();
    // this.findMinCardinalitySets();
    // this.findMinimalMetricSets();
    // this.openDialog();
  }

  getDistinctArrays(arrays: number[][]) {
    const distinctArrays: number[][] = [];

    arrays.forEach(array => {
      if (!distinctArrays.some(distinctArray => this.arraysAreEqual(array, distinctArray))) {
        distinctArrays.push(array);
      }
    });

    return distinctArrays;
  }

  private sortResolvingSets(): void {
    this.resolvingSets.sort((a, b) => a.length - b.length || a.join('').localeCompare(b.join('')));
  }

  private findMinCardinalitySets(): void {
    if (this.resolvingSets.length === 0) {
      this.minCardinalitySets = [];
      this.metricDimension = 0;
      return;
    }

    const minCardinality = this.resolvingSets[0].length;
    this.minCardinalitySets = this.resolvingSets.filter(set => set.length === minCardinality);
    this.metricDimension = minCardinality;
  }

  private findMinimalMetricSets(): void {
    this.minimalMetricSets = this.resolvingSets.filter((set, index, self) =>
      !self.some((otherSet, otherIndex) =>
        otherIndex !== index && otherSet.every(v => set.includes(v))
      )
    );
  }

  openDialog(): void {
    this.dialog.open(MetricDimensionDialogComponent, {
      width: '600px',
      data: {
        resolvingSets: this.resolvingSets,
        minCardinalitySets: this.minCardinalitySets,
        metricDimension: this.metricDimension,
        minimalMetricSets: this.minimalMetricSets
      }
    });
  }

  protected readonly String = String;

  calculateDistanceMatrixUsingList(adjList: any): number[][] {
    const n = adjList.length;
    const distanceMatrix: number[][] = Array.from({ length: n }, () => Array(n).fill(Infinity));

    const bfs = (start: number) => {
      const queue: number[] = [start];
      const distances: number[] = Array(n).fill(Infinity);
      distances[start] = 0;

      while (queue.length > 0) {
        const node = queue.shift()!;

        for (const adjacent of adjList[node]) {
          if (distances[adjacent] === Infinity) {
            distances[adjacent] = distances[node] + 1;
            queue.push(adjacent);
          }
        }
      }

      for (let i = 0; i < n; i++) {
        distanceMatrix[start][i] = distances[i];
      }
    };

    for (let i = 0; i < n; i++) {
      bfs(i);
    }

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (distanceMatrix[i][j] === Infinity) {
          distanceMatrix[i][j] = -1;
        }
      }
    }

    return distanceMatrix;
  }

  findEntriesOfDiscernibilityMatrix(n, table) {
    const resolvants = [];
    const resolvantsAgainstPairs = [];

    for (let i = 1; i < n; i++) {
      for (let j = i + 1; j <= n; j++) {
        const resolvent = [];
        for (let [index, row] of table.entries()) {
          if (row[i - 1] !== row[j - 1]) {
            resolvent.push(index + 1);
          }
        }
        resolvantsAgainstPairs.push([`(${i}, ${j})`, resolvent]);
        resolvants.push(resolvent);
      }
    }

    const distinctPairs = this.getDistinctPairs(resolvantsAgainstPairs);
    console.log(distinctPairs.length);
    const filteredDistinctPairs = [];
    for (let pair of distinctPairs) {
      if (!this.isProperSupersetOfAny(pair[1], resolvants)) {
        filteredDistinctPairs.push(pair);
      }
    }
    console.log(filteredDistinctPairs.length);
    return filteredDistinctPairs;
  }

  getDistinctPairs(arr) {
    const distinctPairs = [];
    for (const pair of arr) {
      const [, value] = pair;
      if (!distinctPairs.some(([_, v]) => this.arraysAreEqual(v, value))) {
        distinctPairs.push(pair);
      }
    }
    return distinctPairs;
  }

  isProperSupersetOfAny(subset, resolvingSets) {
    return resolvingSets.some(set => this.isProperSuperset(subset, set));
  }

  isProperSuperset(superset, subset) {
    return superset.length > subset.length && subset.every(value => superset.includes(value));
  }

  arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    const sortedArr1 = [...arr1].sort((a, b) => a - b);
    const sortedArr2 = [...arr2].sort((a, b) => a - b);
    return sortedArr1.every((value, index) => value === sortedArr2[index]);
  }

  async exportToLatex() {
    await this.findResolvingSets().then(() => {
      const latex = this.generateLatex();
      const blob = new Blob([latex], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'results.tex';
      link.click();
    });
  }

  async exportToPDF() {
    await this.findResolvingSets().then(() => {
      const url = `https://latexonline.cc/compile?text=${encodeURIComponent(this.generateLatex())}`;
      window.open(url, '_blank');
    });
  }

  private generateLatex(): string {
    let latex = '\\documentclass{article}\n\\usepackage{amsmath}\n\\begin{document}\n';
    latex += '\\section*{Metric Dimension Results}\n';

    latex += '\\subsection*{Metric Dimension}\n';
    latex += `The metric dimension is ${this.metricDimension}.\n`;

    latex += '\\subsection*{Resolving Sets}\n';
    latex += '\\begin{itemize}\n';
    this.resolvingSets.forEach(set => {
      latex += `  \\item ${set.join(', ')}\n`;
    });
    latex += '\\end{itemize}\n';

    latex += '\\subsection*{Minimum Cardinality Sets}\n';
    latex += '\\begin{itemize}\n';
    this.minCardinalitySets.forEach(set => {
      latex += `  \\item ${set.join(', ')}\n`;
    });
    latex += '\\end{itemize}\n';

    latex += '\\subsection*{Minimal Cardinality Sets}\n';
    latex += '\\begin{itemize}\n';
    this.minimalMetricSets.forEach(set => {
      latex += `  \\item ${set.join(', ')}\n`;
    });
    latex += '\\end{itemize}\n';

    latex += '\\end{document}\n';

    return latex;
  }

  isTableFullyFilled(): boolean {
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        if (this.table[i][j] === null) {
          return false;
        }
      }
    }
    return true;
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.table);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'table.xlsx');
  }

  exportGraphParamsToExcel(): void {
    const data: number[] = this.adjacencyMatrixInformation;

    const dataArray: (string | number)[][] = data.map((value, index) => [`v${index + 1}`, value]);

    const headers: string[] = ['Vertex', 'Degree'];

    dataArray.unshift(headers);

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dataArray);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'graph-parameters.xlsx');
  }
}
