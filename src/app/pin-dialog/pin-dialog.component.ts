import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-pin-dialog',
  templateUrl: './pin-dialog.component.html',
  styleUrls: ['./pin-dialog.component.css']
})
export class PinDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PinDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { route: string },
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      pin: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const enteredPin = this.form.get('pin')?.value;
      const correctPin = this.authService.getOpeners(this.data.route);

      if (enteredPin === correctPin) {
        this.dialogRef.close(enteredPin);
      } else {
        this.form.get('pin')?.setErrors({ incorrect: true });
      }
    }
  }
}
