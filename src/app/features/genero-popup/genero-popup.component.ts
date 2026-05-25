import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-genero-popup',
  templateUrl: './genero-popup.component.html',
  styleUrls: ['./genero-popup.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GeneroPopupComponent implements OnInit {

  @Input() authUser!: { nickUsuario: string; contrasena: string };
  @Output() cerrar = new EventEmitter<void>();

  generos: any[] = [];
  nuevoNombre: string = '';
  editandoId: number | null = null;
  editandoNombre: string = '';
  errorMsg: string = '';

  constructor(private userService: UserService) {}

  async ngOnInit() {
    await this.cargarGeneros();
  }

  async cargarGeneros() {
    try {
      const resultado = await this.userService.obtenerGeneros(
        this.authUser.nickUsuario, this.authUser.contrasena
      );
      this.generos = Array.isArray(resultado) ? resultado : [];
    } catch (e) {
      this.generos = [];
    }
  }

  async crear() {
    if (!this.nuevoNombre.trim()) {
      this.errorMsg = 'El nombre es obligatorio.';
      return;
    }
    try {
      await this.userService.crearGenero(
        { nombre: this.nuevoNombre.trim() },
        this.authUser.nickUsuario, this.authUser.contrasena
      );
      this.nuevoNombre = '';
      this.errorMsg = '';
      await this.cargarGeneros();
    } catch (e) {
      this.errorMsg = 'Error al crear el género.';
    }
  }

  activarEdicion(genero: any) {
    this.editandoId = genero.id;
    this.editandoNombre = genero.nombre;
    this.errorMsg = '';
  }

  async actualizar() {
    if (!this.editandoNombre.trim()) {
      this.errorMsg = 'El nombre es obligatorio.';
      return;
    }
    try {
      await this.userService.actualizarGenero(
        this.editandoId!, { nombre: this.editandoNombre.trim() },
        this.authUser.nickUsuario, this.authUser.contrasena
      );
      this.editandoId = null;
      this.editandoNombre = '';
      this.errorMsg = '';
      await this.cargarGeneros();
    } catch (e) {
      this.errorMsg = 'Error al actualizar el género.';
    }
  }

  async eliminar(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este género?')) return;
    try {
      await this.userService.eliminarGenero(id, this.authUser.nickUsuario, this.authUser.contrasena);
      await this.cargarGeneros();
    } catch (e) {
      this.errorMsg = 'Error al eliminar el género.';
    }
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.editandoNombre = '';
    this.errorMsg = '';
  }
}