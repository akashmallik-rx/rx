import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../components/common/alert/alert.component';

@Injectable({
  providedIn: 'root'
})
export class AlertUtil {
  constructor(public _dialog: MatDialog) { }

  public onDeleteConfirmation() {
    const dialogRef = this._dialog.open(AlertComponent, {
      width: '250px'
    });

    return dialogRef.afterClosed();
  }
}
