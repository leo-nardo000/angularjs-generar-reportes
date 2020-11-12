import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Router} from '@angular/router'

import {AuthService} from '../../services/auth.service';
import {RegistroService} from '../../services/registros.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  newUser: any = {
    username:'',
    pass:'',
    confirmar_pass:'',
    id_empresa:'',
    id_cargo:'',
    tipo_usuario:'',
    primer_nombre:'',
    segundo_nombre:'',
    primer_apellido:'',
    segundo_apellido:'',
    identificacion:'',
    direccion:'',
    num_telefono:'',
    correo_primario:'',
    correo_secundario:'',
    fecha_nac:''
  }

  message: any = {}
  messagebolExito = false;
  messagebolError = false;

  constructor(private router:Router,private auth:AuthService,private registroService:RegistroService) { }

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
    
    const selectEmpresa = document.getElementById('selectEmpresa');

    this.registroService.signupSelectEmpresa().subscribe(
      empresas => {

        let option;

        for (const empresa of empresas) {
          option = document.createElement('option');

          option.value = empresa.id_empresa;
          option.textContent = empresa.razon_social;

          selectEmpresa.append(option);
        }
      },
      err => console.log(err)
    )

  }

  inicioSesion(){
    const tipoUsuario: any = document.getElementById('tipo_usuario');

    const nivelUsuarioSeleccionado = tipoUsuario.options[tipoUsuario.selectedIndex].value;
    
    const campos = document.querySelectorAll('.disabled');

    if (nivelUsuarioSeleccionado == '1') {

      campos.forEach((campo: any) => {
        campo.disabled = true;
      });
    } else {
      campos.forEach((campo: any) => {
        campo.disabled = false;

      });
    }
    
  }

  signupSubmit(form: NgForm){

    
    if (this.newUser.pass !== this.newUser.confirmar_pass) {

      this.alertaError({error:{res:"Las Contraseñas no son iguales"}})
      return;
    }

    let fecha_nacimiento: any = new Date(this.newUser.fecha_nac);
    let mayoria_edad = 18;

    let fecha:any = new Date();
    fecha.setFullYear(fecha.getFullYear() - mayoria_edad);
    
    if((fecha - fecha_nacimiento) < 0){
      this.alertaError({error:{res:"La persona a registrar debe ser mayor de edad."}})
      return;
    }
    
    this.registroService.registrarUsuario(this.newUser).subscribe(
      res => {
        this.alertaExito(res);
      },
      err => {
        this.alertaError(err)
      }
    )
  }

  resetForm(form: NgForm){
    form.reset();
  }

  seleccionarCargo(){
    const selectCargos = document.getElementById('selectCargo')
    selectCargos.innerHTML = '';
    this.registroService.signupSelectCargo(this.newUser.id_empresa).subscribe(
      cargos => {
        
        let option;

        const optionSeleccione = document.createElement('option');
        optionSeleccione.value = "";
        optionSeleccione.disabled = true;
        optionSeleccione.selected = true;
        optionSeleccione.textContent = "-- Seleccione --"

        selectCargos.append(optionSeleccione);

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

  alertaError(mensaje){
    this.message = mensaje.error;
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
