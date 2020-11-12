import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

import {RegistroService} from '../../services/registros.service';

@Component({
  selector: 'app-registrar-empresa',
  templateUrl: './registrar-empresa.component.html',
  styleUrls: ['./registrar-empresa.component.css']
})
export class RegistrarEmpresaComponent implements OnInit {

  empresa: any = {};

  message: any = {}
  messagebolExito = false;
  messagebolError = false;

  constructor(private registroService:RegistroService,private auth:AuthService,private router:Router) { }

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
  }

  submit(form: NgForm){
    this.registroService.registrarEmpresa(form.value).subscribe(
      res => {
        this.message = res;
        this.messagebolExito = true;
        form.reset();
        setTimeout(() => {
        this.messagebolExito = false;
        }, 3000);
      },
      err => {
        this.message = err.error;
        this.messagebolError = true;
        setTimeout(() => {
          this.messagebolError = false;
        }, 3000);
      }
    )
  }

  resetForm(form:NgForm){
    form.reset();
  }

}
