import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-heatmap-analysis',
  templateUrl: './heatmap-analysis.component.html',
  styleUrls: ['./heatmap-analysis.component.css']
})
export class HeatmapAnalysisComponent implements OnChanges {
  @Input() distanceMatrix: number[][] = [];
  @Input() directDistanceMatrix: number[][] = [];

  heatmapData1: ChartData<'bubble'> = { datasets: [] };
  heatmapData2: ChartData<'bubble'> = { datasets: [] };
  heatmapOptions: ChartOptions<'bubble'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {},
      y: {}
    }
  };

  ngOnChanges() {
    this.generateHeatmapData();
  }

  generateHeatmapData() {
    this.heatmapData1 = this.formatHeatmapData(this.distanceMatrix);
    this.heatmapData2 = this.formatHeatmapData(this.directDistanceMatrix);
  }

  formatHeatmapData(matrix: number[][]): ChartData<'bubble'> {
    const data = [];
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        const value = matrix[i][j];
        const color = this.getColorForValue(value);
        data.push({ x: i, y: j, r: value, backgroundColor: color });
      }
    }

    return {
      datasets: [
        {
          label: 'Heatmap',
          data,
          backgroundColor: (context: any) => context.raw.backgroundColor,
          borderColor: 'rgba(0, 0, 0, 0.1)'
        }
      ]
    };
  }

  getColorForValue(value: number): string {
    const alpha = value / 100;
    return `rgba(255, 0, 0, ${alpha})`;
  }
}
