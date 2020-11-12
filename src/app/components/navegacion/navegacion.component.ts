import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RegistroService } from 'src/app/services/registros.service';

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css']
})
export class NavegacionComponent implements OnInit {

  usuario_reporte = false;

  constructor(private registroService:RegistroService,private router:Router,private auth:AuthService) { }

  ngOnInit(): void {

    this.registroService.ingresar().subscribe(
      res => {
        if (res.tipo_usuario == 3) {
          this.usuario_reporte = true;
        }
      },
      err => {
        this.auth.logOut();
        this.router.navigate(['/signin']);
      }
    )

    document.getElementById('menu-movil').addEventListener('click',function () {
      document.getElementById('navegacion-enlaces').classList.toggle('activo')
    })
  }

  dropMenu(){
    const opciones = document.querySelector('.drop-menu .opciones')

    opciones.classList.toggle('activo');
  }

  logOut(){
    this.auth.logOut();
  }

}
