import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Usuario } from '../models/user.model';
import { Direccion } from '../models/direccion.model';
import { Genero } from '../models/genero.model';
import { PuestoDeTrabajo } from '../models/puestodetrabajo.model';

import to from './utils.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}


  async obtenerUsuarios(
    nickUsuario: string,
    nickContrasena: string
  ) {
    return await to(
      this.http.get<Usuario[]>(
        `${this.apiUrl}/usuarios`,
        {
          params: { nickUsuario, nickContrasena }
        }
      ).toPromise()
    );
  }

  async obtenerUsuarioPorId(
    id: number,
    nickUsuario: string,
    nickContrasena: string
  ) {
    return await to(
      this.http.get<Usuario>(
        `${this.apiUrl}/usuarios/${id}`,
        {
          params: { nickUsuario, nickContrasena }
        }
      ).toPromise()
    );
  }

  async crearUsuario(
    usuario: Usuario,
    nickUsuario: string,
    nickContrasena: string
  ) {
    return await to(
      this.http.post<Usuario>(
        `${this.apiUrl}/usuarios`,
        usuario,
        {
          params: { nickUsuario, nickContrasena }
        }
      ).toPromise()
    );
  }

  async actualizarUsuario(
    id: number,
    usuario: Usuario,
    nickUsuario: string,
    nickContrasena: string
  ) {
    return await to(
      this.http.put<Usuario>(
        `${this.apiUrl}/usuarios/${id}`,
        usuario,
        {
          params: { nickUsuario, nickContrasena }
        }
      ).toPromise()
    );
  }

  async eliminarUsuario(
    id: number,
    nickUsuario: string,
    nickContrasena: string
  ) {
    return await to(
      this.http.delete(
        `${this.apiUrl}/usuarios/${id}`,
        {
          params: { nickUsuario, nickContrasena }
        }
      ).toPromise()
    );
  }


  async obtenerDireccionesPorUsuario(
    usuarioId: number,
    nickUsuario: string,
    nickContrasena: string
  ) {
    return await to(
      this.http.get<Direccion[]>(
        `${this.apiUrl}/direcciones/usuario/${usuarioId}`,
        {
          params: { nickUsuario, nickContrasena }
        }
      ).toPromise()
    );
  }

  async crearDireccion(
    direccion: Direccion,
    nickUsuario: string,
    nickContrasena: string
  ) {
    return await to(
      this.http.post<Direccion>(
        `${this.apiUrl}/direcciones`,
        direccion,
        {
          params: { nickUsuario, nickContrasena }
        }
      ).toPromise()
    );
  }

  async actualizarDireccion(
    id: number,
    direccion: Direccion,
    nickUsuario: string,
    nickContrasena: string
  ) {
    return await to(
      this.http.put<Direccion>(
        `${this.apiUrl}/direcciones/${id}`,
        direccion,
        {
          params: { nickUsuario, nickContrasena }
        }
      ).toPromise()
    );
  }

  async eliminarDireccion(
    id: number,
    nickUsuario: string,
    nickContrasena: string
  ) {
    return await to(
      this.http.delete(
        `${this.apiUrl}/direcciones/${id}`,
        {
          params: { nickUsuario, nickContrasena }
        }
      ).toPromise()
    );
  }

async obtenerGeneros(nickUsuario: string, nickContrasena: string) {
  return await to(
  this.http.get<Genero[]>(
      `${this.apiUrl}/generos`,
      {
        params: { nickUsuario, nickContrasena }
      }
    ).toPromise()
  );
}

async obtenerPuestosDeTrabajo(
  nickUsuario: string,
  nickContrasena: string
) {
  return await to(
    this.http.get<PuestoDeTrabajo[]>(
      `${this.apiUrl}/puestosdetrabajo`,
      {
        params: { nickUsuario, nickContrasena }
      }
    ).toPromise()
  );
}
}