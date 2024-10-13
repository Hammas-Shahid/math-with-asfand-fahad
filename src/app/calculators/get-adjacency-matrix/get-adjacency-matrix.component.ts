import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {getClassMembersOfDivisor, getDivisors, getGCD, isPrime, toSubscript} from '../../functions';
import {saveAs} from 'file-saver';
import * as d3 from 'd3';
import {Router} from "@angular/router";
import {CalculatorsService} from "../calculators.service";

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
  graphTypes = ['Intersection Graph', 'Power Graph']
  graphTypeFC = new FormControl(GraphTypes.intersection_graph)
  @ViewChild('graphContainer', {static: true}) private graphContainer!: ElementRef;
  private zoom!: d3.ZoomBehavior<Element, unknown>;


  constructor(private router: Router, private calculatorsService: CalculatorsService) {
    this.numberInput.valueChanges.subscribe(value => {
      if (value && !isNaN(value)) {
        this.getTotalNodes();
        this.setAndProcessData(value)
      }
    });

    this.graphTypeFC.valueChanges.subscribe(v=> this.setAndProcessData(this.numberInput.value))

  }

  setAndProcessData(n: number){
    if (this.graphTypeFC.value === GraphTypes.intersection_graph) {
      this.generateAdjacencyMatrix(n);
      this.generateEmbedding();
      this.drawGraph(); // Draw graph when data changes
    }
    else {
      const adjacencyList =  this.getAdjacencyListForPowerGraph();
      this.adjacencyMatrix = this.generateAdjacencyMatrixFromList(adjacencyList, 0).map(innerArray =>
        innerArray.map(value => value ? 1 : 0)
      );
      let divs: number[] = getDivisors(n);
      this.displayedColumns = this.totalVertices.map(v=> v.toString());
      this.generateEmbedding();
      this.drawGraph();
    }
  }

  ngOnInit(): void {
    this.drawGraph(); // Draw initial graph if needed
  }

  generateAdjacencyMatrix(num: number): number[][] {
    let divs: number[] = getDivisors(num);

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

  generateAdjacencyListWithoutEmbedding(indexToStart = 1): number[][] {
    const adjList: number[][] = [];

    for (let i = 0; i < this.adjacencyMatrix.length; i++) {
      const connections: number[] = [];
      for (let j = 0; j < this.adjacencyMatrix.length; j++) {
        if (this.adjacencyMatrix[i][j] === 1) {
          connections.push(j + indexToStart); // Adjusting index to start from 1
        }
      }
      // Pushes each node's connections as an array
      adjList.push(connections);
    }

    return adjList;
  }

  generateAdjacencyMatrixFromList(adjList: number[][], adjustZeroBasedIndex = 1): boolean[][] {
    const size = adjList.length;
    const matrix: boolean[][] = Array.from({length: size}, () => Array(size).fill(false));

    adjList.forEach((connections, i) => {
      connections.forEach(connection => {
        // Adjusting connection index to 0-based (subtract 1)
        matrix[i][connection - adjustZeroBasedIndex] = true;
      });
    });

    return matrix;
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
      label: `${this.displayedColumns[i]}`
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
    svg.transition().call(this.zoom.scaleBy, 0.666);
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

  goToMetricDimensionComponent() {
    const adjacencyList = this.graphTypeFC.value === GraphTypes.intersection_graph ? this.generateAdjacencyListWithoutEmbedding(0) : this.getAdjacencyListForPowerGraph();
    const adjacencyMatrix = this.generateAdjacencyMatrixFromList(adjacencyList, 0);
    console.log(adjacencyMatrix)
    const data = {adjacencyList, adjacencyMatrix, graphId: '', inputType: 'local', divs: this.displayedColumns}
    this.calculatorsService.metricTableDataSubject.next(data);
    this.router.navigate(['calculators/metric-dimension']);
  }

  downloadGraphAsImage() {
    const svgElement = this.graphContainer.nativeElement.querySelector('svg') as SVGSVGElement;

    // Get the SVG's outer HTML
    const svgString = new XMLSerializer().serializeToString(svgElement);

    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions based on the SVG element's dimensions
    const svgBounds = svgElement.getBoundingClientRect();
    canvas.width = svgBounds.width;
    canvas.height = svgBounds.height;
    ctx!.fillStyle = 'white';
    ctx!.fillRect(0, 0, canvas.width, canvas.height);

    // Create an image and set its source to the SVG data URI
    const img = new Image();
    const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      // Draw the SVG on the canvas
      ctx!.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      // Convert the canvas to a PNG and download it
      canvas.toBlob((blob) => {
        saveAs(blob!, 'graph.png');
      });
    };
    img.src = url;
  }

  totalVertices = [];

  getTotalNodes() {
    this.totalVertices = [];
    for (let i = 0; i < this.numberInput.value; i++) {
      this.totalVertices.push(i);
    }
  }

  getAdjacencyListForPowerGraph() {
    const n = this.numberInput.value;
    const m = []; // elements whose GCD with 'n' is 1;
    const divisorsOf_n = getDivisors(n);
    const classOfDivisors = [];
    const cumulativeClassOfDivisors = [];
    let adjacencyList = [];
    const remainingNodes = [];

    for (let node of this.totalVertices) {

      // populating 'm'
      if (node !== 0 && getGCD(node, n) === 1) {
        m.push(node);
      }
    }

    for (let div of divisorsOf_n) {

      classOfDivisors.push([div, getClassMembersOfDivisor(div, this.totalVertices)]);

      const classesOfDiv = [];
      // get classes of divisor
      const divisorsOfDivisor = getDivisors(div);
      for (let divOfDiv of divisorsOfDivisor) {
        const classOfDivOfDiv = getClassMembersOfDivisor(divOfDiv, this.totalVertices);
        classesOfDiv.push(...classOfDivOfDiv);
      }
      cumulativeClassOfDivisors.push([div, [...new Set([...divisorsOfDivisor, ...classesOfDiv])]])

    }

    for (let node of this.totalVertices) {

      if (node === 0 || node === 1 || m.includes(node)) {
        const nodeIndexInVerticesArray = this.totalVertices.findIndex(v => v === node);
        const list = structuredClone(this.totalVertices)
        if (nodeIndexInVerticesArray > -1) {
          list.splice(nodeIndexInVerticesArray, 1);
        }
        // const indexOfNode = list.findIndex(v=> v === node);
        // list.splice(indexOfNode, 1);
        adjacencyList.push([node, list]);
      } else if (isPrime(node) && n % node === 0) {
        let list = m;
        if (!list.includes(0)) {
          list = [0, ...list]
        }
        for (let vertex of this.totalVertices) {
          if (getGCD(node, vertex) === node) {
            list.push(vertex);
          }
        }
        list = [...new Set(list)].sort();
        const indexOfNode = list.findIndex(v => v === node);
        if (indexOfNode > -1) {
          list.splice(indexOfNode, 1);
        }
        adjacencyList.push([node, list])
      } else if (!isPrime(node) && n % node === 0) {
        let list = m;
        if (!list.includes(0)) {
          list = [0, ...list]
        }
        const classOfNode = classOfDivisors.find(c => c[0] === node)
        const cumulativeClassOfNode = cumulativeClassOfDivisors.find(c => c[0] === node)
        const multiples =[]
        for (let i =2 ; i < Math.ceil(n/node); i++ ) {
          multiples.push(node*i);
        }
        list.push(...classOfNode[1], ...cumulativeClassOfNode[1], ...multiples);
        list = [...new Set(list)].sort();
        const indexOfNode = list.findIndex(v => v === node);
        if (indexOfNode > -1) {
          list.splice(indexOfNode, 1);
        }
        adjacencyList.push([node, list]);
      } else {
        remainingNodes.push(node);
      }

    }

    console.log(remainingNodes)

    for (let node of remainingNodes){console.log(node);
      const gcd = getGCD(node, n);
      let elementInAdjacencyList = structuredClone(adjacencyList.find(l => l[0] === gcd));
      elementInAdjacencyList[0] = node;
      const indexOfNode = elementInAdjacencyList[1].findIndex(v=> v === node);
      if (indexOfNode){
        elementInAdjacencyList[1].splice(indexOfNode, 1);
      }
      elementInAdjacencyList[1].push(gcd);
      adjacencyList.push(elementInAdjacencyList);
    }

    adjacencyList = adjacencyList.sort((a,b)=> a[0] - b[0]);

    return adjacencyList.map(li=> li[1]);

  }

}

export enum GraphTypes {
  intersection_graph = 'Intersection Graph',
  power_graph = 'Power Graph'
}
