import { Component } from '@angular/core';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor( public authService: AuthService) {

    this.initializeApp();
  }

  initializeApp() {

  }

  logoutUser():Promise<void> {
    return this.authService.logoutUser()
    }
}
