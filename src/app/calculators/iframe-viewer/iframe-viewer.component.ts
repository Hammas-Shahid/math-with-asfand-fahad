// iframe-viewer.component.ts
import {Component} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {AuthService} from "../../auth.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {CalculatorsService} from "../calculators.service";

@Component({
  selector: 'app-iframe-viewer',
  templateUrl: './iframe-viewer.component.html',
  styleUrls: ['./iframe-viewer.component.css']
})
export class iframeViewerComponent {

  constructor(public sanitizer: DomSanitizer, private http: HttpClient, private router: Router, private calculatorsService: CalculatorsService) {
    const url = 'https://houseofgraphs.org/result-graphs'; // Replace with the actual URL of your web app
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  graphId: number;

  getAdjacencyMatrix() {
    return this.http.get(`https://houseofgraphs.org/api/graphs/${this.graphId}`).subscribe((res: any) => {
      const data = {adjacencyList: res.adjacencyList, adjacencyMatrix: res.adjacencyMatrix}
      console.log(data)
      this.calculatorsService.metricTableDataSubject.next(data)

      this.navigate()
    })
  }

  iframeUrl: SafeResourceUrl;

  navigate() {
    this.router.navigate(['calculators/metric-dimension']);
  }
}
