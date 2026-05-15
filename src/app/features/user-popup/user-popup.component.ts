import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-popup',
  templateUrl: './user-popup.component.html',
  styleUrls: ['./user-popup.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UserPopupComponent implements OnInit, OnChanges {

  @Input() modo: string = 'CREATE';
  @Input() authUser!: { nickUsuario: string; contrasena: string; };

  @Output() cerrarPopUpOk = new EventEmitter<any>();
  @Output() cerrarPopUpCancel = new EventEmitter<void>();

  selectedRowIndex: number | null = null;

  usuario: any = {
    nickUsuario: '',
    contrasena: '',
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    fechaNacimiento: '',
    fechaCreacion: '',
    genero: null,
    puestoDeTrabajo: null,
    horaDesayuno: '',
    esAdmin: false,
    direcciones: []
  };

  generos: any[] = [];
  puestos: any[] = [];
  catalogsLoaded = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.setFechaCreacion();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['authUser'] && this.authUser?.nickUsuario && !this.catalogsLoaded) {
      this.catalogsLoaded = true;
      this.loadCatalogs();
    }
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1?.id === o2?.id;
  }

  setFechaCreacion() {
    const now = new Date();
    const p = (n: number) => n.toString().padStart(2, '0');
    this.usuario.fechaCreacion =
      `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())} ` +
      `${p(now.getHours())}:${p(now.getMinutes())}`;
  }

  async loadCatalogs() {
    await Promise.all([
      this.loadGeneros(),
      this.loadPuestos()
    ]);
  }

  async loadGeneros() {
    try {
      const resultado = await this.userService.obtenerGeneros(
        this.authUser.nickUsuario,
        this.authUser.contrasena
      );

      if (!resultado) { this.generos = []; return; }

      if (Array.isArray(resultado) && resultado[0] instanceof Error) {
        console.error('Error géneros:', resultado[0]);
        this.generos = [];
        return;
      }

      this.generos = Array.isArray(resultado) ? resultado : [resultado];
      console.log('Géneros cargados:', this.generos);

    } catch (e) {
      console.error('Excepción loadGeneros:', e);
      this.generos = [];
    }
  }

  async loadPuestos() {
    try {
      const resultado = await this.userService.obtenerPuestosDeTrabajo(
        this.authUser.nickUsuario,
        this.authUser.contrasena
      );

      if (!resultado) { this.puestos = []; return; }

      if (Array.isArray(resultado) && resultado[0] instanceof Error) {
        console.error('Error puestos:', resultado[0]);
        this.puestos = [];
        return;
      }

      this.puestos = Array.isArray(resultado) ? resultado : [resultado];
      console.log('Puestos cargados:', this.puestos);

    } catch (e) {
      console.error('Excepción loadPuestos:', e);
      this.puestos = [];
    }
  }
  async onSave() {
    try {
      const usuarioAEnviar = {
        ...this.usuario,
        fechaHoraCreacion: new Date().toISOString(),
        fechaCreacion: undefined,
        fechaNacimiento: this.usuario.fechaNacimiento || null,
        genero: this.usuario.genero ? { id: this.usuario.genero.id } : null,
        puestoDeTrabajo: this.usuario.puestoDeTrabajo ? { id: this.usuario.puestoDeTrabajo.id } : null,
        direcciones: []
      };

      console.log('Enviando usuario:', JSON.stringify(usuarioAEnviar));

      const resultado = await this.userService.crearUsuario(
        usuarioAEnviar,
        this.authUser.nickUsuario,
        this.authUser.contrasena
      );

      if (!resultado) { console.error('Respuesta vacía'); return; }
      if (Array.isArray(resultado) && resultado[0] instanceof Error) {
        console.error('Error creando usuario:', resultado[0]);
        alert('Error al crear el usuario.');
        return;
      }

      const res = resultado as any;
      console.log('Usuario creado con id:', res.id);

      if (res?.id && this.usuario.direcciones.length > 0) {
        for (const dir of this.usuario.direcciones) {
          const dirAEnviar = {
            nombreCalle: dir.nombreCalle,
            numeroCalle: dir.numeroCalle,
            direccionPrincipal: dir.direccionPrincipal ? 1 : 0,
            usuario: { id: res.id }   
          };

          console.log('Enviando dirección:', JSON.stringify(dirAEnviar));

          const resultadoDir = await this.userService.crearDireccion(
            dirAEnviar as any,
            this.authUser.nickUsuario,
            this.authUser.contrasena
          );

          if (Array.isArray(resultadoDir) && resultadoDir[0] instanceof Error) {
            console.error('Error creando dirección:', resultadoDir[0]);
          }
        }
      }

      this.cerrarPopUpOk.emit(res);

    } catch (e) {
      console.error('Excepción onSave:', e);
    }
  }

  onCancel() {
    this.cerrarPopUpCancel.emit();
  }

  addAddress() {
    this.usuario.direcciones.push({
      nombreCalle: '',
      numeroCalle: null,
      direccionPrincipal: false
    });
  }

  deleteAddress() {
    if (this.selectedRowIndex === null) return;
    this.usuario.direcciones.splice(this.selectedRowIndex, 1);
    this.selectedRowIndex = null;
  }

  setMainAddress(index: number) {
    this.usuario.direcciones.forEach((d: any, i: number) => {
      d.direccionPrincipal = i === index ? 1 : 0;
    });
  }

  updateAddress() {
    if (this.selectedRowIndex === null) return;
    const addr = this.usuario.direcciones[this.selectedRowIndex];
    if (!addr) return;
    if (addr.direccionPrincipal) {
      this.setMainAddress(this.selectedRowIndex);
    }
  }
}