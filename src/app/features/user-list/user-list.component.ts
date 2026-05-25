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
  adminLogged: any;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  async ngOnInit() {
    await this.cargarUsuarios();
  }

  async cargarUsuarios() {
    const nickUsuario = localStorage.getItem('nickUsuario') || '';
    const contrasena = localStorage.getItem('contrasena') || '';


    this.adminLogged = { nickUsuario, contrasena };

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

    if (this.usuarios.length > 0) {
      this.usuarioSeleccionado = this.usuarios[0];
    }
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

    const confirmado = confirm("¿Estás seguro de que deseas eliminar el usuario seleccionado?");
    if (!confirmado) return;

    const nickUsuario = localStorage.getItem('nickUsuario') || '';
    const contrasena = localStorage.getItem('contrasena') || '';

    const direcciones = this.usuarioSeleccionado.direcciones || [];

    for (const direccion of direcciones) {
      const resultadoDir: any = await this.userService.eliminarDireccion(
        direccion.id,
        nickUsuario,
        contrasena
      );

      const errorDir = Array.isArray(resultadoDir) ? resultadoDir[1] : null;
      if (errorDir) {
        console.error('Error al eliminar dirección:', errorDir);
        alert('No se pudo eliminar una dirección del usuario. Operación cancelada.');
        return;
      }
    }

    const resultado: any = await this.userService.eliminarUsuario(
      this.usuarioSeleccionado.id,
      nickUsuario,
      contrasena
    );

    const error = Array.isArray(resultado) ? resultado[1] : null;
    if (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar el usuario. Inténtalo de nuevo.');
      return;
    }

    this.usuarioSeleccionado = undefined;
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
  const tienePrincipal = usuario.direcciones.some((d: any) => d.direccionPrincipal == 1);
  return Math.max(0, usuario.direcciones.length - (tienePrincipal ? 1 : 0));
}

formatearFecha(fecha: any): string {
  if (!fecha) return '';
  const partes = fecha.toString().replace('T', '-').replace(/:/g, '-').split('-');
  const year = partes[0];
  const month = partes[1];
  const day = partes[2];
  const hour = partes[3] || '00';
  const min = partes[4] || '00';
  return `${year}-${month}-${day} ${hour}:${min}`;
}
}