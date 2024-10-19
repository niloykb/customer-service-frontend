import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReusableDialogData } from '../../models/dialog';
import { ConfirmationComponent } from './confirmation/confirmation.component';


@Injectable({
  providedIn: 'root'
})
export class DialogService {

  dialog = inject(MatDialog);

  confirmDialog(data: ReusableDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '400px',
      data: data,
      disableClose: true
    });

    return dialogRef.afterClosed();
  }

}
