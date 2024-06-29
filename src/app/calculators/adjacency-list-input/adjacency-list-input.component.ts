import { Component } from '@angular/core';

@Component({
  selector: 'app-adjacency-list-input',
  templateUrl: './adjacency-list-input.component.html',
  styleUrls: ['./adjacency-list-input.component.css']
})
export class AdjacencyListInputComponent {
  adjacencyList: string = '';
  graph6: string = '';

  generateGraph6(): void {
    const edges: [number, number][] = [];

    const lines = this.adjacencyList.split('\n').filter(line => line.trim());
    lines.forEach(line => {
      const [node, connections] = line.split(':');
      const nodeIndex = parseInt(node.trim(), 10) - 1; // Convert to 0-based index
      const connectedNodes = connections.trim().split(' ').map(n => parseInt(n.trim(), 10) - 1); // Convert to 0-based index
      connectedNodes.forEach(connection => {
        if (!edges.some(([a, b]) => (a === nodeIndex && b === connection) || (a === connection && b === nodeIndex))) {
          edges.push([nodeIndex, connection]);
        }
      });
    });

    const n = Math.max(...edges.flat()) + 1;
    const adjMatrix = Array.from({ length: n }, () => Array(n).fill(0));
    edges.forEach(([from, to]) => {
      adjMatrix[from][to] = 1;
      adjMatrix[to][from] = 1; // Undirected graph
    });

    this.graph6 = this.adjMatrixToGraph6(adjMatrix);
  }

  adjMatrixToGraph6(matrix: number[][]): string {
    const n = matrix.length;
    const bits = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        bits.push(matrix[i][j]);
      }
    }

    const bitString = bits.join('');
    const chunkedBits = bitString.match(/.{1,6}/g) || [];

    const chars = chunkedBits.map(chunk => {
      const value = parseInt(chunk.padEnd(6, '0'), 2);
      return String.fromCharCode(value + 63);
    });

    return `${n > 62 ? `>` : ''}${n > 62 ? n.toString() : String.fromCharCode(n + 63)}${chars.join('')}`;
  }

  downloadGraph6(): void {
    const blob = new Blob([this.graph6], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph.g6';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
