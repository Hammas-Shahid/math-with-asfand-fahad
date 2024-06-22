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
  resolvingSets: string[][] = [];

  generateTable(): void {
    this.table = Array.from({ length: this.n }, () => Array.from({ length: this.n }, () => null));
    this.displayedColumns = ['header', ...Array.from({ length: this.n }, (_, i) => `col${i + 1}`)];
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

  findResolvingSets(): void {
    this.resolvingSets = this.calculateResolvingSets();
    this.sortResolvingSets();
  }

  private calculateResolvingSets(): string[][] {
    const vertices = Array.from({ length: this.n }, (_, i) => i + 1);
    const allSubsets = this.getAllSubsets(vertices);
    const resolvingSets: string[][] = [];

    for (const subset of allSubsets) {
      if (this.isResolvingSet(subset)) {
        resolvingSets.push(subset.map(v => `v${v}`).sort());
      }
    }

    return resolvingSets;
  }

  private getAllSubsets(arr: number[]): number[][] {
    return arr.reduce<number[][]>(
      (subsets, value) => subsets.concat(subsets.map(set => [value, ...set])),
      [[]]
    );
  }

  private isResolvingSet(subset: number[]): boolean {
    const distances = new Set<string>();

    for (let i = 0; i < this.n; i++) {
      const distanceVector = subset.map(j => this.table[i][j - 1]).join(',');
      if (distances.has(distanceVector)) {
        return false;
      }
      distances.add(distanceVector);
    }

    return true;
  }

  private sortResolvingSets(): void {
    this.resolvingSets.sort((a, b) => a.length - b.length || a.join('').localeCompare(b.join('')));
  }

  protected readonly String = String;
}
