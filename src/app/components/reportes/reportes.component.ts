import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import {RegistroService} from '../../services/registros.service'

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  reporte = {
    desde:"",
    hasta:"",
    empresa:"",
    turno:"",
    empleado:"",
    empleado_desde:"",
    empleado_hasta:""
  }

  empleados = []

  message: any = {}
  messagebolExito = false;
  messagebolError = false;
  clickBuscarEmpleado = false;

  constructor(private registroService:RegistroService,private auth:AuthService, private router:Router) { }

  ngOnInit(): void {

    this.registroService.ingresar().subscribe(
      res => {
        if(res.tipo_usuario == 1) {
          this.auth.logOut();
          this.router.navigate(['/signin']);
        }
      },
      err => {
        this.auth.logOut();
        this.router.navigate(['/signin']);
      }
    )

    const selectEmpresa = document.getElementById("empresa");

    this.registroService.signupSelectEmpresa().subscribe(
      empresas => {
        let option;

        const optionSeleccione = document.createElement("option");
        optionSeleccione.value = "";
        optionSeleccione.textContent = "-- Seleccione --";
        optionSeleccione.disabled = true;
        optionSeleccione.selected = true;

        selectEmpresa.append(optionSeleccione);

        for (const empresa of empresas) {
          option = document.createElement("option");
          option.value = empresa.id_empresa;
          option.textContent = empresa.razon_social;

          selectEmpresa.append(option);
        }
      }
    )

    const selectIdentificacion = document.getElementById('empleado');

    this.registroService.inicioSelectPersonas().subscribe(
      personas => {

        this.empleados = personas;
        let option;

        for (const persona of personas) {
          option = document.createElement('option')
          option.textContent = `${persona.primer_nombre} ${persona.primer_apellido} - ${persona.identificacion}`;
          option.value = persona.id_persona;

          selectIdentificacion.append(option)
        }
      },
      err => console.log(err)
    )

  }

  submit(){
    console.log(this.reporte);
  }

  generarReporteEmpresaPdf(){

    if (this.reporte.empresa == "") {
      this.alertaError("Debe Seleccionar una empresa antes de generar el reporte.");
      return;
    }

    if (this.reporte.desde == "" || this.reporte.hasta == "") {
      this.alertaError("Los campos de fecha no pueden estar vacios.");
      return;
    }

    if (this.reporte.turno == "") {
      this.alertaError("Debe seleccionar un turno.");
      return;
    }

    if (Date.parse(this.reporte.desde) > Date.parse(this.reporte.hasta)) {
      this.alertaError("La fecha Inicial no puede ser mayor que la final.");
      return;
    }
    
    const fecha_actual = new Date();
    fecha_actual.setHours(0,0,0,0);

    const fecha_desde = new Date(this.reporte.desde);
    const fecha_hasta = new Date(this.reporte.hasta);

    if (fecha_desde > fecha_actual) {
      this.alertaError("La fecha Inicial no puede ser mayor que la fecha actual.");
      return;
    }
    if (fecha_hasta > fecha_actual) {
      this.alertaError("La fecha Final no puede ser mayor que la fecha actual.");
      return;
    }

    this.registroService.generarReporteEmpresaPdf(this.reporte).subscribe(
      async (res) => {
        this.alertaExito(res);

        await this.descargarReportePdf(res);
        await this.eliminarReportePdf(res);
      },
      err => {
        console.log(err)
      }
    )
    
  }

  generarReporteEmpleadoPdf(){
    if (this.reporte.empleado == "") {
      this.alertaError("Debe seleccionar un empleado.");
      return;
    }

    if (!this.clickBuscarEmpleado) {
      this.alertaError("Debe Buscar un empleado.");
      return;
    }

    if (this.reporte.empleado_desde == "" || this.reporte.empleado_hasta == "") {
      this.alertaError("Los campos fecha no pueden estar vacios.")
      return;
    }

    if (Date.parse(this.reporte.empleado_desde) > Date.parse(this.reporte.empleado_hasta)) {
      this.alertaError("La fecha Inicial no puede ser mayor que la final.");
      return;
    }
    
    const fecha_actual = new Date();
    fecha_actual.setHours(0,0,0,0);

    const fecha_empleado_desde = new Date(this.reporte.empleado_desde);
    const fecha_empleado_hasta = new Date(this.reporte.empleado_hasta);

    if (fecha_empleado_desde > fecha_actual) {
      this.alertaError("La fecha Inicial no puede ser mayor que la fecha actual.");
      return;
    }
    if (fecha_empleado_hasta > fecha_actual) {
      this.alertaError("La fecha Final no puede ser mayor que la fecha actual.");
      return;
    }

    this.registroService.generarReporteEmpleadoPdf(this.reporte).subscribe(
      async res => {
        this.alertaExito(res);

        await this.descargarReportePdf(res);
        await this.eliminarReportePdf(res);
        
      },
      err => {
        console.log(err)
      }
    )
  }

  buscarEmpleado(){
    if (this.reporte.empleado == "") {
      this.alertaError("Debe seleccionar un empleado.");
      return; 
    }

    this.clickBuscarEmpleado = true;

    const empleado_seleccionado = this.empleados.filter(empleado => empleado.id_persona == this.reporte.empleado)[0]

    document.querySelector("#empleado span").textContent = `${empleado_seleccionado.primer_nombre} ${empleado_seleccionado.primer_apellido}`;

    const cargoSpan = document.querySelector("#cargo span");

    this.registroService.signupSelectCargo(empleado_seleccionado.id_empresa).subscribe(
      cargos => {
        
        for (const cargo of cargos) {

          if (empleado_seleccionado.id_cargo == cargo.id_cargo) {
            cargoSpan.textContent = cargo.descripcion;
          }
        }
      },
      err => console.error(err)
    )
    
  }

  verificarBuscar(){
    this.clickBuscarEmpleado=false;
  }

  async descargarReportePdf(res){
    const source = `/api/inicio/descargar/${res.nombre}`;

    setTimeout(() => {
    const a:any = document.createElement('a');
    
    a.href = source;

    a.click();
    }, 8000);
  }

  async eliminarReportePdf(res){
    setTimeout(() => {
      this.registroService.eliminarReportePDF(res.nombre).subscribe(
        res => console.log(res),
        err => console.log(err)
      )
    }, 60000);
  }

  alertaError(texto){
    this.message = {res:texto};
        this.messagebolError = true;
        
        setTimeout(() => {
        this.messagebolError = false;
        }, 3000);
  }

  alertaExito(mensaje){
    this.message = mensaje;
        this.messagebolExito = true;
        
        setTimeout(() => {
        this.messagebolExito = false;
        }, 3000);
  }

}
