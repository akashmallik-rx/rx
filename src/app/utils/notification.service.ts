import { TitleCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
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

  public handleError(message: string, error: any) {
    Object.keys(error.error).map((key,_) => {
      error.error[key].forEach( (message: string) => {
        console.log(message);
        this._openSnackBar(`${this._titleCasePipe.transform(key)}: ${message}`, 'ERROR');
      });
    });
    // this._openSnackBar(message, 'Error');
  }

  private _openSnackBar(message: string, label: string) {
    this._snackBar.open(message, label, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2500
    });
  }
}
