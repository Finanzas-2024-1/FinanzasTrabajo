import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor( private userService: UserService, private router: Router) { }

  name = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  repassword = new FormControl('', [Validators.required]);
  terms = new FormControl(false, [Validators.requiredTrue]);
  termsError = false;

  submit() {
    const nameValue = this.name.value;
    const emailValue = this.email.value;
    const passwordValue = this.password.value;
    const repasswordValue = this.repassword.value;

    if (this.name.invalid || this.email.invalid || this.password.invalid || this.repassword.invalid) {
      // Al menos uno de los campos es inválido, mostrar mensajes de error
      this.name.markAsTouched();
      this.email.markAsTouched();
      this.password.markAsTouched();
      this.repassword.markAsTouched();
      return;
    }
  
    if (passwordValue !== repasswordValue) {
      // Las contraseñas no coinciden, mostrar mensaje de error
      this.repassword.setErrors({ mismatch: true });
      return;
    }

    if (!this.terms.value) {
      // El checkbox no está marcado, mostrar mensaje de error
      this.termsError = true;
      return;
    }
  
    const newItem = {
      name: nameValue,
      email: emailValue,
      password: passwordValue,
      repassword: repasswordValue
    }
  
    this.userService.createItem(newItem).subscribe(
      res => {
        console.log("Usuario agregado exitosamente");
        this.router.navigate(['/login']);
        this.name.reset();
        this.email.reset();
        this.password.reset();
        this.repassword.reset();
      },
      error => {
        console.log("Ocurrió un error al agregar el usuario");
        console.log(error);
      }
    );
  }

  getErrorMessageName() {
    if(this.name.hasError('required')) {
      return 'Debes ingresar un valor';
    }

    return '';
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

  getErrorMessageRePassword() {
    if (this.repassword.hasError('required')) {
      return 'Debes ingresar un valor';
    }
  
    if (this.repassword.hasError('mismatch')) {
      return 'Las contraseñas no coinciden';
    }
  
    return '';
  }

  resetTermsError() {
    this.termsError = false;
  }
}
