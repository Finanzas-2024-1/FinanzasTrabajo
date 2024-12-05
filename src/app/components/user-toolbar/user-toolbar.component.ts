import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-toolbar',
  templateUrl: './user-toolbar.component.html',
  styleUrls: ['./user-toolbar.component.css']
})
export class UserToolbarComponent {

  user_name!: string | undefined;

  constructor(private authService: AuthService) {
    this.user_name = this.authService.getUser()?.name;
  }

  conseguirDato() {
    const globalUser = this.authService.getUser();
    
    console.log(globalUser?.name)
  }

  logout(): void {
    this.authService.logout();
  }
}
