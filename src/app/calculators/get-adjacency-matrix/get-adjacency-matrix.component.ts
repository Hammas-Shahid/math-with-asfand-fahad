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

  constructor() {
    this.numberInput.valueChanges.subscribe(value => {
      this.generateAdjacencyMatrix(parseInt(value));
    });
  }

  generateAdjacencyMatrix(num: number): number[][] {
    let divs: number[] = divisors(num);

    // Initialize a square matrix with zeros
    const matrix: number[][] = Array.from({ length: divs.length }, () => Array(divs.length).fill(1));

    // Populate the adjacency matrix
    for (let i = 0; i < divs.length; i++) {
      for (let j = 0; j < divs.length; j++) {
        // Set matrix[i][j] to 0 if divs[i] is related to divs[j] based on some condition
        if (divs[i] === divs[j]) {
          matrix[i][j] = 0;
        }
        else if (getGCD(divs[i], divs[j]) === 1){
          matrix[i][j] = 0;
        }
        else {
          matrix[i][j] = 1;
        }
      }
    }

    this.displayedColumns = divs.map(div => div.toString());
    this.adjacencyMatrix = matrix;
    return matrix;
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
