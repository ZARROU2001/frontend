import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../shared/components/snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  constructor(private _snackBar: MatSnackBar) {}

  openSuccessSnackBar(message: string, action: string = 'Ok') {


    this._snackBar.open(message,action,{
      panelClass: 'app-notification-success',
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration:4000,

    });
  }

  openErrorSnackBar(message: string, action: string = 'Try again!') {
    
    this._snackBar.open(message,action,{
      panelClass: 'app-notification-error',
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration:4000
    });
  }

  // openSuccessSnackBar(message: string, action: string = 'OK', type: string = 'success') {
  //   const config = new MatSnackBarConfig();
  //   config.duration = 2000;
  //   config.verticalPosition = 'top';

  //   this._snackBar.openFromComponent(SnackBarComponent,{
  //     data:{
  //       icon:'done',
  //       message,
  //       action,
  //       snackbar:this._snackBar,
  //       type
  //     },
  //     verticalPosition : 'top',
  //     horizontalPosition:'right',
  //     panelClass:'success-snackbar'
  //   });
  // }

  // openErrorSnackBar(message: string, action: string = 'Try again!', type: string = 'error') {
  //   const config = new MatSnackBarConfig();
  //   config.duration = 2000;
  //   config.verticalPosition = 'top';

  //   this._snackBar.openFromComponent(SnackBarComponent,{
  //     data:{
  //       icon:'report_problem',
  //       message,
  //       action,
  //       snackbar:this._snackBar,
  //       type,
  //     },
  //     verticalPosition : 'top',
  //     horizontalPosition:'right',
      
  //     panelClass:'app-notification-error' 
  //   });
  // }
}

