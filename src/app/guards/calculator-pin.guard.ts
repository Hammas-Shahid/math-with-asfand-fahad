import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PinDialogComponent } from '../pin-dialog/pin-dialog.component';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CalculatorPinGuard implements CanActivate {

  constructor(private router: Router, private dialog: MatDialog, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const routePath = route.routeConfig?.path;
    if (routePath && this.authService.getPin(routePath)) {
      if (this.authService.isRouteVerified(routePath)) {
        return true;
      } else {
        return true;
        const dialogRef = this.dialog.open(PinDialogComponent, {
          data: { route: routePath }
        });

        return dialogRef.afterClosed().pipe(
          map(result => {
            if (result === this.authService.getPin(routePath)) {
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
    return true;
  }
}
