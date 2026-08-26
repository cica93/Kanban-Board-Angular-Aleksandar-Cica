import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { TitleCasePipe } from '@angular/common';

@Component({
  imports: [MatIconModule, MatButtonModule, TitleCasePipe],
  selector: 'app-custom-snackbar',
  styleUrl: './custom-snackbar.component.scss',
  templateUrl: './custom-snackbar.component.html',
})
export class CustomSnackbarComponent {
  public readonly snackBarRef = inject(MatSnackBarRef<CustomSnackbarComponent>);
  public readonly data: {
    summary: string;
    detail: string;
  } = inject(MAT_SNACK_BAR_DATA);
}
