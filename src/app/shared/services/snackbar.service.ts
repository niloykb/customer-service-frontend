import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface SnackbarData {
  message: string;
  class?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private _snackBar = inject(MatSnackBar);

  openSnackBar(data: SnackbarData) {
    this._snackBar.open(data.message, 'Close', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: data.class,
      duration: 1000,
      data: data
    });
  }
}
