import { TitleCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationUtil {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private _titleCasePipe: TitleCasePipe,
    private _snackBar: MatSnackBar,
  ) { }

  public onSuccess(message: string) {
    this._openSnackBar(message, 'SUCCESS');
  }

  public onCreateSuccess() {
    this.onSuccess('Successfully Created.');
  }

  public onUpdateSuccess() {
    this.onSuccess('Successfully Updated.');
  }

  public onDeleteSuccess() {
    this.onSuccess('Successfully Deleted.');
  }

  public handleError(message: string, response: any) {
    // this._openSnackBar(message, 'Error');
    const error = response.error;

    Object.entries(error).map(([key, value], _) => {
      if (Array.isArray(value)) {
        value.forEach((errorDetail: string) => {
          this._openSnackBar(`${this._titleCasePipe.transform(key)}: ${errorDetail}`, 'ERROR');
        });
      } else {
        this._openSnackBar(`${this._titleCasePipe.transform(key)}: ${value}`, 'ERROR');
      }
    });
  }

  private _openSnackBar(message: string, label: string) {
    this._snackBar.open(message, label, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2500
    });
  }
}
