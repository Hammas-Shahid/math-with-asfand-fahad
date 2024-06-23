import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PinDialogComponent } from '../pin-dialog/pin-dialog.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private dialog: MatDialog, private router: Router, private authService: AuthService) {}

  openPinDialog(route: string) {
    if (route === 'comparison-analysis')
      this.router.navigate([`/calculators/${route}`]);

    if (this.authService.isRouteVerified(route)) {
      this.router.navigate([`/calculators/${route}`]);
    } else {
      const dialogRef = this.dialog.open(PinDialogComponent, {
        data: { route }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === this.authService.getPin(route)) {
          this.authService.verifyRoute(route);
          this.router.navigate([`/calculators/${route}`]);
        }
      });
    }
  }
}
