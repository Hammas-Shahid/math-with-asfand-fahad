import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private verifiedRoutes: Set<string> = new Set();

  // private pins: { [key: string]: string } = {
  //   'metric-dimension': 'qwerty9211',
  //   'vector-calculator': 'kholo2',
  //   'information-system': 'asdf420',
  //   'direct-distance': 'kholo2',
  //   'comparison-analysis': 'asdf9211'
  // };

  private pins: { [key: string]: string } = {
    'metric-dimension': ' ',
    'vector-calculator': ' ',
    'information-system': ' ',
    'direct-distance': ' ',
    'comparison-analysis': ' '
  };

  isRouteVerified(route: string): boolean {
    return this.verifiedRoutes.has(route);
  }

  verifyRoute(route: string): void {
    this.verifiedRoutes.add(route);
  }

  getPin(route: string): string {
    return this.pins[route];
  }
}
