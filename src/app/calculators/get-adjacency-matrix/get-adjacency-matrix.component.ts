import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { divisors, getGCD } from '../../functions';
import { saveAs } from 'file-saver';
import * as d3 from 'd3';

@Component({
  selector: 'app-get-adjacency-matrix',
  templateUrl: './get-adjacency-matrix.component.html',
  styleUrls: ['./get-adjacency-matrix.component.css']
})
export class GetAdjacencyMatrixComponent implements OnInit {
  numberInput = new FormControl();
  adjacencyMatrix: number[][] = [];
  displayedColumns: string[] = [];
  embedding: number[][] = [];
  @ViewChild('graphContainer', { static: true }) private graphContainer!: ElementRef;

  constructor() {
    this.numberInput.valueChanges.subscribe(value => {
      if (value && !isNaN(value)) {
        this.generateAdjacencyMatrix(parseInt(value));
        this.generateEmbedding();
        this.drawGraph(); // Draw graph when data changes
      }
    });
  }

  ngOnInit(): void {
    this.drawGraph(); // Draw initial graph if needed
  }

  generateAdjacencyMatrix(num: number): number[][] {
    let divs: number[] = divisors(num);

    const matrix: number[][] = Array.from({ length: divs.length }, () => Array(divs.length).fill(0));

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
      (Math.cos((2 * Math.PI * i) / size) * 1.5),
      (Math.sin((2 * Math.PI * i) / size) * 1.5)
    ]);
  }

  generateAdjacencyListWithEmbedding(): string[] {
    const adjList: string[] = [];
    adjList.push(`${this.adjacencyMatrix.length}`);

    for (let i = 0; i < this.adjacencyMatrix.length; i++) {
      const connections: number[] = [];
      for (let j = 0; j < this.adjacencyMatrix.length; j++) {
        if (this.adjacencyMatrix[i][j] === 1) {
          connections.push(j + 1); // Adjusting index to start from 1
        }
      }

      const coords = this.embedding[i];
      adjList.push(`${coords[0].toFixed(6)} ${coords[1].toFixed(6)} ${connections.join(' ')}`);
    }

    return adjList;
  }

  downloadAdjacencyListAsTXT() {
    if (this.adjacencyMatrix.length === 0) {
      return;
    }

    const adjList = this.generateAdjacencyListWithEmbedding();
    const txtContent = adjList.join('\n');
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    saveAs(blob, 'adjacency_list.txt');
  }

  downloadMatrixAsTXT() {
    if (this.adjacencyMatrix.length === 0) {
      return;
    }

    let txtContent = '';
    this.adjacencyMatrix.forEach((rowArray) => {
      let row = rowArray.join(' ');
      txtContent += row + '\n';
    });

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    saveAs(blob, 'adjacency_matrix.txt');
  }

  drawGraph() {
    if (!this.adjacencyMatrix.length || !this.embedding.length) return;

    const svg = d3.select(this.graphContainer.nativeElement).select('svg');
    svg.selectAll('*').remove(); // Clear existing content

    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const padding = 50; // Padding around the graph

    // Define nodes with labels
    const nodes = this.embedding.map((coord, i) => ({
      id: i,
      x: coord[0] * (width / 3) + (width / 2),
      y: coord[1] * (height / 3) + (height / 2),
      label: this.displayedColumns[i] // Label the node with the divisor
    }));

    // Set the viewBox to scale and position the graph
    svg.attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Create a zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 5]) // Zoom scale range
      .on('zoom', (event) => {
        svg.selectAll('g').attr('transform', event.transform);
      });

    // Apply zoom behavior
    svg.call(zoom);

    // Create a group element to contain all graph elements
    const g = svg.append('g');

    // Draw links
    g.selectAll('line')
      .data(this.adjacencyMatrix.flatMap((row, i) => row.map((val, j) => (val === 1 ? { source: i, target: j } : null)).filter(v => v)))
      .enter()
      .append('line')
      .attr('x1', d => nodes[d.source].x)
      .attr('y1', d => nodes[d.source].y)
      .attr('x2', d => nodes[d.target].x)
      .attr('y2', d => nodes[d.target].y)
      .attr('stroke', 'black');

    // Draw nodes
    g.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 5)
      .attr('fill', 'red');

    // Add labels
    g.selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('dy', -10) // Position label above the node
      .attr('text-anchor', 'middle')
      .text(d => d.label)
      .attr('font-size', '12px')
      .attr('fill', 'black');
  }}
