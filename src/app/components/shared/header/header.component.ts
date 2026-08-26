import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  host: {
    class: 'flex flex-row justify-content-between',
  },
})
export class HeaderComponent {}
