# Documentación del proyecto Usuarios App

## 1. Visión general del proyecto

Este proyecto es una aplicación web Angular destinada a gestionar usuarios. Incluye:

- Pantalla de login.
- Listado de usuarios.
- Creación y actualización de usuarios.
- Gestión de direcciones de cada usuario.
- Consumo de una API REST en `http://localhost:8080/api/v1`.

Es una aplicación Angular moderna con componentes independientes (`standalone`) y usa `FormsModule`, `HttpClientModule` y `Router`.

---

## 2. Archivos de configuración global

### `package.json`

- Define el nombre `usuarios-app` y la versión `1.0.0`.
- Scripts:
  - `npm start` / `ng serve`: arranca la aplicación en modo desarrollo.
  - `npm run build`: construye la aplicación para producción.
  - `npm test`: ejecuta pruebas.
  - `npm run lint`: ejecuta linting.
- Dependencias principales:
  - Angular 19 (`@angular/core`, `@angular/common`, `@angular/router`, `@angular/forms`, `@angular/platform-browser`).
  - `rxjs`, `tslib`, `zone.js`.
- DevDependencies para Angular CLI, compilador y TypeScript.

### `angular.json`

- Configura el proyecto Angular.
- Indica que el código fuente está en `src`.
- Define `main.ts` como entrada y `index.html` como plantilla.
- Activa `HttpClientModule` y `FormsModule` vía `main.ts`.
- Define `development` y `production` para build y serve.

### `src/index.html`

- Documento HTML base.
- Contiene la etiqueta `<app-root></app-root>` donde Angular monta la aplicación.
- Define `lang="es"`, `charset="utf-8"`, y `viewport`.

### `src/main.ts`

- Punto de arranque de Angular.
- Importa `bootstrapApplication` desde `@angular/platform-browser`.
- Registra el componente raiz `AppComponent`.
- Provee:
  - `provideRouter(routes)` para las rutas.
  - `FormsModule` para el binding con `ngModel`.
  - `HttpClientModule` para llamadas HTTP.
- Maneja posibles errores de arranque con `catch`.

### `src/polyfills.ts`

- Archivo estándar de Angular para polyfills.
- En este proyecto no contiene código propio importante.

---

## 3. Root del App

### `src/app/app.component.ts`

Es el componente raíz que se despliega en `<app-root>`.

- Importa `Router` para navegar y `RouterOutlet` para renderizar vistas de ruta.
- Importa `HeaderComponent` para mostrar el encabezado fuera de la ruta de login.
- Usa `CommonModule` para directivas básicas.
- Marca `standalone: true`, lo que significa que no necesita módulo `NgModule`.
- `providers: [LoginService]` registra el servicio de login en este componente. Sin embargo, el servicio ya es `providedIn: 'root'`, por lo que esta línea es redundante.
- Su constructor expone `public router: Router` para que la plantilla pueda conocer la ruta actual.

### `src/app/app.component.html`

- Contiene la estructura principal.
- Muestra `<app-header />` solo cuando la ruta no es `/login`.
- Incluye `<router-outlet></router-outlet>` donde se renderiza el componente correspondiente a la ruta activa.
- Usa la clase `nz-content` para el contenedor principal.

### `src/app/app.component.css`

- Estiliza `html, body` para ocupar 100% de altura y eliminar margenes.
- Define `.nz-content` para centrar el texto y separar el contenido.
- Estiliza el título `h2` con color rojo.

---

## 4. Enrutamiento

### `src/app/app.routes.ts`

Define las rutas principales de la aplicación:

- `''` redirige a la ruta de login (`/login`).
- `/login` renderiza `LoginComponent`.
- `/usuarios` renderiza `UserListComponent`.

Conexiones:

- `routes` se importa en `main.ts`.
- `LoginComponent` y `UserListComponent` son componentes standalone usados aquí.
- Constantes de ruta se extraen de `const-routes.ts`.

---

## 5. Constantes compartidas

### `src/app/shared/contants/const-urls.ts`

- `API_URL`: URL base de la API `http://localhost:8080/api/v1`.
- `NICK_USUARIO_PARAM`: nombre del parámetro `nickUsuario` para enviar en peticiones.
- `PASS_USUARIO_PARAM`: nombre del parámetro `contrasena`.

### `src/app/shared/contants/const-routes.ts`

- `PATH_USUARIOS = 'usuarios'`.
- `PATH_LOGIN = 'login'`.

### `src/app/shared/contants/const-local-storage.ts`

- `USUARIO_LOGADO_STORAGE = 'usuarioLogado'`.
- Se define para guardar usuario en localStorage, aunque en el proyecto actual no se usa activamente en todos los componentes.

---

## 6. Modelos de datos

### `src/app/core/models/user.model.ts`

Define la interfaz `Usuario` que representa un usuario del sistema:

- `id`: identificador numérico.
- `nickUsuario`: nombre de usuario.
- `nombre`: nombre real.
- `contrasena`: contraseña.
- `fechaHoraCreacion`: fecha de creación.
- `genero`: objeto `Genero`.
- `primerApellido` y `segundoApellido`.
- `fechaNacimiento`: fecha de nacimiento.
- `horaDesayuno`: hora de desayuno.
- `puestoTrabajo`: objeto `PuestoDeTrabajo`.
- `admin`: booleano para indicar si es administrador.
- `direcciones`: arreglo de `Direccion`.

También exporta `usuarioInicial`, un valor por defecto para inicializar formularios.

### `src/app/core/models/direccion.model.ts`

Define la interfaz `Direccion`:

- `id`: identificador de dirección.
- `nombreCalle`: nombre de la calle.
- `numeroCalle`: número.
- `usuario`: referencia al `Usuario` propietario.
- `direccionPrincipal`: booleano para indicar si es la dirección principal.

### `src/app/core/models/genero.model.ts`

Define la interfaz `Genero` con `id` y `nombre`.

### `src/app/core/models/puestodetrabajo.model.ts`

Define la interfaz `PuestoDeTrabajo` con `id` y `nombre`.

### `src/app/core/models/imagenusuario.model.ts`

Define `ImagenUsuario`:

- `id`.
- `usuario`: referencia `Usuario`.
- `imagen`: URL o cadena de la imagen.

> Nota: Este modelo existe en el proyecto, pero no se utiliza activamente en los componentes revisados.

---

## 7. Servicios

### `src/app/core/services/utils.service.ts`

Este archivo contiene utilidades generales.

- `to(promise: Promise<any>)`
  - Envuelve la promesa y devuelve el resultado exitoso.
  - Si la promesa lanza una excepción, devuelve un arreglo `[err]`.
  - Esto evita `try/catch` en cada petición cuando se usa el patrón `const resultado = await to(...)`.

- `isOkResponse(response)`
  - Verifica si la respuesta tiene `response.body.type === 'OK'`.
  - No se usa actualmente en los componentes principales.

- `loadResponseData(response)`
  - Retorna `response.body.data`.
  - También no se usa actualmente.

- `loadResponseError(response)`
  - Extrae el mensaje de error del cuerpo de respuesta.
  - No se usa en el código actual.

- `headers`
  - Cabeceras HTTP por defecto con `Content-Type: application/json`.
  - No se usa directamente en los servicios principales.

- `loadCredentials()`
  - Construye `HttpParams` usando el usuario logado desde localStorage.
  - No se usa directamente en el código actual.

- `guardarUsuarioLogado(usuario)` y `obtenerUsuarioLogado()`
  - Guardan y leen datos de usuario en `localStorage`.
  - También no se están usando en los componentes.

### `src/app/core/services/auth.service.ts`

Servicio de autenticación.

- `paramNickUsuario` y `paramContrasena`
  - Extrae los nombres de parámetro desde `ConstUrls`.
  - Sin embargo, no se usa en `iniciarSesion`.

- `apiUrl`
  - URL base de API desde `ConstUrls.API_URL`.

- `iniciarSesion(nickUsuario, contrasena)`
  - Construye un cuerpo con `nickUsuario` y `contrasena`.
  - Llama a `POST http://localhost:8080/api/v1/login`.
  - Usa `to(...)` para capturar errores en un arreglo.

Conexiones:

- Consumido en `LoginComponent`.
- No valida explícitamente la forma de la respuesta, solo determina si `result === true`.

### `src/app/core/services/user.service.ts`

Servicio principal para consumir la API REST de usuarios, direcciones, géneros y puestos.

- `apiUrl = 'http://localhost:8080/api/v1'`.
- Inyecta `HttpClient`.

Funciones de usuario:

- `obtenerUsuarios(nickUsuario, nickContrasena)`
  - GET `/usuarios` con parámetros de autenticación.
- `obtenerUsuarioPorId(id, nickUsuario, nickContrasena)`
  - GET `/usuarios/{id}`.
- `crearUsuario(usuario, nickUsuario, nickContrasena)`
  - POST `/usuarios`.
- `actualizarUsuario(id, usuario, nickUsuario, nickContrasena)`
  - PUT `/usuarios/{id}`.
- `eliminarUsuario(id, nickUsuario, nickContrasena)`
  - DELETE `/usuarios/{id}`.

Funciones de direcciones:

- `obtenerDireccionesPorUsuario(usuarioId, nickUsuario, nickContrasena)`
  - GET `/direcciones/usuario/{usuarioId}`.
- `crearDireccion(direccion, nickUsuario, nickContrasena)`
  - POST `/direcciones`.
- `actualizarDireccion(id, direccion, nickUsuario, nickContrasena)`
  - PUT `/direcciones/{id}`.
- `eliminarDireccion(id, nickUsuario, nickContrasena)`
  - DELETE `/direcciones/{id}`.

Funciones de géneros:

- `obtenerGeneros(nickUsuario, nickContrasena)`
  - GET `/generos`.
- `crearGenero(genero, nickUsuario, nickContrasena)`
  - POST `/generos`.
- `actualizarGenero(id, genero, nickUsuario, nickContrasena)`
  - PUT `/generos/{id}`.
- `eliminarGenero(id, nickUsuario, nickContrasena)`
  - DELETE `/generos/{id}`.

Funciones de puestos de trabajo:

- `obtenerPuestosDeTrabajo(nickUsuario, nickContrasena)`
  - GET `/puestosdetrabajo`.
- `crearPuestoDeTrabajo(puesto, nickUsuario, nickContrasena)`
  - POST `/puestosdetrabajo`.

### Repetición y patrones en `UserService`

- Todos los métodos usan el mismo patrón: `to(this.http.METODO(...).toPromise())`.
- Esto mantiene uniforme el manejo de errores y evita excepciones no capturadas.
- Las rutas usan siempre `nickUsuario` y `contrasena` como parámetros de consulta.

> Nota: `toPromise()` está en desuso en RxJS moderno, pero aquí se usa para convertir observables en promesas.

---

## 8. Componentes

### 8.1 `LoginComponent`

Archivos:
- `src/app/features/login/login.component.ts`
- `src/app/features/login/login.component.html`
- `src/app/features/login/login.component.css`

#### `login.component.ts`

- Importa `FormModule` para `ngModel`.
- Define propiedades:
  - `nickUsuario`
  - `contrasena`
  - `errorMessage`
- Inyecta `Router` y `LoginService`.
- `login()`:
  - Valida que los campos no estén vacíos.
  - Si faltan datos, asigna mensaje de error y retorna.
  - Llama a `loginService.iniciarSesion`.
  - Si el resultado es exactamente `true`:
    - Guarda `nickUsuario` y `contrasena` en `localStorage`.
    - Navega a `/usuarios`.
  - Si no, muestra `Credenciales incorrectas`.

Conexiones:

- Usa `LoginService`.
- Guarda credenciales en `localStorage` para que otros componentes accedan.
- Redirige a `UserListComponent` con `router.navigate(['/usuarios'])`.

#### `login.component.html`

- Muestra formulario de login con dos campos:
  - `nickUsuario`
  - `contrasena`
- Usa `[(ngModel)]` para enlazar propiedades.
- Si hay `errorMessage`, muestra el mensaje.
- Botón `Iniciar Sesión` invoca `login()`.

#### `login.component.css`

- Estiliza el formulario con contenedor centrado y colores suaves.
- Define estados `hover`/`active` en el botón.
- Estiliza el mensaje de error.

### 8.2 `UserListComponent`

Archivos:
- `src/app/features/user-list/user-list.component.ts`
- `src/app/features/user-list/user-list.component.html`
- `src/app/features/user-list/user-list.component.css`

#### `user-list.component.ts`

- Importa `CommonModule`, `DatePipe`, `UserPopupComponent` y `UserService`.
- Propiedades:
  - `usuarios`: lista cargada desde API.
  - `usuarioSeleccionado`: usuario seleccionado en la tabla.
  - `modoPopup`: controla si el popup está cerrado, en crear o actualizar.
  - `adminLogged`: credenciales tomadas de `localStorage`.

- `ngOnInit()`:
  - Llama a `cargarUsuarios()` al iniciar.

- `cargarUsuarios()`:
  - Toma `nickUsuario` y `contrasena` de `localStorage`.
  - Guarda estas credenciales en `adminLogged`.
  - Llama a `userService.obtenerUsuarios()`.
  - Si la respuesta es arreglo, lo usa directamente.
  - Si la respuesta es un arreglo con error, lo maneja e imprime en consola.
  - Para cada usuario, solicita sus direcciones con `obtenerDireccionesPorUsuario(...)`.
  - Copia las direcciones al usuario.
  - Establece `usuarioSeleccionado` en el primer usuario, si existe.

- `launchPopupCreate()` y `launchPopupUpdate()`:
  - Abren el popup en modo `'CREATE'` o `'UPDATE'`.
  - El popup se muestra solo si `modoPopup !== 'CLOSED'`.

- `eliminarUsuario()`:
  - Confirma con `confirm()`.
  - Elimina primero todas las direcciones del usuario.
  - Luego elimina el usuario.
  - Si hay erroes, muestra alert y cancela.
  - Finalmente recarga la lista.

- `onCerrarPopUpOk()` y `onCerrarPopUpCancel()`:
  - Cierra el popup.
  - Si se cierra con éxito, recarga la lista.

- `seleccionarUsuario(usuario)`:
  - Cambia el usuario seleccionado.

- `obtenerIconoGenero(generoNombre)`:
  - Devuelve la ruta de imagen según el género.
  - Soporta masculino, femenino u otros.

- `obtenerDireccionCompleta(usuario)`:
  - Busca la dirección principal y devuelve `Calle, Número`.
  - Si no existe, devuelve `Sin dirección`.

- `obtenerDireccionCorta(usuario)`:
  - Acorta la dirección a 25 caracteres y agrega `...`.

- `obtenerContadorDireccionesExtra(usuario)`:
  - Cuenta cuántas direcciones extra tiene un usuario aparte de la principal.

Conexiones:

- Usa `UserService` para leer y eliminar datos.
- Abre `UserPopupComponent` con `authUser`, `usuarioEntrada` y `modo`.
- Comparte credenciales de administrador a través de `localStorage`.

#### `user-list.component.html`

- Muestra el popup de usuario solo cuando `modoPopup` no es `'CLOSED'`.
- Botones para Crear, Actualizar y Borrar.
- Tabla con columnas:
  - Selección.
  - Género (icono).
  - Usuario.
  - Nombre completo.
  - Fecha de creación.
  - Hora de desayuno.
  - Puesto de trabajo.
  - Dirección principal.
- Usa sintaxis `@for` y `@if` de Angular 19 para iterar y condicionales.

#### `user-list.component.css`

- Estiliza el contenedor, la tabla, botones y estados hover.
- Aplica scroll vertical al contenedor de tabla.
- Usa colores contrastantes:
  - rojo para cabeceras.
  - azul para botones principales.
  - fondo rosado claro en filas pares.

### 8.3 `UserPopupComponent`

Archivos:
- `src/app/features/user-popup/user-popup.component.ts`
- `src/app/features/user-popup/user-popup.component.html`
- `src/app/features/user-popup/user-popup.component.css`

Este componente gestiona la creación y actualización de usuarios y sus direcciones.

#### `user-popup.component.ts`

- Importa `CommonModule` y `FormsModule`.
- Usa `@Input()`:
  - `modo`: `'CREATE'` o `'UPDATE'`.
  - `authUser`: credenciales del admin.
  - `usuarioEntrada`: usuario a editar en modo update.
- Usa `@Output()`:
  - `cerrarPopUpOk`: emite cuando se guarda con éxito.
  - `cerrarPopUpCancel`: emite cuando se cancela.

- Estado interno:
  - `selectedRowIndex`: dirección seleccionada.
  - `passwordError`, `nickError`, `horaDesayunoError`.
  - `usuario`: objeto de usuario que se edita/crea.
  - `generos`, `puestos`: catálogos de selección.
  - `catalogsLoaded`: evita recargar catálogos varias veces.

- `ngOnInit()`:
  - Si el modo es `CREATE`, fija la `fechaHoraCreacion` actual.

- `ngOnChanges(changes)`:
  - Cuando `authUser` cambia y hay nick, carga catálogos si no se han cargado.
  - Si cambia `modo` o `usuarioEntrada`, recarga los datos del formulario.

- `cargarUsuarioParaEditar()`:
  - Extrae los datos de `usuarioEntrada`.
  - Convierte `fechaNacimiento` y `fechaHoraCreacion` a formatos de fecha legibles.
  - Asocia `genero` y `puestoDeTrabajo` con objetos del catálogo para que `select` funcione.
  - Copia direcciones.

- `resetUsuario()`:
  - Inicializa `this.usuario` con valores vacíos.
  - Resetea errores y selecciona la fecha actual.

- `compareObjects(o1, o2)`:
  - Permite comparar objetos en `select` por `id`.

- `setFechaCreacion()`:
  - Genera `fechaHoraCreacion` en formato `YYYY-MM-DD HH:mm`.

- Validaciones:
  - `validarNick`: nick obligatorio y mínimo 3 caracteres.
  - `validarContrasena`: en `UPDATE` permite dejar vacío para conservar la contraseña existente; en `CREATE` o si se escribe, requiere 6 caracteres con mayúscula, minúscula y número.
  - `validarHoraDesayuno`: acepta cadena vacía o formato `HH:MM`.

- `nickEstaRepetido()`:
  - Carga todos los usuarios desde API.
  - Compara mayúsculas/minúsculas contra el nick actual.
  - En modo `UPDATE`, permite el mismo usuario actual.

- `loadCatalogs()`:
  - Carga géneros y puestos de trabajo en paralelo.

- `loadGeneros()` y `loadPuestos()`:
  - Llaman al servicio y normalizan respuestas.
  - Si hay error devuelven arreglo vacío.

- `onSave()`:
  - Valida campos.
  - Comprueba nick repetido.
  - Prepara `usuarioAEnviar` con estructura correcta para la API:
    - incluye `genero: { id }` y `puestoDeTrabajo: { id }`.
    - establece `fechaNacimiento` a `null` si está vacía.
    - excluye `direcciones` en el objeto principal porque se guardan por separado.
  - En `CREATE`:
    - crea el usuario.
    - guarda cada dirección con `guardarDireccion(..., 'CREATE')`.
  - En `UPDATE`:
    - actualiza el usuario.
    - elimina direcciones que ya no existen.
    - guarda direcciones nuevas o actualiza existentes.
  - Emite `cerrarPopUpOk` con el resultado si todo sale bien.

- `guardarDireccion(dir, usuarioId, operacion)`:
  - Construye `dirAEnviar` normalizando `direccionPrincipal` a `1` o `0`.
  - Llama a la API de creación o actualización.

- Acciones de UI:
  - `onCancel()` emite `cerrarPopUpCancel`.
  - `addAddress()` añade una nueva dirección vacía.
  - `deleteAddress()` elimina la dirección seleccionada.
  - `setMainAddress(index)` marca una dirección como principal.
  - `updateAddress()` actualmente solo valida que haya selección; el comportamiento real no está implementado.

> Importante: `updateAddress()` es un placeholder. El botón Actualizar direcciones existe, pero la función no modifica datos ni abre edición adicional.

#### `user-popup.component.html`

- Muestra un modal con fondo oscuro.
- Título cambia según modo (`Crear Usuario` o `Actualizar Usuario`).
- Formulario con campos:
  - nick, contraseña, fecha creación, nombre, apellidos, cumpleaños, género, puesto y hora de desayuno.
- Validación visual:
  - bordes rojos si hay errores.
  - mensajes de error debajo de los campos.
- Sección de direcciones:
  - Botones crear, actualizar y borrar.
  - Tabla de direcciones con selección de fila y dirección principal.
- Botones `Guardar` y `Cancelar`.

#### `user-popup.component.css`

- Crea un modal centrado con overlay.
- Usa grid para el formulario principal.
- Estiliza campos de entrada, errores y botones.
- Da scroll interno al cuerpo del modal si el contenido es alto.

### 8.4 `HeaderComponent`

Archivos:
- `src/app/components/layout/header/header.component.ts`
- `src/app/components/layout/header/header.component.html`
- `src/app/components/layout/header/header.component.css`

#### `header.component.ts`

- Componente standalone de cabecera.
- `nickUsuario` se carga desde `localStorage` en `ngOnInit()`.
- `logout()` borra `nickUsuario` y `contrasena` de `localStorage` y redirige a `/login`.

Conexiones:

- Aparece en `app.component.html` excepto en la ruta `/login`.

#### `header.component.html`

- Muestra un avatar con icono de usuario.
- Muestra el nick del usuario.
- Botón `Log Out`.

#### `header.component.css`

- Diseño con `display: flex`.
- Botón rojo con hover.
- Estiliza avatar y nombre del usuario.

---

## 9. Flujo general de la aplicación

1. El usuario abre la aplicación y Angular monta `AppComponent`.
2. `AppComponent` muestra el `HeaderComponent` si la ruta no es `/login`.
3. `LoginComponent` se renderiza en `/login`.
4. El usuario ingresa credenciales y, si `LoginService` devuelve `true`, guarda credenciales en `localStorage` y navega a `/usuarios`.
5. En `/usuarios`, `UserListComponent`:
   - Carga todos los usuarios.
   - Carga las direcciones de cada usuario.
   - Muestra el listado en una tabla.
   - Permite abrir `UserPopupComponent` para crear o actualizar usuarios.
6. `UserPopupComponent` valida datos y llama a `UserService` para crear/actualizar usuarios y direcciones.
7. `HeaderComponent` lee el usuario actual y permite cerrar sesión.

---

## 10. Observaciones importantes y matices

- En `LoginComponent`, la validación de la respuesta de login es muy simple: solo acepta `true`.
- `UserService` y `LoginService` usan `to()` para capturar errores. Los resultados de error son arreglos `[err]`.
- Hay cierta inconsistencia entre los modelos y el uso real de datos:
  - En `Usuario` la propiedad es `admin`, pero en `UserPopupComponent` se usa `esAdmin`.
  - En el modelo `Usuario` se llama `puestoTrabajo`, mientras que en el componente se usa `puestoDeTrabajo`.
  - Esto puede generar bugs si el backend devuelve la forma exacta de JSON y el frontend no la normaliza.
- `const-local-storage.ts` define `usuarioLogado`, pero los componentes guardan `nickUsuario` y `contrasena` directamente en localStorage.
- `app/app.component.ts` registra `LoginService` en `providers`, pero `LoginService` ya es global (`providedIn: 'root'`).
- `updateAddress()` en `UserPopupComponent` no hace nada útil aún.
- Las rutas usan `ConstRoutes`, pero `app.routes.ts` importa directamente `LoginComponent` y `UserListComponent`.
- La sintaxis `@for` y `@if` en plantillas indica uso de Angular 19+ con la nueva sintaxis.

---

## 11. Recomendaciones para mejoras

- Normalizar los nombres de propiedades en el modelo `Usuario` y en el código (`puestoTrabajo` vs `puestoDeTrabajo`, `admin` vs `esAdmin`).
- Usar un único mecanismo de almacenamiento de credenciales, preferiblemente `utils.service` o `AuthService`, en lugar de manipular `localStorage` directamente desde varios componentes.
- Completar `updateAddress()` en `UserPopupComponent` si se desea editar direcciones existentes.
- Si el backend retorna objetos de error, implementar un manejo más claro en lugar de `alert()` y `console.error()`.
- Cambiar `toPromise()` a `firstValueFrom()` o `lastValueFrom()` para compatibilidad con versiones modernas de RxJS.
- Usar `headers` y `loadCredentials()` de `utils.service` para estandarizar el envío de credenciales.

---

## 12. Archivos no cubiertos directamente

- `src/app/core/models/imagenusuario.model.ts` existe, pero no está enlazado con ninguna vista o servicio activo.
- `src/app/shared/contants/const-local-storage.ts` define una constante que no se utiliza en el flujo actual.

---

## 13. Conclusión

Esta aplicación es un CRUD de usuarios con autenticación básica, diseñado con Angular standalone components. La estructura principal está bien definida y las conexiones entre componentes y servicios son claras. La mayor parte del código usa patrones similares para la carga de datos y manejo de errores, lo cual facilita la extensión.

Si deseas, puedo también generar un diagrama del flujo de navegación y un árbol de dependencias entre componentes y servicios.