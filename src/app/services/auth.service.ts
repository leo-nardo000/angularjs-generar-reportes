import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  URI = '/api'

  constructor(private http:HttpClient) { }

  signIn(user){
    return this.http.post<any>(`${this.URI}/signin`,user);
  }

  loggedIn(){
    return !!sessionStorage.getItem('token');
  }

  logOut(){
    sessionStorage.removeItem('token');
  }

  getToken(){
    return sessionStorage.getItem('token')
  }
}