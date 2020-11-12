import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'

import {AuthService} from '../../services/auth.service'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  user = {
    username:'',
    password:''
  }

  error = {}
  errorbol = false;

  constructor(private authService: AuthService,private router:Router) { }

  ngOnInit(): void {
  }

  signinSubmit(){
    this.authService.signIn(this.user).subscribe(
      res => {
        sessionStorage.setItem('token',res);

        this.router.navigate(['/inicio/persona']);
      },
      err => {
        this.error = err
        this.errorbol = true;
        setTimeout(() => {
        this.errorbol = false;
        }, 3000);
      }
    )
  }

}
