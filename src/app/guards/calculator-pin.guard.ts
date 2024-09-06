import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PinDialogComponent } from '../pin-dialog/pin-dialog.component';
import { AuthService } from '../auth.service';
import {EncryptionService} from "../services/encryption.service";

@Injectable({
  providedIn: 'root'
})
export class CalculatorPinGuard implements CanActivate {

  constructor(private router: Router, private dialog: MatDialog, private authService: AuthService, private encryptionService: EncryptionService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const routePath = route.routeConfig?.path;
    if (routePath && this.authService.getOpeners(routePath)) {
      if (this.authService.isRouteVerified(routePath)) {
        return true;
      } else {
        const dialogRef = this.dialog.open(PinDialogComponent, {
          data: { route: routePath }
        });

        return dialogRef.afterClosed().pipe(
          map(result => {
            console.log(this.authService.getOpeners(routePath), 'asdf', this.encryptionService.close(result), 'ffdff', result)
            if (this.encryptionService.close(result) === this.authService.getOpeners(routePath)) {
              this.authService.verifyRoute(routePath);
              return true;
            } else {
              this.router.navigate(['/dashboard']);
              return false;
            }
          })
        );
      }
    }
    return false;
  }
}
