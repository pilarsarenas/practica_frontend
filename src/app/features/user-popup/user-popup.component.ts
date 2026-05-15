import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-popup',
  templateUrl: './user-popup.component.html',
  styleUrls: ['./user-popup.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UserPopupComponent implements OnInit {

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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.setFechaCreacion();
    this.loadCatalogs();
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
    if (!this.authUser) return;

    await Promise.all([
      this.loadGeneros(),
      this.loadPuestos()
    ]);
  }

  // -----------------------
  // GENEROS
  // -----------------------
async loadGeneros() {

  const [data, err] = await this.userService.obtenerGeneros(
    this.authUser.nickUsuario,
    this.authUser.contrasena
  );

 console.log(JSON.stringify(data));

  if (err) {
    console.error(err);
    this.generos = [];
    return;
  }

  // SI VIENE ARRAY
  if (Array.isArray(data)) {

    this.generos = data;

  } else if (data) {

    // SI VIENE OBJETO -> LO METEMOS EN ARRAY
    this.generos = [data];

  } else {

    this.generos = [];

  }

  console.log('GENEROS FINAL:', this.generos);
}

  // -----------------------
  // PUESTOS
  // -----------------------
async loadPuestos() {

  const [data, err] = await this.userService.obtenerPuestosDeTrabajo(
    this.authUser.nickUsuario,
    this.authUser.contrasena
  );

console.log(JSON.stringify(data));

  if (err) {
    console.error(err);
    this.puestos = [];
    return;
  }

  // SI VIENE ARRAY
  if (Array.isArray(data)) {

    this.puestos = data;

  } else if (data) {

    // SI VIENE OBJETO -> LO METEMOS EN ARRAY
    this.puestos = [data];

  } else {

    this.puestos = [];

  }

  console.log('PUESTOS FINAL:', this.puestos);
}
  // -----------------------
  // SAVE
  // -----------------------
  async onSave() {
    const [res, err] = await this.userService.crearUsuario(
      this.usuario,
      this.authUser.nickUsuario,
      this.authUser.contrasena
    );

    if (err) {
      console.error('Error creando usuario', err);
      return;
    }

    this.cerrarPopUpOk.emit(res);
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
      d.direccionPrincipal = i === index;
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