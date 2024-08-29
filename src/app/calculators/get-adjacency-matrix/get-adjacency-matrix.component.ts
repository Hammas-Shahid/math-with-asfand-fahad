import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { divisors, getGCD } from '../../functions';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-get-adjacency-matrix',
  templateUrl: './get-adjacency-matrix.component.html',
  styleUrls: ['./get-adjacency-matrix.component.css']
})
export class GetAdjacencyMatrixComponent {
  numberInput = new FormControl();
  adjacencyMatrix: number[][] = [];
  displayedColumns: string[] = [];
  embedding: number[][] = [];

  constructor() {
    this.numberInput.valueChanges.subscribe(value => {
      if (value && !isNaN(value)) {
        this.generateAdjacencyMatrix(parseInt(value));
        this.generateEmbedding();
      }
    });
  }

  generateAdjacencyMatrix(num: number): number[][] {
    let divs: number[] = divisors(num);

    // Initialize a square matrix with zeros
    const matrix: number[][] = Array.from({ length: divs.length }, () => Array(divs.length).fill(0));

    // Populate the adjacency matrix
    for (let i = 0; i < divs.length; i++) {
      for (let j = 0; j < divs.length; j++) {
        if (i !== j && getGCD(divs[i], divs[j]) !== 1) {
          matrix[i][j] = 1;
        }
      }
    }

    this.displayedColumns = divs.map(div => div.toString());
    this.adjacencyMatrix = matrix;
    return matrix;
  }

  generateEmbedding() {
    const size = this.adjacencyMatrix.length;
    this.embedding = Array.from({ length: size }, (_, i) => [
      (Math.cos((2 * Math.PI * i) / size) * 1.5), // Scale to fit the range -1.5 to 1.5
      (Math.sin((2 * Math.PI * i) / size) * 1.5)  // Scale to fit the range -1.5 to 1.5
    ]);
  }

  generateAdjacencyListWithEmbedding(): string[] {
    const adjList: string[] = [];

    // First line should be the number of vertices
    adjList.push(`${this.adjacencyMatrix.length}`);

    // Create adjacency list with embedding coordinates
    for (let i = 0; i < this.adjacencyMatrix.length; i++) {
      const connections: number[] = [];

      for (let j = 0; j < this.adjacencyMatrix.length; j++) {
        if (this.adjacencyMatrix[i][j] === 1) {
          connections.push(j); // Adjusting index to start from 1
        }
      }

      const coords = this.embedding[i];
      // Ensure formatting is consistent and properly spaced
      adjList.push(`${coords[0].toFixed(6)} ${coords[1].toFixed(6)} ${connections.join(' ')}`);
    }

    return adjList;
  }

  downloadAdjacencyListAsTXT() {
    if (this.adjacencyMatrix.length === 0) {
      return;
    }

    const adjList = this.generateAdjacencyListWithEmbedding();

    // Convert adjacency list to plain text format
    const txtContent = adjList.join('\n');

    // Create a Blob from the plain text content
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });

    // Use FileSaver.js to save the file
    saveAs(blob, 'adjacency_list.txt');
  }

  downloadMatrixAsTXT() {
    if (this.adjacencyMatrix.length === 0) {
      return;
    }

    // Convert matrix to plain text format
    let txtContent = '';

    this.adjacencyMatrix.forEach((rowArray) => {
      let row = rowArray.join(' '); // Join elements with a space
      txtContent += row + '\n'; // Add a newline after each row
    });

    // Create a Blob from the plain text content
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });

    // Use FileSaver.js to save the file
    saveAs(blob, 'adjacency_matrix.txt');
  }
}
