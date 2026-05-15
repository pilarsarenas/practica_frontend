import { HttpHeaders, HttpParams } from "@angular/common/http";
import ConstUrls from "../../shared/contants/const-urls";
import ConstLocalStorage from "../../shared/contants/const-local-storage";
import { Usuario } from "../models/user.model";

export default async function to(promise: Promise<any>) {
    try {
        const data = await promise
        return data
    } catch (err) {
        return [err]
    }
}

export function isOkResponse(response) {
    if (response && response.body && response.body.type === "OK") {
        return true
    }
    return false
}

export function loadResponseData(response) {
    return response.body.data;
}

export function loadResponseError(response) {
    if (!response || !response.body || !response.body.exception) {
        return "Error inesperado de servidor";
    } else {
        return response.body.exception.codigoDeError + ' ' + response.body.exception.mensajeDeError;
    }
}

export const headers = new HttpHeaders({
    'Content-Type': 'application/json'
});

export function loadCredentials(): HttpParams {
    return new HttpParams()
        .set(ConstUrls.NICK_USUARIO_PARAM, obtenerUsuarioLogado().nickUsuario)
        .set(ConstUrls.PASS_USUARIO_PARAM, obtenerUsuarioLogado().contrasena);
}

export function guardarUsuarioLogado(usuario: Usuario) {
    localStorage.setItem(ConstLocalStorage.USUARIO_LOGADO_STORAGE, JSON.stringify(usuario));
}

export function obtenerUsuarioLogado(): Usuario {
    return JSON.parse(localStorage.getItem(ConstLocalStorage.USUARIO_LOGADO_STORAGE));
}
