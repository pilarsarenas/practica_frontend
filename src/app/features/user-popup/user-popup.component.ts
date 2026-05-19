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
  @Input() usuarioEntrada: any = null;

  @Output() cerrarPopUpOk = new EventEmitter<any>();
  @Output() cerrarPopUpCancel = new EventEmitter<void>();

  selectedRowIndex: number | null = null;
  passwordError: string = '';
  nickError: string = '';

  usuario: any = {
    nickUsuario: '',
    contrasena: '',
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    fechaNacimiento: '',
    fechaHoraCreacion: '',
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
    if (this.modo === 'CREATE') {
      this.setFechaCreacion();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['authUser'] && this.authUser?.nickUsuario && !this.catalogsLoaded) {
      this.catalogsLoaded = true;
      this.loadCatalogs().then(() => {
        if (this.modo === 'UPDATE' && this.usuarioEntrada) {
          this.cargarUsuarioParaEditar();
        }
      });
    }

    if ((changes['modo'] || changes['usuarioEntrada']) && this.catalogsLoaded) {
      if (this.modo === 'UPDATE' && this.usuarioEntrada) {
        this.cargarUsuarioParaEditar();
      } else if (this.modo === 'CREATE') {
        this.resetUsuario();
      }
    }
  }

  cargarUsuarioParaEditar() {
    const u = this.usuarioEntrada;

    let fechaNac = '';
    if (u.fechaNacimiento) {
      const d = new Date(u.fechaNacimiento);
      if (!isNaN(d.getTime())) {
        fechaNac = d.toISOString().substring(0, 10);
      } else {
        fechaNac = u.fechaNacimiento;
      }
    }

    let fechaCreacionMostrar = '';
    if (u.fechaHoraCreacion) {
      const d = new Date(u.fechaHoraCreacion);
      if (!isNaN(d.getTime())) {
        const p = (n: number) => n.toString().padStart(2, '0');
        fechaCreacionMostrar =
          `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ` +
          `${p(d.getHours())}:${p(d.getMinutes())}`;
      }
    }

    const generoCatalogo = this.generos.find(g => g.id === u.genero?.id) || null;
    const puestoCatalogo = this.puestos.find(p => p.id === u.puestoDeTrabajo?.id) || null;

    this.usuario = {
      ...u,
      fechaNacimiento: fechaNac,
      fechaHoraCreacion: fechaCreacionMostrar,
      genero: generoCatalogo,
      puestoDeTrabajo: puestoCatalogo,
      direcciones: u.direcciones ? [...u.direcciones] : []
    };

    this.passwordError = '';
    this.nickError = '';
    this.selectedRowIndex = null;
  }

  resetUsuario() {
    this.usuario = {
      nickUsuario: '',
      contrasena: '',
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
      fechaNacimiento: '',
      fechaHoraCreacion: '',
      genero: null,
      puestoDeTrabajo: null,
      horaDesayuno: '',
      esAdmin: false,
      direcciones: []
    };
    this.passwordError = '';
    this.nickError = '';
    this.setFechaCreacion();
    this.selectedRowIndex = null;
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1?.id === o2?.id;
  }

  setFechaCreacion() {
    const now = new Date();
    const p = (n: number) => n.toString().padStart(2, '0');
    this.usuario.fechaHoraCreacion =
      `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())} ` +
      `${p(now.getHours())}:${p(now.getMinutes())}`;
  }

  validarNick(nick: string): boolean {
    if (!nick || nick.trim().length === 0) {
      this.nickError = 'El nombre de usuario es obligatorio.';
      return false;
    }
    if (nick.trim().length < 3) {
      this.nickError = 'El nombre de usuario debe tener al menos 3 caracteres.';
      return false;
    }
    this.nickError = '';
    return true;
  }

  validarContrasena(contrasena: string): boolean {
    if (this.modo === 'UPDATE' && !contrasena) {
      this.passwordError = '';
      return true;
    }
    if (!contrasena) {
      this.passwordError = 'La contraseña es obligatoria.';
      return false;
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!regex.test(contrasena)) {
      this.passwordError = 'Mínimo 6 caracteres, una mayúscula, una minúscula y un número.';
      return false;
    }
    this.passwordError = '';
    return true;
  }

  async nickEstaRepetido(): Promise<boolean> {
    const nick = this.usuario.nickUsuario?.trim().toLowerCase();
    const resultado = await this.userService.obtenerUsuarios(
      this.authUser.nickUsuario,
      this.authUser.contrasena
    );
    const usuarios: any[] = Array.isArray(resultado) ? resultado : [];

    return usuarios.some((u: any) => {
      const mismoNick = u.nickUsuario?.trim().toLowerCase() === nick;
      const esElMismo = this.modo === 'UPDATE' && u.id === this.usuarioEntrada?.id;
      return mismoNick && !esElMismo;
    });
  }

  async loadCatalogs() {
    await Promise.all([this.loadGeneros(), this.loadPuestos()]);
  }

  async loadGeneros() {
    try {
      const resultado = await this.userService.obtenerGeneros(
        this.authUser.nickUsuario, this.authUser.contrasena
      );
      if (!resultado) { this.generos = []; return; }
      if (Array.isArray(resultado) && resultado[0] instanceof Error) { this.generos = []; return; }
      this.generos = Array.isArray(resultado) ? resultado : [resultado];
    } catch (e) {
      this.generos = [];
    }
  }

  async loadPuestos() {
    try {
      const resultado = await this.userService.obtenerPuestosDeTrabajo(
        this.authUser.nickUsuario, this.authUser.contrasena
      );
      if (!resultado) { this.puestos = []; return; }
      if (Array.isArray(resultado) && resultado[0] instanceof Error) { this.puestos = []; return; }
      this.puestos = Array.isArray(resultado) ? resultado : [resultado];
    } catch (e) {
      this.puestos = [];
    }
  }

  async onSave() {
    const nickValido = this.validarNick(this.usuario.nickUsuario);
    const passValida = this.validarContrasena(this.usuario.contrasena);
    if (!nickValido || !passValida) return;

    const repetido = await this.nickEstaRepetido();
    if (repetido) {
      this.nickError = 'Este nombre de usuario ya está en uso.';
      return;
    }

    try {
      const contrasenaFinal = (this.modo === 'UPDATE' && !this.usuario.contrasena)
        ? this.usuarioEntrada?.contrasena
        : this.usuario.contrasena;

      const usuarioAEnviar = {
        ...this.usuario,
        contrasena: contrasenaFinal,
        fechaHoraCreacion: this.modo === 'CREATE'
          ? new Date().toISOString()
          : this.usuarioEntrada?.fechaHoraCreacion,
        fechaNacimiento: this.usuario.fechaNacimiento || null,
        genero: this.usuario.genero ? { id: this.usuario.genero.id } : null,
        puestoDeTrabajo: this.usuario.puestoDeTrabajo ? { id: this.usuario.puestoDeTrabajo.id } : null,
        direcciones: []
      };

      let res: any;

      if (this.modo === 'CREATE') {
        const resultado = await this.userService.crearUsuario(
          usuarioAEnviar, this.authUser.nickUsuario, this.authUser.contrasena
        );
        if (!resultado || (Array.isArray(resultado) && resultado[0] instanceof Error)) {
          alert('Error al crear el usuario.'); return;
        }
        res = resultado;

        for (const dir of this.usuario.direcciones) {
          await this.guardarDireccion(dir, res.id, 'CREATE');
        }

      } else if (this.modo === 'UPDATE') {
        const resultado = await this.userService.actualizarUsuario(
          this.usuario.id, usuarioAEnviar, this.authUser.nickUsuario, this.authUser.contrasena
        );
        if (!resultado || (Array.isArray(resultado) && resultado[0] instanceof Error)) {
          alert('Error al actualizar el usuario.'); return;
        }
        res = resultado;

        const direccionesOriginales: any[] = this.usuarioEntrada?.direcciones || [];
        const direccionesActuales: any[] = this.usuario.direcciones;

        for (const dirOrig of direccionesOriginales) {
          const sigueExistiendo = direccionesActuales.find((d: any) => d.id === dirOrig.id);
          if (!sigueExistiendo) {
            await this.userService.eliminarDireccion(
              dirOrig.id, this.authUser.nickUsuario, this.authUser.contrasena
            );
          }
        }

        for (const dir of direccionesActuales) {
          await this.guardarDireccion(dir, res.id, dir.id ? 'UPDATE' : 'CREATE');
        }
      }

      this.cerrarPopUpOk.emit(res);

    } catch (e) {
      console.error('Excepción onSave:', e);
    }
  }

  async guardarDireccion(dir: any, usuarioId: number, operacion: 'CREATE' | 'UPDATE') {
    const dirAEnviar = {
      nombreCalle: dir.nombreCalle,
      numeroCalle: dir.numeroCalle,
      direccionPrincipal: dir.direccionPrincipal ? 1 : 0,
      usuario: { id: usuarioId }
    };

    if (operacion === 'CREATE') {
      await this.userService.crearDireccion(dirAEnviar as any, this.authUser.nickUsuario, this.authUser.contrasena);
    } else {
      await this.userService.actualizarDireccion(dir.id, dirAEnviar as any, this.authUser.nickUsuario, this.authUser.contrasena);
    }
  }

  onCancel() {
    this.cerrarPopUpCancel.emit();
  }

  addAddress() {
    this.usuario.direcciones.push({ nombreCalle: '', numeroCalle: null, direccionPrincipal: 0 });
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
  }
}