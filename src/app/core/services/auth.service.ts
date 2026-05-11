import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl =
    'http://localhost:8080/api/v1/usuarios/login';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {

    return this.http.post<boolean>(
      this.apiUrl,
      {
        nickUsuario: username,
        contrasena: password
      }
    );
  }
}