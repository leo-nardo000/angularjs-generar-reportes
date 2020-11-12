import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import { NgForm } from '@angular/forms';

import {RegistroService} from '../../services/registros.service';
import {AuthService} from '../../services/auth.service';



@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  persona:any = {
    id_persona:'',
    primer_nombre:'',
    primer_apellido:'',
    identificacion:'',
    segundo_nombre:'',
    segundo_apellido:'',
    fecha_nac:'',
    direccio:'',
    num_telefono:'',
    correo_primario:'',
    correo_secundario:'',
    username:'',
    pass:'',
    confirmar_pass:'',
    razon_social:'',
    id_cargo:'',
    activo:'',
    tipo_usuario:''
  };

  message: any = {}
  messagebolExito = false;
  messagebolError = false;
  clickBuscar = false;

  personas = [];

  constructor(private registroService:RegistroService,private router:Router,private auth:AuthService) { }

  ngOnInit(): void {

    this.registroService.ingresar().subscribe(
      res => {
        if (res.tipo_usuario == 3) {
          this.router.navigate(['inicio/asistencia']);
        } else if(res.tipo_usuario == 1) {
          this.auth.logOut();
          this.router.navigate(['/signin']);
        }
      },
      err => {
        this.auth.logOut();
        this.router.navigate(['/signin']);
      }
    )

    const selectIdentificacion = document.getElementById('buscar_identificacion');

    this.registroService.inicioSelectPersonas().subscribe(
      personas => {
        
        this.personas = personas;

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

  validarSeleccionIdentificacion(){

  }

  buscar(){

    this.clickBuscar = true;
  
    const idPersonaSeleccionada = this.selectIdentificacion();

    if (!idPersonaSeleccionada) {
      return;
    }


    this.registroService.inicioSelectHuellas(idPersonaSeleccionada).subscribe(
      huellas => {
        const selectHuellas = document.getElementById('selectHuellas');
        selectHuellas.innerHTML = '';
        let option;
        for (let i = 0; i < huellas.length; i++) {
          option = document.createElement('option');
          option.value = huellas[i].id_huella;
          option.textContent = `Huella ${i+1}`;
          selectHuellas.append(option);
        }
      },
      err => console.log(err)
    )

    for (const persona of this.personas) {
      if (persona.id_persona == idPersonaSeleccionada) {
        
        this.persona = persona

        const fecha = persona.fecha_nac.split('T')
        this.persona.fecha_nac = fecha[0];
      }
    }
    
    const selectEstado = document.getElementById('selectActivo');
    const selectTipo = document.getElementById('selectTipo');
    const selectEmpresa = document.getElementById('selectEmpresa');
    const selectCargos = document.getElementById('selectCargo');

    this.registroService.signupSelectEmpresa().subscribe(
      empresas => {
        let option;
        selectEmpresa.innerHTML = '';
        for (const empresa of empresas) {
          option = document.createElement('option');

          if (this.persona.id_empresa === empresa.id_empresa) {
            option.selected = true;
          }

          option.value = empresa.id_empresa;
          option.textContent = empresa.razon_social;

          selectEmpresa.append(option);
        }
      }
    )
    
    this.registroService.signupSelectCargo(this.persona.id_empresa).subscribe(
      cargos => {
        
        let option;
        selectCargos.innerHTML = '';
        for (const cargo of cargos) {
          option = document.createElement('option');

          if (this.persona.id_cargo == cargo.id_cargo) {
            option.selected = true;
          }

          option.value = cargo.id_cargo;
          option.textContent = cargo.descripcion;

          selectCargos.append(option);
        }
      },
      err => console.error(err)
    )


    if (this.persona.activo == "A") {
      selectEstado.innerHTML = `
      <option value="A" selected>Activo</option>`; 
    }

    switch (this.persona.tipo_usuario) {
      case 2:
        selectTipo.innerHTML =`
        <option value="2" selected>ADMIN</option>
        <option value="3">REPORTES</option>
        <option value="1">NORMAL</option>
        `;
        break;
      case 1:
        selectTipo.innerHTML =`
        <option value="2">ADMIN</option>
        <option value="3">REPORTES</option>
        <option value="1" selected>NORMAL</option>
        `;
        break;
      case 3:
          selectTipo.innerHTML =`
          <option value="2">ADMIN</option>
          <option value="3" selected>REPORTES</option>
          <option value="1">NORMAL</option>
          `;
          break;
    
      default:
        break;
    }
    return false;
  }

  submit(form:NgForm){

    const respuesta = this.selectIdentificacion();

    if (!respuesta) {
      return;
    }

    let fecha_nacimiento: any = new Date(this.persona.fecha_nac);
    let mayoria_edad = 18;

    let fecha: any = new Date();
    fecha.setFullYear(fecha.getFullYear() - mayoria_edad);
    
    if((fecha - fecha_nacimiento) < 0){
      this.alertaError({res:"La persona a registrar debe ser mayor de edad."})
      return;
    }
    
    if (this.persona.username == null) {
      this.persona.username = ""
    }
    
    delete this.persona.razon_social;
    delete this.persona.rif;
    delete this.persona.descripcion;
    delete this.persona.telefono;

    this.registroService.modificarPersona(this.persona.id_persona,this.persona).subscribe(
      res => {

        this.alertaExito(res)
        this.buscar();
      },
      err => {

        this.alertaError(err.error);

      }
    )
  }

  eliminarUsuario(){
    const respuesta = this.selectIdentificacion();

    if (!respuesta) {
      return;
    }

    if (confirm("Al eliminar la persona estaria borrando todo lo relacionado a ella, desde sus huellas hasta todos sus chequeos ¿Desea continuar?")) {
      this.registroService.eliminarPersona(this.persona.id_persona).subscribe(
        res => {

          this.alertaExito(res)
          setTimeout(() => {
            this.router.navigate(['inicio/asistencia'])
          }, 4000);

        },
        err => {
  
          this.alertaError(err.error);
  
        }
      )
    }
  }

  seleccionarCargo(){
    const selectCargos = document.getElementById('selectCargo')

    selectCargos.innerHTML = '';
    this.registroService.signupSelectCargo(this.persona.id_empresa).subscribe(
      cargos => {
        
        let option;

        for (const cargo of cargos) {
          option = document.createElement('option');

          option.value = cargo.id_cargo;
          option.textContent = cargo.descripcion;

          selectCargos.append(option);
        }
      },
      err => console.error(err)
    )
  }

  selectIdentificacion(){
    const selectIdentificacion: any = document.getElementById('buscar_identificacion');
    const idPersonaSeleccionada = selectIdentificacion.options[selectIdentificacion.selectedIndex].value;

    if(idPersonaSeleccionada == "" ){
      this.alertaError({res: "Debe Seleccionar una persona antes de realizar cualquier operación."})
      this.clickBuscar = false;
      return false;
    }
    if (this.clickBuscar === false) {
      this.alertaError({res: "Debe Buscar una persona antes de realizar cualquier operación."})
      return false;
    }

    return idPersonaSeleccionada;
  }

  alertaError(mensaje){
    this.message = mensaje

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

