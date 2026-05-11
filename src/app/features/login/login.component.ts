import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {

  username: string = '';

  password: string = '';

  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login(): void {

    this.authService.login(
      this.username,
      this.password
    ).subscribe({

      next: (response) => {

        if (response) {

          this.router.navigate(['/usuarios']);

        } else {

          this.errorMessage =
            'Usuario o contraseña incorrectos';
        }
      },

      error: () => {

        this.errorMessage =
          'Error conectando con el backend';
      }
    });
  }
}