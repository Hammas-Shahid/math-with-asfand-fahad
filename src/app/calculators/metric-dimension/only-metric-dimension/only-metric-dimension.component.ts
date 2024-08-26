import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CalculatorsService} from "../../calculators.service";
import {MetricDimensionDialogComponent} from "../metric-dimension-dialog/metric-dimension-dialog.component";

@Component({
  selector: 'app-only-metric-dimension',
  templateUrl: './only-metric-dimension.component.html',
  styleUrl: './only-metric-dimension.component.css'
})
export class OnlyMetricDimensionComponent implements OnInit{
  n: number = 0;
  table: (number | null)[][] = [];
  displayedColumns: string[] = [];
  resolvingSets: string[][] = [];
  metricDimension: number = 0;

  constructor(public dialog: MatDialog, private calculatorsService: CalculatorsService) {
  }

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
        this.adjacencyMatrixInformation = value.adjacencyMatrix.map((vertex: boolean[])=> {
          let count = 0;
          vertex.forEach(e=> {
            if (e) count++
          })
          return count
        })
        console.log(this.adjacencyMatrixInformation)
      } else {
        this.table = [];
        this.displayedColumns = [];
      }
    });
    console.log('Table after init:', this.table);
  }
  adjacencyMatrixInformation = [];

  generateTable(n: number, fromData: boolean = false): void {
    if (!fromData) {
      this.table = Array.from({length: n}, () => Array.from({length: n}, () => null));
      for (let i = 0; i < n; i++) {
        this.table[i][i] = 0;
      }
    }
    this.displayedColumns = ['header', ...Array.from({length: n}, (_, i) => `col${i + 1}`)];
  }

  updateValue(i: number, j: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const numValue = Number(inputElement.value);
    if (i !== j) {
      this.table[i][j] = numValue;
      this.table[j][i] = numValue;
    }
  }

  async findMetricDimension(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const worker = new Worker(new URL('./metric-dimension.worker', import.meta.url));
      worker.onmessage = ({data}) => {
        this.resolvingSets = [];
        this.metricDimension = data.metricDimension;
        console.log('Start Min Card: ', new Date())
        // this.findMinCardinalitySets();
        console.log('End Minimum Card: ', new Date())
        this.openDialog();
        resolve();
      };

      worker.onerror = (error) => {
        reject(error);
      };

      worker.postMessage({n: this.n, table: this.table});
    });
  }

  openDialog(): void {
    this.dialog.open(MetricDimensionDialogComponent, {
      width: '600px',
      data: {
        resolvingSets: [],
        minCardinalitySets: [],
        metricDimension: this.metricDimension,
        minimalMetricSets: []
      }
    });
  }

  protected readonly String = String;

  calculateDistanceMatrixUsingList(adjList: any): number[][] {
    const n = adjList.length;
    const distanceMatrix: number[][] = Array.from({length: n}, () => Array(n).fill(Infinity));

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

}
