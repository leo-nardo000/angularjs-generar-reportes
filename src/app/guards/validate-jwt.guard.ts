import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {RegistroService} from '../services/registros.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardJWT implements CanActivate {

  res = false;
  constructor(private registroService:RegistroService,private auth:AuthService, private router:Router){}

  canActivate(){
    this.registroService.ingresar().subscribe(
      res => {
        console.log(res);
      },
      err => {
        this.auth.logOut();
        this.router.navigate(['/signin']);
      }
    )
    
    return this.res;
  }
  
}
