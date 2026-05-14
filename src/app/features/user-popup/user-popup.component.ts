import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserService } from "src/app/core/services/user.service";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";

@Component({
  selector: 'app-user-popup',
  templateUrl: './user-popup.component.html',
  styleUrls: ['./user-popup.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class UserPopupComponent implements OnInit {

  @Input() authUser!: { nickUsuario: string; contrasena: string };

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
    puestoTrabajo: null,
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

  setFechaCreacion() {
    const now = new Date();
    const p = (n: number) => n.toString().padStart(2, '0');

    this.usuario.fechaCreacion =
      `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())} ` +
      `${p(now.getHours())}:${p(now.getMinutes())}`;
  }

  async loadCatalogs() {
    if (!this.authUser) return;

    await this.loadGeneros();
    await this.loadPuestos();
  }

  async loadGeneros() {
    const [data, err] = await this.userService.obtenerGeneros(
  this.authUser.nickUsuario,
  this.authUser.contrasena
);


    if (data) {
      this.generos = data;
    } else {
      console.error('Error cargando géneros', err);
    }
  }

  async loadPuestos() {
    const [data, err] = await this.userService.obtenerPuestosDeTrabajo(
      this.authUser.nickUsuario,
      this.authUser.contrasena
    );

    if (data) {
      this.puestos = data;
    } else {
      console.error('Error cargando puestos', err);
    }
  }

  async onSave() {
    const [res, err] = await this.userService.crearUsuario(
      this.usuario,
      this.authUser.nickUsuario,
      this.authUser.contrasena
    );

    if (res) {
      this.cerrarPopUpOk.emit(res);
    } else {
      console.error('Error creando usuario', err);
    }
  }

  onCancel() {
    this.cerrarPopUpCancel.emit();
  }

  addAddress() {
    this.usuario.direcciones.push({
      calle: '',
      numero: '',
      principal: false
    });
  }

  deleteAddress() {
    if (this.selectedRowIndex === null) return;

    this.usuario.direcciones.splice(this.selectedRowIndex, 1);
    this.selectedRowIndex = null;
  }

  setMainAddress(index: number) {
    this.usuario.direcciones.forEach((d: any, i: number) => {
      d.principal = i === index;
    });
  }
}