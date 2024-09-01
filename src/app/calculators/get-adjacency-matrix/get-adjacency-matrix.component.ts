import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {divisors, getGCD, toSubscript} from '../../functions';
import {saveAs} from 'file-saver';
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
  isGraphCreated = false;
  @ViewChild('graphContainer', {static: true}) private graphContainer!: ElementRef;
  private zoom!: d3.ZoomBehavior<Element, unknown>;


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

    const matrix: number[][] = Array.from({length: divs.length}, () => Array(divs.length).fill(0));

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
    this.embedding = Array.from({length: size}, (_, i) => [
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
    const blob = new Blob([txtContent], {type: 'text/plain;charset=utf-8;'});
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

    const blob = new Blob([txtContent], {type: 'text/plain;charset=utf-8;'});
    saveAs(blob, 'adjacency_matrix.txt');
  }

  drawGraph() {
    this.isGraphCreated = false;
    const svg = d3.select(this.graphContainer.nativeElement).select('svg');
    if (!this.adjacencyMatrix.length || !this.embedding.length) {
      svg.selectAll('*').remove(); // Clear existing content
      return
    }


    svg.selectAll('*').remove(); // Clear existing content

    const svgElement = svg.node() as SVGSVGElement;
    const container = svgElement.parentElement as HTMLElement;
    const width = container.clientHeight;
    const height = container.clientHeight;
    const padding = 50; // Padding around the graph

    // Define nodes with labels and apply padding
    const nodes = this.embedding.map((coord, i) => ({
      id: i,
      x: coord[0] * (width / 3) + (width / 2),
      y: coord[1] * (height / 3) + (height / 2),
      label: `v${this.displayedColumns[i]}`
    }));

    // Calculate the bounding box dimensions considering padding
    const minX = d3.min(nodes, d => d.x) - padding;
    const maxX = d3.max(nodes, d => d.x) + padding;
    const minY = d3.min(nodes, d => d.y) - padding;
    const maxY = d3.max(nodes, d => d.y) + padding;

    // Calculate content dimensions
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    // Adjust viewBox to fit the content
    svg.attr('viewBox', `${minX} ${minY} ${contentWidth} ${contentHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Create a zoom behavior
    this.zoom = d3.zoom()
      .scaleExtent([0.5, 5]) // Zoom scale range
      .on('zoom', (event) => {
        svg.selectAll('g').attr('transform', event.transform);
      });

    svg.on('dblclick.zoom', (event) => {
      const [x, y] = d3.pointer(event, svg.node());
      svg.transition().call(this.zoom.scaleBy, 2, [x, y]); // Zoom in on double-click
    });

    // Apply zoom behavior
    svg.call(this.zoom);

    // Create a group element to contain all graph elements
    const g = svg.append('g');

    // Draw links
    g.selectAll('line')
      .data(this.adjacencyMatrix.flatMap((row, i) => row.map((val, j) => (val === 1 ? {
        source: i,
        target: j
      } : null)).filter(v => v)))
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
      .attr('r', 10)
      .attr('fill', 'rgb(100, 175, 255)')
      .attr('fill-opacity', 0.7)
      .attr('stroke', 'rgb(100, 175, 255)')
      .attr('stroke-width', 2);

    // Add labels
    g.selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('dy', -15)
      .attr('text-anchor', 'middle')
      .text(d => d.label)
      .attr('font-size', '22px')
      .attr('fill', 'red')
      .attr('font-weight', '500');

    this.isGraphCreated = true;
  }

  zoomIn() {
    const svg = d3.select(this.graphContainer.nativeElement).select('svg');
    svg.transition().call(this.zoom.scaleBy, 1.5);
  }

  zoomOut() {
    const svg = d3.select(this.graphContainer.nativeElement).select('svg');
    svg.transition().call(this.zoom.scaleBy, 0.75);
  }

  resetZoom() {
    const svg = d3.select(this.graphContainer.nativeElement).select('svg');
    const g = svg.select('g');

    // Reset the zoom
    svg.transition().duration(750).call(this.zoom.transform, d3.zoomIdentity);

    // Re-center the graph
    const svgElement = svg.node() as SVGSVGElement;
    const container = svgElement.parentElement as HTMLElement;
    const width = container.clientHeight;
    const height = container.clientHeight;
    const padding = 50; // Padding around the graph

    // Define nodes with labels and apply padding
    const nodes = this.embedding.map((coord, i) => ({
      id: i,
      x: coord[0] * (width / 3) + (width / 2),
      y: coord[1] * (height / 3) + (height / 2),
      label: `v${this.displayedColumns[i]}`
    }));

    // Calculate the bounding box dimensions considering padding
    const minX = d3.min(nodes, d => d.x) - padding;
    const maxX = d3.max(nodes, d => d.x) + padding;
    const minY = d3.min(nodes, d => d.y) - padding;
    const maxY = d3.max(nodes, d => d.y) + padding;

    // Calculate content dimensions
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    // Adjust viewBox to fit the content
    svg.attr('viewBox', `${minX} ${minY} ${contentWidth} ${contentHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Reset the transform of the 'g' element
    g.transition().duration(750).attr('transform', `translate(0,0) scale(1)`);
  }

}
