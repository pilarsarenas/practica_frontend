import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-puesto-popup',
  templateUrl: './puesto-trabajo-popup.component.html',
  styleUrls: ['./puesto-trabajo-popup.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PuestoPopupComponent implements OnInit {

  @Input() authUser!: { nickUsuario: string; contrasena: string };
  @Output() cerrar = new EventEmitter<void>();

  puestos: any[] = [];
  nuevoNombre: string = '';
  editandoId: number | null = null;
  editandoNombre: string = '';
  errorMsg: string = '';

  constructor(private userService: UserService) {}

  async ngOnInit() {
    await this.cargarPuestos();
  }

  async cargarPuestos() {
    try {
      const resultado = await this.userService.obtenerPuestosDeTrabajo(
        this.authUser.nickUsuario, this.authUser.contrasena
      );
      this.puestos = Array.isArray(resultado) ? resultado : [];
    } catch (e) {
      this.puestos = [];
    }
  }

  async crear() {
    if (!this.nuevoNombre.trim()) {
      this.errorMsg = 'El nombre es obligatorio.';
      return;
    }
    try {
      await this.userService.crearPuestoDeTrabajo(
        { nombre: this.nuevoNombre.trim() },
        this.authUser.nickUsuario, this.authUser.contrasena
      );
      this.nuevoNombre = '';
      this.errorMsg = '';
      await this.cargarPuestos();
    } catch (e) {
      this.errorMsg = 'Error al crear el puesto.';
    }
  }

  activarEdicion(puesto: any) {
    this.editandoId = puesto.id;
    this.editandoNombre = puesto.nombre;
    this.errorMsg = '';
  }

  async actualizar() {
    if (!this.editandoNombre.trim()) {
      this.errorMsg = 'El nombre es obligatorio.';
      return;
    }
    try {
      await this.userService.actualizarPuestoDeTrabajo(
        this.editandoId!, { nombre: this.editandoNombre.trim() },
        this.authUser.nickUsuario, this.authUser.contrasena
      );
      this.editandoId = null;
      this.editandoNombre = '';
      this.errorMsg = '';
      await this.cargarPuestos();
    } catch (e) {
      this.errorMsg = 'Error al actualizar el puesto.';
    }
  }

  async eliminar(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este puesto?')) return;
    try {
      await this.userService.eliminarPuestoDeTrabajo(id, this.authUser.nickUsuario, this.authUser.contrasena);
      await this.cargarPuestos();
    } catch (e) {
      this.errorMsg = 'Error al eliminar el puesto.';
    }
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.editandoNombre = '';
    this.errorMsg = '';
  }
}