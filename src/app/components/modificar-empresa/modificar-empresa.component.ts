import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import { RegistroService } from '../../services/registros.service';

@Component({
  selector: 'app-modificar-empresa',
  templateUrl: './modificar-empresa.component.html',
  styleUrls: ['./modificar-empresa.component.css'],
})
export class ModificarEmpresaComponent implements OnInit {
  empresa: any = {
    id_empresa: '',
    razon_social: '',
    direccion: '',
    rif: '',
    telefono: '',
    id_cargo: '',
    chequeo: '',
    primera_entrada: '',
    primera_salida: '',
    segunda_entrada: '',
    segunda_salida: '',
  };
  empresas: any = [];

  message: any = {};
  messagebolExito = false;
  messagebolError = false;

  modificar_cargo = false;
  segundaEntrada = true;
  clickBuscar = false;

  constructor(private registroService: RegistroService, private auth:AuthService, private router:Router) {}

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

    const rif = document.getElementById('buscar_rif');

    this.registroService.signupSelectEmpresa().subscribe((empresas) => {
      this.empresas = empresas;
      let option;
      rif.innerHTML = "";


      let optionSeleccione = document.createElement('option');
      optionSeleccione.textContent = "-- Seleccione --";
      optionSeleccione.value = "";
      optionSeleccione.disabled = true;
      optionSeleccione.selected = true;
      rif.append(optionSeleccione);
      
      for (const empresa of empresas) {
        option = document.createElement('option');
        option.value = empresa.id_empresa;
        option.textContent = `${empresa.razon_social} - ${empresa.rif}`;

        rif.append(option);
      }
    });
  }

  buscar() {
    this.clickBuscar = true;
    const rifSeleccionado = this.rifSeleccionado()
    if (!rifSeleccionado) {
        return;
    }
      const empresaSeleccionada = this.empresas.filter(
        (empresa) => rifSeleccionado == empresa.id_empresa
      )[0];

      this.empresa.razon_social = empresaSeleccionada.razon_social;
      this.empresa.id_empresa = empresaSeleccionada.id_empresa;
      this.empresa.rif = empresaSeleccionada.rif;
      this.empresa.telefono = empresaSeleccionada.telefono;
      this.empresa.direccion = empresaSeleccionada.direccion;

      this.registroService
        .signupSelectCargo(this.empresa.id_empresa)
        .subscribe((cargos) => {
          const cargosSelect = document.getElementById('id_cargo');
          cargosSelect.innerHTML = '';
          let option;

          let optionSeleccione = document.createElement('option');
          optionSeleccione.value = "";
          optionSeleccione.selected = true;
          optionSeleccione.disabled = true;
          optionSeleccione.textContent = "-- seleccione --";

          cargosSelect.append(optionSeleccione)

          for (const cargo of cargos) {
            option = document.createElement('option');

            option.value = cargo.id_cargo;
            option.textContent = cargo.descripcion;

            cargosSelect.append(option);
          }
        });
  }

  eliminarCargo() {
    const rifSeleccionado = this.rifSeleccionado()
    if (!rifSeleccionado) {
        return;
    }

    if (confirm('¿Estas seguro de eliminar este cargo?')) {
      const cargosSelect: any = document.getElementById('id_cargo');
      const cargoSeleccionado =
        cargosSelect.options[cargosSelect.selectedIndex].value;

      this.registroService.eliminarCargo(cargoSeleccionado).subscribe(
        (res) => {
          this.buscar();
          this.alertaExito(res);
        },
        (err) => {
          this.alertaError(err.error)
        }
      );
    }
  }

  agregarCargo() {
    const rifSeleccionado = this.rifSeleccionado()
    if (!rifSeleccionado) {
        return;
    }

    const cargo: any = document.getElementById('cargo');

    this.registroService
      .agregarCargo(this.empresa.id_empresa, {cargo: cargo.value})
      .subscribe(
        (res) => {
          this.buscar();
          cargo.value = "";
          this.alertaExito(res);
        },
        (err) => {
          this.alertaError(err.error)
        }
      );
  }

  modificarCargo() {
    const rifSeleccionado = this.rifSeleccionado()
    if (!rifSeleccionado) {
        return;
    }

    const cargosSelect: any = document.getElementById('id_cargo');
    const cargoSeleccionado =
      cargosSelect.options[cargosSelect.selectedIndex].textContent;
    const cargoSeleccionadoValue =
      cargosSelect.options[cargosSelect.selectedIndex].value;

    this.modificar_cargo = true;

    const cargo:any = document.getElementById('cargo');
    cargo.value = cargoSeleccionado;
    cargo.dataset.id = cargoSeleccionadoValue;
  }

  modificarCargoSeleccionado() {
    const cargo: any = document.getElementById('cargo');

    const cargo_modificar = {
      id_cargo: cargo.dataset.id,
      descripcion: cargo.value,
      id_empresa:this.empresa.id_empresa
    };

    this.registroService
      .modificarCargo(cargo_modificar.id_cargo, cargo_modificar)
      .subscribe(
        (res) => {
          this.buscar();
          cargo.value = "";
          this.modificar_cargo = false;
          this.alertaExito(res);
        },
        (err) => {
          this.alertaError(err.error)
        }
      );
  }

  horarios(){
    const cargoSelect: any = document.getElementById("id_cargo");
    const cargoSeleccionado = cargoSelect.options[cargoSelect.selectedIndex].value;

    this.registroService.obtenerHorarios(cargoSeleccionado).subscribe(
      horarios => {

        if (horarios == null) {
          this.empresa.primera_entrada = "";
          this.empresa.primera_salida = "";
          this.empresa.segunda_entrada = "";
          this.empresa.segunda_salida = "";
          return;
        }
        
          this.empresa.primera_entrada = horarios.primera_entrada;
          this.empresa.primera_salida = horarios.primera_salida;
          this.empresa.segunda_entrada = horarios.segunda_entrada;
          this.empresa.segunda_salida = horarios.segunda_salida;

          if (horarios.segunda_entrada == "00:00:00" && horarios.segunda_salida == "00:00:00") {
            this.segundaEntrada = false;
            this.empresa.segunda_entrada = ""
            this.empresa.segunda_salida = ""
            const chequeo_1: any = document.getElementById("chequeo_1");
            chequeo_1.checked = true;
          } else {
            this.segundaEntrada = true;
          }
        
  
      },
      err => {
        console.log(err);
      }
    )
  }

  habilitarEntradas(){
    const cantidad_chequeos:any = document.querySelectorAll('input[type="radio"]');

    cantidad_chequeos.forEach(chequeo => {
      
      if (chequeo.checked) {
        if (chequeo.value == "dos") {
          this.segundaEntrada = true;
        } else {
          this.segundaEntrada = false;
          this.empresa.segunda_entrada = ""
          this.empresa.segunda_salida = ""
        }
      }
    
    })
  }

  submit(form) {

    const rifSeleccionado = this.rifSeleccionado()
    if (!rifSeleccionado) {
        return;
    }

    this.registroService.modificarEmpresa(this.empresa.id_empresa,this.empresa).subscribe(
      res => {
          this.alertaExito(res);
      },
      err => {
        this.alertaError(err.error)
      }
    )
  }

  eliminarEmpresa(){
    const rifSeleccionado = this.rifSeleccionado()
    if (!rifSeleccionado) {
        return;
    }
    if (confirm("Al eliminar la empresa se eliminara todo lo relacionado a ella desde cargos, chequeos, horarios, personas. ¿Deseas continuar?")) {
      this.registroService.eliminarEmpresa(this.empresa.id_empresa).subscribe(
        res => {
          this.alertaExito(res);
          setTimeout(() => {
            this.router.navigate(['inicio/asistencia'])
          }, 4000);
        },
        err => {
          this.alertaError(err.error)
        }
      )
    }

  }

  modificarHorario(){

    if (this.empresa.id_cargo == "") {
        this.alertaError({res: "Debe seleccionar un cargo antes de establecer un horario"})
        return;
    }

    const chequeo_1: any = document.getElementById("chequeo_1");
    const chequeo_2: any = document.getElementById("chequeo_2");

      if (chequeo_1.checked && chequeo_1.value == 'uno') {
        this.segundaEntrada = false;
          this.empresa.segunda_entrada = ""
          this.empresa.segunda_salida = ""

          if (this.empresa.primera_entrada == "" || this.empresa.primera_salida == "") {
            this.alertaError({res: "Los campos Primera Entrada no pueden estar vacios"})
            return;
          }
      } else if(chequeo_2.checked && chequeo_2.value == 'dos'){
          this.segundaEntrada = true;

          if (this.empresa.primera_entrada == "" || this.empresa.primera_salida == "") {
            this.alertaError({res: "Los campos Primera Entrada no pueden estar vacios"})
            return;
          }

          if (this.empresa.segunda_entrada == "" || this.empresa.segunda_salida == "") {
            this.alertaError({res: "Los campos Segunda Entrada no pueden estar vacios"})
            return;
          }

      }

    this.registroService.modificarHorarios(this.empresa.id_cargo,this.empresa).subscribe(
      res => {
          this.alertaExito(res);
      },
      err => {
        this.alertaError(err.error)
      }
    )
  }

  rifSeleccionado(){
    const rif:any = document.getElementById('buscar_rif');
    const rifSeleccionado = rif.options[rif.selectedIndex].value;

    if (rifSeleccionado == "") {
      this.alertaError({res:'Debe seleccionar un RIF antes de hacer cualquier operación.'});
      this.clickBuscar = false;
      return false;
    }
    if (this.clickBuscar == false) {
      this.alertaError({res: "Debe Buscar una Empresa antes de realizar cualquier operación."})
      return false;
    }
    return rifSeleccionado;
  }

  alertaError(mensaje){
    this.message = mensaje;
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
