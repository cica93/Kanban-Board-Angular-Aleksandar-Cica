import { Component } from '@angular/core';
import { IonCol, IonGrid, IonRow } from '@ionic/angular';

@Component({
  selector: 'app-header',
  imports: [IonGrid, IonRow, IonCol],
  templateUrl: './header.component.html',
  host: {
    class: 'flex flex-row justify-content-between',
  },
})
export class HeaderComponent {}
