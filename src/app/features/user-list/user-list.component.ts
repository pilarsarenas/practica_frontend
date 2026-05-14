import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserPopupComponent } from '../user-popup/user-popup.component';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    UserPopupComponent,
    DatePipe
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  usuarios: any[] = [];
  usuarioSeleccionado?: any;
  modoPopup: string = 'CLOSED';
  adminLogged: any; // Variable para pasar al popup

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  async ngOnInit() {
    await this.cargarUsuarios();
  }

  async cargarUsuarios() {
    // 1. Obtenemos credenciales del localStorage
    const nickUsuario = localStorage.getItem('nickUsuario') || '';
    const contrasena = localStorage.getItem('contrasena') || '';

    // 2. Guardamos en adminLogged para que el popup lo reciba
    this.adminLogged = { nickUsuario, contrasena };

    // 3. Llamada al servicio para obtener usuarios
    const resultado = await this.userService.obtenerUsuarios(nickUsuario, contrasena);

    let usuariosLocal: any[] = [];

    if (Array.isArray(resultado)) {
      usuariosLocal = resultado;
    } else {
      const [data, error] = resultado as any;
      if (error) {
        console.error('Error usuarios:', error);
        return;
      }
      usuariosLocal = data || [];
    }

    // 4. Carga de direcciones para cada usuario
    for (const usuario of usuariosLocal) {
      const resultadoDirecciones = await this.userService.obtenerDireccionesPorUsuario(
        usuario.id,
        nickUsuario,
        contrasena
      );

      if (Array.isArray(resultadoDirecciones)) {
        usuario.direcciones = resultadoDirecciones;
      } else {
        const [direcciones, errorDir] = resultadoDirecciones as any;
        usuario.direcciones = !errorDir ? (direcciones || []) : [];
      }
    }

    this.usuarios = usuariosLocal;

    // Seleccionamos el primero por defecto si existe
    if (this.usuarios.length > 0) {
      this.usuarioSeleccionado = this.usuarios[0];
    }
  }

  logout(): void {
    localStorage.removeItem('nickUsuario');
    localStorage.removeItem('contrasena');
    this.router.navigate(['/login']);
  }

  launchPopupCreate(): void {
    this.modoPopup = 'CREATE';
  }

  launchPopupUpdate(): void {
    if (this.usuarioSeleccionado) {
      this.modoPopup = 'UPDATE';
    }
  }

  async eliminarUsuario() {
    if (!this.usuarioSeleccionado) return;

    const nickUsuario = localStorage.getItem('nickUsuario') || '';
    const contrasena = localStorage.getItem('contrasena') || '';

    const [, error] = await this.userService.eliminarUsuario(
      this.usuarioSeleccionado.id,
      nickUsuario,
      contrasena
    );

    if (error) {
      console.error('Error al eliminar:', error);
      return;
    }

    await this.cargarUsuarios();
  }

  onCerrarPopUpOk(): void {
    this.modoPopup = 'CLOSED';
    this.cargarUsuarios();
  }

  onCerrarPopUpCancel(): void {
    this.modoPopup = 'CLOSED';
  }

  seleccionarUsuario(usuario: any): void {
    this.usuarioSeleccionado = usuario;
  }

  obtenerIconoGenero(generoNombre: string): string {
    if (!generoNombre) return '/assets/images/Other.png';
    const g = generoNombre.toLowerCase();
    if (g === 'hombre' || g === 'masculino') return '/assets/images/Male.JPG';
    if (g === 'mujer' || g === 'femenino') return '/assets/images/Female.JPG';
    return '/assets/images/Other.png';
  }

  obtenerDireccionCompleta(usuario: any): string {
    const principal = usuario.direcciones?.find((d: any) => d.direccionPrincipal == 1);
    if (!principal) return 'Sin dirección';
    const calle = principal.nombreCalle || '';
    const numero = principal.numeroCalle ? `, ${principal.numeroCalle}` : '';
    return `${calle}${numero}`;
  }

  obtenerDireccionCorta(usuario: any): string {
    const direccion = this.obtenerDireccionCompleta(usuario);
    const MAX_LENGTH = 25;
    return direccion.length > MAX_LENGTH ? direccion.substring(0, MAX_LENGTH) + '...' : direccion;
  }

  obtenerContadorDireccionesExtra(usuario: any): number {
    if (!usuario.direcciones) return 0;
    return Math.max(0, usuario.direcciones.length - 1);
  }
}