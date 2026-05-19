import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    FormsModule
  ]
})
export class LoginComponent {

  loginService: LoginService;
  nickUsuario: string = '';
  contrasena: string = '';
  errorMessage: string = '';

  constructor(private router: Router, loginService: LoginService) {
    this.loginService = loginService;
  }

  async login() {
    if (!this.nickUsuario || this.nickUsuario.trim() === '') {
      this.errorMessage = 'El nombre de usuario es obligatorio';
      return;
    }
    if (!this.contrasena || this.contrasena.trim() === '') {
      this.errorMessage = 'La contraseña es obligatoria';
      return;
    }

    let result = await this.loginService.iniciarSesion(this.nickUsuario, this.contrasena);
    if (result === true) {
      localStorage.setItem('nickUsuario', this.nickUsuario);
      localStorage.setItem('contrasena', this.contrasena);
      this.router.navigate(['/usuarios']);
    } else {
      this.errorMessage = 'Credenciales incorrectas';
    }
  }
}