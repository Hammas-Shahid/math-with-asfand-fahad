import { Component } from '@angular/core';

@Component({
  selector: 'app-adjacency-list-input',
  templateUrl: './adjacency-list-input.component.html',
  styleUrls: ['./adjacency-list-input.component.css']
})
export class AdjacencyListInputComponent {
  adjacencyList: string = '';
  adjacencyMatrixString: string = '';
  adjacencyMatrix: number[][] = [];
  errorMessage: string = '';

  generateAdjacencyMatrix(): void {
    try {
      const edges: [number, number][] = [];
      const lines = this.adjacencyList.split('\n').filter(line => line.trim());
      const uniqueNodes = new Set<number>();

      lines.forEach(line => {
        const parts = line.split(':');
        if (parts.length !== 2) {
          throw new Error(`Invalid format in line: "${line}". Expected format: "node: neighbors"`);
        }
        const [node, connections] = parts;
        const nodeIndex = parseInt(node.trim(), 10) - 1; // Convert to 0-based index
        if (isNaN(nodeIndex) || nodeIndex < 0) {
          throw new Error(`Invalid node number in line: "${line}"`);
        }
        const connectedNodes = connections.trim().split(' ').map(n => {
          const idx = parseInt(n.trim(), 10) - 1; // Convert to 0-based index
          if (isNaN(idx) || idx < 0) {
            throw new Error(`Invalid connection number in line: "${line}"`);
          }
          return idx;
        });

        connectedNodes.forEach(connection => {
          if (!edges.some(([a, b]) => (a === nodeIndex && b === connection) || (a === connection && b === nodeIndex))) {
            edges.push([nodeIndex, connection]);
          }
          uniqueNodes.add(nodeIndex);
          uniqueNodes.add(connection);
        });
      });

      const nodeArray = Array.from(uniqueNodes).sort((a, b) => a - b);
      const nodeMap = new Map<number, number>();
      nodeArray.forEach((node, index) => nodeMap.set(node, index));
      const n = nodeArray.length;

      this.adjacencyMatrix = Array.from({ length: n }, () => Array(n).fill(0));
      edges.forEach(([from, to]) => {
        const i = nodeMap.get(from);
        const j = nodeMap.get(to);
        if (i !== undefined && j !== undefined) {
          this.adjacencyMatrix[i][j] = 1;
          this.adjacencyMatrix[j][i] = 1; // Undirected graph
        }
      });

      console.log('Edges:', edges);
      console.log('Adjacency Matrix:', this.adjacencyMatrix);

      this.adjacencyMatrixString = this.matrixToString(this.adjacencyMatrix);
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = error.message;
    }
  }

  matrixToString(matrix: number[][]): string {
    return matrix.map(row => row.join(' ')).join('\n');
  }

  downloadMatFile(): void {
    const blob = new Blob([this.adjacencyMatrixString], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'adjacency_matrix.mat';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
