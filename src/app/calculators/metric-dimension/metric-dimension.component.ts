import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MetricDimensionDialogComponent } from './metric-dimension-dialog/metric-dimension-dialog.component';
import { CalculatorsService } from '../calculators.service';

@Component({
  selector: 'app-metric-dimension',
  templateUrl: './metric-dimension.component.html',
  styleUrls: ['./metric-dimension.component.css']
})
export class MetricDimensionComponent implements OnInit {
  n: number = 0;
  table: (number | null)[][] = [];
  displayedColumns: string[] = [];
  resolvingSets: string[][] = [];
  minCardinalitySets: string[][] = [];
  minimalMetricSets: string[][] = [];
  metricDimension: number = 0;

  constructor(public dialog: MatDialog, private calculatorsService: CalculatorsService) {}

  ngOnInit(): void {
    let navigatedData: any = null;
    this.calculatorsService.metricTableDataSubject.subscribe(value => {
      navigatedData = value;
      if (navigatedData) {
        console.log('Received state:', navigatedData);
        navigatedData = this.calculateDistanceMatrixUsingList(navigatedData);
        this.table = navigatedData as any;
        this.n = this.table.length;
        this.generateTable(this.n, true);
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

  async findResolvingSets(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const worker = new Worker(new URL('../metric-dimension/resolving-sets.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        this.resolvingSets = data.resolvingSets;
        this.sortResolvingSets();
        this.findMinCardinalitySets();
        this.findMinimalMetricSets();
        this.openDialog();
        resolve();
      };

      worker.onerror = (error) => {
        reject(error);
      };

      worker.postMessage({ n: this.n, table: this.table });
    });
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
}
