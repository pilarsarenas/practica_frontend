import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Usuario } from '../models/user.model';
import to from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  async obtenerUsuarios(nickUsuario: string, nickContrasena: string) {
    return await to(
      this.http
        .get<Usuario[]>(
          `${this.apiUrl}/usuarios?nickUsuario=${nickUsuario}&nickContrasena=${nickContrasena}`
        )
        .toPromise()
    );
  }

  async eliminarUsuario(id: number, nickUsuario: string, nickContrasena: string) {
    return await to(
      this.http
        .delete(
          `${this.apiUrl}/usuarios/${id}?nickUsuario=${nickUsuario}&nickContrasena=${nickContrasena}`
        )
        .toPromise()
    );
  }

  async crearUsuario(usuario: Usuario, nickUsuario: string, nickContrasena: string) {
    return await to(
      this.http
        .post<Usuario>(
          `${this.apiUrl}/usuarios?nickUsuario=${nickUsuario}&nickContrasena=${nickContrasena}`,
          usuario
        )
        .toPromise()
    );
  }

  async actualizarUsuario(id: number, usuario: Usuario, nickUsuario: string, nickContrasena: string) {
    return await to(
      this.http
        .put<Usuario>(
          `${this.apiUrl}/usuarios/${id}?nickUsuario=${nickUsuario}&nickContrasena=${nickContrasena}`,
          usuario
        )
        .toPromise()
    );
  }
  async obtenerDireccionesPorUsuario(
  usuarioId: number,
  nickUsuario: string,
  nickContrasena: string
) {
  return await to(
    this.http
      .get<any[]>(
        `${this.apiUrl}/direcciones/usuario/${usuarioId}?nickUsuario=${nickUsuario}&nickContrasena=${nickContrasena}`
      )
      .toPromise()
  );
}
}