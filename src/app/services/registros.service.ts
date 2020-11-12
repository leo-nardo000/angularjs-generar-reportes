import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  URI = '/api'

  constructor(private http: HttpClient) { }

  // ? validacion jwt
  ingresar(){
    return this.http.get<any>(`${this.URI}/inicio`);
  }
  // ? componenente signup registrar persona
  signupSelectEmpresa(){
    return this.http.get<any>(`${this.URI}/inicio/signupSelectEmpresa`);
  }

  signupSelectCargo(id){
    return this.http.get<any>(`${this.URI}/inicio/signupSelectCargo/${id}`);
  }

  registrarUsuario(usuario){
    return this.http.post<any>(`${this.URI}/inicio/registrarUsuario`,usuario);
  }
  // ? componenente registrar empresa
  registrarEmpresa(empresa){
    return this.http.post<any>(`${this.URI}/inicio/registrar_empresa`,empresa)
  }
  // ? componente modificar persona
  inicioSelectPersonas(){
    return this.http.get<any>(`${this.URI}/inicio/inicioSelectPersonas`);
  }

  inicioSelectHuellas(idPersonaSeleccionada){
    return this.http.get<any>(`${this.URI}/inicio/inicioSelectHuellas/${idPersonaSeleccionada}`);
  }

  modificarPersona(id,datos){
    return this.http.put<any>(`${this.URI}/inicio/modificarPersona/${id}`,datos);
  }

  eliminarPersona(id){
    return this.http.delete<any>(`${this.URI}/inicio/eliminarPersona/${id}`);
  }

  // ? componente modificar empresa
  eliminarCargo(id){
    return this.http.delete<any>(`${this.URI}/inicio/eliminarCargo/${id}`)
  }

  agregarCargo(id_empresa,cargo){
    return this.http.post<any>(`${this.URI}/inicio/agregarCargo/${id_empresa}`,cargo);
  }
  modificarCargo(id,cargo){
    return this.http.put<any>(`${this.URI}/inicio/modificarCargo/${id}`,cargo)
  }
  obtenerHorarios(id_cargo){
    return this.http.get<any>(`${this.URI}/inicio/obtenerHorarios/${id_cargo}`)
  }
  modificarHorarios(id_cargo,horarios){
    return this.http.put<any>(`${this.URI}/inicio/modificarHorarios/${id_cargo}`,horarios)
  }

  modificarEmpresa(id,empresa){
    return this.http.put<any>(`${this.URI}/inicio/modificarEmpresa/${id}`,empresa)
  }

  eliminarEmpresa(id){
    return this.http.delete<any>(`${this.URI}/inicio/eliminarEmpresa/${id}`)
  }

  // ? componente reportes
  generarReporteEmpresaPdf(contenido){
    return this.http.post<any>(`${this.URI}/inicio/generar-reporte-empresa/pdf`,contenido)
  }
  generarReporteEmpleadoPdf(contenido){
    return this.http.post<any>(`${this.URI}/inicio/generar-reporte-empleado/pdf`,contenido)
  }

  eliminarReportePDF(nombre){
    return this.http.delete<any>(`${this.URI}/inicio/eliminar-reporte/pdf/${nombre}`)
  }
}
