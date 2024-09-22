import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CalculatorsService} from "../../calculators.service";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-discernibility-matrix',
  templateUrl: './discernibility-matrix.component.html',
  styleUrl: './discernibility-matrix.component.css'
})
export class DiscernibilityMatrixComponent implements OnInit{
  n: number = 0;
  table: (number | null)[][] = [];
  displayedColumns: string[] = [];
  adjacencyMatrixInformation: number[] = [];
  discernibilityMatrix = [];
  title: string = '';

  constructor(private calculatorsService: CalculatorsService) {}

  ngOnInit(): void {
    let adjacencyList: any = null;
    this.calculatorsService.metricTableDataSubject.subscribe(navigatedData => {
      adjacencyList = navigatedData.adjacencyList;
      this.navigatedData = navigatedData;
      if (adjacencyList) {
        this.title = `Graph Id: ${navigatedData.graphId}`;
        console.log('Received state:', adjacencyList);
        adjacencyList = this.calculateDistanceMatrixUsingList(adjacencyList);
        this.table = adjacencyList as any;
        this.n = this.table.length;
        if (navigatedData.inputType === 'local'){
          this.displayedColumns = ['header', ...navigatedData.divs];
        }
        this.generateTable(this.n, true);
        this.adjacencyMatrixInformation = navigatedData.adjacencyMatrix.map((vertex: boolean[]) => {
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
  navigatedData = null;

  generateTable(n: number, fromData: boolean = false): void {
    if (!fromData) {
      this.table = Array.from({ length: n }, () => Array.from({ length: n }, () => null));
      for (let i = 0; i < n; i++) {
        this.table[i][i] = 0;
      }
    }
    if (this.navigatedData.inputType !== 'local')
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
    this.discernibilityMatrix = await this.findEntriesOfDiscernibilityMatrix(this.n, this.table);
    console.log(this.discernibilityMatrix)
  }

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

  findEntriesOfDiscernibilityMatrix(n, table): Promise<any[]> {
    return new Promise((resolve, reject) => {
      try {
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
            if (this.navigatedData.inputType !== 'local') {
              resolvantsAgainstPairs.push([`(v_{${i}}, v_{${j}})`, resolvent]);
            }
            else{
              const divs = this.displayedColumns.slice(1);
              // const ii = this.displayedColumns.findIndex()
            resolvantsAgainstPairs.push([`(${divs[i-1]}, ${divs[j-1]})`, resolvent]);
            }
            resolvants.push(resolvent);
          }
        }

        const result = resolvantsAgainstPairs.map(e => {
          let map = [];
          if (this.navigatedData.inputType !== 'local') {
            map = e[1].map(el => `v_{${el}}`);
          }
          else {
            map = e[1].map(el => {
              const divs = this.displayedColumns.slice(1);
              return `${divs[el-1]}`
            });
          }
          return `$$${e[0]} =  \\{${map}\\}$$`;
        });

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

   async downloadAsLatex() {
    this.discernibilityMatrix = await this.findEntriesOfDiscernibilityMatrix(this.n, this.table);
    // Convert your data to LaTeX format
    const formattedData = this.discernibilityMatrix.join(''); // Add LaTeX new line command \\
    const latexContent = `
  \\documentclass{article}
  \\begin{document}
  $$${this.title}$$
  ${formattedData}
  \\end{document}
  `;

    // Create a Blob from the LaTeX content
    const blob = new Blob([latexContent], { type: "application/x-latex" });

    // Create a link element for downloading the file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.tex";

    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  // async exportToLatex() {
  //   await this.findResolvingSets().then(() => {
  //     const latex = this.generateLatex();
  //     const blob = new Blob([latex], { type: 'text/plain;charset=utf-8' });
  //     const link = document.createElement('a');
  //     link.href = URL.createObjectURL(blob);
  //     link.download = 'results.tex';
  //     link.click();
  //   });
  // }

  // async exportToPDF() {
  //   await this.findResolvingSets().then(() => {
  //     const url = `https://latexonline.cc/compile?text=${encodeURIComponent(this.generateLatex())}`;
  //     window.open(url, '_blank');
  //   });
  // }

  // private generateLatex(): string {
  //   let latex = '\\documentclass{article}\n\\usepackage{amsmath}\n\\begin{document}\n';
  //   latex += '\\section*{Metric Dimension Results}\n';
  //
  //   latex += '\\subsection*{Metric Dimension}\n';
  //   latex += `The metric dimension is ${this.metricDimension}.\n`;
  //
  //   latex += '\\subsection*{Resolving Sets}\n';
  //   latex += '\\begin{itemize}\n';
  //   this.resolvingSets.forEach(set => {
  //     latex += `  \\item ${set.join(', ')}\n`;
  //   });
  //   latex += '\\end{itemize}\n';
  //
  //   latex += '\\subsection*{Minimum Cardinality Sets}\n';
  //   latex += '\\begin{itemize}\n';
  //   this.minCardinalitySets.forEach(set => {
  //     latex += `  \\item ${set.join(', ')}\n`;
  //   });
  //   latex += '\\end{itemize}\n';
  //
  //   latex += '\\subsection*{Minimal Cardinality Sets}\n';
  //   latex += '\\begin{itemize}\n';
  //   this.minimalMetricSets.forEach(set => {
  //     latex += `  \\item ${set.join(', ')}\n`;
  //   });
  //   latex += '\\end{itemize}\n';
  //
  //   latex += '\\end{document}\n';
  //
  //   return latex;
  // }

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
