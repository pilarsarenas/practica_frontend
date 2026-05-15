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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.setFechaCreacion();
  }

  // Se ejecuta cada vez que un @Input cambia, incluyendo la primera vez
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

      // 'to' devuelve el dato directo en éxito, [err] en error
      if (!resultado) { this.generos = []; return; }

      // Si es array con primer elemento que es Error -> es un error
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
      const resultado = await this.userService.crearUsuario(
        this.usuario,
        this.authUser.nickUsuario,
        this.authUser.contrasena
      );

      if (!resultado) { console.error('Respuesta vacía'); return; }

      const [res, err] = resultado as any;
      if (err) { console.error('Error creando usuario:', err); return; }

      if (res?.id && this.usuario.direcciones.length > 0) {
        for (const dir of this.usuario.direcciones) {
          await this.userService.crearDireccion(
            { ...dir, usuarioId: res.id },
            this.authUser.nickUsuario,
            this.authUser.contrasena
          );
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