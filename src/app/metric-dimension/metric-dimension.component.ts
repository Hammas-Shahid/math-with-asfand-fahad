import { Component } from '@angular/core';

@Component({
  selector: 'app-metric-dimension',
  templateUrl: './metric-dimension.component.html',
  styleUrls: ['./metric-dimension.component.css']
})
export class MetricDimensionComponent {
  n: number = 0;
  table: (number | null)[][] = [];
  displayedColumns: string[] = [];

  generateTable(): void {
    this.table = Array.from({ length: this.n }, () => Array.from({ length: this.n }, () => null));
    this.displayedColumns = ['header', ...Array.from({ length: this.n }, (_, i) => `col${i}`)];
    for (let i = 0; i < this.n; i++) {
      this.table[i][i] = 0;
    }
  }

  updateValue(i: number, j: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const numValue = Number(inputElement.value);
    if (i !== j) {
      this.table[i][j] = numValue;
      this.table[j][i] = numValue;
    }
  }

  protected readonly String = String;
}
