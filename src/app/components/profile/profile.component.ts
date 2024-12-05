import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Users } from 'src/app/models/users';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  user_now!: Users | null;

  constructor(private auth: AuthService) { 
    this.user_now = this.auth.getUser()
  }
}
