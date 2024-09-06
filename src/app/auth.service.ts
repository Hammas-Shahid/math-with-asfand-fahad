import { Injectable } from '@angular/core';
import {EncryptionService} from "./services/encryption.service";
import {routes} from "../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private encryptionService: EncryptionService) {
  }
  private verifiedRoutes: Set<string> = new Set();

  private routeOpeners: { [key: string]: string } = routes;

  isRouteVerified(route: string): boolean {
    return this.verifiedRoutes.has(route);
  }

  verifyRoute(route: string): void {
    this.verifiedRoutes.add(route);
  }

  getOpeners(route: string): string {
    console.log(this.routeOpeners[route])
    return this.encryptionService.open(this.encryptionService.close(this.routeOpeners[route]));
  }
}
