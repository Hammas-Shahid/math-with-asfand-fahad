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
        // this.calculatorsService.metricTableDataSubject.next(null);
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

  findResolvingSets(): void {
    // if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('../metric-dimension/resolving-sets.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        this.resolvingSets = data.resolvingSets;
        this.sortResolvingSets();
        this.findMinCardinalitySets();
        this.findMinimalMetricSets();
        this.openDialog();
      };

      worker.postMessage({ n: this.n, table: this.table });
    // } else {
      // Web Workers are not supported in this environment.
      // You can fallback to running on the main thread if needed.
      // this.resolvingSets = this.calculateResolvingSets();
    //   this.sortResolvingSets();
    //   this.findMinCardinalitySets();
    //   this.findMinimalMetricSets();
    //   this.openDialog();
    // }
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

      // Update the distance matrix for the starting node
      for (let i = 0; i < n; i++) {
        distanceMatrix[start][i] = distances[i];
      }
    };

    // Perform BFS from each node
    for (let i = 0; i < n; i++) {
      bfs(i);
    }

    // Replace Infinity with -1 to indicate no path exists if preferred
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (distanceMatrix[i][j] === Infinity) {
          distanceMatrix[i][j] = -1;
        }
      }
    }

    return distanceMatrix;
  }

}
