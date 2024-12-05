import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users';	

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private userService: UserService, private router: Router, private authService: AuthService) { }

  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  login() {
    const emailValue = this.email.value;
    const passwordValue = this.password.value;

    if (this.email.invalid || this.password.invalid) {
      // Al menos uno de los campos es inválido, mostrar mensajes de error
      this.email.markAsTouched();
      this.password.markAsTouched();
      return;
    }

    const newItem = {
      email: emailValue,
      password: passwordValue
    }

    this.userService.getList().subscribe(
      data => {
        const userExists = data.some(item => item.email === emailValue && item.password === passwordValue);

        if (userExists) {

          const user = data.find(item => item.email === emailValue && item.password === passwordValue) as Users;
    
          this.authService.setUser(user); // Almacenar el usuario en el AuthService

          this.router.navigate(['/products']);
        } else {
          alert('Usuario o contraseña incorrectos');
        }
      },
      error => {
        console.log("Ocurrió un error al obtener la data");
        console.log(error);
      }
    );
  }

  getErrorMessageEmail() {
    if(this.email.hasError('required')) {
      return 'Debes ingresar un valor';
    }

    return '';
  }

  getErrorMessagePassword() {
    if(this.password.hasError('required')) {
      return 'Debes ingresar un valor';
    }

    return '';
  }
}
