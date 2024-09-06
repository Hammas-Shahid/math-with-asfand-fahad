import { Component, Input, OnChanges } from '@angular/core';
import kmeans from 'kmeans-js';

@Component({
  selector: 'app-cluster-analysis',
  templateUrl: './cluster-analysis.component.html',
  styleUrls: ['./cluster-analysis.component.css']
})
export class ClusterAnalysisComponent implements OnChanges {
  @Input() distanceMatrix: number[][] = [];
  @Input() directDistanceMatrix: number[][] = [];
  clusterResult1: any;
  clusterResult2: any;
  k = 3; // Number of clusters

  ngOnChanges() {
    this.performClustering();
  }

  performClustering() {
    if (this.distanceMatrix.length && this.directDistanceMatrix.length) {
      this.clusterResult1 = this.calculateClusters(this.distanceMatrix);
      this.clusterResult2 = this.calculateClusters(this.directDistanceMatrix);
    }
  }

  calculateClusters(matrix: number[][]) {
    const data = matrix.map(row => row.slice(1)); // Skip the first element to avoid using identical coordinates
    const kmeansInstance = new kmeans();
    const clusters = kmeansInstance.cluster(data, this.k);
    return clusters;
  }
}
